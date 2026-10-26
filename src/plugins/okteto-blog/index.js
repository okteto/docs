// Thin wrapper around @docusaurus/plugin-content-blog.
//
// It keeps the stock plugin (name, routes, feed, MDX loader, theme hooks all
// unchanged) and adds what the Sanity-powered blog had that Docusaurus
// doesn't:
//
//   1. Legacy pagination URLs. Docusaurus paginates as /blog/page/2/, the old
//      blog used /blog/page-2/. Routes and paginator links are rewritten as
//      they are registered, so the old URLs keep working with no redirects.
//   2. Series and related posts, computed once from all posts and exposed as
//      global data (see src/theme/BlogPostItem/Footer).
//   3. Tag pages for tags no post uses. The old blog rendered an (empty) page
//      for every tag; Docusaurus only creates pages for tags in use. Unused
//      tags from tags.yml get a redirect page to /blog/tags/ instead of a 404.
//   4. /blog/posts.json, a machine-readable index of every post. okteto.com
//      pages that list blog posts (BlogPostsListing in okteto/website) read
//      it instead of querying Sanity.

const fs = require('fs/promises');
const path = require('path');
const yaml = require('js-yaml');
const blogPluginModule = require('@docusaurus/plugin-content-blog');

const pluginContentBlog = blogPluginModule.default;

// How many related posts a post shows: hand-picked ones (`related:` front
// matter) first, then the most recent posts sharing a tag. Same rule the
// Gatsby blog used.
const RELATED_COUNT = 2;

function legacyPageUrl(url) {
  return typeof url === 'string' ? url.replace(/\/page\/(\d+)(\/?)$/, '/page-$1$2') : url;
}

function rewriteListMetadata(metadata) {
  if (!metadata) return metadata;
  return {
    ...metadata,
    permalink: legacyPageUrl(metadata.permalink),
    previousPage: legacyPageUrl(metadata.previousPage),
    nextPage: legacyPageUrl(metadata.nextPage),
  };
}

function rewriteRoute(route) {
  const props = route.props && {
    ...route.props,
    metadata: route.props.metadata?.page ? rewriteListMetadata(route.props.metadata) : route.props.metadata,
    listMetadata: rewriteListMetadata(route.props.listMetadata),
  };
  return { ...route, path: legacyPageUrl(route.path), props };
}

function summarize(post) {
  const { title, permalink, date, description, frontMatter } = post.metadata;
  return { title, permalink, date, description: frontMatter.excerpt || description };
}

function buildIndex(blogPosts) {
  const bySlug = new Map(blogPosts.map((p) => [p.metadata.frontMatter.slug, p]));
  // blogPosts arrive sorted newest first.
  const series = {};
  for (const post of [...blogPosts].reverse()) {
    const name = post.metadata.frontMatter.series;
    if (name) (series[name] ||= []).push({ title: post.metadata.title, permalink: post.metadata.permalink });
  }

  const posts = {};
  for (const post of blogPosts) {
    const { permalink, tags, frontMatter } = post.metadata;
    const picked = (frontMatter.related || []).map((slug) => bySlug.get(slug)).filter(Boolean);
    const tagSet = new Set(tags.map((t) => t.label));
    const automatic = blogPosts.filter(
      (other) => other !== post && other.metadata.tags.some((t) => tagSet.has(t.label)),
    );
    const related = [...new Set([...picked, ...automatic])].slice(0, RELATED_COUNT).map(summarize);
    posts[permalink] = { series: frontMatter.series || null, related };
  }
  return { series, posts };
}

function redirectPage(to) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="robots" content="noindex"><link rel="canonical" href="${to}"><meta http-equiv="refresh" content="0; url=${to}"></head><body><a href="${to}">${to}</a></body></html>\n`;
}

async function writeUnusedTagRedirects({ outDir, content, tagsFile, baseUrl }) {
  const defined = yaml.load(await fs.readFile(tagsFile, 'utf8')) || {};
  const withSlash = (url) => url.replace(/\/?$/, '/');
  const tagsUrl = `${baseUrl}tags/`;
  const used = new Set(Object.values(content.blogTags).map((tag) => withSlash(tag.permalink)));
  const unused = Object.values(defined).filter(
    (tag) => !used.has(withSlash(`${tagsUrl}${tag.permalink.replace(/^\//, '')}`)),
  );
  await Promise.all(
    unused.map(async (tag) => {
      const dir = path.join(outDir, 'tags', tag.permalink.replace(/^\//, ''));
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(path.join(dir, 'index.html'), redirectPage(tagsUrl));
    }),
  );
  return unused.length;
}

// The image URL is read back from the built page's og:image, because
// Docusaurus only knows the hashed asset path after webpack has run.
async function writePostsIndex({ outDir, content, siteUrl }) {
  const posts = await Promise.all(
    content.blogPosts.map(async ({ metadata }) => {
      const html = await fs.readFile(path.join(outDir, metadata.permalink.replace(/^\/blog\//, ''), 'index.html'), 'utf8');
      const image = html.match(/<meta[^>]+property="og:image"[^>]+content="([^"]+)"/)?.[1] ?? null;
      return {
        title: metadata.title,
        url: `${siteUrl}${metadata.permalink.replace(/\/?$/, '/')}`,
        date: metadata.date,
        description: metadata.frontMatter.excerpt || metadata.description,
        image,
        authors: metadata.authors.map((a) => a.name),
        tags: metadata.tags.map((t) => t.label),
      };
    }),
  );
  await fs.writeFile(path.join(outDir, 'posts.json'), JSON.stringify({ posts }, null, 2));
}

async function oktetoBlogPlugin(context, options) {
  const plugin = await pluginContentBlog(context, options);
  return {
    ...plugin,
    async postBuild(props) {
      await plugin.postBuild(props);
      const tagsFile = path.resolve(context.siteDir, options.path, options.tags);
      const count = await writeUnusedTagRedirects({ ...props, tagsFile, baseUrl: context.baseUrl });
      console.log(`[okteto-blog] wrote ${count} redirect pages for unused tags`);
      await writePostsIndex({ ...props, siteUrl: context.siteConfig.url });
    },
    async contentLoaded({ content, actions }) {
      actions.setGlobalData(buildIndex(content.blogPosts));
      await plugin.contentLoaded({
        content,
        actions: { ...actions, addRoute: (route) => actions.addRoute(rewriteRoute(route)) },
      });
    },
  };
}

oktetoBlogPlugin.validateOptions = blogPluginModule.validateOptions;

module.exports = oktetoBlogPlugin;
