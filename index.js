const express = require("express");
const db = require("./db/db");

const app = express();
const PORT = 4000;

const message = {
    message: "Hello"
}

app.use((req, res, next) => {
    console.log("Middleware 1");
    console.log(`${req.method} ${req.url}`);
    next();
});

app.get("/", (req, res) => {
    res.send(message);
});

app.get("/test/db", async (req, res) => {
    try {
        const result = await db.query("SELECT NOW()");
        res.status(200).send(result.rows[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).send("Database error");
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

