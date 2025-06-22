const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
const { initializeDatabase } = require('./services/database');
const searchRoutes = require('./routes/searchRoutes');
const crawlRoutes = require('./routes/crawlRoutes');
const classifyRoutes = require('./routes/classifyRoutes');
const { errorHandler } = require('./utils/errorHandler');
const config = require('./config/config');

// Create Express app
const app = express();

// Middleware
app.use(cors(config.CORS));
app.use(compression());
// Body parser with increased limit for larger payloads
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Basic security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Ensure data directory exists
const fs = require('fs');
const dataDir = path.dirname(config.DB_PATH);
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database
initializeDatabase().catch(error => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
});

// Routes
app.use('/search', searchRoutes);
app.use('/crawl', crawlRoutes);
app.use('/classify-url', classifyRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: require('./package.json').version
    });
});

// Error handling
app.use(errorHandler);

// Start server
const PORT = config.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${config.NODE_ENV}`);
});

// Handle graceful shutdown
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

async function gracefulShutdown() {
    console.log('Received shutdown signal');
    
    try {
        // Close database connections
        const { db } = require('./services/database');
        await new Promise((resolve, reject) => {
            db.close(err => {
                if (err) reject(err);
                else resolve();
            });
        });
        console.log('Database connections closed');

        // Close crawler browser if open
        const crawler = require('./services/crawler');
        await crawler.close();
        console.log('Crawler browser closed');

        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
}
