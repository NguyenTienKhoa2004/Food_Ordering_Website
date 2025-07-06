const mysql = require('mysql2/promise');


// MySQL connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'foodapp'
};

// Function to get a connection
async function getConnection() {
  const connection = await mysql.createConnection(dbConfig);
  console.log('Connected to MySQL database successfully!');
  return connection;
}

// Test the connection on startup
async function testConnection() {
  try {
    const connection = await getConnection();
    await connection.ping(); // Test the connection
    console.log('MySQL connection test successful!');
    await connection.end(); // Close test connection
  } catch (error) {
    console.error('Error connecting to MySQL:', error.message);
  }
}

testConnection();

module.exports = { getConnection };

