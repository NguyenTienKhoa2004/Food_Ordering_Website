// Importing the required models
const itemModel = require('../models/itemModel');
const orderModel = require('../models/orderModel');
const exclusiveDealsModel = require('../models/exclusiveDealsModel');

class homeController {

    // Public homepage (/public-home)
    async publicHome(req, res) {
        const ItemModel = new itemModel(); // Instantiate the item model
        const item = await ItemModel.showitem(); // Fetch all items from the database
        const exclusive_deals_model = new exclusiveDealsModel();
        const exclusiveDeals = await exclusive_deals_model.showitem(); // Fetch exclusive deals from the database

        const categories = await ItemModel.showCategory(); // Fetch all categories from the database
        const suggestions = await ItemModel. showSuggestions(); // Fetch suggestions from the database
        res.render('public-home', {
            currentPath: req.originalUrl,
            layout: 'public', // Use the public layout
            item: item, // Pass the fetched items to the view
            categories: categories, // Pass the fetched categories to the view
            suggestions: suggestions, // Pass the fetched suggestions to the view
            user: {
            location: 'Regent Street, A4, A4201, London'
            },
            cart: {
            items: 23,
            total: '79.89'
            },
            exclusiveDeals: exclusiveDeals,
           
            restaurants: [
            { image: '/img/restaurants/mcdonalds.svg', name: "McDonald's London" },
            { image: '/img/restaurants/papajohns.jpg', name: "Papa Johns" },
            { image: '/img/restaurants/kfc.png', name: "KFC West London" },
            { image: '/img/restaurants/texas-chicken.jpg', name: "Texas Chicken" },
            { image: '/img/restaurants/burger-king.png', name: "Burger King" },
            { image: '/img/restaurants/shaurma.avif', name: "Shaurma 1" }
            ],
            statistics: [
            { number: '546+', label: 'Registered Riders' },
            { number: '789,900+', label: 'Orders Delivered' },
            { number: '690+', label: 'Restaurants Partnered' },
            { number: '17,457+', label: 'Food Items' }
            ]
        });
    }

    // User homepage (/user)
    async userHome(req, res) {
        // Check if the user is logged in
        if (!req.session.user) {
            return res.redirect('/login'); // Redirect to login if not logged in
        }

        // Prevent admins from accessing the user homepage
        if (req.session.user.isAdmin) {
            return res.redirect('/admin'); // Redirect admins to the admin dashboard
        }

        const ItemModel = new itemModel(); // Instantiate the item model
        const item = await ItemModel.showitem(); // Fetch all items from the database

        const exclusive_deals_model = new exclusiveDealsModel();
        const exclusiveDeals = await exclusive_deals_model.showitem(); // Fetch exclusive deals from the database

        const categories = await ItemModel.showCategory(); // Fetch all categories from the database
        const suggestions = await ItemModel. showSuggestions(); // Fetch suggestions from the database
        res.render('user/home-user', {
            currentPath: req.path,
            layout: 'user', // Use the user layout
            username: req.session.user.username, // Pass the logged-in user's username
            item: item, // Pass the fetched items to the view
            exclusiveDeals: exclusiveDeals, // Pass the fetched exclusive deals to the view
            categories: categories, // Pass the fetched categories to the view
            suggestions: suggestions, // Pass the fetched suggestions to the view
            user: {
            location: 'Regent Street, A4, A4201, London'
            },
            
           
            statistics: [
            { number: '546+', label: 'Registered Riders' },
            { number: '789,900+', label: 'Orders Delivered' },
            { number: '690+', label: 'Restaurants Partnered' },
            { number: '17,457+', label: 'Food Items' }
            ]
            
        });
    }

    // Place an order
    async placeOrder(req, res) {
        
        try {
            // Check if the user is logged in
            if (!req.session.user) {
                return res.redirect('/login'); // Redirect to login if not logged in
            }

            // Extract item ID and quantity from the request body
            const { itemId, quantity } = req.body;

            // Validate the input fields
            if (!itemId || !quantity || quantity <= 0) {
                return res.status(400).send('Item ID and valid quantity are required'); // Return 400 if validation fails
            }

            // Create an array of items to be ordered
            const items = [{ itemId: parseInt(itemId), quantity: parseInt(quantity) }];

            const OrderModel = new orderModel(); // Instantiate the order model
            const { orderId, total } = await OrderModel.createOrder(req.session.user.id, items); // Create the order

            // Render the order confirmation page with the order details
            res.render('order/order-confirmation', {
                layout: 'public', // Use the public layout
                orderId, // Pass the order ID
                total // Pass the total cost of the order
            });
        } catch (error) {
            // Log and handle any errors
            console.error('Error placing order:', error);
            res.status(500).send('Internal server error'); // Return a 500 error response
        }
    }

    // Search for items
    async search(req, res) {
        try {
            const query = req.query.query; // Extract the search query from the request parameters
            const ItemModel = new itemModel(); // Instantiate the item model
            const items = await ItemModel.searchItems(query); // Search for items matching the query

            // Return the search results as JSON
            res.json({ query, items });
        } catch (error) {
            // Log and handle any errors
            console.error('Error in search:', error);
            res.status(500).send('Internal server error'); // Return a 500 error response
        }
    }

    async menu(req, res) {
    try {
        // Fetch all items from the database
        const ItemModel = new itemModel();
        const items = await ItemModel.showitem();

        // If user is logged in, check if they are admin
        if (req.session.user) {
            if (req.session.user.isAdmin) {
                return res.redirect('/admin'); // Redirect admins to the admin dashboard
            }
            // Render menu for logged-in user
            return res.render('item/menu', {
                layout: 'user',
                items,
                currentPath: req.originalUrl,
                username: req.session.user.username,
                user: { location: 'Regent Street, A4, A4201, London' }
            });
        }

        // Render menu for guests (not logged in)
        res.render('item/menu', {
            layout: 'public',
            items,
            currentPath: req.originalUrl,
            user: { location: 'Regent Street, A4, A4201, London' }
        });

    } catch (error) {
        console.error('Error in menu:', error);
        res.status(500).render('error', {
            layout: 'public',
            message: 'An error occurred while loading the menu. Please try again later.',
        });
    }
}

    restaurant(req, res) {
        // Check if the user is logged in
        if (!req.session.user) {
            return res.redirect('/login'); // Redirect to login if not logged in
        }

        // Prevent admins from accessing the user homepage
        if (req.session.user.isAdmin) {
            return res.redirect('/admin'); // Redirect admins to the admin dashboard
        }

        // Render the restaurant view with the user layout
        res.render('order/restaurant', {
            layout: 'user', // Use the user layout
            username: req.session.user.username, // Pass the logged-in user's username
            currentPath: req.originalUrl, // Pass the current path for active link highlighting
        });
    }
    
}

// Exporting an instance of the homeController class
module.exports = new homeController();