#!/usr/bin/env node
// Renders the covers of the blog posts and the tutorials, defined in
// covers.mjs with the style of style.mjs, as JPEG files (or PNG or WebP, by the
// extension of the output).
//
// Usage: node scripts/covers/render.mjs [filter ...]
//
// With filters, it renders only the covers whose output path contains one of
// them (for example, `helm` or `2026-11-08`). The images of the blog and the
// tutorials (covers and diagrams) are 2400x1260; the others are 1200x630.
//
// Needs Google Chrome. Set CHROME to its binary if it isn't in the default
// macOS location.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

import covers from './covers.mjs';
import { page, root, setTheme, W, H } from './style.mjs';

const chrome = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const filters = process.argv.slice(2);
const selected = covers.filter((cover) => filters.length === 0 || filters.some((filter) => cover.out.includes(filter)));
if (selected.length === 0) {
  console.error('No cover matches.');
  process.exit(1);
}

// Start a headless Chrome with the DevTools protocol on a free port.
const port = 9400 + Math.floor(Math.random() * 400);
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'covers-chrome-'));
const proc = spawn(chrome, [
  '--headless=new', '--disable-gpu', '--hide-scrollbars', '--allow-file-access-from-files',
  `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, 'about:blank',
], { stdio: 'ignore' });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let version;
for (let i = 0; i < 50 && !version; i++) {
  await sleep(200);
  version = await fetch(`http://127.0.0.1:${port}/json/version`).then((r) => r.json()).catch(() => null);
}
const ws = new WebSocket(version.webSocketDebuggerUrl);
await new Promise((resolve) => ws.addEventListener('open', resolve, { once: true }));
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

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'covers-html-'));
const { result: { targetId } } = await send('Target.createTarget', { url: 'about:blank' });
const { result: { sessionId } } = await send('Target.attachToTarget', { targetId, flatten: true });
await send('Page.enable', {}, sessionId);
let scale = 0;
for (const [index, cover] of selected.entries()) {
  const wanted = /^(blog|tutorials)\//.test(cover.out) ? 2 : 1;
  if (wanted !== scale) {
    scale = wanted;
    await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: scale, mobile: false }, sessionId);
  }
  const html = path.join(tmp, `${index}.html`);
  // Images inside an article have a white background and the light theme. Their
  // subject is a function, so it is drawn after the theme is set.
  setTheme(cover.background === 'white' ? 'light' : 'dark');
  const subject = typeof cover.svg === 'function' ? cover.svg() : cover.svg;
  fs.writeFileSync(html, page(subject, cover.background));
  await send('Page.navigate', { url: `file://${html}` }, sessionId);
  // Wait for the font and the logo files.
  await send('Runtime.evaluate', {
    expression: 'Promise.all([document.fonts.ready, ...[...document.images].map((i) => i.decode().catch(() => {}))]).then(() => new Promise((r) => setTimeout(r, 300)))',
    awaitPromise: true,
  }, sessionId);
  // The format follows the extension of the output: .jpg, .png or .webp.
  const format = { '.png': 'png', '.webp': 'webp' }[path.extname(cover.out)] ?? 'jpeg';
  const shot = await send('Page.captureScreenshot', { format, ...(format === 'png' ? {} : { quality: format === 'webp' ? 90 : 84 }) }, sessionId);
  const out = path.join(root, cover.out);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, Buffer.from(shot.result.data, 'base64'));
  console.log(cover.out);
}
ws.close();
proc.kill();
