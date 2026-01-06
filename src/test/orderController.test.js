const OrderController = require('../app/controller/OrderController');
const OrderModel = require('../app/models/orderModel');

// Mock toàn bộ OrderModel
jest.mock('../app/models/orderModel');

describe('OrderController.placeOrder', () => {
    let orderController;
    let req, res;

    beforeEach(() => {
        orderController = new OrderController();
        
        req = {
            session: { user: { id: 1, username: 'testuser' } }, 
            body: {
                cart: JSON.stringify([{ product_id: 1, quantity: 2 }]),
                street: '123 Street',
                city: 'Hanoi',
                postal: '10000',
                payment: 'COD'
            }
        };
        
        res = {
            redirect: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
            render: jest.fn()
        };

        jest.clearAllMocks();
    });

    afterAll(async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
    });

    test('Should redirect to /login if user is not in session', async () => {
        req.session.user = null;

        await orderController.placeOrder(req, res);

        expect(res.redirect).toHaveBeenCalledWith('/login');
        expect(res.render).not.toHaveBeenCalled(); // ✅ Đảm bảo không render
    });

    test('Should return 400 if required fields are missing', async () => {
        req.body.street = '';

        await orderController.placeOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('All fields are required.');
        expect(res.render).not.toHaveBeenCalled(); // ✅ Đảm bảo không render
    });

    test('Should return 400 if cart is missing', async () => {
        req.body.cart = undefined;

        await orderController.placeOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('All fields are required.');
    });

    test('Should return 400 if payment method is missing', async () => {
        req.body.payment = '';

        await orderController.placeOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('All fields are required.');
    });

    test('Should create order successfully and render confirmation', async () => {
        const mockCreateOrder = jest.fn().mockResolvedValue({
            orderId: 123,
            total: 500000
        });

        OrderModel.mockImplementation(() => ({
            createOrder: mockCreateOrder
        }));

        await orderController.placeOrder(req, res);

        expect(mockCreateOrder).toHaveBeenCalledWith(
            1, 
            [{ product_id: 1, quantity: 2 }], // items
            { street: '123 Street', city: 'Hanoi', postal: '10000' }, // address
            'COD' 
        );
        
        expect(res.render).toHaveBeenCalledWith('order/order-confirmation', {
            layout: 'user',
            orderId: 123,
            total: 500000,
            address: { street: '123 Street', city: 'Hanoi', postal: '10000' },
            payment: 'COD'
        });

        expect(res.status).not.toHaveBeenCalledWith(500);
        expect(res.redirect).not.toHaveBeenCalled();
    });

    test('Should return 500 if Model throws error', async () => {
        const mockCreateOrder = jest.fn().mockRejectedValue(new Error('DB Error'));
        OrderModel.mockImplementation(() => ({ createOrder: mockCreateOrder }));

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        await orderController.placeOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Internal server error');
        expect(res.render).not.toHaveBeenCalled();
        
        expect(consoleSpy).toHaveBeenCalledWith(
            'Error placing order:',
            expect.any(Error)
        );

        consoleSpy.mockRestore();
    });

    test('Should return 500 if cart JSON is invalid', async () => {
        req.body.cart = 'invalid json string';

        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        await orderController.placeOrder(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith('Internal server error');

        consoleSpy.mockRestore();
    });
});