const mysql = require('mysql');

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,    // Host
  user: process.env.DB_USER,    // Username
  password: process.env.DB_PASSWORD, // Password
  database: process.env.DB_NAME, // Database name
  connectionLimit: 10            // Set the connection limit for the pool
});

// Function to execute a query
function executeQuery(query, params) {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return reject(err);
      }
      resolve(results);
    });
  });
}

module.exports = {
  pool,
  executeQuery
};
