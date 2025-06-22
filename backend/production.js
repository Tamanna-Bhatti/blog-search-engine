module.exports = {
    PORT: process.env.PORT || 5000,
    DB_PATH: './data/blog_search.db',
    CRAWLER: {
        USER_AGENT: 'BlogSearchEngine/1.0',
        TIMEOUT_MS: 30000,
        CONCURRENT_REQUESTS: 5,
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY_MS: 1000
    },
    CLASSIFIER: {
        BLOG_CONFIDENCE_THRESHOLD: 0.5,
        MIN_WORD_COUNT: 200
    },
    CORS: {
        ORIGIN: process.env.FRONTEND_URL || 'http://localhost:3000',
        METHODS: ['GET', 'POST', 'OPTIONS'],
        ALLOWED_HEADERS: ['Content-Type', 'Authorization']
    },
    RATE_LIMIT: {
        WINDOW_MS: 15 * 60 * 1000, // 15 minutes
        MAX_REQUESTS: 100 // limit each IP to 100 requests per windowMs
    },
    CACHE: {
        TTL: 5 * 60 // 5 minutes cache
    }
};
