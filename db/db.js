// handle db connection and queries
const { Pool } = require("pg");

const db = new Pool({
    user:  "postgres",
    password: "postgres",
    host: "0.0.0.0",
    port: 5432,
    database: "node-postgres-db"
});

module.exports = db;