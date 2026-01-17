const { getConnection } = require('../../db');
const bcrypt = require('bcrypt');


class UserModel {

    // Static method to find a user by their credentials (username and password)
     static async findUserByCredentials(username, password) {
        const connection = await getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        connection.release();
        const user = rows[0];
        if (user && await bcrypt.compare(password, user.password)) {
            return user;
        }
        return null;
    }

    // Method to fetch all users from the database
    getUsers() {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection(); // Establish a database connection

                // SQL query to fetch all users
                const sql = 'SELECT id, username, isAdmin FROM users';
                const [rows] = await connection.execute(sql); // Execute the query

                connection.release(); // Close the database connection

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
        const hashedPassword = await bcrypt.hash(password, 10); // Hash password
        const sql = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        await connection.execute(sql, [username, email, hashedPassword]);
        connection.release();
    }
    static async findById(id) {
        const connection = await getConnection();
        const [rows] = await connection.execute('SELECT * FROM users WHERE id = ?', [id]);
        connection.release();
        return rows[0];
    }
    static async updateAdminStatus(id, isAdmin) {
        const connection = await getConnection();
        await connection.execute('UPDATE users SET isAdmin = ? WHERE id = ?', [isAdmin ? 1 : 0, id]);
        connection.release();
    }
    static async updateUsername(id, username) {
        const connection = await getConnection();
        await connection.execute('UPDATE users SET username = ? WHERE id = ?', [username, id]);
        connection.release();
    }

    static async checkPassword(id, password) {
        const connection = await getConnection();
        const [rows] = await connection.execute('SELECT password FROM users WHERE id = ?', [id]);
        connection.release();
        if (!rows[0]) return false;
        return await bcrypt.compare(password, rows[0].password);
    }

    static async updatePassword(id, newPassword) {
        const connection = await getConnection();
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await connection.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, id]);
        connection.release();
    }
}

// Exporting the UserModel class for use in other parts of the application
module.exports = UserModel;
