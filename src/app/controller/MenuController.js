const itemModel = require('../models/itemModel');

class MenuController{
    
    async menubyCategory(req, res) {
        try {
            // Check if the user is logged in
            if (!req.session.user) {
                return res.redirect('/login'); // Redirect to login if not logged in
            }

            // Prevent admins from accessing the user homepage
            if (req.session.user.isAdmin) {
                return res.redirect('/admin'); // Redirect admins to the admin dashboard
            }

            // Extract the category from the request parameters
            const category = req.params.category;
            console.log("Category:", category); // Log the category for debugging

            // Fetch items by category from the database
            const ItemModel = new itemModel();
            const items = await ItemModel.getItemsByCategory(category);

            // Render the menu view with the fetched items
            res.render('item/menu', {
                layout: 'user', // Use the user layout
                items, // Pass the fetched items to the view
                currentPath: req.originalUrl, // Pass the current   path for active link highlighting
                username: req.session.user.username, // Pass the logged-in user's username      
            });
        }catch (error) {
            // Log the error for debugging
            console.error('Error in menu:', error);

            // Render an error page or send a user-friendly error message
            res.status(500).render('error', {
                layout: 'public', // Use a public layout for error pages
                message: 'An error occurred while loading the menu. Please try again later.',
            });
        }
        }
}
module.exports = new MenuController();