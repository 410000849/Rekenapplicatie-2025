import express from 'express';
import cookieParser from 'cookie-parser';

const app = express();
app.use(cookieParser());

import document from './public/document.js';
import account from './APIs/account.js';
import { fileURLToPath } from 'url';
import { confirmCookie } from './database.js';
import path from 'path';

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

// LOAD API
app.use('/account', account)

const PORT = 300;
app.listen(PORT, () => {
    console.log('App is listening on PORT: ', PORT);
})