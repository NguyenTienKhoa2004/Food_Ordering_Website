// Importing the UserModel to interact with the user database
const UserModel = require('../models/userModel');

class LoginController {

    // Method to handle user authentication
    async authentication(req, res) {
        try {
            // Extracting username and password from the request body
            const { username, password } = req.body;

            // Basic input validation to ensure both fields are provided
            if (!username || !password) {
                return res.status(400).json({ error: 'Username and password are required' });
            }

            // Check if the user exists in the database with the provided credentials
            const user = await UserModel.findUserByCredentials(username, password);

            if (user) {
                // If user is found, store their details in the session
                req.session.user = {
                    id: user.id, // User ID
                    username: user.username, // Username
                    isAdmin: user.isAdmin, // Admin status
                    
                };
                console.log('User logged in:', req.session.user); // Log the session data for debugging

                // Return JSON response with redirect URL
                return res.json({
                    success: true,
                    redirectUrl: user.isAdmin ? '/me' : '/user'
                });
            } else {
                // If credentials are invalid, return a 401 Unauthorized response
                return res.status(401).json({ error: 'Invalid username or password' });
            }
        } catch (error) {
            // Log any errors and return a 500 Internal Server Error response
            console.error('Login error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // Method to render the login page
    login(req, res) {
        // If the user is already logged in, redirect them based on their role
        if (req.session.user) {
            return res.redirect(req.session.user.isAdmin ? '/me' : '/user');
        }

        // Render the login page with the 'login' layout
        res.render('login', { layout: 'login' });
    }

    // Method to handle user logout
    logout(req, res) {
        // Destroy the session to log the user out
        req.session.destroy(err => {
            if (err) {
                // Log any errors during logout and return a 500 Internal Server Error response
                console.error('Logout error:', err);
                return res.status(500).send('Internal server error');
            }

            // Redirect to the public home page after successful logout
            res.redirect('/');
        });
    }

    async signup(req,res){
        const { username, email, password } = req.body;
        try {
            await UserModel.createUser(username, email, password);
            // Redirect to login or user page after successful signup
            res.redirect('/public');
        } catch (error) {
            console.error('Signup error:', error);
            res.status(500).send('Error creating user');
        }
    }
}

// Exporting an instance of the LoginController class
module.exports = new LoginController();