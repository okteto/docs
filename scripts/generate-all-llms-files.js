#!/usr/bin/env node
/**
 * Writes llms.txt and llms-full.txt into the build output for every version
 * in versions.json, assembled from the per-page Markdown twins Docusaurus
 * already writes for every version (docusaurus.config.js keeps
 * includeVersionedDocs + enableMarkdownFiles on unconditionally). We build
 * these ourselves instead of using the llms-txt plugin's own output, which
 * combines every version into one file with no way to split it back apart.
 *
 * Nothing here is committed: everything is derived from versioned_docs/, so
 * it's cheap to regenerate on every `yarn build` (see package.json) instead
 * of persisting it - which also means backporting a fix into an old
 * version's versioned_docs/ needs no extra step, just a rebuild.
 *
 * Usage: node scripts/generate-all-llms-files.js
 */
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const BUILD_OUT_DIR = path.join(ROOT_DIR, 'build', 'docs');

const VERSION_LIKE_REGEX = /^\d+\.\d+$/;
const SITE_TITLE_SUFFIX = ' | Okteto Documentation';

function readVersions() {
  const versions = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'versions.json'), 'utf8'));
  return { versions, rootVersion: versions[0] };
}

function collectMarkdownFiles(dir, baseDir, results) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectMarkdownFiles(fullPath, baseDir, results);
    } else if (entry.name.endsWith('.md')) {
      results.push(path.relative(baseDir, fullPath).split(path.sep).join('/'));
    }
  }
}

// Lists every Markdown twin (relative to buildRoot) belonging to `version`,
// sorted by path (reproduces the llms-txt plugin's own ordering with no
// sidebar-aware logic needed). The root version's pages sit at buildRoot
// unprefixed, alongside sibling dirs for every other version plus
// tutorials/search - all excluded. An archived version's pages are its
// landing page `V.md` plus everything under `V/`.
function listVersionTwins(buildRoot, version, rootVersion) {
  const isRoot = version === rootVersion;
  const results = [];
  for (const entry of fs.readdirSync(buildRoot, { withFileTypes: true })) {
    const nameWithoutExt = entry.name.replace(/\.md$/, '');
    if (isRoot) {
      const isVersionLike = VERSION_LIKE_REGEX.test(nameWithoutExt);
      if (nameWithoutExt === 'tutorials' || nameWithoutExt === 'search' || isVersionLike) continue;
    } else if (nameWithoutExt !== version) {
      continue;
    }
    const fullPath = path.join(buildRoot, entry.name);
    if (entry.isDirectory()) {
      collectMarkdownFiles(fullPath, buildRoot, results);
    } else if (entry.name.endsWith('.md')) {
      results.push(entry.name);
    }
  }
  results.sort();
  return results;
}

// twin "foo/bar.md" -> served URL "/docs/foo/bar/"; "index.md" -> "/docs/".
function urlForTwin(twinPath) {
  const withoutExt = twinPath.slice(0, -'.md'.length);
  const routePath = withoutExt === 'index' ? '' : `${withoutExt}/`;
  return `/docs/${routePath}`;
}

// twin "foo/bar.md" -> companion HTML "foo/bar/index.html"; "index.md" ->
// "index.html". Docusaurus builds both side by side from the same route.
function htmlPathForTwin(twinPath) {
  const withoutExt = twinPath.slice(0, -'.md'.length);
  return withoutExt === 'index' ? 'index.html' : `${withoutExt}/index.html`;
}

// Every twin carries a "Documentation Index" pointer to llms.txt, inserted by
// docusaurus.config.js's remarkLlmsIndexPointer. That plugin has no way to
// know which version it's running for (the llms-txt plugin calls it with no
// file/route context), so it always points at the root llms.txt - correct
// for the current version, wrong for every archived one. Fix it up here,
// where we do know the version, both in what we embed in llms-full.txt and
// in the served twin file itself.
const INDEX_POINTER_URL_REGEX = /<(https?:\/\/[^>]+\/docs\/)llms\.txt>/;
function withVersionAwareIndexPointer(content, version) {
  return content.replace(INDEX_POINTER_URL_REGEX, (match, origin) => `<${origin}${version}/llms.txt>`);
}

const HTML_ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", '#39': "'" };
function decodeHtmlEntities(text) {
  return text.replace(/&(#\d+|#x[0-9a-f]+|[a-z]+\d*);/gi, (match, entity) => {
    if (entity[0] === '#') {
      const codePoint = entity[1] === 'x' || entity[1] === 'X' ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
      return Number.isNaN(codePoint) ? match : String.fromCodePoint(codePoint);
    }
    return HTML_ENTITIES[entity.toLowerCase()] ?? match;
  });
}

