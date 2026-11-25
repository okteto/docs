// Opens the home page and a sample of the pages of each site (docs,
// tutorials, blog) in headless Chrome, and fails when a page doesn't return
// 200, throws a JavaScript error, logs a console error, or requests a file of
// the site that returns 400 or more. Errors of external resources (analytics,
// search, fonts of other domains) are ignored: they don't depend on this repo.
//
// Usage: node smoke-test.mjs [base URL]
//   base URL: where the three sites are served. By default, the endpoint of
//     the `docs` service in the Okteto Namespace (`okteto test smoke`).
//   PAGES_PER_SITE: pages taken from each sitemap, 10 by default.
//   CHROME: path of a Chrome binary, instead of the browser of Playwright.
import { chromium } from 'playwright';

const base = (process.argv[2] || `https://docs-${process.env.OKTETO_NAMESPACE}.${process.env.OKTETO_DOMAIN}`).replace(/\/$/, '');
const perSite = Number(process.env.PAGES_PER_SITE || 10);
const sitemaps = ['/docs/sitemap-docs.xml', '/tutorials/sitemap-tutorials.xml', '/blog/sitemap-blog.xml'];

async function samplePaths(sitemap) {
  const res = await fetch(base + sitemap);
  if (!res.ok) throw new Error(`${sitemap}: HTTP ${res.status}`);
  const paths = [...(await res.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  const step = Math.max(1, Math.floor(paths.length / perSite));
  return paths.filter((_, i) => i % step === 0).slice(0, perSite);
}

const paths = [];
for (const sitemap of sitemaps) {
  paths.push(sitemap.slice(0, sitemap.indexOf('/', 1) + 1), ...(await samplePaths(sitemap)));
}

const browser = await chromium.launch({
  ...(process.env.CHROME && { executablePath: process.env.CHROME }),
  args: ['--no-sandbox'],
});
let failed = 0;
for (const path of [...new Set(paths)]) {
  const page = await browser.newPage();
  const errors = [];
  page.on('console', (m) => {
    if (m.type() === 'error' && !m.text().startsWith('Failed to load resource')) errors.push(`console: ${m.text().slice(0, 200)}`);
  });
  page.on('pageerror', (e) => errors.push(`page error: ${String(e).slice(0, 200)}`));
  page.on('response', (r) => {
    if (new URL(r.url()).origin === new URL(page.url()).origin && r.status() >= 400) errors.push(`HTTP ${r.status()} ${r.url()}`);
  });
  let status = 0;
  try {
    // Not `networkidle`: some ad and analytics requests never finish
    status = (await page.goto(base + path, { waitUntil: 'load', timeout: 45000 }))?.status() ?? 0;
    await page.waitForTimeout(2000);
  } catch (e) {
    errors.push(`load: ${e.message.split('\n')[0]}`);
  }
  if (status !== 200 || errors.length) failed++;
  console.log(`${status} ${path}${errors.length ? `\n    ${[...new Set(errors)].join('\n    ')}` : ''}`);
  await page.close();
}
await browser.close();
console.log(failed ? `${failed} page(s) with errors` : 'all pages loaded without errors');
process.exit(failed ? 1 : 0);
