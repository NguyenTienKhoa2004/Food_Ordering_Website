const redis = require('redis');

const client = redis.createClient({
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 20) {
                console.log('Error: Too many retries to connect Redis. Connection terminated');
                return new Error('Too many retries.');
            }
            return Math.min(retries * 50, 500);
        }
    }
});

client.on('error', (err) => console.error('Redis Client Error', err));

client.on('connect', () => console.log('Redis Client Connected'));

client.on('reconnecting', () => console.log('Redis Client Reconnecting...'));

(async () => {
    try {
        await client.connect();
    } catch (err) {
        console.error('Failed to connect to Redis:', err);
    }
})();

module.exports = client;