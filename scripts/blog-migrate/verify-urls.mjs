#!/usr/bin/env node
// Checks that the blog build serves every URL the old blog served.
//
// Usage: yarn build:blog && node scripts/blog-migrate/verify-urls.mjs
//
// Reads legacy-urls.txt (one /blog/... path per line) and fails if any path
// has no index.html under build/blog. Also checks the per-post Markdown twins
// (/blog/<slug>.md) and the RSS feed the website proxies /rss.xml to.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const buildDir = path.resolve(here, '../../build');

const urls = fs
  .readFileSync(path.join(here, 'legacy-urls.txt'), 'utf8')
  .split('\n')
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith('#'));

const missing = [];
const exists = (relative) => fs.existsSync(path.join(buildDir, relative));

for (const url of urls) {
  const page = url.replace(/\/?$/, '/index.html');
  if (!exists(page)) missing.push(url);
  // Post pages (/blog/<slug>/) also had a Markdown twin.
  const post = url.match(/^\/blog\/([^/]+)\/$/);
  if (post && !/^page-\d+$/.test(post[1]) && !exists(`/blog/${post[1]}.md`)) missing.push(`/blog/${post[1]}.md`);
}
if (!exists('/blog/rss.xml')) missing.push('/blog/rss.xml');

if (missing.length) {
  console.error(`${missing.length} legacy URL(s) not served by build/blog:`);
  for (const url of missing) console.error(`  ${url}`);
  process.exit(1);
}
console.log(`all ${urls.length} legacy blog URLs are served by build/blog (plus Markdown twins and rss.xml)`);
