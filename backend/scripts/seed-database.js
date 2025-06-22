const { initializeDatabase, upsertPost } = require('../services/database');
const config = require('../config/config');

const samplePosts = [
    {
        title: "Getting Started with Web Development",
        url: "https://example-blog.com/web-dev-intro",
        snippet: "A comprehensive guide for beginners looking to start their journey in web development.",
        domain: "example-blog.com",
        content: "Web development is an exciting field that combines creativity with technical skills...",
        is_blog: true,
        quality_score: 0.85
    },
    {
        title: "Modern JavaScript Features You Should Know",
        url: "https://tech-blog.com/modern-js-features",
        snippet: "Exploring the latest JavaScript features that make coding more efficient and enjoyable.",
        domain: "tech-blog.com",
        content: "JavaScript has evolved significantly over the years, introducing many powerful features...",
        is_blog: true,
        quality_score: 0.9
    },
    {
        title: "Building Responsive Websites with Tailwind CSS",
        url: "https://css-tricks.com/tailwind-guide",
        snippet: "Learn how to create beautiful, responsive websites using Tailwind CSS utility classes.",
        domain: "css-tricks.com",
        content: "Tailwind CSS has revolutionized the way we style websites, offering a utility-first approach...",
        is_blog: true,
        quality_score: 0.88
    }
];

async function seedDatabase() {
    try {
        console.log('Initializing database...');
        await initializeDatabase();

        console.log('Seeding sample blog posts...');
        for (const post of samplePosts) {
            await upsertPost(post);
            console.log(`Seeded: ${post.title}`);
        }

        console.log('Database seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

// Run seeding
seedDatabase();
