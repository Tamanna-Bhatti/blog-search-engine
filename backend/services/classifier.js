const config = require('../config/config');

class ContentClassifier {
    constructor() {
        // Initialize classification rules and patterns
        this.blogPatterns = {
            // Personal blog indicators in URLs and domains (expanded)
            urlPatterns: [
                /blog/i,
                /medium\.com/,
                /substack\.com/,
                /wordpress\.com/,
                /blogspot\.com/,
                /ghost\.io/,
                /hashnode\.com/,
                /dev\.to/,
                /notion\.site/,
                /tumblr\.com/,
                /wix\.com/,
                /squarespace\.com/,
                /weebly\.com/,
                /blogger\.com/,
                /typepad\.com/,
                /livejournal\.com/,
                /posts?/i,
                /articles?/i,
                /writings?/i,
                /thoughts?/i,
                /journal/i,
                /diary/i
            ],
            
            // Common blog post structures (expanded)
            titlePatterns: [
                /^how\s(?:to|i)\s/i,
                /^why\s(?:i|you|we)\s/i,
                /^what\s(?:i|you|we)\s/i,
                /^when\s(?:i|you|we)\s/i,
                /^my\s(?:experience|journey|story|thoughts|take)/i,
                /^lessons\slearned/i,
                /^what\si\slearned/i,
                /\d+\s(?:things|ways|tips|lessons|reasons|steps)/i,
                /^(?:a|an)\s(?:guide|tutorial|walkthrough)/i,
                /^(?:building|creating|making|developing)/i,
                /^(?:understanding|exploring|diving)/i,
                /^(?:thoughts|reflections)\son/i,
                /review:/i,
                /tutorial:/i,
                /guide:/i
            ],

            // Content patterns that suggest personal writing (expanded)
            contentPatterns: [
                /\b(?:I|we|my|our|me|us)\b/i,
                /\b(?:learned|discovered|realized|found|experienced|noticed)\b/i,
                /\b(?:experience|journey|story|adventure|challenge)\b/i,
                /\b(?:personally|honestly|frankly|recently|yesterday|today)\b/i,
                /\b(?:decided|tried|attempted|started|began)\b/i,
                /\b(?:thoughts|feelings|opinions|perspective|view)\b/i,
                /\b(?:tutorial|walkthrough|step-by-step|how-to)\b/i,
                /\b(?:review|analysis|comparison|breakdown)\b/i
            ]
        };

        // Corporate/commercial content indicators
        this.corporatePatterns = {
            // Common marketing phrases
            marketingPhrases: [
                /\b(?:buy now|limited time|special offer)\b/i,
                /\b(?:product|service|solution)\b/i,
                /\b(?:contact sales|request demo)\b/i,
                /\b(?:enterprise-grade|industry-leading)\b/i
            ],

            // SEO optimization indicators
            seoPatterns: [
                /\b(?:click here|learn more|find out more)\b/i,
                /\b(?:top\s\d+|best\s\d+)\b/i,
                /\b(?:ultimate guide|complete guide)\b/i
            ]
        };
    }

    async classifyContent(pageData) {
        const scores = {
            domain: this.analyzeDomain(pageData.domain),
            title: this.analyzeTitle(pageData.title),
            content: this.analyzeContent(pageData.content),
            structure: this.analyzeStructure(pageData)
        };

        // Calculate final score (weighted average)
        const weights = {
            domain: 0.2,
            title: 0.2,
            content: 0.4,
            structure: 0.2
        };

        const finalScore = Object.keys(scores).reduce((total, key) => {
            return total + (scores[key] * weights[key]);
        }, 0);

        // Classification result
        return {
            isBlog: finalScore >= config.CLASSIFIER.BLOG_CONFIDENCE_THRESHOLD,
            score: finalScore,
            details: scores
        };
    }

    analyzeDomain(domain) {
        let score = 0.5; // Start neutral

        // Check for obvious blog platforms
        if (this.blogPatterns.urlPatterns.some(pattern => pattern.test(domain))) {
            score += 0.3;
        }

        // Check for personal-looking domains
        if (/^(?!www\.)[\w-]+\.[\w-]+$/.test(domain)) {
            score += 0.1;
        }

        // Penalize obvious corporate/commercial domains
        if (/(?:corp|inc|ltd|enterprise|shop|store)/.test(domain)) {
            score -= 0.2;
        }

        return Math.max(0, Math.min(1, score));
    }

    analyzeTitle(title) {
        let score = 0.5;

        // Check for personal blog post patterns
        if (this.blogPatterns.titlePatterns.some(pattern => pattern.test(title))) {
            score += 0.3;
        }

        // Penalize marketing-style titles
        if (this.corporatePatterns.marketingPhrases.some(pattern => pattern.test(title))) {
            score -= 0.2;
        }

        // Penalize obvious SEO titles
        if (this.corporatePatterns.seoPatterns.some(pattern => pattern.test(title))) {
            score -= 0.2;
        }

        return Math.max(0, Math.min(1, score));
    }

    analyzeContent(content) {
        let score = 0.5;

        // Calculate the ratio of personal pronouns
        const personalPronounMatches = content.match(/\b(?:I|me|my|mine|we|our|ours)\b/gi) || [];
        const wordCount = content.split(/\\s+/).length;
        const pronounRatio = personalPronounMatches.length / wordCount;

        if (pronounRatio > 0.01) {
            score += 0.2;
        }

        // Check for blog-style writing patterns
        if (this.blogPatterns.contentPatterns.some(pattern => pattern.test(content))) {
            score += 0.2;
        }

        // Penalize marketing content
        const marketingPhraseCount = this.corporatePatterns.marketingPhrases.reduce((count, pattern) => {
            const matches = content.match(pattern) || [];
            return count + matches.length;
        }, 0);

        if (marketingPhraseCount > 5) {
            score -= 0.3;
        }

        return Math.max(0, Math.min(1, score));
    }

    analyzeStructure(pageData) {
        let score = 0.5;

        // Check content length
        const wordCount = pageData.wordCount;
        if (wordCount < config.CLASSIFIER.MIN_WORD_COUNT) {
            score -= 0.3;
        } else if (wordCount > 3000) {
            score += 0.2;
        }

        // Analyze content-to-noise ratio (if available)
        if (pageData.content && pageData.snippet) {
            const contentLength = pageData.content.length;
            const snippetLength = pageData.snippet.length;
            
            if (contentLength > 0 && snippetLength > 0) {
                const ratio = contentLength / snippetLength;
                if (ratio > 10) {
                    score += 0.2;
                }
            }
        }

        return Math.max(0, Math.min(1, score));
    }
}

// Export singleton instance
const classifier = new ContentClassifier();
module.exports = {
    classifyContent: (pageData) => classifier.classifyContent(pageData)
};
