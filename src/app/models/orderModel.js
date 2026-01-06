// Importing the database connection utility
const { getConnection } = require('../../db');

class orderModel {

    async createOrder(userId, items, address, payment) {
        const connection = await getConnection();
        try {
            await connection.beginTransaction();
            let total = 0;
            for (const item of items) {
                const [rows] = await connection.execute('SELECT price FROM items WHERE id = ?', [item.product_id]);
                if (rows.length === 0) {
                    throw new Error(`Item ID ${item.product_id} not found`);
                }
                total += rows[0].price * item.quantity;
            }

            const [orderResult] = await connection.execute(
                'INSERT INTO orders (user_id, total, status, street, city, postal, Payment) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [userId, total, 'pending', address.street, address.city, address.postal, payment]
            );
            const orderId = orderResult.insertId;

            for (const item of items) {
                const [rows] = await connection.execute('SELECT price FROM items WHERE id = ?', [item.product_id]);
                await connection.execute(
                    'INSERT INTO order_items (order_id, item_id, quantity, price) VALUES (?, ?, ?, ?)',
                    [orderId, item.product_id, item.quantity, rows[0].price]
                );
            }

            await connection.commit();
            //await connection.end();
            await connection.release();
            return { orderId, total };
        } catch (error) {
            await connection.rollback();
            //await connection.end();
            await connection.release();
            console.error('Error creating order:', error);
            throw error;
        }
}

    async showCartbyUserID(userId) {
        try {
            const connection = await getConnection();
            const [rows] = await connection.execute('SELECT * FROM orders WHERE user_id = ?', [userId]);
            await connection.end();
            return rows;
        } catch (error) {
            console.error('Error fetching cart:', error);
            throw error;
        }
    }


    showCartbyID(Id) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection(); 
                const [rows] = await connection.execute('SELECT o.*, u.username FROM orders o JOIN users u on o.user_id = u.id WHERE o.id = ?', [Id]);
                await connection.end(); 
                resolve(rows); 
            } catch (error) {
                console.error('Error fetching cart:', error); 
                reject(error); 
            }
        });
    }


    showAllOrders() {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection(); 
                const [rows] = await connection.execute('SELECT * FROM orders'); 
                await connection.end(); 
                resolve(rows); 
            } catch (error) {
                console.error('Error fetching all orders:', error); 
                reject(error); 
            }
        });
    }

    getOrders() {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection(); 
                const sql = `
                    SELECT o.*, u.username
                    FROM orders o
                    JOIN users u ON o.user_id = u.id
                    ORDER BY o.created_at DESC
                `; 
                const [rows] = await connection.execute(sql); 
                await connection.end(); 
                resolve(rows); 
            } catch (error) {
                console.error('Error fetching orders:', error); 
                reject(error); 
            }
        });
    }

    updateOrderStatus(orderId, status) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection();
                const sql = 'UPDATE orders SET status = ? WHERE id = ?';
                const [result] = await connection.execute(sql, [status, orderId]);
                await connection.end();
                resolve(result);
            } catch (error) {
                console.error('Error updating order status:', error);
                reject(error);
            }
        });
    }
    CancelOrder(orderId) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection(); 
                const sql = 'UPDATE orders SET status = ? WHERE id = ?'; 
                const [result] = await connection.execute(sql, ['cancelled', orderId]); 
                await connection.end(); 
                resolve(result); 
            } catch (error) {
                console.error('Error cancelling order:', error); 
                reject(error); 
            }
        });
    }
    deleteOrder(orderId) {
        return new Promise(async (resolve, reject) => {
            let connection;
            try {
                connection = await getConnection(); 
                await connection.beginTransaction(); 

                await connection.execute('DELETE FROM order_items WHERE order_id = ?', [orderId]);
                const [result] = await connection.execute('DELETE FROM orders WHERE id = ?', [orderId]);

                await connection.commit(); 
                await connection.end(); 
                resolve(result); 
            } catch (error) {
                if (connection) {
                    await connection.rollback();
                    await connection.end();
                }
                console.error('Error deleting order:', error);
                reject(error);
            }
        });
    }
    markOrderAsDone(orderId) {
        return new Promise(async (resolve, reject) => {
            try {
                const connection = await getConnection(); 
                const sql = 'UPDATE orders SET status = ? WHERE id = ?'; 
                const [result] = await connection.execute(sql, ['done', orderId]); 
                await connection.end(); 
                resolve(result); 
            } catch (error) {
                console.error('Error marking order as done:', error); 
                reject(error); 
            }
        });
    }
}

module.exports = orderModel;