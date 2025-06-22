const path = require('path');
const express = require('express');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const config = require('../config/config');
const searchRoutes = require('../routes/searchRoutes');
const { initializeDatabase } = require('../services/database');
const { APIError } = require('../utils/errorHandler');

// Set environment to production
process.env.NODE_ENV = 'production';

async function startServer() {
    try {
        // Initialize database
        await initializeDatabase();
        
        const app = express();

        // Production middleware
        app.use(compression());
        app.use(express.json());
        
        // Rate limiting
        const limiter = rateLimit({
            windowMs: config.RATE_LIMIT.WINDOW_MS,
            max: config.RATE_LIMIT.MAX_REQUESTS
        });
        app.use(limiter);

        // CORS configuration
        app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', config.CORS.ORIGIN);
            res.header('Access-Control-Allow-Methods', config.CORS.METHODS.join(', '));
            res.header('Access-Control-Allow-Headers', config.CORS.ALLOWED_HEADERS.join(', '));
            next();
        });

        // Serve static frontend files
        app.use(express.static(path.join(__dirname, '../../frontend/build')));

        // API routes
        app.use('/search', searchRoutes);

        // Serve index.html for all other routes (SPA support)
        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../../frontend/build/index.html'));
        });

        // Error handling
        app.use((err, req, res, next) => {
            console.error('ERROR 💥', err);
            
            if (err instanceof APIError) {
                return res.status(err.statusCode).json({
                    status: 'error',
                    message: err.message
                });
            }

            res.status(500).json({
                status: 'error',
                message: 'Something went wrong'
            });
        });

        // Start server
        const PORT = config.PORT;
        app.listen(PORT, () => {
            console.log(`🚀 Production server running on port ${PORT}`);
            console.log(`Environment: ${config.NODE_ENV}`);
        });

    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();
