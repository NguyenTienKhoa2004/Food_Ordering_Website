const itemRouter = require('./item');
const meRouter = require('./me');
const homeRouter = require('./home');
const cartRouter = require('./cart');
const orderRouter = require('./order');
const categoryRouter = require('./category');
const profileRouter = require('./profile');
const menuRouter = require('./menu');
const exclusiveDealsRouter = require('./exclusive_deals');
const chatboxRouter = require('./chatbox');
function route(app){
    
    app.use('/item', itemRouter);
    app.use('/cart', cartRouter);
    app.use('/me', meRouter); 
    app.use('/order',orderRouter);
    app.use('/category', categoryRouter);
    app.use('/profile', profileRouter);
    app.use('/menu',menuRouter);
    app.use('/exclusiveDeals', exclusiveDealsRouter);
    app.use('/chat', chatboxRouter);
    app.use('/', homeRouter);
 
}

module.exports = route;
