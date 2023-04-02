import Redis from 'ioredis';

export const redisClient = new Redis();

redisClient.on('ready', () => {
    console.log('redis client ready');
});

redisClient.on('connect', () => {
    console.log('redis client connected');
});

redisClient.on('reconnecting', (args) => {
    console.log('redis client reconnecting', args);
});

redisClient.on('end', (args) => {
    console.log('redis client end', args);
});

redisClient.on('warning', (err) => {
    console.log('redis client warning', err);
});

redisClient.on('error', (err) => {
    console.log('redis client error', err);
});
