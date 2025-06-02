const pool = require('./model/model');

module.exports = async () => {
  try {
    await pool.end(); // Close the database connection pool
    console.log('Global teardown: Database connection pool closed');
  } catch (error) {
    console.error('Error during global teardown:', error);
  }
};
