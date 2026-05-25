const express = require("express");
const TaskService = require("../service/Task-Service");

const taskService = TaskService();
const protectedRoute = express.Router();

protectedRoute.use((req, res, next) => {
    //auth stuff
    console.log("Protected route middleware executed");
    next();
});

protectedRoute.use((err, req, res, next) => {
    console.error("Error handling request:", err);
    res.status(500).json({ error: "Internal Server Error" });
});

protectedRoute.use((req, res, next) => {
    console.log("Middleware executed");
    console.log(`Request method: ${req.method}, Request URL: ${req.url}`);
    next();
});

protectedRoute.use((req, res, next) => {
    //auth stuff
    console.log("Authentication middleware executed");
    next();
})

protectedRoute.get("/health_check", (req, res) => {
    res.status(200).json({ message: "Server is healthy" });
});

protectedRoute.post("/createTask", async (req, res) => {
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

protectedRoute.get("/getAllTasks", async (req, res) => {
    try {
        const tasks = await taskService.getAllTasks();
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

protectedRoute.get("/getTaskById/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const task = await taskService.getTaskById(id);
        res.status(200).json(task);
    } catch (error) {
        console.error("Error fetching task by ID:", error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

protectedRoute.delete("/deleteTaskById/:id", async (req, res) => {
    const {id} = req.params;
    try {
        const result = await taskService.deleteTaskById(id);
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error deleting task by ID", error.message || error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

protectedRoute.patch("/updateTaskById/:id", async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    try {
        const result = await taskService.updateTaskById(id, {"title": title, "description": description, "status": status});
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Error updating task by ID", error.message || error);
        res.status(500).json({ error: error.message || "Internal Server Error" });
    }
});

module.exports = protectedRoute;