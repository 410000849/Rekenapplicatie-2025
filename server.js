import express from 'express';
import cookieParser from 'cookie-parser';
import logger from './logger.js';

const app = express();
app.use(cookieParser());

import document from './public/document.js';
import { fileURLToPath } from 'url';
import { confirmCookie } from './database.js';
import path from 'path';

import account from './APIs/account.js';
import admin from './APIs/admin.js';
import groep from './APIs/groep.js';
import ouder from './APIs/ouder.js';
import game from './APIs/game.js';
import vulnerable from './APIs/vulnerable.js';

// DEBUG MODE
const debug = false;

// CONSTANTS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// SERVE STATIC
app.use('/assets', express.static(path.join(__dirname, 'public/front-end/assets')));
app.use('/fonts', express.static(path.join(__dirname, 'public/front-end/fonts')));
app.use('/icons', express.static(path.join(__dirname, 'public/front-end/icons')));

// FUNCTIONS
async function _settings(path) {
    const settings = {
        page: path.split('/').length > 2 ? path.split('/')[2] : path.split('/')[1] || 'index',
        locale: path.split('/').length > 2 ? path.split('/')[1] : 'main' || 'main'
    };

    if (debug) console.log('Settings: ', settings);
    return settings;
}

// LOAD API
app.use('/account', account)
app.use('/admin', admin)
app.use('/groep', groep)
app.use('/ouder', ouder)
app.use('/game', game)
app.use('/vuln', vulnerable)

// ROUTING
app.get('*', async (req, res) => {
    const settings = await _settings(req.path);

    if (settings.locale !== 'main') {
        const cookie = await req.cookies['USER_TOKEN'];
        if (!cookie || !cookie.includes(':')) return res.status(200).redirect('/sign-up');
        const [table, uniqueString] = cookie.split(':');

        const hasSession = await confirmCookie(table, uniqueString);
        if (!hasSession) return res.status(200).redirect('/sign-up');

        if (settings.locale !== table) return res.status(200).redirect(`/${table}/${settings.page}`);
        res.status(200).send(await document(settings));
    } else {
        if (settings.page == 'sign-up' || settings.page == 'log-in') {
            const cookie = await req.cookies['USER_TOKEN'];
            if (cookie && cookie.includes(':')) {
                const table = cookie.split(':')[0];
                return res.status(200).redirect(`/${table}/home`);
            }
        }

        res.status(200).send(await document(settings));
    }
})

const PORT = 300;
app.listen(PORT, () => {
    logger.info(`Server started on PORT: ${PORT}`);
    console.log('App is listening on PORT: ', PORT);
})