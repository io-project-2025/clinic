const db = require('./model/DatabaseService');

module.exports = async () => {
  try {
    await db.pool.end(); // Close the database connection pool
    console.log('Global teardown: Database connection pool closed');
  } catch (error) {
    console.error('Error during global teardown:', error);
  }
};
