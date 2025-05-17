const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.connect()
  .then(client => {
    return client
      .query("SET search_path TO clinic;")
      .then(() => {
        client.release();
        console.log('Połączono z bazą i ustawiono search_path na clinic');
      })
      .catch(err => {
        client.release();
        console.error('Błąd ustawiania search_path:', err.stack);
      });
  })
  .catch(err => {
    console.error('Błąd połączenia z bazą danych:', err.stack);
  });

  
module.exports = pool;