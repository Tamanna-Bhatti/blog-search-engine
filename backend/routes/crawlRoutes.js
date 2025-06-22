const express = require('express');
const crawler = require('../services/crawler');
const { APIError } = require('../utils/errorHandler');
const { URL } = require('url');

const router = express.Router();

// POST /crawl
// Body: { urls: string[] }
router.post('/', async (req, res, next) => {
    try {
        const { urls } = req.body;

        // Validate request body
        if (!urls || !Array.isArray(urls) || urls.length === 0) {
            throw new APIError(400, 'Request body must include an array of URLs');
        }

        // Validate URLs and normalize them
        const validUrls = urls
            .map(url => {
                try {
                    return new URL(url).href;
                } catch (error) {
                    return null;
                }
            })
            .filter(url => url !== null);

        if (validUrls.length === 0) {
            throw new APIError(400, 'No valid URLs provided');
        }

        // Start crawling process
        // Note: This runs asynchronously and doesn't wait for completion
        crawler.startCrawl(validUrls).catch(error => {
            console.error('Crawl error:', error);
        });

        // Return immediate response
        res.json({
            status: 'success',
            message: 'Crawl started',
            data: {
                accepted_urls: validUrls,
                rejected_urls: urls.filter(url => !validUrls.includes(url))
            }
        });
    } catch (error) {
        next(error);
    }
});

// GET /crawl/status
// Query: ?url=string (optional)
router.get('/status', async (req, res, next) => {
    try {
        const { url } = req.query;

        // If URL is provided, get specific status
        if (url) {
            try {
                const normalizedUrl = new URL(url).href;
                const status = crawler.getStatus(normalizedUrl);
                
                res.json({
                    status: 'success',
                    data: {
                        url: normalizedUrl,
                        crawl_status: status
                    }
                });
            } catch (error) {
                throw new APIError(400, 'Invalid URL provided');
            }
        } 
        // Otherwise return overall crawler status
        else {
            const status = crawler.getOverallStatus();
            
            res.json({
                status: 'success',
                data: status
            });
        }
    } catch (error) {
        next(error);
    }
});

// POST /crawl/stop
// Body: { url?: string }
router.post('/stop', async (req, res, next) => {
    try {
        const { url } = req.body;

        // If URL is provided, stop specific crawl
        if (url) {
            try {
                const normalizedUrl = new URL(url).href;
                await crawler.stopCrawl(normalizedUrl);
                
                res.json({
                    status: 'success',
                    message: `Crawl stopped for ${normalizedUrl}`
                });
            } catch (error) {
                throw new APIError(400, 'Invalid URL provided');
            }
        } 
        // Otherwise stop all crawls
        else {
            await crawler.stopAllCrawls();
            
            res.json({
                status: 'success',
                message: 'All crawls stopped'
            });
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;
