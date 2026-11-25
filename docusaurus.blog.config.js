// The Okteto blog, served at https://www.okteto.com/blog/.
//
// Built from the same repo and the same shared configuration as the docs and
// the tutorials (config/shared.js), as a separate Docusaurus site because
// baseUrl is site-wide. Content lives in ./blog: one folder per post, plus authors.yml
// and tags.yml. See blog/README.md for how to write a post.

const shared = require('./config/shared');
const { siteJsonLdHeadTag, pageJsonLdRefs } = require('./config/jsonld');

const BASE_URL = shared.SITES.blog;
const LLMS_TXT_URL = `${shared.SITE_URL}/docs/llms.txt`;

module.exports = {
  ...shared.siteConfig,
  // Page titles render as "<post title> | Okteto", same as the old blog.
  title: 'Okteto',
  tagline: 'Kubernetes for Developers',
  baseUrl: BASE_URL,
  favicon: 'img/favicon.ico',
  staticDirectories: shared.staticDirectories('blog/static'),
  markdown: {
    // Posts migrated from Sanity's Markdown field stay .md and are parsed as
    // CommonMark (raw HTML, literal `{`). New posts are .mdx.
    format: 'detect',
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
  headTags: [
    ...shared.headTags(BASE_URL),
    // Site-level JSON-LD entity graph: the same Organization and product as the
    // docs and the tutorials (config/jsonld.js), and this site as a WebSite.
    // Each post adds its own BlogPosting, which references this graph
    // (src/theme/BlogPostPage/StructuredData).
    siteJsonLdHeadTag({ baseUrl: BASE_URL, name: 'Okteto Blog' }),
  ],
  customFields: {
    // Read by src/theme/BlogPostPage/StructuredData: the references of each
    // post to the site-level JSON-LD graph.
    jsonLd: pageJsonLdRefs({ baseUrl: BASE_URL }),
    // Read by src/theme/BlogPostItem/Footer: every post ends with what Okteto
    // is and a link to okteto.com (src/components/blog/AboutOkteto).
    aboutOkteto: true,
  },
  themeConfig: {
    ...shared.themeConfig,
    // Searches blog posts only (see shared.algolia). Results depend on the
    // Algolia crawler indexing https://www.okteto.com/blog/. The button reads
    // "Search" on the three sites; the search box says what it searches.
    algolia: {
      ...shared.algolia,
      translations: {
        button: { buttonText: 'Search', buttonAriaLabel: 'Search the blog' },
        modal: { searchBox: { placeholderText: 'Search blog posts' } },
      },
    },
    navbar: shared.navbar('blog', { start: [shared.searchNavbarItem] }),
    footer: shared.footer('blog', { llmsTxtUrl: LLMS_TXT_URL }),
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        // The blog plugin is registered below through src/plugins/okteto-blog.
        docs: false,
        blog: false,
        pages: false,
        sitemap: {
          filename: 'sitemap-blog.xml',
          // The old blog kept tag pages out of the sitemap too.
          ignorePatterns: ['/blog/tags/**', '/blog/authors/'],
        },
        ...shared.presetOptions,
        theme: {
          customCss: [shared.presetOptions.theme.customCss, require.resolve('./src/styles/blog.scss')],
        },
      },
    ],
  ],
  plugins: [
    [
      require.resolve('./src/plugins/okteto-blog'),
      {
        path: 'blog/posts',
        routeBasePath: '/',
        blogTitle: 'Okteto Blog',
        blogDescription:
          'Posts from the Okteto team on development environments, platform engineering, Kubernetes, and AI coding agents.',
        // Twelve fill complete rows at four, three and two columns (the card grid
        // in src/theme/BlogPostItems never shows more than four).
        postsPerPage: 12,
        blogSidebarCount: 0,
        // Posts are ordered by `date`, but dates are not shown anywhere on the
        // blog, so there is no by-year archive page either.
        archiveBasePath: null,
        showReadingTime: true,
        // Feeds dateModified in the post JSON-LD and article:modified_time, from
        // git or the `last_update` front matter. Post pages don't show it: their
        // footer is the callout (src/theme/BlogPostItem/Footer).
        showLastUpdateTime: true,
        authorsMapPath: '../authors.yml',
        tags: '../tags.yml',
        onInlineTags: 'throw',
        onInlineAuthors: 'throw',
        onUntruncatedBlogPosts: 'ignore',
        // Root-relative links to the docs and the tutorials are links to
        // other sites (see config/shared.js).
        remarkPlugins: [shared.remarkCrossSiteLinks('blog')],
        feedOptions: {
          // Published at /blog/rss.xml; okteto.com proxies the old /rss.xml
          // URL to it.
          type: 'rss',
          title: 'Okteto Blog',
          description:
            'Posts from the Okteto team on development environments, platform engineering, Kubernetes, and AI coding agents.',
          copyright: `Copyright © ${new Date().getFullYear()} Okteto, Inc.`,
          limit: false,
        },
      },
    ],
    [
      // Markdown twin of every post (/blog/<slug>.md) and /blog/llms.txt,
      // for coding agents. The old blog served the same .md URLs.
      '@signalwire/docusaurus-plugin-llms-txt',
      {
        content: {
          includeBlog: true,
          includeDocs: false,
          includePages: false,
          enableMarkdownFiles: true,
        },
      },
    ],
    ...shared.plugins,
  ],
  scripts: shared.scripts,
};
