import fs from 'fs';
import path from 'path';

// DEBUG MODE
const debug = false;

// PAGE BUILDER
export default async function({page, locale}) {
    let _head = await head(page, locale);
    let _css = await css(page, locale);
    let _body = await body(page, locale);
    let _header = await header(page, locale, _body);
    let _footer = await footer(page, locale, _body);
    let _script = await script(page, locale);

    // Filter extra head content from header
    try {
        let match = _header.match(/<extra-start>([\s\S]*?)<\/([\w-]+)>/)
        if (match) {
            const [ full, content ] = match;
            _header = _header.replace(full, '').trim();

            content.split('\n').forEach(line => {
                if (!_head.includes(line.trim())) {
                    _head = line + _head + '\n';
                }
            })
        }
    } catch (error) {
        if (debug) console.log(error);
    }
    
    try {
        let match = _header.match(/<extra-end>([\s\S]*?)<\/([\w-]+)>/);
        if (match) {
            const [ full, content ] = match;
            _header = _header.replace(full, '').trim();
            
            content.split('\n').forEach(line => {
                if (!_head.includes(line.trim())) {
                    _head += line + '\n';
                }
            })
        }
    } catch (error) {
        if (debug) console.log(error);
    }

    // Filter extra head content from body
    try {
        const match = _body.match(/<extra-start>([\s\S]*?)<\/([\w-]+)>/);
        if (match) {
            const [ full, content ] = match;
            _body = _body.replace(full, '').trim();

            content.split('\n').forEach(line => {
                if (!_head.includes(line.trim())) {
                    _head = line + _head + '\n';
                }
            })
        }
    } catch (error) {
        if (debug) console.log(error);
    }

    try {
        const match = _body.match(/<extra-end>([\s\S]*?)<\/([\w-]+)>/);
        if (match) {
            const [ full, content ] = match;
            _body = _body.replace(full, '').trim();
            content.split('\n').forEach(line => {
                if (!_head.includes(line.trim())) {
                    _head += line + '\n';
                }
            })
        }
    } catch (error) {
        if (debug) console.log(error);
    }

    // Ensure the content gets loaded in at once
    _css = `
    body > * {
        opacity: 0;
    }` + _css;

    _script = `
    Promise.all([
        document.fonts.ready,
        new Promise(resolve => window.onload = resolve)
    ]).then(async () => {
        const children = Array.from(document.body.children);
        children.forEach(child => {
            child.style.opacity = '1';
        });
    });` + _script;

    // Return the complete page
    return `
    <head>${_head}</head>
    <style>${_css}</style>
    <body>${_header}
    ${_body}
    ${_footer}</body>
    <script>${_script}</script>
    `;
}

// PAGE ELEMENTS
async function head(page, locale) {
    var title = (page.charAt(0).toUpperCase() + page.substring(1)).replaceAll('-', ' ') + ' - Rekenapplicatie';
    var logo = '/assets/logo.png';

    return `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <title>${title}</title>

    <link rel="icon" href="${logo}">
    <link rel="apple-touch-icon" type="image/png" href="${logo}">
    <link rel="apple-touch-startup-image" type="image/png" href="${logo}">

    <meta property="og:title" content="${title}">
    <meta property="og:image" content="${logo}">
    <meta property="og:type" content="website">
    `
}

async function css(page, locale) {
    let inner = await fs.promises.readFile(path.join(`public/front-end/routing/${locale}/main.css`), 'utf-8').catch(error => debug ? console.log(error) : '');
    inner += await fs.promises.readFile(path.join(`public/front-end/routing/${locale}/${page}/index.css`), 'utf-8').catch(error => debug ? console.log(error) : '');
    return inner || '';
}

async function header(page, locale) {
    return await fs.promises.readFile(path.join(`public/front-end/routing/${locale}/header.html`), 'utf-8').catch(error => debug ? console.log(error) : '') || '';
}

async function body(page, locale) {
    return await fs.promises.readFile(path.join(`public/front-end/routing/${locale}/${page}/index.html`), 'utf-8').catch(error => debug ? console.log(error) : '') || await fs.promises.readFile(path.join(`public/front-end/routing/${locale}/page-not-found/index.html`), 'utf-8').catch(error => debug ? console.log(error) : '')
}

async function footer(page, locale) {
    return await fs.promises.readFile(path.join(`public/front-end/routing/${locale}/footer.html`), 'utf-8').catch(error => debug ? console.log(error) : '') || '';
}

async function script(page, locale) {
    let inner = await fs.promises.readFile(path.join(`public/front-end/routing/${locale}/main.js`), 'utf-8').catch(error => debug ? console.log(error) : '') || '';
    inner += await fs.promises.readFile(path.join(`public/front-end/routing/${locale}/${page}/index.js`), 'utf-8').catch(error => debug ? console.log(error) : '') || '';
    return inner;
}