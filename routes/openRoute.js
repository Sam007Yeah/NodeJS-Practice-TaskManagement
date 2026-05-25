const express = require("express");
const UserService = require("../service/User-Service");

const openRoute = express.Router();
const userService = UserService();

openRoute.use(express.json());

openRoute.get("/health_check", (req, res) => {
    res.status(200).send({message: "Open Route working fine!"});
});

openRoute.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        let result = await userService.createUser(username, password);
        res.status(201).send({"Result" : result});
    }
    catch (error) {
        console.error("Error while creating user!")
        res.status(500).send({"Result" : "Error while creating user", 
            "Reason" : error.message || "Internal Server Error"
        });
    }
});

openRoute.post("/verifyUser", async (req, res) => {
    const { id, password } = req.body;
    try {
        let result = await userService.verifyUser(id, password);
        res.status(200).send({"Result" : result});
    }
    catch (error) {
        res.status(500).send({"Result" : "User Can't be verified",
            "Reason" : error.message || "Internal Server Error"
        });
    }
});

openRoute.post("/login", async (req, res) => {
    const { id, password } = req.body;
    try {
        let result = await userService.login(id, password);
        res.status(200).send(result);
    }
    catch (error) {
        res.status(500).send({"message" : "Error processing Request"});
    }
})

openRoute.get("/verifyToken/:token", (req, res) => {
    const { token } = req.params
    try {
        res.send(userService.verifyToken(token))
    }
    catch (err) {
        res.status(500).send({"message": err.message || "Internal Server Error"})
    }
})

module.exports = openRoute;