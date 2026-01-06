const CartModel = require('../models/orderModel');

class CartController {

    async showcart(req, res, next) {
        try {
             if (!req.session.user) {
            return res.redirect('/login'); 
        }

        if (req.session.user.isAdmin) {
            return res.redirect('/admin'); 
        }
            const userId = req.session.user.id;
            const cartModel = new CartModel();

            const cart = await cartModel.showCartbyUserID(userId);
 
            res.render('order/cart', {
                currentPath: req.originalUrl,
                layout: 'user', 
                cart: cart, 
                username: req.session.user.username 
            });
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = new CartController();