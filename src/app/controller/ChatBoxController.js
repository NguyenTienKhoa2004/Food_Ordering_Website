class ChatBoxController {

    showChatBox(req, res) {
        try {
            // Check if user is logged in
            if (!req.session.user) {
                return res.redirect('/login'); // Redirect to login if not authenticated
            }

            // Check if user is an admin
            if (req.session.user.isAdmin) {
                return res.redirect('/admin'); // Redirect to admin dashboard if admin
            }

            // Render chatbox view for authenticated users
            res.render('chatbox/chatbox', {
                layout: 'user',
                username: req.session.user.username,
                currentPath: req.originalUrl,
            });
        } catch (error) {
            console.error('Error in showChatBox:', error);
            res.status(500).render('error', {
                layout: 'public',
                message: 'An error occurred while loading the chatbox. Please try again later.',
            });
        }
    }

    chatboxReply(req, res) {
        const msg = req.body.message.toLowerCase();

        let reply = "Sorry, I didn't get that.";

        if (msg.includes("menu")) {
            reply = "We have burgers 🍔, pizza 🍕, and fries 🍟!";
        } else if (msg.includes("recommend")) {
            reply = "You should try our grilled chicken sandwich 🥪!";
        } else if (msg.includes("hello") || msg.includes("hi")) {
            reply = "Hi! How can I assist you with your order today?";
        } else if (msg.includes("order") || msg.includes("want")) {
            reply = "What would you like to order?";
        }

        res.json({ reply });
    }
}

module.exports = new ChatBoxController();