const express = require('express');
const { classifyContent } = require('../services/classifier');
const { getPostByUrl } = require('../services/database');
const crawler = require('../services/crawler');
const { APIError } = require('../utils/errorHandler');
const { URL } = require('url');

const router = express.Router();

// POST /classify-url
// Body: { url: string }
router.post('/', async (req, res, next) => {
    try {
        const { url } = req.body;

        // Validate URL
        if (!url) {
            throw new APIError(400, 'URL is required');
        }

        let normalizedUrl;
        try {
            normalizedUrl = new URL(url).href;
        } catch (error) {
            throw new APIError(400, 'Invalid URL format');
        }

        // Check if URL was already classified
        const existingPost = await getPostByUrl(normalizedUrl);
        if (existingPost) {
            return res.json({
                status: 'success',
                data: {
                    url: normalizedUrl,
                    is_blog: existingPost.is_blog === 1,
                    quality_score: existingPost.quality_score,
                    classification_source: 'cache',
                    crawled_at: existingPost.crawled_at
                }
            });
        }

        // Initialize crawler if needed
        await crawler.initialize();

        // Fetch and classify the content
        const page = await crawler.browser.newPage();
        try {
            // Set timeout and user agent
            await page.setDefaultNavigationTimeout(30000);
            await page.setUserAgent('BlogSearchClassifier/1.0');

            // Navigate to the URL
            await page.goto(normalizedUrl, { waitUntil: 'networkidle0' });

            // Extract content
            const metadata = await crawler.extractMetadata(page);
            const content = await crawler.extractContent(page);

            // Prepare page data for classification
            const pageData = {
                url: normalizedUrl,
                domain: new URL(normalizedUrl).hostname,
                title: metadata.title,
                snippet: metadata.description,
                content: content,
                wordCount: content.split(/\\s+/).length
            };

            // Classify the content
            const classification = await classifyContent(pageData);

            res.json({
                status: 'success',
                data: {
                    url: normalizedUrl,
                    is_blog: classification.isBlog,
                    quality_score: classification.score,
                    classification_details: classification.details,
                    classification_source: 'live',
                    metadata: {
                        title: metadata.title,
                        description: metadata.description,
                        word_count: pageData.wordCount
                    }
                }
            });

        } catch (error) {
            throw new APIError(500, `Failed to classify URL: ${error.message}`);
        } finally {
            await page.close();
        }

    } catch (error) {
        next(error);
    }
});

// GET /classify-url/stats
router.get('/stats', async (req, res, next) => {
    try {
        // This could be expanded to include more detailed classification statistics
        const stats = {
            total_classified: 0,
            blog_percentage: 0,
            average_quality_score: 0,
            classification_timestamp: new Date().toISOString()
        };

        res.json({
            status: 'success',
            data: stats
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
