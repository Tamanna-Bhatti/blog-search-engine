const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const config = require('../config/config');

// Ensure we're using absolute path for database
const dbPath = path.resolve(process.cwd(), config.DB_PATH);

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        process.exit(1);
    }
    console.log('Connected to SQLite database');
});

// Initialize database schema
const initializeDatabase = () => {
    const schema = `
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            url TEXT UNIQUE NOT NULL,
            snippet TEXT,
            domain TEXT NOT NULL,
            content TEXT,
            is_blog BOOLEAN NOT NULL DEFAULT 0,
            quality_score FLOAT,
            crawled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE INDEX IF NOT EXISTS idx_posts_url ON posts(url);
        CREATE INDEX IF NOT EXISTS idx_posts_domain ON posts(domain);
        CREATE INDEX IF NOT EXISTS idx_posts_is_blog ON posts(is_blog);
        CREATE VIRTUAL TABLE IF NOT EXISTS posts_fts USING fts5(
            title, 
            snippet, 
            content,
            content='posts',
            content_rowid='id'
        );

        CREATE TRIGGER IF NOT EXISTS posts_ai AFTER INSERT ON posts BEGIN
            INSERT INTO posts_fts(rowid, title, snippet, content)
            VALUES (new.id, new.title, new.snippet, new.content);
        END;

        CREATE TRIGGER IF NOT EXISTS posts_ad AFTER DELETE ON posts BEGIN
            INSERT INTO posts_fts(posts_fts, rowid, title, snippet, content)
            VALUES('delete', old.id, old.title, old.snippet, old.content);
        END;

        CREATE TRIGGER IF NOT EXISTS posts_au AFTER UPDATE ON posts BEGIN
            INSERT INTO posts_fts(posts_fts, rowid, title, snippet, content)
            VALUES('delete', old.id, old.title, old.snippet, old.content);
            INSERT INTO posts_fts(rowid, title, snippet, content)
            VALUES (new.id, new.title, new.snippet, new.content);
        END;
    `;

    return new Promise((resolve, reject) => {
        db.exec(schema, (err) => {
            if (err) {
                console.error('Error creating schema:', err);
                reject(err);
            } else {
                console.log('Database schema initialized successfully');
                resolve();
            }
        });
    });
};

// Enhanced search posts with broader matching
const searchPosts = (query, limit = 10, offset = 0) => {
    return new Promise((resolve, reject) => {
        // Escape special characters for FTS5
        const escapedQuery = query.replace(/[\\'"]/g, '').trim();
        
        // Create multiple search variations for better matching
        const searchTerms = escapedQuery.toLowerCase().split(/\s+/);
        const ftsQuery = searchTerms.join(' OR ');
        
        const sql = `
            SELECT p.id, p.title, p.url, p.snippet, p.domain, p.quality_score, p.crawled_at
            FROM posts p
            WHERE p.is_blog = 1 AND (
                lower(p.title) LIKE '%' || lower(?) || '%' OR
                lower(p.snippet) LIKE '%' || lower(?) || '%' OR
                lower(p.content) LIKE '%' || lower(?) || '%'
            )
            ORDER BY p.quality_score DESC, p.crawled_at DESC
            LIMIT ? OFFSET ?
        `;
        
        db.all(sql, [
            escapedQuery, // Title LIKE
            escapedQuery, // Snippet LIKE
            escapedQuery, // Content LIKE
            limit,
            offset
        ], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

// Insert or update a post
const upsertPost = (post) => {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO posts (title, url, snippet, domain, content, is_blog, quality_score)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(url) DO UPDATE SET
                title = excluded.title,
                snippet = excluded.snippet,
                content = excluded.content,
                is_blog = excluded.is_blog,
                quality_score = excluded.quality_score,
                crawled_at = CURRENT_TIMESTAMP
        `;
        
        db.run(sql, [
            post.title,
            post.url,
            post.snippet,
            post.domain,
            post.content,
            post.is_blog ? 1 : 0,
            post.quality_score
        ], function(err) {
            if (err) reject(err);
            else resolve(this.lastID);
        });
    });
};

// Get post by URL
const getPostByUrl = (url) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM posts WHERE url = ?';
        db.get(sql, [url], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

// Get search statistics
const getSearchStats = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                COUNT(*) as total_posts,
                COUNT(DISTINCT domain) as total_domains,
                MAX(crawled_at) as last_crawl,
                AVG(quality_score) as avg_quality_score
            FROM posts 
            WHERE is_blog = 1
        `;
        
        db.get(sql, [], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
};

// Get recent blog posts
const getRecentPosts = (limit = 10) => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT id, title, url, snippet, domain, quality_score, crawled_at
            FROM posts 
            WHERE is_blog = 1
            ORDER BY crawled_at DESC
            LIMIT ?
        `;
        
        db.all(sql, [limit], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};

// Export database functions
module.exports = {
    initializeDatabase,
    searchPosts,
    upsertPost,
    getPostByUrl,
    getSearchStats,
    getRecentPosts,
    db // Export for direct access if needed
};
