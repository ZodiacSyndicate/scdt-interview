import request from 'supertest';
import { beforeEach, afterEach, describe, it, expect } from '@jest/globals';
import { app } from '../server';
import { dataSource } from '../server/data-source';
import Redis from 'ioredis';

const generateRandomUrl = () => {
    const generateRandomString = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyz';
        const len = chars.length;
        let res = '';
        for (let i = 0; i < 3; i++) {
            res += chars[Math.round(Math.random() * len)];
        }
        return res;
    };
    return `https://${generateRandomString()}.${generateRandomString()}.${generateRandomString()}`;
};

const randomUrl = generateRandomUrl();

let redis: Redis;

const shortUrl = { current: '' };

const invalidUrl = 'xxxxxxx';

beforeEach(async () => {
    await dataSource.initialize();
    redis = new Redis();
});

afterEach(async () => {
    await dataSource.destroy();
    redis.disconnect();
});

describe('POST /api/url/short', () => {
    it('should create a short url', async () => {
        const res = await request(app).post('/api/url/short').send({ url: randomUrl });
        shortUrl.current = res.body.data;
        expect(res.body.code).toBe(200);
        expect(res.body.data).toBeTruthy();
    });

    it('should return same shortUrl when send repeat url', async () => {
        const res = await request(app).post('/api/url/short').send({ url: randomUrl });
        expect(res.body.code).toBe(200);
        expect(res.body.data).toBe(shortUrl.current);
    });

    it('should failed when send a invalid url', async () => {
        const res = await request(app).post('/api/url/short').send({ url: invalidUrl });
        expect(res.body.code).toBe(400);
        expect(res.body.message).toBe('Invalid url');
    });
});

describe('GET /api/url/origin', () => {
    it('should return same originUrl as above', async () => {
        const res = await request(app).get(`/api/url/origin?url=${shortUrl.current}`);
        expect(res.body.code).toBe(200);
        expect(res.body.data).toBe(randomUrl);
    });

    it('should return right value when redis expires', async () => {
        await redis.del(shortUrl.current);
        const res = await request(app).get(`/api/url/origin?url=${shortUrl.current}`);
        expect(res.body.code).toBe(200);
        expect(res.body.data).toBe(randomUrl);
    });

    it('redis should store originUrl when query after expired', async () => {
        const originUrl = await redis.get(shortUrl.current);
        expect(originUrl).toBe(randomUrl);
    });

    it('should fail when shortUrl have not been generated', async () => {
        const res = await request(app).get(`/api/url/origin?url=https://x.cc/asd`);
        expect(res.body.code).toBe(400);
        expect(res.body.message).toBe('Url dose not exist');
    });

    it('should failed when send a invalid url', async () => {
        const res = await request(app).get(`/api/url/origin?url=${invalidUrl}`);
        expect(res.body.code).toBe(400);
        expect(res.body.message).toBe('Invalid url');
    });
});
