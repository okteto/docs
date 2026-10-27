const path = require('path');
const shared = require('./config/shared');

const docsContentPath = 'src/content';

// Strip Docusaurus heading-anchor links (class "hash-link") from the Markdown
// twins generated for AI agents. They render as noisy `[​](#... "Direct link
// to ...")` fragments that carry no content. Dependency-free hast walk so it
// works in this CommonJS config without an ESM import.
function rehypeStripHashLinks() {
  const isHashLink = (node) =>
    node.tagName === 'a' &&
    Array.isArray(node.properties && node.properties.className) &&
    node.properties.className.includes('hash-link');

  const walk = (node) => {
    if (!node.children) return;
    node.children = node.children.filter((child) => !isHashLink(child));
    node.children.forEach(walk);
  };

  return (tree) => walk(tree);
}

// Strip tier badges (the TiersList component, rendered as
// `<div class="TiersList"><span class="Tier">…</span></div>`) from the
// Markdown twins. They sit inside heading HTML, so without this the badge
// labels concatenate into the heading text (e.g.
// `# CatalogScaleEnterpriseSelf-Hosted`).
function rehypeStripTierBadges() {
  const isTierBadge = (node) =>
    node.tagName === 'div' &&
    Array.isArray(node.properties && node.properties.className) &&
    node.properties.className.includes('TiersList');

  const walk = (node) => {
    if (!node.children) return;
    node.children = node.children.filter((child) => !isTierBadge(child));
    node.children.forEach(walk);
  };

  return (tree) => walk(tree);
}

// Strip the AgentActions control (the "Copy page / Open in agent" split
// button) from the Markdown twins — it's page chrome, not content. Same
// dependency-free hast walk as rehypeStripHashLinks above.
function rehypeStripAgentActions() {
  const isAgentActions = (node) =>
    Array.isArray(node.properties && node.properties.className) &&
    node.properties.className.includes('AgentActions');

  const walk = (node) => {
    if (!node.children) return;
    node.children = node.children.filter((child) => !isAgentActions(child));
    node.children.forEach(walk);
  };

  return (tree) => walk(tree);
}

// Docs origin and base path (also used for url/baseUrl in module.exports below).
const SITE_URL = shared.SITE_URL;
const BASE_URL = '/docs/';

// Origin for the llms.txt pointer. On Netlify deploy previews / branch deploys
// use the deploy's own URL (injected as DEPLOY_PRIME_URL) so the pointer
// resolves to the preview instead of production; fall back to the production
// origin for prod builds and local development. Building an absolute URL also
// keeps Docusaurus's onBrokenLinks check from treating it as an internal route
// (llms.txt is generated in postBuild, so no route exists for it at check time).
const LLMS_ORIGIN =
  process.env.CONTEXT && process.env.CONTEXT !== 'production'
    ? process.env.DEPLOY_PRIME_URL || SITE_URL
    : SITE_URL;
const LLMS_TXT_URL = `${LLMS_ORIGIN}${BASE_URL.replace(/\/$/, '')}/llms.txt`;

// Prepend a pointer to llms.txt at the top of every generated Markdown page so
// that coding agents which fetch a page as Markdown can discover the full
// documentation index. Linking the index (rather than crawling blindly) sharply
// reduces an agent's wasted fetches and tokens.
function remarkLlmsIndexPointer() {
  return (tree) => {
    tree.children.unshift({
      type: 'blockquote',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'strong',
              children: [{ type: 'text', value: 'Documentation Index' }],
            },
            {
              type: 'text',
              value: ': fetch the complete list of pages as Markdown at ',
            },
            {
              type: 'link',
              url: LLMS_TXT_URL,
              children: [{ type: 'text', value: LLMS_TXT_URL }],
            },
            {
              type: 'text',
              value: ' to find the right page before exploring further.',
            },
          ],
        },
      ],
    });
  };
}

// Site-level JSON-LD entity graph: who publishes these docs (Organization),
// the docs site itself (WebSite), and the product they document (WebApplication).
// Rendered into the <head> of every docs page so answer engines and search read
// the publisher and product identity instead of inferring it. Page-level
// TechArticle/BreadcrumbList blocks reference these @id values.
const siteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Okteto, Inc.',
      url: `${SITE_URL}/`,
      description:
        'Okteto gives coding agents production-like environments to verify their work.',
      logo: {
        '@type': 'ImageObject',
        '@id': `${SITE_URL}/#logo`,
        url: `${SITE_URL}${BASE_URL}img/logo.svg`,
      },
      sameAs: [
        'https://github.com/okteto/okteto',
        'https://twitter.com/oktetohq',
        'https://www.youtube.com/@OktetoHQ',
      ],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}${BASE_URL}#website`,
      url: `${SITE_URL}${BASE_URL}`,
      name: 'Okteto Documentation',
      publisher: { '@id': `${SITE_URL}/#organization` },
      inLanguage: 'en-US',
    },
    {
      '@type': 'WebApplication',
      '@id': `${SITE_URL}/#product`,
      name: 'Okteto Platform',
      description: 'Okteto is the environment platform for agentic development.',
      url: `${SITE_URL}/`,
      applicationCategory: 'DeveloperApplication',
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
  ],
};

