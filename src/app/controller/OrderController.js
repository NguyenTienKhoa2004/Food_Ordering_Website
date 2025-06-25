const orderModel = require('../models/orderModel');

class OrderController {

    async placeOrder(req, res) {
        try {
            
            if (!req.session.user) {
                return res.redirect('/login'); 
            }
            const { cart, street, city, postal, payment } = req.body;
            console.log('Payment method:', payment);
            console.log('Placing order with data:', req.body);

             if (!cart || !street || !city || !postal || !payment) {
                return res.status(400).send('All fields are required.');
            }
            const items = JSON.parse(cart);
                    
            const address = { street, city, postal };
            const OrderModel = new orderModel();
            const { orderId, total } = await OrderModel.createOrder(req.session.user.id, items, address, payment);
        
            res.render('order/order-confirmation', {
                layout: 'user',
                orderId,
                total, 
                address,
                payment
            });
      
        } catch (error) {
            console.error('Error placing order:', error);
            res.status(500).send('Internal server error'); 
        }
    }
    
//     async placeOrder(req, res) {
//     try {
//         // Check if user is authenticated
//         if (!req.session.user) {
//             return res.status(401).json({ error: 'Unauthorized, please log in' });
//         }

//         // Extract and validate request body
//         const { cart, street, city, postal, payment } = req.body;
//         console.log('Payment method:', payment);
//         console.log('Placing order with data:', req.body);

//         if (!cart || !street || !city || !postal || !payment) {
//             return res.status(400).json({ error: 'All fields are required' });
//         }

//         // Parse cart data
//         let items;
//         try {
//             items = JSON.parse(cart);
//         } catch (error) {
//             return res.status(400).json({ error: 'Invalid cart format' });
//         }

//         // Validate items array
//         if (!Array.isArray(items) || items.length === 0) {
//             return res.status(400).json({ error: 'Cart cannot be empty' });
//         }

//         // Create address object
//         const address = { street, city, postal };

//         // Create order using OrderModel
//         const OrderModel = new orderModel();
//         const { orderId, total } = await OrderModel.createOrder(req.session.user.id, items, address, payment);

//         // Return JSON response
//         res.status(200).json({
//             message: 'Order placed successfully',
//             orderId,
//             total,
//             address,
//             payment,
//             items
//         });
//     } catch (error) {
//         console.error('Error placing order:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// }
    async cancelOrder(req, res) {
        try {
            
            if (!req.session.user) {
                return res.status(403).send('Access denied: Admins only'); 
            }
            const orderId = req.params.id;
            const OrderModel = new orderModel();
            await OrderModel.CancelOrder(orderId);
            res.redirect('/cart');
        } catch (error) {
            // Log and handle any errors
            console.error('Error cancelling order:', error);
            res.status(500).send('Internal server error'); 
        }
    }

    async showOrderForm(req, res) {
        try {
            res.render('order/place-order', {
                layout: 'user', 
                currentPath: req.originalUrl, 
                username: req.session.user.username
            });
        } catch (error) {
            // Log and handle any errors
            console.error('Error showing order form:', error);
            res.status(500).send('Internal server error');
        }
    }

    async trackOrder(req, res) {
        
        try {
             if (!req.session.user) {
            return res.redirect('/login'); 
        }

        if (req.session.user.isAdmin) {
            return res.redirect('/admin'); 
        }
            const orderId = req.params.id; 
            const cartModel = new orderModel();
            const cart = await cartModel.showCartbyID(orderId);
            console.log('Cart data:', cart); 

            console.log(req.path);
            console.log(req.session.user.username);

            res.render('order/track-order', {
                currentPath: req.originalUrl,
                title: 'Track Order',
                layout: 'user', 
                cart: cart, 
                username: req.session.user.username 
            });
        } catch (error) {
            console.error('Error in trackOrder:', error);
            res.status(500).render('error', {
                layout: 'public',
                message: 'An error occurred while loading the track order page. Please try again later.',
            });
        }
    }

    deleteOrder(req, res) {
        try {
            if (!req.session.user || !req.session.user.isAdmin) {
                return res.status(403).send('Access denied: Admins only'); 
            }
            const orderId = req.params.id;
            const OrderModel = new orderModel();
            OrderModel.deleteOrder(orderId);

            res.redirect('/me?success=Order+deleted');
        } catch (error) {
            console.error('Error deleting order:', error);
            res.status(500).send('Internal server error'); 
        }
    }
}


module.exports = new OrderController();