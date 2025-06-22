const express = require('express');
const { searchPosts } = require('../services/database');
const { APIError } = require('../utils/errorHandler');

const router = express.Router();

// GET /search?q=query&limit=10&offset=0
router.get('/', async (req, res, next) => {
    try {
        const { q, limit = 10, offset = 0 } = req.query;

        // Validate search query
        if (!q || q.trim().length === 0) {
            throw new APIError(400, 'Search query is required');
        }

        // Validate and parse limit/offset
        const parsedLimit = Math.min(parseInt(limit) || 10, 50); // Max 50 results per page
        const parsedOffset = parseInt(offset) || 0;

        if (parsedOffset < 0) {
            throw new APIError(400, 'Offset must be non-negative');
        }

        // Perform search
        const results = await searchPosts(q.trim(), parsedLimit, parsedOffset);

        // Format response
        res.json({
            status: 'success',
            data: {
                query: q,
                offset: parsedOffset,
                limit: parsedLimit,
                total: results.length,
                results: results.map(post => ({
                    id: post.id,
                    title: post.title,
                    url: post.url,
                    snippet: post.snippet,
                    domain: post.domain,
                    quality_score: post.quality_score,
                    crawled_at: post.crawled_at
                }))
            }
        });
    } catch (error) {
        next(error);
    }
});

// GET /search/stats - Get search statistics
router.get('/stats', async (req, res, next) => {
    try {
        const stats = await searchStats();
        res.json({
            status: 'success',
            data: stats
        });
    } catch (error) {
        next(error);
    }
});

// Helper function to get search statistics
async function searchStats() {
    // This could be expanded to include more detailed statistics
    return {
        total_posts: 0, // Implement actual count
        total_domains: 0, // Implement actual count
        last_crawl: new Date().toISOString()
    };
}

module.exports = router;
