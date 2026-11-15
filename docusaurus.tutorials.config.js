// The Okteto tutorials, served at https://www.okteto.com/docs/tutorials/.
//
// A third Docusaurus site built from this repo, with the same configuration
// (config/shared.js) and the same look as the blog: tutorials are written and
// rendered as blog posts (src/plugins/okteto-blog and the Blog* components of
// src/theme). Content lives in ./tutorials: one folder per tutorial. See
// tutorials/README.md for how to write one.
//
// The build goes to build/docs/tutorials, inside the output of the docs site,
// so it runs after `build:docs` (which empties build/docs).

const shared = require('./config/shared');

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
  headTags: shared.headTags(BASE_URL),
  customFields: {
    // Read by src/theme/SearchMetadata and src/theme/BlogPostPaginator.
    searchTag: 'tutorials',
    allPostsLabel: 'All tutorials',
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
        button: { buttonText: 'Search tutorials', buttonAriaLabel: 'Search tutorials' },
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
          ignorePatterns: ['/docs/tutorials/tags/**', '/docs/tutorials/authors/', '/docs/tutorials/search/'],
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
      // Markdown twin of every tutorial (/docs/tutorials/<slug>.md) and
      // /docs/tutorials/llms.txt, which the llms.txt of the docs links to.
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
