const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});


pool.on("connect", (client) => {
  client
    .query("SET search_path TO clinic;")
    .catch((err) => console.error("Błąd ustawiania search_path:", err.stack));
});


module.exports = pool;

