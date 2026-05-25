const app = require("./index");
const db = require("./db/db");
const express = require("express");
const initDB = require("./db/init");
const protectedRoute = require("./routes/protectedRoutes");
const openRoute = require("./routes/openRoute")

//starting the server
const PORT = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", protectedRoute);
app.use("/", openRoute);

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