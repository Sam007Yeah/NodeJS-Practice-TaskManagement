const db = require("./db");

async function init() {
    try {
        const createTaskTable = await db.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id VARCHAR PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                status VARCHAR(50) NOT NULL DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        const createUserTable = await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id VARCHAR PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                password VARCHAR(10) NOT NULL UNIQUE,
                roles VARCHAR
                );
        `);

        await Promise.allSettled([createTaskTable, createUserTable]).then(() => {
            console.log("Database initialised!");
        })
    } catch (error) {
        console.error("Error initializing database:", error);
    }
}

module.exports = init;