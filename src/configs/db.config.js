"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'rescueradar',
    password: 'root',
    port: 5432, // Your PostgreSQL port
    //   ssl: {
    // 	rejectUnauthorized: true,
    // },
});
pool
    .connect()
    .then(() => {
    console.log('Database connection successful');
    // You can perform further database operations here
})
    .catch((error) => {
    console.error('Database connection error:', error.message);
});
exports.default = pool;
