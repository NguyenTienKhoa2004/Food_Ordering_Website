// Importing the database connection utility and the slugify library
const { getConnection } = require('../../db'); 
const slugify = require('slugify'); 


class itemModel {

    // Method to generate a unique slug for an item based on its name
    async generateUniqueSlug(name, connection) {
        let baseSlug = slugify(name, { lower: true, strict: true }); // Generate a base slug
        let slug = baseSlug;
        let counter = 1;

        // Check if the slug is unique; if not, append a counter to make it unique
        while (true) {
            const [rows] = await connection.execute('SELECT id FROM items WHERE slug = ?', [slug]);
            if (rows.length === 0) {
                return slug; // Return the unique slug
            }
            slug = `${baseSlug}-${counter}`; // Append counter (e.g., pizza-1)
            counter++;
        }
    }

    // Method to add a new item to the database
    additem(itemData) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection(); // Establish a database connection

                // Generate a unique slug for the item
                const slug = await this.generateUniqueSlug(itemData.name, connection);

                // SQL query to insert the item into the database
                const sql = 'INSERT INTO items (slug, name, description, image, price) VALUES (?, ?, ?, ?, ?)';
                const values = [slug, itemData.name, itemData.description, itemData.image, itemData.price];

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
                const sql = 'SELECT * FROM items'; // SQL query to fetch all items
                const [rows] = await connection.execute(sql); // Execute the query
                await connection.end(); // Close the database connection
                resolve(rows); // Resolve the promise with the fetched rows
            } catch (error) {
                console.error('Error fetching items:', error); // Log any errors
                reject(error); // Reject the promise with the error
            }
        });
    }

//     showitem() {
//     return new Promise(async (resolve, reject) => {
//         let connection;
//         try {
//             connection = await getConnection();
//             const [rows] = await connection.execute('SELECT * FROM items');
//             resolve(rows);
//         } catch (error) {
//             console.error('Error fetching items:', error);
//             reject(error);
//         } finally {
//             if (connection) connection.release(); // Release instead of end
//         }
//     });
// }
    showCategory() {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection(); // Establish a database connection
                const sql = 'SELECT * FROM categories'; // SQL query to fetch all categories
                const [rows] = await connection.execute(sql); // Execute the query
                await connection.end(); // Close the database connection
                resolve(rows); // Resolve the promise with the fetched rows
            } catch (error) {
                console.error('Error fetching categories:', error); // Log any errors
                reject(error); // Reject the promise with the error
            }
        });
    }
    showSuggestions() {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection(); // Establish a database connection
                const sql = 'SELECT * FROM items ORDER BY RAND() LIMIT 5'; // SQL query to fetch random suggestions
                const [rows] = await connection.execute(sql); // Execute the query
                await connection.end(); // Close the database connection
                resolve(rows); // Resolve the promise with the fetched rows
            } catch (error) {
                console.error('Error fetching suggestions:', error); // Log any errors
                reject(error); // Reject the promise with the error
            }
        });
    }
    getItemsByCategory(name) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection(); // Establish a database connection
                const sql = 'SELECT * FROM items WHERE category LIKE ?'; // SQL query to fetch items by name
                const [rows] = await connection.execute(sql, [`%${name}%`]); // Execute the query
                await connection.end(); // Close the database connection
                resolve(rows); // Resolve the promise with the fetched rows
            } catch (error) {
                console.error('Error fetching items by name:', error); // Log any errors
                reject(error); // Reject the promise with the error
            }
        });
    }

    // Method to fetch a specific item by its slug
    getItemBySlug(slug) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection(); // Establish a database connection
                const sql = 'SELECT * FROM items WHERE slug = ?'; // SQL query to fetch the item by slug
                const [rows] = await connection.execute(sql, [slug]); // Execute the query
                await connection.end(); // Close the database connection
                resolve(rows.length > 0 ? rows[0] : null); // Resolve with the item or null if not found
            } catch (error) {
                console.error('Error fetching item by slug:', error); // Log any errors
                reject(error); // Reject the promise with the error
            }
        });
    }

    // Method to edit an existing item in the database
    editItem(id, itemData) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection(); // Establish a database connection

                // Fetch the current item data
                const [current] = await connection.execute('SELECT id, slug, name, description, image, price FROM items WHERE id = ?', [id]);
                if (current.length === 0) {
                    await connection.end(); // Close the connection if the item is not found
                    return reject(new Error('Item not found')); // Reject with an error
                }

                // Generate a new slug if the name has changed
                const newSlug = itemData.name && itemData.name !== current[0].name
                    ? await this.generateUniqueSlug(itemData.name, connection, id)
                    : current[0].slug;

                // SQL query to update the item in the database
                const sql = 'UPDATE items SET slug = ?, name = ?, description = ?, image = ?, price = ? WHERE id = ?';
                const values = [
                    newSlug,
                    itemData.name,
                    itemData.description,
                    itemData.image,
                    itemData.price,
                    id
                ];

                // Execute the query and resolve the result
                const [result] = await connection.execute(sql, values);
                await connection.end(); // Close the database connection
                resolve(result);
            } catch (error) {
                console.error('Error editing item:', error); // Log any errors
                reject(error); // Reject the promise with the error
            }
        });
    }

    // Method to search for items by name or description
    searchItems(query) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection(); // Establish a database connection
                const sql = 'SELECT * FROM items WHERE name LIKE ? OR description LIKE ?'; // SQL query for search
                const [rows] = await connection.execute(sql, [`%${query}%`, `%${query}%`]); // Execute the query
                await connection.end(); // Close the database connection
                resolve(rows); // Resolve the promise with the search results
            } catch (error) {
                console.error('Error searching items:', error); // Log any errors
                reject(error); // Reject the promise with the error
            }
        });
    }

    // deleteItem(id) {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             const connection = await getConnection(); // Establish a database connection
    //             await connection.execute('DELETE FROM order_items WHERE item_id = ?', [id]);
    //             const sql = 'DELETE FROM items WHERE id = ?'; // SQL query to delete the item
    //             const [result] = await connection.execute(sql, [id]); // Execute the query
    //             await connection.end(); // Close the database connection
    //             resolve(result); // Resolve the promise with the result
    //         } catch (error) {
    //             console.error('Error deleting item:', error); // Log any errors
    //             reject(error); // Reject the promise with the error
    //         }
    //     });
    // }
}

// Exporting the itemModel class for use in other parts of the application
module.exports = itemModel;