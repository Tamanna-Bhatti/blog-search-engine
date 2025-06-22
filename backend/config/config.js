const path = require('path');

const baseConfig = {
    // Crawler configuration
    CRAWLER: {
        CONCURRENT_CRAWLS: 5,
        TIMEOUT_MS: 30000,
        MAX_DEPTH: 3,
        USER_AGENT: 'BlogSearchBot/1.0',
    },

    // Classification thresholds
    CLASSIFIER: {
        BLOG_CONFIDENCE_THRESHOLD: 0.7,
        MIN_WORD_COUNT: 500,
        MAX_LINK_PERCENTAGE: 0.1
    },

    // API rate limiting
    RATE_LIMIT: {
        WINDOW_MS: 15 * 60 * 1000, // 15 minutes
        MAX_REQUESTS: 100
    }
};

const envConfig = {
    development: {
        PORT: process.env.PORT || 5000,
        NODE_ENV: 'development',
        DB_PATH: path.join(process.cwd(), 'data', 'blog_search.db'),
        CORS: {
            origin: process.env.FRONTEND_URL || 'http://localhost:3000',
            methods: ['GET', 'POST', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true
        }
    },
    production: {
        PORT: process.env.PORT || 5000,
        NODE_ENV: 'production',
        DB_PATH: path.join(process.env.DATA_DIR || process.cwd(), 'data', 'blog_search.db'),
        CORS: {
            origin: process.env.FRONTEND_URL || '*',
            methods: ['GET', 'POST', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true
        }
    }
};

const env = process.env.NODE_ENV || 'development';
module.exports = {
    ...baseConfig,
    ...envConfig[env]
};
