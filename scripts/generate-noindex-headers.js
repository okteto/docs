#!/usr/bin/env node
/**
 * Writes build/_headers with an `X-Robots-Tag: noindex` rule for every
 * version served under a version prefix (/docs/1.47/, /docs/1.50/, ...):
 * the archived versions and the unreleased one. The official version is
 * served from /docs/ and stays indexable.
 *
 * The HTML pages already carry a robots meta tag (src/theme/DocVersionRoot),
 * but the Markdown twins and the llms.txt / llms-full.txt files of those
 * versions have no <head>, and they're what AI crawlers read. A response
 * header covers every file type.
 *
 * Versions are discovered from build/docs, so nothing needs updating when a
 * version is cut. Netlify merges these rules with the [[headers]] in
 * netlify.toml.
 *
 * Usage: node scripts/generate-noindex-headers.js
 */
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const BUILD_DIR = path.join(ROOT_DIR, 'build');
const BUILD_OUT_DIR = path.join(BUILD_DIR, 'docs');

const VERSION_LIKE_REGEX = /^\d+\.\d+$/;

function main() {
  if (!fs.existsSync(BUILD_OUT_DIR)) {
    throw new Error(`${path.relative(ROOT_DIR, BUILD_OUT_DIR)} is missing. Run \`docusaurus build\` before this script.`);
  }

  // Each version has a directory (`1.47/`) plus its landing page files
  // next to it (`1.47.html`, `1.47.md`).
  const paths = [];
  const versions = new Set();
  for (const entry of fs.readdirSync(BUILD_OUT_DIR, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const version = entry.name.replace(/\.(html|md)$/, '');
    if (!VERSION_LIKE_REGEX.test(version)) continue;
    versions.add(version);
    paths.push(`/docs/${entry.name}`);
    if (entry.isDirectory()) paths.push(`/docs/${entry.name}/*`);
  }

  const rules = paths.map((servedPath) => `${servedPath}\n  X-Robots-Tag: noindex\n`);
  fs.writeFileSync(path.join(BUILD_DIR, '_headers'), rules.join('\n'));
  console.log(`Wrote build/_headers (noindex for versions ${[...versions].join(', ')})`);
}

main();
