// The Okteto tutorials, served at https://www.okteto.com/tutorials/.
//
// A third Docusaurus site built from this repo, with the same configuration
// (config/shared.js) and the same look as the blog: tutorials are written and
// rendered as blog posts (src/plugins/okteto-blog and the Blog* components of
// src/theme). Content lives in ./tutorials: one folder per tutorial. See
// tutorials/README.md for how to write one.

const shared = require('./config/shared');
const { siteJsonLdHeadTag, pageJsonLdRefs } = require('./config/jsonld');

const BASE_URL = shared.SITES.tutorials;
const LLMS_TXT_URL = `${shared.SITE_URL}/docs/llms.txt`;
const DESCRIPTION =
  'Step-by-step tutorials to develop, preview and test applications with Okteto, and to run AI coding agents on them.';

module.exports = {
  ...shared.siteConfig,
  title: 'Okteto',
  tagline: 'Kubernetes for Developers',
  baseUrl: BASE_URL,
  favicon: 'img/favicon.ico',
  // Images live next to each tutorial, so there is no static folder of its own.
  staticDirectories: ['shared/static'],
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
  headTags: [
    ...shared.headTags(BASE_URL),
    // Site-level JSON-LD entity graph: the same Organization and product as the
    // docs (config/jsonld.js), and this site as a WebSite. Each tutorial adds
    // its own BlogPosting, which references this graph
    // (src/theme/BlogPostPage/StructuredData).
    siteJsonLdHeadTag({ baseUrl: BASE_URL, name: 'Okteto Tutorials' }),
  ],
  customFields: {
    // Read by src/theme/SearchMetadata and src/theme/BlogPostPaginator.
    searchTag: 'tutorials',
    allPostsLabel: 'All tutorials',
    // Read by src/components/Newsletter: the tutorials go out in the product
    // updates email, so this site signs readers up to that list.
    newsletter: 'productUpdates',
    // Read by src/theme/BlogPostPage/StructuredData: the references of each
    // tutorial to the site-level JSON-LD graph.
    jsonLd: pageJsonLdRefs({ baseUrl: BASE_URL, aboutProduct: true }),
  },
  themeConfig: {
    ...shared.themeConfig,
    // Searches tutorials only: every page of this site is indexed with the
    // `tutorials` tag (src/theme/SearchMetadata), and the search box filters on it.
    algolia: {
      ...shared.algolia,
      contextualSearch: false,
      searchParameters: { facetFilters: ['language:en', 'docusaurus_tag:tutorials'] },
      translations: {
        button: { buttonText: 'Search', buttonAriaLabel: 'Search tutorials' },
        modal: { searchBox: { placeholderText: 'Search tutorials' } },
      },
    },
    navbar: shared.navbar('tutorials', { start: [shared.searchNavbarItem] }),
    footer: shared.footer('tutorials', { llmsTxtUrl: LLMS_TXT_URL }),
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: false,
        blog: false,
        pages: false,
        sitemap: {
          filename: 'sitemap-tutorials.xml',
          ignorePatterns: ['/tutorials/tags/**', '/tutorials/authors/', '/tutorials/search/'],
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
        path: 'tutorials/posts',
        routeBasePath: '/',
        blogTitle: 'Okteto Tutorials',
        blogDescription: DESCRIPTION,
        postsPerPage: 12,
        blogSidebarCount: 0,
        archiveBasePath: null,
        showReadingTime: true,
        onInlineTags: 'throw',
        onInlineAuthors: 'throw',
        onUntruncatedBlogPosts: 'ignore',
        remarkPlugins: [shared.remarkCrossSiteLinks('tutorials')],
        feedOptions: {
          type: 'rss',
          title: 'Okteto Tutorials',
          description: DESCRIPTION,
          copyright: `Copyright © ${new Date().getFullYear()} Okteto, Inc.`,
          limit: false,
        },
      },
    ],
    [
      // Markdown twin of every tutorial (/tutorials/<slug>.md) and
      // /tutorials/llms.txt, which the llms.txt of the docs links to.
      '@signalwire/docusaurus-plugin-llms-txt',
      {
        siteTitle: 'Okteto Tutorials',
        siteDescription: DESCRIPTION,
        optionalLinks: [{ title: 'Okteto Documentation', url: `${shared.SITE_URL}/docs/llms.txt` }],
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
