import express from 'express';
require('express-async-errors');
import routes from './routes/index.routes';
import { errorHandling } from './middlewares/error-handling';
import cors from 'cors';

import i18next from 'i18next';
import i18nextMiddleware from 'i18next-express-middleware';
import Backend from 'i18next-node-fs-backend';
import { app } from './config/index';
import { l } from './helpers/general';

i18next
    .use(Backend)
    .init({
        lng: 'en',
        backend: {
            loadPath: __dirname + '/i18n/{{lng}}.json'
        },
        debug: process.env.DEBUG_I18N == 'true' || false,
        detection: {
            order: ['querystring', 'cookie'],
            caches: ['cookie']
        },
        preload: ['en', 'pt', 'es', 'it'],
        saveMissing: true,
        fallbackLng: ['en']
    });

const server = express();

server.use(i18nextMiddleware.handle(i18next));

l('INFO', 'cors config', app.cors_config);

server.use(cors({
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}));

server.use(express.json());

server.use(routes);

server.use(errorHandling);

server.listen(app.port);

console.log("server listenning on port: " + app.port);