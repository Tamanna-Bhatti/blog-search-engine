const fs = require('fs');
const path = require('path');
const crawler = require('../services/crawler');
const { initializeDatabase } = require('../services/database');

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...');
        
        // Initialize database
        await initializeDatabase();
        
        // Load seed URLs
        const seedFile = path.join(__dirname, '../data/seed-urls.json');
        const seedData = JSON.parse(fs.readFileSync(seedFile, 'utf8'));
        
        console.log(`📋 Found ${seedData.urls.length} URLs to crawl`);
        
        // Crawl URLs in batches to avoid overwhelming servers
        const batchSize = 5;
        for (let i = 0; i < seedData.urls.length; i += batchSize) {
            const batch = seedData.urls.slice(i, i + batchSize);
            console.log(`🔄 Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(seedData.urls.length/batchSize)}`);
            
            await Promise.all(batch.map(async (url) => {
                try {
                    console.log(`  📡 Crawling: ${url}`);
                    await crawler.crawlUrl(url);
                } catch (error) {
                    console.error(`  ❌ Failed to crawl ${url}:`, error.message);
                }
            }));
            
            // Wait between batches to be respectful
            if (i + batchSize < seedData.urls.length) {
                console.log('  ⏳ Waiting 2 seconds before next batch...');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
        
        console.log('✅ Database seeding completed!');
        
    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await crawler.close();
        process.exit(0);
    }
}

// Run if called directly
if (require.main === module) {
    seedDatabase();
}

module.exports = { seedDatabase };
