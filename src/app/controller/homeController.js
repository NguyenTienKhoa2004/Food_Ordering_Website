// Importing the required models
const itemModel = require('../models/itemModel');
const orderModel = require('../models/orderModel');
const exclusiveDealsModel = require('../models/exclusiveDealsModel');
const redisClient = require('../../config/redis');

class homeController {

    getCachedItems = async () => {
        const cacheKey = 'menu_items';
        let items;

        try {
            if (redisClient.isOpen) {
                console.log('[REDIS] Connected');

                const cachedData = await redisClient.get(cacheKey);
                if (cachedData) {
                    console.log('[REDIS] Cache HIT → menu_items');

                    items = JSON.parse(cachedData);
                    return items;
                }
                console.log('[REDIS] Cache MISS → menu_items');
            }
        } catch (err) {
            console.error('Redis get error:', err);
        }
        console.log('[DB] Fetching menu items from database...');
        const ItemModel = new itemModel();
        items = await ItemModel.showitem();

        try {
            if (redisClient.isOpen) {
                console.log('[REDIS] Cache SET → menu_items');
                await redisClient.setEx(cacheKey, 3600, JSON.stringify(items));
            }
        } catch (err) {
            console.error('Redis set error:', err);
        }

        return items;
    }

    publicHome = async (req, res) => {
        const ItemModel = new itemModel();
        const item = await this.getCachedItems();

        const exclusive_deals_model = new exclusiveDealsModel();
        const exclusiveDeals = await exclusive_deals_model.showitem();

        const categories = await ItemModel.showCategory();
        const suggestions = await ItemModel.showSuggestions();

        res.render('public-home', {
            currentPath: req.originalUrl,
            layout: 'public',
            item: item,
            categories: categories,
            suggestions: suggestions,
            exclusiveDeals: exclusiveDeals
        });
    }

    userHome = async (req, res) => {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        if (req.session.user.isAdmin) {
            return res.redirect('/admin');
        }

        const ItemModel = new itemModel();
        const item = await this.getCachedItems();

        const exclusive_deals_model = new exclusiveDealsModel();
        const exclusiveDeals = await exclusive_deals_model.showitem();

        const categories = await ItemModel.showCategory();
        const suggestions = await ItemModel.showSuggestions();

        res.render('user/home-user', {
            currentPath: req.path,
            layout: 'user',
            username: req.session.user.username,
            item: item,
            exclusiveDeals: exclusiveDeals,
            categories: categories,
            suggestions: suggestions,
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

    search = async (req, res) => {
        try {
            const query = req.query.query;
            const ItemModel = new itemModel();
            const items = await ItemModel.searchItems(query);
            res.json({ query, items });
        } catch (error) {
            console.error('Error in search:', error);
            res.status(500).send('Internal server error');
        }
    }

    menu = async (req, res) => {
        try {
            const items = await this.getCachedItems();

            if (req.session.user) {
                if (req.session.user.isAdmin) {
                    return res.redirect('/admin');
                }
                return res.render('item/menu', {
                    layout: 'user',
                    items,
                    currentPath: req.originalUrl,
                    username: req.session.user.username,
                    user: { location: 'Regent Street, A4, A4201, London' }
                });
            }

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
}

module.exports = new homeController();