const itemModel = require('../models/itemModel');
const redisClient = require('../../config/redis');

class ItemController {

    create(req, res, next) {
        res.render('item/create', { layout: 'admin' });
    }

    async store(req, res) {
        try {
            if (!req.session.user || !req.session.user.isAdmin) {
                return res.status(403).json({ success: false, message: 'Access denied: Admins only' });
            }

            const { name, description, image, price } = req.body;

            if (!name || !description || !image) {
                return res.status(400).json({ success: false, message: 'Name, description, and image are required' });
            }

            const itemData = { name, description, image, price };

            const ItemModel = new itemModel();
            const result = await ItemModel.additem(itemData);
            req.io.emit('newItem', result);

            try {
                if (redisClient.isOpen) {
                    await redisClient.del('menu_items');
                }
            } catch (err) {
                console.error('Redis delete error:', err);
            }

            return res.status(201).json({
                success: true,
                message: 'Item added successfully',
                redirectUrl: '/item/create'
            });
        } catch (error) {
            console.error('Error in addItem controller:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }


    async show(req, res) {
        try {
            const slug = req.params.slug;

            const ItemModel = new itemModel();
            const item = await ItemModel.getItemBySlug(slug);
            if (!item) {
                return res.status(404).send('Item not found');
            }

            res.render('item/item-details', {
                layout: 'admin',
                item
            });
        } catch (error) {

            console.error('Error fetching item:', error);
            res.status(500).send('Internal server error');
        }
    }

    edit(req, res) {
        const slug = req.params.slug;
        console.log("Slug:", slug);

        const ItemModel = new itemModel();
        ItemModel.getItemBySlug(slug)
            .then(item => {
                if (!item) {
                    return res.status(404).send('Item not found');
                }

                res.render('item/edit-item', {
                    layout: 'admin',
                    item
                });
            })
            .catch(error => {
                console.error('Error fetching item for edit:', error);
                res.status(500).send('Internal server error');
            });
    }

    async update(req, res) {
        try {
            if (!req.session.user || !req.session.user.isAdmin) {
                return res.status(403).send('Access denied: Admins only');
            }

            const id = req.params.id;
            const { name, description, image, price } = req.body;

            if (!name || price == null) {
                return res.status(400).send('Name and price are required');
            }

            const parsedPrice = parseFloat(price);
            if (isNaN(parsedPrice) || parsedPrice <= 0) {
                return res.status(400).send('Price must be a positive number');
            }

            const itemData = {
                name,
                description: description || null,
                image: image || null,
                price: parsedPrice
            };

            const ItemModel = new itemModel();
            const result = await ItemModel.editItem(id, itemData);
            if (result.affectedRows === 0) {
                return res.status(404).send('Item not found');
            }

            try {
                if (redisClient.isOpen) {
                    await redisClient.del('menu_items');
                }
            } catch (err) {
                console.error('Redis delete error:', err);
            }

            res.redirect('/me/stored/item?success=Item+updated');
        } catch (error) {
            console.error('Error updating item:', error);
            res.status(500).send('Internal server error');
        }
    }


    async itemDetail(req, res) {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        if (req.session.user.isAdmin) {
            return res.redirect('/admin');
        }

        const itemSlug = req.params.slug;
        const cacheKey = `item:${itemSlug}`;
        let item;

        try {
            if (redisClient.isOpen) {
                const cachedData = await redisClient.get(cacheKey);
                if (cachedData) {
                    console.log(`[REDIS] Cache HIT → ${cacheKey}`);
                    return res.render('item/item-details', {
                        layout: 'user',
                        bodyClass: 'item-details-bg',
                        username: req.session.user.username,
                        currentPath: req.originalUrl,
                        item: JSON.parse(cachedData)
                    });
                }
            }
        } catch (err) {
            console.error('Redis get error:', err);
        }

        console.log(`[REDIS] Cache MISS → ${cacheKey}`);
        const ItemModel = new itemModel();
        item = await ItemModel.getItemBySlug(itemSlug);

        if (!item) {
            return res.status(404).send('Item not found');
        }

        try {
            if (redisClient.isOpen) {
                await redisClient.setEx(cacheKey, 3600, JSON.stringify(item));
                console.log(`[REDIS] Cache SET → ${cacheKey}`);
            }
        } catch (err) {
            console.error('Redis set error:', err);
        }

        res.render('item/item-details', {
            layout: 'user',
            bodyClass: 'item-details-bg',
            username: req.session.user.username,
            currentPath: req.originalUrl,
            item: item
        });
    }

    async deleteItem(req, res, next) {
        try {
            if (!req.session.user) {
                return res.redirect('/login');
            }

            if (!req.session.user.isAdmin) {
                return res.status(403).send('Access denied: Admins only');
            }

            const itemId = req.params.id;

            const ItemModel = new itemModel();

            await ItemModel.deleteItem(itemId);

            try {
                if (redisClient.isOpen) {
                    await redisClient.del('menu_items');
                }
            } catch (err) {
                console.error('Redis delete error:', err);
            }

            res.redirect('/me/stored/item');

        } catch (err) {
            console.error('Error in deleteItem:', err);
            res.status(500).send('Internal server error');
        }
    }

}

module.exports = new ItemController();
