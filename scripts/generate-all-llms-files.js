#!/usr/bin/env node
/**
 * Writes llms.txt and llms-full.txt into the build output for every version
 * in versions.json, plus one more pair for the tutorials plugin's pages
 * (unversioned, so every version links to it instead of duplicating it).
 * Everything is assembled from the per-page Markdown twins Docusaurus
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

// Lists Markdown twins at buildRoot whose top-level name (without .md)
// satisfies `matchName`, sorted by path (reproduces the llms-txt plugin's
// own ordering with no sidebar-aware logic needed).
function listTwins(buildRoot, matchName) {
  const results = [];
  for (const entry of fs.readdirSync(buildRoot, { withFileTypes: true })) {
    const nameWithoutExt = entry.name.replace(/\.md$/, '');
    if (!matchName(nameWithoutExt)) continue;
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

// The root version's pages sit at buildRoot unprefixed, alongside sibling
// dirs for every other version and the tutorials plugin's pages - both
// excluded (tutorials get their own llms.txt below); `search` is an
// interactive widget, not indexable content, excluded everywhere. An
// archived version's pages are its landing page `V.md` plus everything
// under `V/`.
function listVersionTwins(buildRoot, version, rootVersion) {
  if (version !== rootVersion) return listTwins(buildRoot, (name) => name === version);
  return listTwins(buildRoot, (name) => name !== 'search' && name !== 'tutorials' && !VERSION_LIKE_REGEX.test(name));
}

function listTutorialsTwins(buildRoot) {
  return listTwins(buildRoot, (name) => name === 'tutorials');
}

// Points at the twin itself ("/docs/foo/bar.md"), not the HTML page, so an
// agent following the link gets clean Markdown directly - matching every
// other link the llms-txt plugin generates (e.g. cross-page links inside
// twin bodies, via rehype-links.js).
function urlForTwin(twinPath) {
  return `/docs/${twinPath}`;
}

// twin "foo/bar.md" -> companion HTML "foo/bar/index.html"; "index.md" ->
// "index.html". Docusaurus builds both side by side from the same route.
function htmlPathForTwin(twinPath) {
  const withoutExt = twinPath.slice(0, -'.md'.length);
  return withoutExt === 'index' ? 'index.html' : `${withoutExt}/index.html`;
}

// Every twin carries a "Documentation Index" pointer to llms.txt, inserted by
// docusaurus.config.js's remarkLlmsIndexPointer. That plugin has no way to
// know which page it's running for (the llms-txt plugin calls it with no
// file/route context), so it always points at the root llms.txt - correct
// only for the root version's own pages. Fix it up here, where we do know
// the scope, both in what we embed in llms-full.txt and in the served twin
// file itself.
const INDEX_POINTER_URL_REGEX = /<(https?:\/\/[^>]+\/docs\/)llms\.txt>/;
function withIndexPointerTarget(content, targetPrefix) {
  return content.replace(INDEX_POINTER_URL_REGEX, (match, origin) => `<${origin}${targetPrefix}llms.txt>`);
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

// { twinPath, url, title, description } for every twin path, rewriting each
// one's Documentation Index pointer to `targetPrefix` first (pass '' for the
// root version, where it's already correct and no rewrite is needed).
function collectEntries(buildRoot, twinPaths, targetPrefix) {
  return twinPaths.map((twinPath) => {
    const twinFilePath = path.join(buildRoot, twinPath);
    let twinContent = fs.readFileSync(twinFilePath, 'utf8');
    if (targetPrefix) {
      const corrected = withIndexPointerTarget(twinContent, targetPrefix);
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

// Tutorials aren't tied to any version, so they get their own llms.txt
// (written once, see main) and every version just links to it instead of
// duplicating tutorial pages into every version's index/full-text dump.
function renderTutorialsSection() {
  return ['## Tutorials', '', '- [Okteto Tutorials](/docs/tutorials/llms.txt)', ''];
}

function renderLlmsTxt({ title, description, sectionHeading, entries, extraSections = [] }) {
  const lines = [`# ${title}`, '', `> ${description}`, ''];
  for (const section of extraSections) lines.push(...section);
  lines.push(`## ${sectionHeading}`, '');
  for (const { title, url, description: entryDescription } of entries) {
    lines.push(entryDescription ? `- [${title}](${url}): ${entryDescription}` : `- [${title}](${url})`);
  }
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}

function renderLlmsFullTxt(indexContent, buildRoot, entries) {
  const bodies = entries.map(({ twinPath }) => fs.readFileSync(path.join(buildRoot, twinPath), 'utf8').trimEnd());
  return [indexContent.trimEnd(), '# Full Documentation Content', ...bodies].join('\n\n---\n\n') + '\n';
}

function writeLlmsFiles(destDir, llmsTxt, llmsFullTxt) {
  fs.mkdirSync(destDir, { recursive: true });
  fs.writeFileSync(path.join(destDir, 'llms.txt'), llmsTxt);
  fs.writeFileSync(path.join(destDir, 'llms-full.txt'), llmsFullTxt);
}

function main() {
  if (!fs.existsSync(BUILD_OUT_DIR)) {
    throw new Error(`${path.relative(ROOT_DIR, BUILD_OUT_DIR)} is missing. Run \`docusaurus build\` before this script.`);
  }

  const { versions, rootVersion } = readVersions();

  const tutorialsEntries = collectEntries(BUILD_OUT_DIR, listTutorialsTwins(BUILD_OUT_DIR), 'tutorials/');
  const hasTutorials = tutorialsEntries.length > 0;
  if (hasTutorials) {
    const tutorialsLlmsTxt = renderLlmsTxt({
      title: 'Okteto Tutorials',
      description: 'Okteto tutorials - step-by-step guides that apply across versions.',
      sectionHeading: 'tutorials',
      entries: tutorialsEntries,
      extraSections: [['## Documentation', '', '- [Okteto Documentation](/docs/llms.txt)', '']],
    });
    const tutorialsLlmsFullTxt = renderLlmsFullTxt(tutorialsLlmsTxt, BUILD_OUT_DIR, tutorialsEntries);
    writeLlmsFiles(path.join(BUILD_OUT_DIR, 'tutorials'), tutorialsLlmsTxt, tutorialsLlmsFullTxt);
    console.log(`Wrote build/docs/tutorials/llms.txt + llms-full.txt (${tutorialsEntries.length} pages)`);
  } else {
    console.warn('No tutorial pages found - skipping build/docs/tutorials/llms.txt.');
  }

  for (const version of versions) {
    const isRoot = version === rootVersion;
    const entries = collectEntries(BUILD_OUT_DIR, listVersionTwins(BUILD_OUT_DIR, version, rootVersion), isRoot ? '' : `${version}/`);
    if (entries.length === 0) {
      console.warn(`No pages found for version ${version} - skipping.`);
      continue;
    }

    const extraSections = [renderOtherVersionsSection(version, versions, rootVersion)];
    if (hasTutorials) extraSections.push(renderTutorialsSection());

    const llmsTxt = renderLlmsTxt({
      title: 'Okteto Documentation',
      description: `Okteto product documentation for version ${version}.`,
      sectionHeading: 'docs',
      entries,
      extraSections,
    });
    const llmsFullTxt = renderLlmsFullTxt(llmsTxt, BUILD_OUT_DIR, entries);

    const servedDir = isRoot ? BUILD_OUT_DIR : path.join(BUILD_OUT_DIR, version);
    writeLlmsFiles(servedDir, llmsTxt, llmsFullTxt);

    const size = ((llmsTxt.length + llmsFullTxt.length) / 1024 / 1024).toFixed(2);
    console.log(`Wrote build/docs/${isRoot ? '' : version + '/'}llms.txt + llms-full.txt (${size} MB, ${entries.length} pages)`);
  }
}

main();
