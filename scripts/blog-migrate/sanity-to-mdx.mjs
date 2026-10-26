#!/usr/bin/env node
// One-time migration of the okteto.com blog from Sanity into this repo.
//
// Reads every published `blogPost` from the public Sanity dataset and writes:
//   blog/posts/<date>-<slug>/index.mdx   (Portable Text posts)
//   blog/posts/<date>-<slug>/index.md    (posts whose body was a Markdown string)
//   blog/posts/<date>-<slug>/img/*       (images, downloaded next to the post)
//   blog/authors.yml, blog/tags.yml, blog/static/img/{authors,social}/*
//
// Re-runnable: it overwrites generated files and skips images it already has,
// so it can be run again right before the cutover to pick up late edits.
//
// Usage: node scripts/blog-migrate/sanity-to-mdx.mjs [path/to/okteto/website/static/blog]
//
// The optional argument is the website repo's static/blog folder. Older posts
// load images from it by relative path (/blog/<slug>/demo.gif). Those folders
// are copied to blog/static/<slug>/, which the blog serves at the same URLs.

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const PROJECT_ID = '6icyfeiq';
const DATASET = 'production';
const API = `https://${PROJECT_ID}.apicdn.sanity.io/v2023-01-01/data/query/${DATASET}`;
// Images are rendered at most 952px wide on the blog. Keep 2x for retina and
// let Sanity downscale anything larger so the repo doesn't carry 4K originals.
const MAX_IMAGE_WIDTH = 1904;

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const BLOG_DIR = path.join(ROOT, 'blog');
const POSTS_DIR = path.join(BLOG_DIR, 'posts');
const AUTHOR_IMG_DIR = path.join(BLOG_DIR, 'static/img/authors');
const SOCIAL_IMG_DIR = path.join(BLOG_DIR, 'static/img/social');
const LEGACY_STATIC_DIR = process.argv[2] ? path.resolve(process.argv[2]) : null;

const POSTS_QUERY = `*[_type == "blogPost" && !(_id in path("drafts.**"))] | order(date desc) {
  _id, title, date, excerpt, hideFeaturedImage, textMarkdown,
  "slug": slug.current,
  seo { metaTitle, metaDescription, excludeFromSitemap, ogImage },
  featuredImage,
  "authors": authors[]->{ name, "slug": slug.current, jobtitle, headline, image, linkedin, twitter },
  "tags": tags[]->{ name, "slug": slug.current },
  "series": series->name,
  "related": relatedPosts[]->slug.current,
  text[] {
    ...,
    _type == "customerQuote" => { ..., author->{ name, jobtitle, image, "company": company->name } },
    _type == "logos" => { ..., logos[] { ..., logo->{ name, logoFullColorDark, logoFullColorLight, logomarkDark } } }
  }
}`;

const TAGS_QUERY = `*[_type == "blogTag"] | order(slug.current asc) { name, "slug": slug.current }`;

