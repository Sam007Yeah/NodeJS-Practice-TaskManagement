const db = require("./db");

async function init() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id VARCHAR PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                status VARCHAR(50) NOT NULL DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Database initialized successfully");
    } catch (error) {
        console.error("Error initializing database:", error);
    }
}

module.exports = init;