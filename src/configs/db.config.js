"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: "ankitkumar",
    host: "rescueradar.cjon0daiisn3.ap-south-1.rds.amazonaws.com",
    database: "rescueradar",
    password: "rescueradar",
    port: 5432,
    ssl: {
        rejectUnauthorized: true,
    },
});
pool
    .connect()
    .then(() => {
    console.log("Database connection successful");
    // You can perform further database operations here
})
    .catch((error) => {
    console.error("Database connection error:", error.message);
});
exports.default = pool;