async function groq(query) {
  const res = await fetch(`${API}?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error(`Sanity query failed: ${res.status} ${await res.text()}`);
  return (await res.json()).result;
}

// ---------------------------------------------------------------------------
// Assets

// image-<hash>-<w>x<h>-<ext>  ->  https://cdn.sanity.io/images/<p>/<d>/<hash>-<w>x<h>.<ext>
//
// Raster images are transcoded by the Sanity CDN on the way in: the originals
// are mostly full-size PNG screenshots (113 MB for the whole blog), WebP at
// q85 is a fraction of that with no visible loss at blog sizes. `format: jpg`
// is used for featured/social images because some link unfurlers still don't
// render WebP og:images.
function imageUrl(ref, { maxWidth = MAX_IMAGE_WIDTH, format = 'webp' } = {}) {
  const [, hash, dims, ext] = ref.match(/^image-([a-f0-9]+)-(\d+x\d+)-(\w+)$/);
  const base = `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${hash}-${dims}.${ext}`;
  if (['svg', 'gif'].includes(ext)) return { url: base, name: `${hash.slice(0, 12)}.${ext}` };
  const params = new URLSearchParams({ fm: format, q: '85' });
  if (Number(dims.split('x')[0]) > maxWidth) params.set('w', String(maxWidth));
  return { url: `${base}?${params}`, name: `${hash.slice(0, 12)}.${format}` };
}

// file-<hash>-<ext>  ->  https://cdn.sanity.io/files/<p>/<d>/<hash>.<ext>
function fileUrl(ref) {
  const [, hash, ext] = ref.match(/^file-([a-f0-9]+)-(\w+)$/);
  return `https://cdn.sanity.io/files/${PROJECT_ID}/${DATASET}/${hash}.${ext}`;
}

const downloads = [];

// Queues a download and returns the path relative to the post folder.
function queueImage(asset, postDir, options) {
  const { url, name } = imageUrl(asset._ref, options);
  downloads.push({ url, dest: path.join(postDir, 'img', name) });
  return `./img/${name}`;
}

async function runDownloads(concurrency = 8) {
  const queue = [...new Map(downloads.map((d) => [d.dest, d])).values()];
  let done = 0;
  async function worker() {
    while (queue.length) {
      const { url, dest } = queue.shift();
      try {
        await fs.access(dest);
      } catch {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`download failed ${res.status}: ${url}`);
        await fs.mkdir(path.dirname(dest), { recursive: true });
        await fs.writeFile(dest, Buffer.from(await res.arrayBuffer()));
      }
      done += 1;
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return done;
}

// ---------------------------------------------------------------------------
// Portable Text -> MDX

// Escapes text so MDX renders it literally. Over-escaping ASCII punctuation is
// harmless in CommonMark, under-escaping `<` or `{` breaks the MDX compile.
function escapeText(text) {
  return text.replace(/[\\`*_[\]<>{}~|&]/g, (c) => `\\${c}`);
}

// Escapes block-level syntax that only matters at the start of a line.
function escapeLineStart(line) {
  return line.replace(/^(\s*)([#>+=-]|\d+\.)/, (m, ws, mark) => `${ws}${mark.replace(/^(\d+)\./, '$1\\.').replace(/^([#>+=-])/, '\\$1')}`);
}

function codeSpan(text) {
  const ticks = text.includes('`') ? '``' : '`';
  const pad = text.startsWith('`') || text.endsWith('`') ? ' ' : '';
  return `${ticks}${pad}${text}${pad}${ticks}`;
}

// Root-relative links (`/docs/...`, `/contact/`) resolved against okteto.com
// on the old blog. On the Docusaurus blog they'd get the /blog/ baseUrl
// prepended, so anything outside /blog/ becomes an absolute URL.
function absolutize(href) {
  return followLegacyRedirect(/^\/(?!\/|blog\/)/.test(href) ? `https://www.okteto.com${href}` : href);
}

// Posts that were renamed or merged left 301s in the website's _redirects
// (/blog/old-slug /blog/new-slug/ 301!). Links to the old slug still worked
// through the redirect; point them straight at the new URL instead.
const legacyRedirects = new Map();
async function loadLegacyRedirects() {
  if (!LEGACY_STATIC_DIR) return;
  const file = path.join(LEGACY_STATIC_DIR, '..', '_redirects');
  let text;
  try {
    text = await fs.readFile(file, 'utf8');
  } catch {
    return;
  }
  for (const line of text.split('\n')) {
    const [from, to, status = '301'] = line.trim().split(/\s+/);
    if (!from?.startsWith('/blog/') || !to?.startsWith('/blog/') || !/^30[18]!?$/.test(status)) continue;
    legacyRedirects.set(from.replace(/\/$/, ''), to);
  }
}

function followLegacyRedirect(href) {
  const m = href.match(/^(?:https?:\/\/(?:www\.)?okteto\.com)?(\/blog\/[^/?#]+)\/?([?#].*)?$/);
  const target = m && legacyRedirects.get(m[1]);
  return target ? `https://www.okteto.com${target.replace(/\/?$/, '/')}${m[2] || ''}` : href;
}

function safeHref(href) {
  return absolutize(href.trim()).replace(/ /g, '%20').replace(/\(/g, '%28').replace(/\)/g, '%29');
}

// Merge consecutive spans that carry exactly the same marks, so `**a****b**`
// never gets emitted.
function mergeSpans(children) {
  const out = [];
  for (const child of children || []) {
    if (child._type !== 'span') {
      warn(`inline ${child._type} dropped`);
      continue;
    }
    const marks = [...(child.marks || [])].sort();
    const prev = out[out.length - 1];
    if (prev && prev.marks.join() === marks.join()) prev.text += child.text;
    else out.push({ text: child.text || '', marks });
  }
  return out;
}

// Renders a block's spans. Links, strong and em are tracked as a stack so
// nested and overlapping marks close and reopen in a valid order, and
// whitespace is kept outside the markers (`** foo**` doesn't parse).
function renderInline(block) {
  const defs = Object.fromEntries((block.markDefs || []).map((d) => [d._key, d]));
  const decoratorsFor = (marks) => {
    const list = [];
    for (const m of marks) {
      const def = defs[m];
      if (def && def._type === 'link' && def.href) list.push({ id: `link:${m}`, open: '[', close: `](${safeHref(def.href)})` });
    }
    if (marks.includes('strong')) list.push({ id: 'strong', open: '**', close: '**' });
    if (marks.includes('em')) list.push({ id: 'em', open: '*', close: '*' });
    return list;
  };

  let out = '';
  let stack = [];
  let pendingTrail = '';
  for (const span of mergeSpans(block.children)) {
    const [, lead, core, trail] = span.text.match(/^(\s*)([\s\S]*?)(\s*)$/);
    if (!core) {
      pendingTrail += span.text;
      continue;
    }
    const wanted = decoratorsFor(span.marks);
    let keep = 0;
    while (keep < stack.length && keep < wanted.length && stack[keep].id === wanted[keep].id) keep += 1;
    for (let i = stack.length - 1; i >= keep; i -= 1) out += stack[i].close;
    out += pendingTrail + lead;
    for (let i = keep; i < wanted.length; i += 1) out += wanted[i].open;
    stack = wanted;
    const text = span.marks.includes('code')
      ? codeSpan(core.replace(/\n/g, ' '))
      : core.split('\n').map(escapeText).join('<br />\n');
    out += text;
    pendingTrail = trail;
  }
  for (let i = stack.length - 1; i >= 0; i -= 1) out += stack[i].close;
  return out + pendingTrail.replace(/\n/g, ' ').replace(/\s+$/, '');
}

const plainText = (block) => (block.children || []).map((c) => c.text || '').join('');

const jsx = (value) => `{${JSON.stringify(value)}}`;

const warnings = new Map();
let currentSlug = '';
function warn(message) {
  const key = `${currentSlug}: ${message}`;
  warnings.set(key, (warnings.get(key) || 0) + 1);
}

function renderBlocks(blocks, ctx) {
  const parts = [];
  let prevWasList = false;
  for (const block of blocks || []) {
    const md = renderBlock(block, ctx);
    if (md === null) continue;
    const isList = block._type === 'block' && Boolean(block.listItem);
    // Consecutive list items are separated by a single newline so they form
    // one list; everything else is its own paragraph.
    parts.push({ md, sep: isList && prevWasList ? '\n' : '\n\n' });
    prevWasList = isList;
  }
  return parts.map((p, i) => (i === 0 ? p.md : p.sep + p.md)).join('');
}

function renderBlock(block, ctx) {
  switch (block._type) {
    case 'block': {
      const text = renderInline(block);
      if (!text.trim()) return null;
      if (block.listItem) {
        const indent = '    '.repeat(Math.max(0, (block.level || 1) - 1));
        const marker = block.listItem === 'number' ? '1.' : '-';
        return `${indent}${marker} ${text.split('\n').join(`\n${indent}   `)}`;
      }
      const style = block.style || 'normal';
      const heading = { h1: '#', h2: '##', h3: '###', h4: '####', h5: '#####', h6: '######' }[style];
      // Headings are already bold, and `## **Title**` reads badly in source,
      // so only link marks are kept.
      if (heading) {
        const linkKeys = new Set((block.markDefs || []).filter((d) => d._type === 'link').map((d) => d._key));
        const linksOnly = {
          ...block,
          children: (block.children || []).map((c) => ({ ...c, marks: (c.marks || []).filter((m) => linkKeys.has(m)) })),
        };
        return `${heading} ${renderInline(linksOnly).replace(/<br \/>\n/g, ' ').replace(/\s+/g, ' ').trim()}`;
      }
      if (style === 'blockquote') return text.split('\n').map((l) => `> ${l}`).join('\n');
      return text.split('\n').map(escapeLineStart).join('\n');
    }
    case 'code': {
      const fence = block.code?.includes('```') ? '~~~~' : '```';
      const lang = block.language && block.language !== 'text' ? block.language : '';
      return `${fence}${lang}\n${(block.code || '').replace(/\s+$/, '')}\n${fence}`;
    }
    case 'baseImage': {
      if (!block.image?.asset?._ref) return null;
      const src = queueImage(block.image.asset, ctx.postDir);
      const alt = (block.altText || '').replace(/\s+/g, ' ').trim();
      if (block.caption || block.float) {
        ctx.components.add('Figure');
        const props = [`src={require(${JSON.stringify(src)}).default}`, `alt=${jsx(alt)}`];
        if (block.caption) props.push(`caption=${jsx(block.caption)}`);
        if (block.float) props.push(`float=${jsx(block.float.toLowerCase())}`);
        return `<Figure ${props.join(' ')} />`;
      }
      return `![${alt.replace(/[[\]\\]/g, '\\$&')}](${src})`;
    }
    case 'youtubeVideo':
      ctx.components.add('YouTube');
      return `<YouTube id=${jsx(block.videoID)} />`;
    case 'videoFile':
      // Videos stay on the Sanity CDN for now: ~98 MB in total is too heavy
      // for git. See blog/README.md, "Open decisions".
      ctx.components.add('Video');
      return `<Video src=${jsx(fileUrl(block.asset._ref))} />`;
    case 'twitterEmbed':
      ctx.components.add('Tweet');
      return `<Tweet id=${jsx(block.tweetID)} />`;
    case 'arcade':
      ctx.components.add('Arcade');
      return `<Arcade id=${jsx(block.arcadeID)} />`;
    case 'baseButton':
      ctx.components.add('BlogButton');
      return `<BlogButton href=${jsx(block.url && absolutize(block.url.trim()))} variant=${jsx((block.theme || 'Green').toLowerCase())}${block.arrow ? ' arrow' : ''}>${escapeText(block.label || '')}</BlogButton>`;
    case 'callToActionPancake': {
      ctx.components.add('CallToAction');
      const actions = (block.callToActions?.callToActions || []).map(({ label, url }) => ({ label, url: url && absolutize(url.trim()) }));
      return `<CallToAction title=${jsx(block.title || '')} actions=${jsx(actions)} />`;
    }
    case 'customerQuote': {
      ctx.components.add('CustomerQuote');
      const a = block.author;
      const props = [`quote=${jsx(block.quote || '')}`];
      if (a?.name) props.push(`author=${jsx(a.name)}`);
      const role = [a?.jobtitle, block.showAuthorsCompany !== false ? a?.company : null].filter(Boolean).join(', ');
      if (role) props.push(`role=${jsx(role)}`);
      if (a?.image?.asset && block.showAuthorsPicture) props.push(`image={require(${JSON.stringify(queueImage(a.image.asset, ctx.postDir))}).default}`);
      return `<CustomerQuote ${props.join(' ')} />`;
    }
    case 'highlight':
      ctx.components.add('Highlight');
      return `<Highlight>\n\n${renderBlocks(block.text, ctx)}\n\n</Highlight>`;
    case 'collapsible':
      return `<details>\n<summary>${escapeText(block.title || 'Details')}</summary>\n\n${renderBlocks(block.text, ctx)}\n\n</details>`;
    case 'table': {
      const rows = (block.rows || []).map((r) => `| ${(r.cells || []).map((c) => escapeText(String(c)).replace(/\n/g, ' ')).join(' | ')} |`);
      if (!rows.length) return null;
      const cols = (block.rows[0].cells || []).length;
      rows.splice(1, 0, `| ${Array(cols).fill('---').join(' | ')} |`);
      return rows.join('\n');
    }
    case 'logos': {
      ctx.components.add('Logos');
      const items = (block.logos || []).map((l) => {
        const img = l.logo?.logoFullColorDark || l.logo?.logoFullColorLight || l.logo?.logomarkDark;
        return img?.asset ? `[![${l.logo.name}](${queueImage(img.asset, ctx.postDir)})](${safeHref(l.externalLink || '#')})` : null;
      });
      return `<Logos>\n\n${items.filter(Boolean).join('\n')}\n\n</Logos>`;
    }
    default:
      warn(`block ${block._type} dropped`);
      return null;
  }
}

// Dead external links found by the 2026-10-26 link audit. Each entry points
// the link at the page's new location or, when none exists, removes it.
const CONTENT_FIXES = [
  // OpenShift moved its docs to docs.redhat.com.
  [
    'https://docs.openshift.com/container-platform/4.1/authentication/using-rbac.html',
    'https://docs.redhat.com/en/documentation/openshift_container_platform/latest/html/authentication_and_authorization/using-rbac',
  ],
  // The article is gone and has no new home; drop it from the reference list.
  ['- https://jeremievallee.com/2018/05/28/kubernetes-rbac-namespace-user.html\n', ''],
  // Docker retired the get-started Swarm guide; link Swarm mode itself.
  ['https://docs.docker.com/get-started/swarm-deploy/', 'https://docs.docker.com/engine/swarm/'],
  // Gartner's conference topic page is gone; its platform engineering article replaces it.
  [
    'https://www.gartner.com/en/conferences/na/applications-us/featured-topic/platform-engineering',
    'https://www.gartner.com/en/articles/what-is-platform-engineering',
  ],
  // The episode MP3 no longer exists on the podcast's site; link the episode page instead.
  [
    /<div class="no-border"[^]*?<audio controls[^]*?KPfGep125\.mp3[^]*?<\/audio>\s*<\/div>/,
    '[Listen to the episode on the Kubernetes Podcast from Google](https://kubernetespodcast.com/episode/125-okteto/).',
  ],
];

function applyContentFixes(text) {
  return CONTENT_FIXES.reduce((out, [from, to]) => (typeof from === 'string' ? out.split(from).join(to) : out.replace(from, to)), text);
}

// ---------------------------------------------------------------------------
// Front matter

const yamlString = (s) => JSON.stringify(String(s));
const yamlList = (items) => `[${items.map(yamlString).join(', ')}]`;

function frontMatter(post, featured, social) {
  const lines = ['---', `title: ${yamlString(post.title.trim())}`];
  if (post.seo?.metaTitle && post.seo.metaTitle.trim() !== post.title.trim()) lines.push(`title_meta: ${yamlString(post.seo.metaTitle.trim())}`);
  const description = post.seo?.metaDescription || post.excerpt;
  if (description) lines.push(`description: ${yamlString(description.trim())}`);
  if (post.excerpt && post.excerpt !== description) lines.push(`excerpt: ${yamlString(post.excerpt.trim())}`);
  lines.push(`slug: ${post.slug}`, `date: ${post.date}`);
  const authors = (post.authors || []).filter(Boolean).map((a) => a.slug);
  if (authors.length) lines.push(`authors: ${yamlList(authors)}`);
  const tags = (post.tags || []).filter(Boolean).map((t) => t.slug);
  if (tags.length) lines.push(`tags: ${yamlList(tags)}`);
  if (featured) {
    lines.push(`image: ${featured.src}`);
    if (featured.alt) lines.push(`image_alt: ${yamlString(featured.alt)}`);
  }
  if (social) lines.push(`social_image: ${social}`);
  if (post.hideFeaturedImage) lines.push('hide_featured_image: true');
  if (post.series) lines.push(`series: ${yamlString(post.series)}`);
  const related = (post.related || []).filter(Boolean);
  if (related.length) lines.push(`related: ${yamlList(related)}`);
  if (post.seo?.excludeFromSitemap) lines.push('sitemap_exclude: true');
  lines.push('---');
  return lines.join('\n');
}

// Copies website/static/blog/<slug>/ to blog/static/<slug>/ when it exists.
// Raw HTML (`<img src="x.png">`) in those posts keeps resolving against the
// page URL, so the files have to stay at /blog/<slug>/x.png.
const legacyCopied = [];
async function copyLegacyStatic(slug) {
  if (!LEGACY_STATIC_DIR) return false;
  const source = path.join(LEGACY_STATIC_DIR, slug);
  try {
    await fs.access(source);
  } catch {
    return false;
  }
  await fs.cp(source, path.join(BLOG_DIR, 'static', slug), { recursive: true });
  legacyCopied.push(slug);
  return true;
}

// ---------------------------------------------------------------------------

async function writeAuthors(posts) {
  const authors = new Map();
  for (const post of posts) for (const a of post.authors || []) if (a?.slug) authors.set(a.slug, a);

  await fs.mkdir(AUTHOR_IMG_DIR, { recursive: true });
  const lines = ['# Blog authors. The key is the author slug: posts reference it in', '# `authors:` and it is the URL of the author page (/blog/authors/<key>/).', ''];
  for (const [slug, a] of [...authors].sort(([x], [y]) => x.localeCompare(y))) {
    lines.push(`${slug}:`, `  name: ${yamlString(a.name)}`);
    if (a.jobtitle) lines.push(`  title: ${yamlString(a.jobtitle)}`);
    if (a.headline) lines.push(`  description: ${yamlString(a.headline)}`);
    if (a.image?.asset?._ref) {
      const { url, name } = imageUrl(a.image.asset._ref, { maxWidth: 400 });
      const file = `${slug}${path.extname(name)}`;
      downloads.push({ url, dest: path.join(AUTHOR_IMG_DIR, file) });
      lines.push(`  image_url: /img/authors/${file}`);
    }
    lines.push('  page: true');
    const socials = [];
    if (a.linkedin) socials.push(`    linkedin: ${yamlString(a.linkedin)}`);
    if (a.twitter) socials.push(`    x: ${yamlString(a.twitter)}`);
    if (socials.length) lines.push('  socials:', ...socials);
  }
  await fs.writeFile(path.join(BLOG_DIR, 'authors.yml'), `${lines.join('\n')}\n`);
  return authors.size;
}

async function writeTags(tags) {
  const lines = ['# Blog tags. Posts may only use tags defined here (onInlineTags: throw).', '# The permalink keeps the URLs the Sanity-powered blog used: /blog/tags/<slug>/.', ''];
  for (const t of tags) lines.push(`${t.slug}:`, `  label: ${yamlString(t.name)}`, `  permalink: /${t.slug}`);
  await fs.writeFile(path.join(BLOG_DIR, 'tags.yml'), `${lines.join('\n')}\n`);
}

async function main() {
  await loadLegacyRedirects();
  const [posts, tags] = await Promise.all([groq(POSTS_QUERY), groq(TAGS_QUERY)]);
  console.log(`sanity: ${posts.length} published posts, ${tags.length} tags`);

  await fs.mkdir(POSTS_DIR, { recursive: true });
  const stats = { mdx: 0, md: 0 };

  for (const post of posts) {
    currentSlug = post.slug;
    const postDir = path.join(POSTS_DIR, `${post.date}-${post.slug}`);
    await fs.mkdir(postDir, { recursive: true });

    const featuredAsset = post.featuredImage?.image?.asset;
    const featured = featuredAsset ? { src: queueImage(featuredAsset, postDir, { format: 'jpg' }), alt: (post.featuredImage.altText || '').trim() } : null;
    // Docusaurus only resolves a relative path in the `image` front matter
    // key, which is the featured image. A separate social card lives in the
    // blog's static folder and is referenced by its absolute path instead.
    let social = null;
    if (post.seo?.ogImage?.asset && post.seo.ogImage.asset._ref !== featuredAsset?._ref) {
      const { url } = imageUrl(post.seo.ogImage.asset._ref, { format: 'jpg' });
      downloads.push({ url, dest: path.join(SOCIAL_IMG_DIR, `${post.slug}.jpg`) });
      social = `/img/social/${post.slug}.jpg`;
    }

    const ctx = { postDir, components: new Set() };
    let body;
    let ext;
    if (post.text) {
      await copyLegacyStatic(post.slug);
      const blocks = post.text;
      // Everything up to the first paragraph is the list-page excerpt.
      const firstPara = blocks.findIndex((b) => b._type === 'block' && !b.listItem && (b.style || 'normal') === 'normal' && plainText(b).trim());
      const head = renderBlocks(blocks.slice(0, firstPara + 1), ctx);
      const rest = renderBlocks(blocks.slice(firstPara + 1), ctx);
      const imports = ctx.components.size
        ? `import { ${[...ctx.components].sort().join(', ')} } from '@site/src/components/blog';\n\n`
        : '';
      body = `${imports}${head}\n\n{/* truncate */}\n\n${rest}`;
      ext = 'mdx';
    } else {
      // Legacy Markdown body: keep it as CommonMark (`format: detect` treats
      // .md files as plain Markdown, so raw HTML and stray `{` keep working).
      let text = post.textMarkdown.replace(/\r\n/g, '\n').trim();
      text = text
        .replace(/(\]\()((?:https?:\/\/(?:www\.)?okteto\.com)?\/[^)\s]*)/g, (m, open, href) => `${open}${absolutize(href)}`)
        .replace(/(href=["'])((?:https?:\/\/(?:www\.)?okteto\.com)?\/[^"']*)/g, (m, open, href) => `${open}${absolutize(href)}`);
      if (await copyLegacyStatic(post.slug)) {
        // `![x](demo.gif)` resolved against the page URL on the old blog. In
        // Docusaurus a relative Markdown image must be a file next to the
        // post, so point it at the static copy instead (same public URL).
        text = text.replace(/(!\[[^\]]*\]\()(?!https?:|\/|#)([^)\s]+)\)/g, `$1/${post.slug}/$2)`);
      }
      const split = text.indexOf('\n\n');
      body = split > 0 ? `${text.slice(0, split)}\n\n<!-- truncate -->\n\n${text.slice(split + 2)}` : text;
      ext = 'md';
    }
    stats[ext] += 1;

    for (const stale of ['index.md', 'index.mdx']) await fs.rm(path.join(postDir, stale), { force: true });
    await fs.writeFile(path.join(postDir, `index.${ext}`), `${frontMatter(post, featured, social)}\n\n${applyContentFixes(body).trim()}\n`);
  }

  const authorCount = await writeAuthors(posts);
  await writeTags(tags);
  const fetched = await runDownloads();

  console.log(`wrote ${stats.mdx} .mdx and ${stats.md} .md posts, ${authorCount} authors, ${tags.length} tags, ${fetched} assets`);
  if (LEGACY_STATIC_DIR) console.log(`copied ${legacyCopied.length} legacy static folders from ${LEGACY_STATIC_DIR}`);
  if (warnings.size) {
    console.log('warnings:');
    for (const [message, count] of warnings) console.log(`  ${message}${count > 1 ? ` (x${count})` : ''}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