// Most pages have a clean `# Title` H1. Auto-generated category index pages
// don't, so fall back to the <title> tag, stripping the site name suffix.
function extractTitle(twinContent, htmlContent) {
  const headingMatch = twinContent.match(/^#\s+(.+)$/m);
  if (headingMatch) return headingMatch[1].trim();
  const titleMatch = htmlContent.match(/<title[^>]*>([^<]*)<\/title>/);
  if (!titleMatch) return null;
  const title = decodeHtmlEntities(titleMatch[1]);
  return title.endsWith(SITE_TITLE_SUFFIX) ? title.slice(0, -SITE_TITLE_SUFFIX.length) : title;
}

function extractDescription(htmlContent) {
  const match = htmlContent.match(/<meta[^>]*\bname="description"[^>]*\bcontent="([^"]*)"/);
  return match ? decodeHtmlEntities(match[1]) : null;
}

// { twinPath, url, title, description } for every page in `version`.
function collectVersionEntries(buildRoot, version, rootVersion) {
  return listVersionTwins(buildRoot, version, rootVersion).map((twinPath) => {
    const twinFilePath = path.join(buildRoot, twinPath);
    let twinContent = fs.readFileSync(twinFilePath, 'utf8');
    if (version !== rootVersion) {
      const corrected = withVersionAwareIndexPointer(twinContent, version);
      if (corrected !== twinContent) {
        fs.writeFileSync(twinFilePath, corrected);
        twinContent = corrected;
      }
    }
    const htmlPath = path.join(buildRoot, htmlPathForTwin(twinPath));
    const htmlContent = fs.existsSync(htmlPath) ? fs.readFileSync(htmlPath, 'utf8') : '';
    return {
      twinPath,
      url: urlForTwin(twinPath),
      title: extractTitle(twinContent, htmlContent) || twinPath,
      description: extractDescription(htmlContent),
    };
  });
}

// Cross-links every version's llms.txt so an agent that fetched the wrong
// one can find the right one.
function renderOtherVersionsSection(version, versions, rootVersion) {
  const lines = ['## Other Versions', ''];
  for (const otherVersion of versions) {
    if (otherVersion === version) continue;
    const isRoot = otherVersion === rootVersion;
    const url = isRoot ? '/docs/llms.txt' : `/docs/${otherVersion}/llms.txt`;
    const label = isRoot ? `Version ${otherVersion} (current)` : `Version ${otherVersion}`;
    lines.push(`- [${label}](${url})`);
  }
  lines.push('');
  return lines;
}

function renderLlmsTxt(version, entries, versions, rootVersion) {
  const lines = ['# Okteto Documentation', '', `> Okteto product documentation for version ${version}.`, ''];
  lines.push(...renderOtherVersionsSection(version, versions, rootVersion));
  lines.push('## docs', '');
  for (const { title, url, description } of entries) {
    lines.push(description ? `- [${title}](${url}): ${description}` : `- [${title}](${url})`);
  }
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}

function renderLlmsFullTxt(indexContent, buildRoot, entries) {
  const bodies = entries.map(({ twinPath }) => fs.readFileSync(path.join(buildRoot, twinPath), 'utf8').trimEnd());
  return [indexContent.trimEnd(), '# Full Documentation Content', ...bodies].join('\n\n---\n\n') + '\n';
}

function main() {
  if (!fs.existsSync(BUILD_OUT_DIR)) {
    throw new Error(`${path.relative(ROOT_DIR, BUILD_OUT_DIR)} is missing. Run \`docusaurus build\` before this script.`);
  }

  const { versions, rootVersion } = readVersions();

  for (const version of versions) {
    const entries = collectVersionEntries(BUILD_OUT_DIR, version, rootVersion);
    if (entries.length === 0) {
      console.warn(`No pages found for version ${version} - skipping.`);
      continue;
    }

    const llmsTxt = renderLlmsTxt(version, entries, versions, rootVersion);
    const llmsFullTxt = renderLlmsFullTxt(llmsTxt, BUILD_OUT_DIR, entries);

    const servedDir = version === rootVersion ? BUILD_OUT_DIR : path.join(BUILD_OUT_DIR, version);
    fs.mkdirSync(servedDir, { recursive: true });
    fs.writeFileSync(path.join(servedDir, 'llms.txt'), llmsTxt);
    fs.writeFileSync(path.join(servedDir, 'llms-full.txt'), llmsFullTxt);

    const size = ((llmsTxt.length + llmsFullTxt.length) / 1024 / 1024).toFixed(2);
    console.log(`Wrote build/docs/${version === rootVersion ? '' : version + '/'}llms.txt + llms-full.txt (${size} MB, ${entries.length} pages)`);
  }
}

main();
