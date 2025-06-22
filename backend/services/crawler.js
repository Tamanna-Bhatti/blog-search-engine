const puppeteer = require('puppeteer');
const { URL } = require('url');
const config = require('../config/config');
const { upsertPost, getPostByUrl } = require('./database');
const { classifyContent } = require('./classifier');

class Crawler {
    constructor() {
        this.browser = null;
        this.activeCrawls = new Set();
    }

    async initialize() {
        if (!this.browser) {
            this.browser = await puppeteer.launch({
                headless: 'new',
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
        }
    }

    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }

    async crawlUrl(url) {
        if (this.activeCrawls.has(url)) {
            console.log(`Already crawling ${url}`);
            return;
        }

        try {
            this.activeCrawls.add(url);
            await this.initialize();

            // Check if URL was recently crawled
            const existingPost = await getPostByUrl(url);
            if (existingPost && 
                (Date.now() - new Date(existingPost.crawled_at).getTime()) < 24 * 60 * 60 * 1000) {
                console.log(`Skipping recently crawled URL: ${url}`);
                return;
            }

            const page = await this.browser.newPage();
            await page.setUserAgent(config.CRAWLER.USER_AGENT);
            
            // Set timeout
            await page.setDefaultNavigationTimeout(config.CRAWLER.TIMEOUT_MS);

            // Navigate to page
            await page.goto(url, { waitUntil: 'networkidle0' });

            // Extract metadata and content
            const metadata = await this.extractMetadata(page);
            const content = await this.extractContent(page);
            
            // Close the page
            await page.close();

            // Quick domain-based filtering
            const urlObj = new URL(url);
            const domain = urlObj.hostname;
            
            // Skip obvious non-blog domains
            if (this.isObviousCorporateDomain(domain)) {
                console.log(`Skipping corporate domain: ${domain}`);
                return;
            }

            // Combine metadata and content for classification
            const pageData = {
                url,
                domain,
                title: metadata.title,
                snippet: metadata.description,
                content: content,
                wordCount: content.split(/\\s+/).length
            };

            // Classify the content
            const classification = await classifyContent(pageData);

            if (classification.isBlog) {
                // Store in database
                await upsertPost({
                    ...pageData,
                    is_blog: true,
                    quality_score: classification.score
                });

                console.log(`Successfully crawled and stored: ${url}`);
            } else {
                console.log(`Skipping non-blog content: ${url}`);
            }

        } catch (error) {
            console.error(`Error crawling ${url}:`, error);
        } finally {
            this.activeCrawls.delete(url);
        }
    }

    async extractMetadata(page) {
        return await page.evaluate(() => {
            const getMetaContent = (name) => {
                const element = document.querySelector(
                    `meta[name="${name}"], meta[property="${name}"], meta[property="og:${name}"]`
                );
                return element ? element.content : null;
            };

            return {
                title: document.title || '',
                description: getMetaContent('description') || '',
                author: getMetaContent('author') || '',
                publishedDate: getMetaContent('article:published_time') || '',
                type: getMetaContent('og:type') || ''
            };
        });
    }

    async extractContent(page) {
        return await page.evaluate(() => {
            // Remove unwanted elements
            const removeElements = (selector) => {
                document.querySelectorAll(selector).forEach(el => el.remove());
            };

            // Remove common non-content elements
            ['script', 'style', 'nav', 'header', 'footer', 'iframe', '.ad', '#ad', '.advertisement']
                .forEach(removeElements);

            // Try to find the main content
            const contentSelectors = [
                'article',
                '[role="main"]',
                '.post-content',
                '.article-content',
                '.entry-content',
                '.blog-post',
                'main'
            ];

            let content = '';
            for (const selector of contentSelectors) {
                const element = document.querySelector(selector);
                if (element) {
                    content = element.innerText;
                    break;
                }
            }

            // Fallback to body if no content found
            if (!content) {
                content = document.body.innerText;
            }

            // Clean up the content
            return content
                .replace(/\\s+/g, ' ')
                .replace(/\\n+/g, '\\n')
                .trim();
        });
    }

    isObviousCorporateDomain(domain) {
        // More targeted filtering - only exclude obvious non-blog domains
        const corporatePatterns = [
            /\\.(gov|mil)$/, // Government and military only
            /^(www\\.)?(amazon|ebay|walmart|target|bestbuy)\\.com$/, // Major e-commerce only
            /\\.(shop|store)$/, // Generic shopping domains
            /^(www\\.)?(paypal|stripe|square)\\.com$/, // Payment processors
            /^(www\\.)?(bank|chase|wellsfargo|citibank)\\.com$/ // Banks
        ];

        return corporatePatterns.some(pattern => pattern.test(domain));
    }

    async startCrawl(seedUrls) {
        // Validate and normalize URLs
        const validUrls = seedUrls
            .map(url => {
                try {
                    return new URL(url).href;
                } catch {
                    console.error(`Invalid URL: ${url}`);
                    return null;
                }
            })
            .filter(url => url !== null);

        // Start crawling each valid URL
        const crawlPromises = validUrls.map(url => this.crawlUrl(url));
        
        // Wait for all crawls to complete
        await Promise.all(crawlPromises);
    }
}

// Export singleton instance
module.exports = new Crawler();
