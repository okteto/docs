#!/usr/bin/env node
// Renders the cover image of every tutorial (1200x630 JPEG, the size of the
// blog's featured images) from covers.json into static/img/tutorials/covers/.
//
// Usage: node scripts/tutorial-covers/render.mjs [id ...]
//
// Needs Google Chrome. Set CHROME to its binary if it isn't in the default
// macOS location. To add a tutorial, add its id, title and logo (a file of
// static/img/logos/) to covers.json and run the script.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const outDir = path.join(root, 'static/img/tutorials/covers');
const chrome = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const only = process.argv.slice(2);
const covers = JSON.parse(fs.readFileSync(path.join(here, 'covers.json'), 'utf8'))
  .filter((cover) => only.length === 0 || only.includes(cover.id));

const fileUrl = (relative) => `file://${path.join(root, relative)}`;
const escape = (text) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;');

function coverHtml({ title, logo }) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Circular; font-weight: 700; src: url('${fileUrl('shared/static/fonts/CircularXXWeb-Bold.woff2')}') format('woff2'); }
html, body { margin: 0; }
body {
  width: 1200px; height: 630px; overflow: hidden; position: relative;
  background: radial-gradient(ellipse 80% 90% at 40% 55%, #2a3a5e 0%, #24314f 45%, #1d2741 100%);
  font-family: Circular, sans-serif;
}
svg.hex { position: absolute; inset: 0; }
.badge {
  position: absolute; left: 72px; top: 72px; width: 104px; height: 104px;
  border-radius: 24px; background: #fff; display: flex; align-items: center; justify-content: center;
}
.badge img { width: 64px; height: 64px; }
h1 {
  position: absolute; left: 72px; top: 220px; width: 900px; margin: 0;
  color: #fff; font-size: 60px; line-height: 1.12; letter-spacing: -0.5px; font-weight: 700;
}
.okteto { position: absolute; right: 72px; bottom: 64px; width: 230px; }
</style></head><body>
<svg class="hex" width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="p" width="108" height="187" patternUnits="userSpaceOnUse" patternTransform="translate(-20 -30)">
      <g fill="none" stroke="#fff" stroke-opacity="0.07" stroke-width="2">
        <polygon points="27,0 81,0 108,46.75 81,93.5 27,93.5 0,46.75" transform="scale(0.92) translate(4 4)"/>
        <polygon points="27,0 81,0 108,46.75 81,93.5 27,93.5 0,46.75" transform="translate(54 93.5) scale(0.92) translate(4 4)"/>
        <polygon points="27,0 81,0 108,46.75 81,93.5 27,93.5 0,46.75" transform="translate(-54 93.5) scale(0.92) translate(4 4)"/>
      </g>
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#p)"/>
</svg>
<div class="badge"><img src="${fileUrl(`static/img/logos/${logo}.svg`)}"></div>
<h1>${escape(title)}</h1>
<img class="okteto" src="${fileUrl('shared/static/img/logo.svg')}">
</body></html>`;
}

// Start a headless Chrome with the DevTools protocol on a free port.
const port = 9400 + Math.floor(Math.random() * 400);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'tutorial-covers-'));
const proc = spawn(chrome, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
  `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank',
], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let version;
for (let i = 0; i < 50 && !version; i++) {
  await sleep(200);
  version = await fetch(`http://127.0.0.1:${port}/json/version`).then((r) => r.json()).catch(() => null);
}
const ws = new WebSocket(version.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0;
const pending = new Map();
ws.addEventListener('message', (event) => {
  const msg = JSON.parse(event.data);
  if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
});
const send = (method, params = {}, sessionId) => new Promise((resolve) => {
  const mid = ++id;
  pending.set(mid, resolve);
  ws.send(JSON.stringify({ id: mid, method, params, sessionId }));
});

fs.mkdirSync(outDir, { recursive: true });
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'tutorial-cover-html-'));
const { result: { targetId } } = await send('Target.createTarget', { url: 'about:blank' });
const { result: { sessionId } } = await send('Target.attachToTarget', { targetId, flatten: true });
await send('Emulation.setDeviceMetricsOverride', { width: 1200, height: 630, deviceScaleFactor: 1, mobile: false }, sessionId);
for (const cover of covers) {
  const html = path.join(tmp, `${cover.id}.html`);
  fs.writeFileSync(html, coverHtml(cover));
  await send('Page.navigate', { url: `file://${html}` }, sessionId);
  await sleep(1200);
  const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 85 }, sessionId);
  fs.writeFileSync(path.join(outDir, `${cover.id}.jpg`), Buffer.from(shot.result.data, 'base64'));
  console.log(`static/img/tutorials/covers/${cover.id}.jpg`);
}
ws.close();
proc.kill();
