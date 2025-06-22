module.exports = {
    // Server configuration
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',

    // Database configuration
    DB_PATH: './data/blog_search.db',
    
    // Crawler configuration
    CRAWLER: {
        CONCURRENT_CRAWLS: 5,
        TIMEOUT_MS: 30000,
        MAX_DEPTH: 3,
        USER_AGENT: 'BlogSearchBot/1.0',
    },

    // Classification thresholds
    CLASSIFIER: {
        // Confidence threshold for blog classification
        BLOG_CONFIDENCE_THRESHOLD: 0.7,
        
        // Minimum word count for a valid blog post
        MIN_WORD_COUNT: 500,
        
        // Maximum percentage of outbound links (to filter spam)
        MAX_LINK_PERCENTAGE: 0.1
    },

    // API rate limiting
    RATE_LIMIT: {
        WINDOW_MS: 15 * 60 * 1000, // 15 minutes
        MAX_REQUESTS: 100
    }
};
