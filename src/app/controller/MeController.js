// Importing required models
const itemModel = require('../models/itemModel');
const orderModel = require('../models/orderModel');
const userModel = require('../models/userModel');
const exclusiveDealsModel = require('../models/exclusiveDealsModel');

class MeController {

    // Admin homepage (/admin)
    async dashboard(req, res) {
        try {
            // Check if the user is logged in and is an admin
            if (!req.session.user || !req.session.user.isAdmin) {
                return res.redirect('/login'); // Redirect to login if not authorized
            }

            // Instantiate models for items, orders, and users
            const ItemModel = new itemModel();
            const OrderModel = new orderModel();
            const UserModel = new userModel();
            const ExclusiveDealsModel = new exclusiveDealsModel();

            // Fetch data from the database
            const items = await ItemModel.showitem(); // Get all items
            const orders = await OrderModel.getOrders(); // Get all orders
            const users = await UserModel.getUsers(); // Get all users
            const exclusiveDeals = await ExclusiveDealsModel.getExclusiveDeals(); // Get exclusive deals

            // Calculate overview statistics
            const overview = {
                totalOrders: orders.length, // Total number of orders
                totalItems: items.length, // Total number of items
                totalUsers: users.length, // Total number of users
                totalRevenue: orders.reduce((sum, order) => sum + parseFloat(order.total), 0).toFixed(2) // Total revenue
            };

            // Render the admin dashboard view with the fetched data
            res.render('admin/dashboard', {
                layout: 'admin', // Use the admin layout
                user: req.session.user, // Pass the logged-in user data
                items, // Pass the items data
                orders, // Pass the orders data
                users, // Pass the users data
                overview, // Pass the overview statistics
                exclusiveDeals
            });
        } catch (error) {
            // Log and handle any errors
            console.error('Error in adminHome:', error);
            res.status(500).send('Internal server error'); // Send a 500 error response
        }
    }

    // [GET] /item/create - Display stored items for the admin
    async storeditem(req, res, next) {
        // Check if the user is logged in
        if (!req.session.user) {
            return res.redirect('/login'); // Redirect to login if not logged in
        }

        // Check if the user is an admin
        if (!req.session.user.isAdmin) {
            return res.status(403).send('Access denied: Admins only'); // Send a 403 error if not an admin
        }

        // Fetch all items from the database
        const ItemModel = new itemModel();
        const item = await ItemModel.showitem();
        console.log(item); // Log the items for debugging

        // Render the stored-item view with the fetched items
        res.render('me/stored-item', { layout: 'admin', item: item });
    }

    // Display the list of all orders for the admin
    async OrderList(req, res, next) {
        // Check if the user is logged in
        if (!req.session.user) {
            return res.redirect('/login'); // Redirect to login if not logged in
        }

        // Check if the user is an admin
        if (!req.session.user.isAdmin) {
            return res.status(403).send('Access denied: Admins only'); // Send a 403 error if not an admin
        }

        // Fetch all orders from the database
        const OrderModel = new orderModel();
        const order = await OrderModel.showAllOrders();
        console.log(order); // Log the orders for debugging

        // Render the order-list view with the fetched orders
        res.render('me/order-list', { layout: 'admin', order: order });
    }
    async toggleAdmin(req, res) {
        try {
            const userId = req.params.id;
            // Fetch user
            const user = await userModel.findById(userId);
            if (!user) {
                return res.status(404).send('User not found');
            }
            // Toggle isAdmin
            const newIsAdmin = !user.isAdmin;
            await userModel.updateAdminStatus(userId, newIsAdmin);
            res.redirect('/me'); // Redirect back to admin dashboard
        } catch (error) {
            console.error('Error toggling admin:', error);
            res.status(500).send('Internal server error');
        }
    }
}

// Export an instance of the MeController class
module.exports = new MeController();

