const db = require("../db/db");
const uuidv4 = require("uuid");

function TaskService() {
    return {
        async createTask(title, description, status) {
            if(!title) {
                throw new Error("Title is required");
            }
            const query = `
                INSERT INTO tasks (id, title, description, status)
                VALUES ($1, $2, $3, $4)
            `;

            const id = uuidv4.v4();
            const values = [id, title, description || null, status || 'pending'];
            try {
                await db.query(query, values);
                return { message: "Task created successfully" };
            } catch (error) {
                console.error("Error creating task:", error);
                throw error;
            }
        }, 
        
        async getAllTasks() {
            const query = `SELECT * FROM tasks`;
            try {
                const result = await db.query(query, []);
                return result.rows;
            } catch (error) {
                console.error("Error fetching tasks:", error);
                throw error;
            }
        },

        async getTaskById(id) {
            const query = `SELECT * FROM tasks WHERE id = $1`;
            try {
                const result = await db.query(query, [id]);
                if (result.rows.length === 0) {
                    throw new Error("Task not found");
                }
                return result.rows[0];
            } catch (error) {
                console.error("Error fetching task by ID:", error);
                throw error;
            }
        }
    }
}


module.exports = TaskService;