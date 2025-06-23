// Importing the database connection utility and the slugify library
const { getConnection } = require('../../db'); 



class exclusiveDealsModel {

   
    // Method to add a new item to the database
    addExclusiveDeals(itemData) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection(); // Establish a database connection

              

                // SQL query to insert the item into the database
                const sql = 'INSERT INTO exclusivedeals (image, discount, name) VALUES (?, ?, ?)';
                const values = [itemData.image, itemData.discount, itemData.name];

                // Execute the query and resolve the result
                const [result] = await connection.execute(sql, values);
                await connection.end(); // Close the database connection
                resolve(result);
            } catch (error) {
                console.error('Error adding item:', error); // Log any errors
                reject(error); // Reject the promise with the error
            }
        });
    }

     // Method to fetch all items from the database
    showitem() {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection(); // Establish a database connection
                const sql = 'SELECT * FROM exclusivedeals'; // SQL query to fetch all items
                const [rows] = await connection.execute(sql); // Execute the query
                await connection.end(); // Close the database connection
                resolve(rows); // Resolve the promise with the fetched rows
            } catch (error) {
                console.error('Error fetching items:', error); // Log any errors
                reject(error); // Reject the promise with the error
            }
        });
    }
    getExclusiveDeals() {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection(); // Establish a database connection
                const sql = 'SELECT * FROM exclusivedeals'; // SQL query to fetch all exclusive deals
                const [rows] = await connection.execute(sql); // Execute the query
                await connection.end(); // Close the database connection
                resolve(rows); // Resolve the promise with the fetched rows
            } catch (error) {
                console.error('Error fetching exclusive deals:', error); // Log any errors
                reject(error); // Reject the promise with the error
            }
        });
    }

    getExclusiveDealsById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection(); // Establish a database connection
                const sql = 'SELECT * FROM exclusivedeals WHERE id = ?'; // SQL query to fetch exclusive deal by ID
                const [rows] = await connection.execute(sql, [id]); // Execute the query with the provided ID
                await connection.end(); // Close the database connection

                if (rows.length > 0) {
                    resolve(rows[0]); // Resolve with the first row if found
                } else {
                    resolve(null); // Resolve with null if no deal is found
                }
            } catch (error) {
                console.error('Error fetching exclusive deal by ID:', error); // Log any errors
                reject(error); // Reject the promise with the error
            }
        });
    }

    editExclusiveDeals(id, itemData) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection(); // Establish a database connection

                // SQL query to update the exclusive deal in the database
                const sql = 'UPDATE exclusivedeals SET image = ?, discount = ?, name = ? WHERE id = ?';
                const values = [itemData.image, itemData.discount, itemData.name, id];

                // Execute the query and resolve the result
                const [result] = await connection.execute(sql, values);
                await connection.end(); // Close the database connection
                resolve(result);
            } catch (error) {
                console.error('Error updating exclusive deal:', error); // Log any errors
                reject(error); // Reject the promise with the error
            }
        });
    }
    deleteExclusiveDeals(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection(); // Establish a database connection
                const sql = 'DELETE FROM exclusivedeals WHERE id = ?'; // SQL query to delete the exclusive deal by ID
                const [result] = await connection.execute(sql, [id]); // Execute the query with the provided ID
                await connection.end(); // Close the database connection
                resolve(result); // Resolve the promise with the result of the deletion
            } catch (error) {
                console.error('Error deleting exclusive deal:', error); // Log any errors
                reject(error); // Reject the promise with the error
            }
        });
    }
   
}

// Exporting the itemModel class for use in other parts of the application
module.exports =exclusiveDealsModel;