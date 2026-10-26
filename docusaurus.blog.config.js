// The Okteto blog, served at https://www.okteto.com/blog/.
//
// Built from the same repo and the same shared configuration as the docs
// (config/shared.js), as a second Docusaurus site because baseUrl is
// site-wide. Content lives in ./blog: one folder per post, plus authors.yml
// and tags.yml. See blog/README.md for how to write a post.

const shared = require('./config/shared');

const BASE_URL = '/blog/';
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
  headTags: shared.headTags(BASE_URL),
  themeConfig: {
    ...shared.themeConfig,
    // Fallback social card for list, tag and author pages. Posts use their
    // featured image.
    image: 'https://www.okteto.com/docs/okteto-meta-image.png',
    navbar: shared.navbar('blog'),
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
          ignorePatterns: ['/blog/tags/**', '/blog/authors/', '/blog/archive/'],
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
        postsPerPage: 30,
        blogSidebarCount: 0,
        showReadingTime: true,
        authorsMapPath: '../authors.yml',
        tags: '../tags.yml',
        onInlineTags: 'throw',
        onInlineAuthors: 'throw',
        onUntruncatedBlogPosts: 'ignore',
        editUrl: 'https://github.com/okteto/docs/edit/main/',
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
