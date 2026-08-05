// Injects the fully-rendered #root markup into dist/index.html so that
// crawlers and link-preview bots that don't execute JS (KakaoTalk, Slack,
// some search engines) see real content instead of an empty shell.
//
// This is not server-side rendering: it boots the built app in a real
// headless Chromium instance, waits for it to finish rendering, then
// snapshots the resulting DOM. React still re-renders on top of this on
// the client, so nothing changes for real users.
import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import puppeteer from 'puppeteer';

const DIST = path.resolve('dist');
const BASE = '/hyeji-portfolio/'; // must match vite.config.ts `base`
const PORT = 4174;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
};

function serveDist() {
  return createServer(async (req, res) => {
    const urlPath = decodeURIComponent((req.url ?? '/').split('?')[0]);
    if (!urlPath.startsWith(BASE)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    let rel = urlPath.slice(BASE.length);
    if (rel === '' || rel.endsWith('/')) rel += 'index.html';
    const filePath = path.join(DIST, rel);
    if (!existsSync(filePath)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const contentType = MIME_TYPES[path.extname(filePath)] ?? 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(await readFile(filePath));
  });
}

async function main() {
  const server = serveDist();
  await new Promise((resolve) => server.listen(PORT, resolve));

  const browser = await puppeteer.launch({ headless: true });
  try {
    const page = await browser.newPage();
    await page.goto(`http://localhost:${PORT}${BASE}`, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });
    // Small buffer past network-idle for any post-load effects to settle.
    await new Promise((resolve) => setTimeout(resolve, 300));

    const rootHtml = await page.$eval('#root', (el) => el.innerHTML);
    if (!rootHtml || rootHtml.length < 100) {
      throw new Error('Prerendered #root content looks empty — aborting to avoid shipping a blank shell.');
    }

    const indexPath = path.join(DIST, 'index.html');
    const html = await readFile(indexPath, 'utf-8');
    if (!html.includes('<div id="root"></div>')) {
      throw new Error('Could not find an empty <div id="root"></div> to inject into.');
    }
    const injected = html.replace('<div id="root"></div>', `<div id="root">${rootHtml}</div>`);
    await writeFile(indexPath, injected, 'utf-8');

    console.log(`Prerender: injected ${rootHtml.length.toLocaleString()} chars into dist/index.html`);
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((error) => {
  console.error('Prerender failed:', error);
  process.exit(1);
});
