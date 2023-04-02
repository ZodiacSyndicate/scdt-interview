import { Express } from 'express';
import { generateShortUrl, getOriginUrl as getOrigin } from '../service';

export const getShortUrl = (app: Express) => {
    app.post('/api/url/short', async (req, res) => {
        await generateShortUrl(req, res);
    });
};

export const getOriginUrl = (app: Express) => {
    app.get('/api/url/origin', async (req, res) => {
        await getOrigin(req, res);
    });
};
