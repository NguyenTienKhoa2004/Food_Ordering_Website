// 
const mysql = require('mysql2/promise');

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'foodapp',
  charset: 'utf8mb4', 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

const pool = mysql.createPool(dbConfig);

async function getConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database successfully!');
    return connection;
  } catch (error) {
    console.error('Error getting connection from pool:', error.message);
    throw error;
  }
}

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    await connection.ping(); 
    console.log('MySQL connection test successful!');
    connection.release(); 
  } catch (error) {
    console.error('Error connecting to MySQL:', error.message);
  }
}

if (process.env.NODE_ENV !== 'test') {
  testConnection();
}

module.exports = { 
  getConnection,
  pool 
};