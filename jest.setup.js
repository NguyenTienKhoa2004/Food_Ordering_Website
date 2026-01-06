const { pool } = require('./src/db');

jest.setTimeout(10000);

afterAll(async () => {
    try {
        if (pool && typeof pool.end === 'function') {
            await pool.end();
        }
        await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
    }
});