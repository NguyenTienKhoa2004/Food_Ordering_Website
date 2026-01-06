const OrderModel = require('../app/models/orderModel'); // Import class
const { getConnection } = require('../db');

jest.mock('../db');

describe('OrderModel.createOrder', () => {

    let mockConnection;
    let orderModel; 

    beforeEach(() => {
        mockConnection = {
            beginTransaction: jest.fn(),
            commit: jest.fn(),
            rollback: jest.fn(),
            end: jest.fn(),
            release: jest.fn(),
            query: jest.fn(),
            execute: jest.fn()
        };

        getConnection.mockResolvedValue(mockConnection);
        
        orderModel = new OrderModel(); 
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    afterAll(async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
    });

    test('Should calculate total, insert order and commit transaction', async () => {
        const userId = 1;
        const items = [{ product_id: 1, quantity: 2 }];

        mockConnection.execute
            .mockResolvedValueOnce([[{ price: 100000 }]]) 
            .mockResolvedValueOnce([{ insertId: 123 }])   
            .mockResolvedValueOnce([[{ price: 100000 }]]) 
            .mockResolvedValueOnce([{ affectedRows: 1 }]); 

        const result = await orderModel.createOrder(userId, items, {}, 'COD');

        expect(mockConnection.beginTransaction).toHaveBeenCalled();
        expect(mockConnection.commit).toHaveBeenCalled();
        expect(mockConnection.rollback).not.toHaveBeenCalled();
        expect(mockConnection.release).toHaveBeenCalled();
        expect(result.orderId).toBe(123);
        expect(result.total).toBe(200000);
    });

    test('Should rollback if item not found', async () => {
        const userId = 1;
        const items = [{ product_id: 999, quantity: 1 }];

        mockConnection.execute.mockResolvedValueOnce([[]]);
        jest.spyOn(console, 'error').mockImplementation(() => {});

        await expect(orderModel.createOrder(userId, items, {}, 'COD'))
            .rejects.toThrow('Item ID 999 not found');

        expect(mockConnection.beginTransaction).toHaveBeenCalled();
        expect(mockConnection.rollback).toHaveBeenCalled();
        expect(mockConnection.commit).not.toHaveBeenCalled();
        expect(mockConnection.release).toHaveBeenCalled();
    });
});