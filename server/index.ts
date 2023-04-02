import express from 'express';
import bodyParser from 'body-parser';
import { dataSource } from './data-source';
import './redis';
import { getShortUrl, getOriginUrl } from './controller';

export const app = express();

app.use(bodyParser.json());

app.use(express.json());

getShortUrl(app);
getOriginUrl(app);

dataSource
    .initialize()
    .then(() => {
        console.log('Data Source has been initialized!');

        app.listen(3000, () => {
            console.log('server listening on port 3000');
        });
    })
    .catch((err) => {
        console.error('Error during Data Source initialization', err);
    });
