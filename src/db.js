// const mysql = require('mysql2/promise');

// const dbConfig = {
//     host: 'localhost',
//     user: 'root',          // Replace with your MySQL username
//     password: 'Minhchau3112...', // Replace with your MySQL password
//     database: 'foodapp'
// };

// async function getConnection() {
//     return await mysql.createConnection(dbConfig);
// }

// module.exports = { getConnection };


const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
};

async function getConnection() {
    return await mysql.createConnection(dbConfig);
}

module.exports = { getConnection };
