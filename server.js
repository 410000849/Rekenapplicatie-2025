import express from 'express';
const app = express();

import document from './public/document.js';
import account from './APIs/account.js';
import path from 'path';

// DEBUG MODE
const debug = false;

// CONSTANTS
const __dirname = import.meta.dirname;

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
    res.status(200).send(await document(settings));
})

// LOAD API
app.use('/account', account)

const PORT = 300;
app.listen(PORT, () => {
    console.log('App is listening on PORT: ', PORT);
})