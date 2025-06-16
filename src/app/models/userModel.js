// Importing the database connection utility
const { getConnection } = require('../../db');

class UserModel {

    // Static method to find a user by their credentials (username and password)
    static async findUserByCredentials(username, password) {
        try {
            const connection = await getConnection(); // Establish a database connection

            // SQL query to find a user with the given username and password
            const [rows] = await connection.execute(
                'SELECT id, username, isAdmin FROM users WHERE username = ? AND password = ?',
                [username, password]
            );

            await connection.end(); // Close the database connection

            // Return the user if found, otherwise return null
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            // Throw a custom error if a database error occurs
            throw new Error('Database error during user lookup');
        }
    }

    // Method to fetch all users from the database
    getUsers() {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection(); // Establish a database connection

                // SQL query to fetch all users
                const sql = 'SELECT id, username, isAdmin FROM users';
                const [rows] = await connection.execute(sql); // Execute the query

                await connection.end(); // Close the database connection

                resolve(rows); // Resolve the promise with the fetched rows
            } catch (error) {
                // Log the error and reject the promise if an error occurs
                console.error('Error fetching users:', error);
                reject(error);
            }
        });
    }
    // Method to create a new user in the database
    static async createUser(username, email, password) {
        const connection = await getConnection();
        const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        await connection.execute(sql, [username, email, password]);
        await connection.end();
    }
    static async findById(id) {
        const connection = await getConnection();
        const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [id]);
        await connection.end();
        return rows[0];
    }
    static async updateAdminStatus(id, isAdmin) {
        const connection = await getConnection();
        await connection.execute('UPDATE users SET isAdmin = ? WHERE id = ?', [isAdmin ? 1 : 0, id]);
        await connection.end();
    }
}

// Exporting the UserModel class for use in other parts of the application
module.exports = UserModel;