// Importing the orderModel to interact with the order data in the database
const ProfileModel = require('../models/profileModel');

class ProfileController {

    // [POST] /order - Handle placing an order
    async editProfile(req, res) {
        try {
            // Check if the user is logged in
            if (!req.session.user) {
                return res.redirect('/login'); // Redirect to login if the user is not logged in
            }

            // Extract user ID from the session
            const userId = req.session.user.id;

            // Instantiate the Model to interact with the profile data
            const profileModel = new ProfileModel();

            // Fetch the user's profile data
            const userProfile = await profileModel.getUserProfile(userId);

            // Build a user object with all expected fields for the template
            const user = {
                image: userProfile && userProfile.image ? userProfile.image : '/img/default-avatar.png',
                username: userProfile && userProfile.username ? userProfile.username : '',
                email: userProfile && userProfile.email ? userProfile.email : '',
                firstName: userProfile && userProfile.firstName ? userProfile.firstName : '',
                lastName: userProfile && userProfile.lastName ? userProfile.lastName : ''
            };

            // Render the profile edit view with the user's profile data
            res.render('profile/edit', {
                layout: 'profile', // Use the user layout
                currentPath: req.originalUrl, // Current path for active link highlighting
                user // Pass the user object expected by the template
            });
        } catch (error) {
            // Log and handle any errors
            console.error('Error editing profile:', error);
            res.status(500).send('Internal server error'); // Return a 500 error response
        }
    }       
}

// Exporting an instance of the OrderController class
module.exports = new ProfileController();