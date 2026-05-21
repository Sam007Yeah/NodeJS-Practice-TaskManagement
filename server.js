const app = require("./index");
const db = require("./db/db");
const express = require("express");
const initDB = require("./db/init");
const TaskService = require("./service/Task-Service");

const taskService = TaskService();
//starting the server
const PORT = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((err, req, res, next) => {
    console.error("Error handling request:", err);
    res.status(500).json({ error: "Internal Server Error" });
});

app.use((req, res, next) => {
    console.log("Middleware executed");
    console.log(`Request method: ${req.method}, Request URL: ${req.url}`);
    next();
});

app.use((req, res, next) => {
    //auth stuff
    console.log("Authentication middleware executed");
    next();
})

app.get("/health_check", (req, res) => {
    res.status(200).json({ message: "Server is healthy" });
});

app.post("/createTask", async (req, res) => {
    const { title, description, status } = req.body;
    try {
        const result = await taskService.createTask(title, description, status);
        res.status(201).json(result);
    }
    catch (error) {
        console.error("Error creating task:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

app.get("/getAllTasks", async (req, res) => {
    try {
        const tasks = await taskService.getAllTasks();
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

app.get("/getTaskById/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const task = await taskService.getTaskById(id);
        res.status(200).json(task);
    } catch (error) {
        console.error("Error fetching task by ID:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});


function start() {
        app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

//Initialising the database before starting the server
initDB().then(() => {
    console.log("Database initialized successfully");
}).catch((error) => {
    console.error("Error initializing database:", error);
}).finally(() => {
    console.log("Starting the server...");
    start();
});