module.exports = {
  ...shared.siteConfig,
  title: 'Okteto Documentation',
  tagline: 'Kubernetes for Developers',
  baseUrl: BASE_URL,
  favicon: 'img/favicon.ico',
  staticDirectories: shared.staticDirectories('static'),
  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
  themes: ['@docusaurus/theme-mermaid'],
  customFields: {
    image: 'https://www.okteto.com/docs/okteto-meta-image.png',
  },
  headTags: [
    ...shared.headTags(BASE_URL),
    {
      // Site-level entity graph (Organization, WebSite, WebApplication).
      tagName: 'script',
      attributes: {
        type: 'application/ld+json',
      },
      innerHTML: JSON.stringify(siteJsonLd),
    },
    {
      // Machine-readable pointer so agents crawling the HTML can find the index.
      tagName: 'link',
      attributes: {
        rel: 'alternate',
        type: 'text/plain',
        title: 'llms.txt',
        href: LLMS_TXT_URL,
      },
    },
  ],
  themeConfig: {
    ...shared.themeConfig,
    tableOfContents: {
      maxHeadingLevel: 4,
    },
    algolia: {
      appId: 'RS9BKUCQCT',
      apiKey: '9213a8b24b30e1994c4c8ff5f282cf6f',
      indexName: 'okteto',
      algoliaOptions: {},
      position: 'left',
    },
    navbar: shared.navbar('docs', {
      start: [
        {
          type: 'search',
          position: 'left',
        },
      ],
      end: [
        {
          type: 'docsVersionDropdown',
          position: 'right',
          dropdownActiveClassDisabled: true,
          dropdownItemsAfter: [
            {
              type: 'html',
              value: '<hr class="dropdown-separator">',
            },
            {
              to: '/archives',
              label: 'Archives',
            },
            {
              to: '/release-notes',
              label: 'Release Notes',
            },
          ],
        },
      ],
    }),
    footer: shared.footer('docs', { llmsTxtUrl: LLMS_TXT_URL }),
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: docsContentPath,
          routeBasePath: '/',
          editUrl: 'https://github.com/okteto/docs/edit/main',
          breadcrumbs: false,
          sidebarPath: require.resolve('./sidebars.js'),
          lastVersion: '1.49',
          versions: {
            current: {
              // aka unreleased version in development
              // Remember to also update "unreleased" redirect if changing the value!
              label: '1.50',
              path: '1.50',
            },
            '1.49': {
              // aka latest/official version
              // Remember to also update docs root redirect if changing the value!
              label: '1.49',
              path: '/',
              banner: 'none',
            },
            '1.48': {
              label: '1.48',
              path: '1.48',
              banner: 'unmaintained',
            },
            '1.47': {
              label: '1.47',
              path: '1.47',
              banner: 'unmaintained',
            },
            '1.46': {
              label: '1.46',
              path: '1.46',
              banner: 'unmaintained',
            },
            '1.45': {
              label: '1.45',
              path: '1.45',
              banner: 'unmaintained',
            },
            '1.44': {
              label: '1.44',
              path: '1.44',
              banner: 'unmaintained',
            },
          },
          include: ['**/*.md', '**/*.mdx'],
        },
        // The blog is a separate site (docusaurus.blog.config.js); without
        // this the preset would also pick up ./blog and publish it under /docs/.
        blog: false,
        ...shared.presetOptions,
      },
    ],
  ],
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'tutorials',
        path: 'src/tutorials',
        routeBasePath: 'tutorials',
        sidebarPath: require.resolve('./sidebarTutorials.js'),
        breadcrumbs: false,
      },
    ],
    [
      '@signalwire/docusaurus-plugin-llms-txt',
      {
        // The plugin's own llms.txt / llms-full.txt output is never used
        // directly - scripts/generate-all-llms-files.js overwrites both with
        // its own per-version-aware versions right after the build (see that
        // script for why: the plugin only ever writes one combined file
        // across every version, in an undocumented full-text format that
        // can't be split back apart per version). What the plugin IS still
        // used for, and does need this config: rendering every version's
        // pages into clean per-page Markdown twins (enableMarkdownFiles),
        // which the script reads directly.
        content: {
          includeVersionedDocs: true,
          enableMarkdownFiles: true,
          beforeDefaultRehypePlugins: [rehypeStripHashLinks, rehypeStripTierBadges, rehypeStripAgentActions],
          remarkPlugins: [remarkLlmsIndexPointer],
        },
      },
    ],
    [
      '@docusaurus/plugin-client-redirects',
      {
        fromExtensions: ['html'],
        redirects: [],
      },
    ],
    ...shared.plugins,
  ],
  scripts: shared.scripts,
};
