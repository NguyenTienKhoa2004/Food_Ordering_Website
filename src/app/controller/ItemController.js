// Importing the itemModel to interact with the item database
const itemModel = require('../models/itemModel');

    class ItemController {

    // [GET] /item/create - Render the item creation page
    create(req, res, next) {
        res.render('item/create', { layout: 'admin' }); // Render the 'create' view with the admin layout
    }

    // [POST] /item/store - Handle adding a new item
    async store(req, res) {
        try {
            // Check if the user is logged in and is an admin
            if (!req.session.user || !req.session.user.isAdmin) {
                return res.status(403).json({ message: 'Access denied: Admins only' }); // Return 403 if unauthorized
            }

            // Extract data from the request body
            const { name, description, image, price } = req.body;

            // Validate input fields
            if (!name || !description || !image) {
                return res.status(400).json({ message: 'Name, description, and image are required' }); // Return 400 if validation fails
            }

            // Create an itemData object to store the item details
            const itemData = { name, description, image, price };

            // Instantiate itemModel and call the additem method
            const ItemModel = new itemModel();
            const result = await ItemModel.additem(itemData);

            // Respond with success and return the new item's ID
            return res.status(201).json({
                message: 'Item added successfully',
                itemId: result.insertId
            });
        } catch (error) {
            // Log and handle any errors
            console.error('Error in addItem controller:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    // [GET] /item/:slug - Display details of a specific item
    async show(req, res) {
        try {
            const slug = req.params.slug; // Extract the slug from the request parameters

            const ItemModel = new itemModel();
            const item = await ItemModel.getItemBySlug(slug); // Fetch the item by its slug
            if (!item) {
                return res.status(404).send('Item not found'); // Return 404 if the item doesn't exist
            }

            // Render the item details page with the fetched item data
            res.render('item/item-details', {
                layout: 'admin', // Use the admin layout
                item
            });
        } catch (error) {
            // Log and handle any errors
            console.error('Error fetching item:', error);
            res.status(500).send('Internal server error');
        }
    }

    // [GET] /item/:slug/edit - Render the edit page for a specific item
    edit(req, res) {
        const slug = req.params.slug; // Extract the slug from the request parameters
        console.log("Slug:", slug); // Log the slug for debugging

        const ItemModel = new itemModel();
        ItemModel.getItemBySlug(slug)
            .then(item => {
                if (!item) {
                    return res.status(404).send('Item not found'); // Return 404 if the item doesn't exist
                }

                // Render the edit-item view with the fetched item data
                res.render('item/edit-item', {
                    layout: 'admin', // Use the admin layout
                    item
                });
            })
            .catch(error => {
                // Log and handle any errors
                console.error('Error fetching item for edit:', error);
                res.status(500).send('Internal server error');
            });
    }

    // [PUT] /item/:id - Handle updating an existing item
    async update(req, res) {
        try {
            // Check if the user is logged in and is an admin
            if (!req.session.user || !req.session.user.isAdmin) {
                return res.status(403).send('Access denied: Admins only'); // Return 403 if unauthorized
            }

            const id = req.params.id; // Extract the item ID from the request parameters
            const { name, description, image, price } = req.body; // Extract data from the request body

            // Validate input fields
            if (!name || price == null) {
                return res.status(400).send('Name and price are required'); // Return 400 if validation fails
            }

            const parsedPrice = parseFloat(price); // Parse the price as a float
            if (isNaN(parsedPrice) || parsedPrice <= 0) {
                return res.status(400).send('Price must be a positive number'); // Return 400 if the price is invalid
            }

            // Create an itemData object with optional fields set to null if not provided
            const itemData = {
                name,
                description: description || null,
                image: image || null,
                price: parsedPrice
            };

            const ItemModel = new itemModel();
            const result = await ItemModel.editItem(id, itemData); // Update the item in the database
            if (result.affectedRows === 0) {
                return res.status(404).send('Item not found'); // Return 404 if the item doesn't exist
            }

            // Redirect to the stored items page with a success message
            res.redirect('/me/stored/item?success=Item+updated');
        } catch (error) {
            // Log and handle any errors
            console.error('Error updating item:', error);
            res.status(500).send('Internal server error');
        }
    }

    // [GET] /item/:slug/order - Render the order form for a specific item
    async showOrderForm(req, res) {
        try {
            // const slug = req.params.slug; // Extract the slug from the request parameters

            // const ItemModel = new itemModel();
            // const item = await ItemModel.getItemBySlug(slug); // Fetch the item by its slug
            // if (!item) {
            //     return res.status(404).send('Item not found'); // Return 404 if the item doesn't exist
            // }
            console.log('currentPath:', req.path); // Log the current path for debugging
            // Render the order form with the fetched item data
            res.render('order/place-order', {
                layout: 'user', // Use the public layout
                // item,
                // currentPath: req.path,
                currentPath: req.originalUrl, // Pass the original URL for potential use in the view
                username: req.session.user.username // Pass the current path for potential use in the view
            });
        } catch (error) {
            // Log and handle any errors
            console.error('Error showing order form:', error);
            res.status(500).send('Internal server error');
        }
    }

    async itemDetail(req, res){
        // Check if the user is logged in
        if (!req.session.user) {
            return res.redirect('/login'); // Redirect to login if not logged in
        }

        // Prevent admins from accessing the user homepage
        if (req.session.user.isAdmin) {
            return res.redirect('/admin'); // Redirect admins to the admin dashboard
        }

        const itemSlug = req.params.slug; // Get the item ID from the request parameters
        const ItemModel = new itemModel(); // Instantiate the item model
        // Fetch the item details from the database
        const item = await ItemModel.getItemBySlug(itemSlug); // Fetch the item by its ID
        if (!item) {
            return res.status(404).send('Item not found'); // Return 404 if the item doesn't exist
        }

        // Render the item detail view with the user layout
        res.render('item/item-details', {
            layout: 'user', // Use the user layout
            bodyClass: 'item-details-bg', // Add a class for styling the body
            username: req.session.user.username, // Pass the logged-in user's username
            currentPath: req.originalUrl, // Pass the current path for active link highlighting
            item: item // Pass the fetched item details to the view
        });
    }

    // deleteItem(req, res, next) {
    //     try {
    //         // Check if the user is logged in
    //         if (!req.session.user) {
    //             return res.redirect('/login'); // Redirect to login if not logged in
    //         }

    //         // Extract the item ID from the request parameters
    //         const itemId = req.params.id;
            
    //         // Instantiate the CartModel to interact with the cart data
    //         const ItemModel = new itemModel();
    //         console.log('Deleting item with ID:', itemId); // Log the item ID for debugging
    //         // Delete the item from the cart using the CartModel method
    //         ItemModel.deleteItem(itemId)
    //             .then(() => {
    //                 // Redirect back to the cart page after deletion
    //                 res.redirect('/me');
    //             })
    //             .catch(err => {
    //                 console.error('Error deleting item:', err);
    //                 res.status(500).send('Internal server error'); // Return a 500 error response
    //             });
    //     } catch (err) {
    //         console.error('Error in deleteItem:', err);
    //         res.status(500).send('Internal server error'); // Return a 500 error response
    //     }
    // }

}

// Exporting an instance of the ItemController class
module.exports = new ItemController();

