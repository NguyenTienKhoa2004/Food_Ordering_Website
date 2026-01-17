// Importing the database connection utility
const { getConnection } = require('../../db');

class profileModel {

    // Method to fetch a user's profile data by their user ID
    async getUserProfile(userId) {
        try {
            const connection = await getConnection(); // Establish a database connection
            
            // SQL query to fetch the user's profile data
            const [rows] = await connection.execute(
                'SELECT id, username, email FROM users WHERE id = ?',
                [userId]
            );
            
            connection.release(); // Close the database connection
            
            // Return the user's profile data if found, otherwise return null
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            // Log and throw an error if a database error occurs
            console.error('Error fetching user profile:', error);
            throw new Error('Database error during user profile lookup');
        }
    }
   
}

// Exporting the UserModel class for use in other parts of the application
module.exports = profileModel;
