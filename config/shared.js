// Configuration shared by the three Docusaurus sites built from this repo:
//
//   docusaurus.config.js            -> https://www.okteto.com/docs/
//   docusaurus.tutorials.config.js  -> https://www.okteto.com/tutorials/
//   docusaurus.blog.config.js       -> https://www.okteto.com/blog/
//
// Docusaurus applies `baseUrl` to the whole site, so serving them from one
// repo means one build each. Everything that should look and behave the same
// on all of them (identity, navbar, footer, analytics, styles) lives here, and
// each config only adds what is specific to it.

const SITE_URL = 'https://www.okteto.com';

// The base URL of each site.
const SITES = {
  docs: '/docs/',
  tutorials: '/tutorials/',
  blog: '/blog/',
};

function siteOf(path) {
  const withSlash = path.endsWith('/') ? path : `${path}/`;
  return Object.keys(SITES).find((site) => withSlash.startsWith(SITES[site]));
}

// Links between the sites are root-relative (/docs/..., /blog/...), so they
// stay on whatever host serves the page: production, a Netlify deploy preview
// or an Okteto preview environment. Two switches make Docusaurus emit them as
// plain links: `autoAddBaseUrl: false` stops it from prefixing the current
// site's baseUrl (/docs/blog/), and `pathname://` makes it a full page load
// instead of a client-side route the current site doesn't have. Inside the
// current site, links use `to` so they go through the router.
function linkTo(site, target, path, label) {
  if (site === target) return { label, to: path };
  // The sites use trailing slashes; without one the link costs a redirect.
  const withSlash = path.endsWith('/') ? path : `${path}/`;
  return { label, href: `pathname://${SITES[target]}${withSlash.replace(/^\//, '')}`, autoAddBaseUrl: false, target: '_self' };
}

// Remark plugin for the Markdown of a site: a root-relative link to a page of
// another site (in the docs, `/tutorials/helm/`; in a tutorial,
// `/docs/reference/okteto-cli/`) becomes the same plain link as linkTo above,
// written as `<a href="pathname://..." autoAddBaseUrl={false} target="_self">`.
// Without it, Docusaurus looks for the page among the routes of the current
// site and fails the build, or prefixes the link with the current site's
// baseUrl (/tutorials/docs/...). The build doesn't check these links.
const FALSE = {
  type: 'mdxJsxAttributeValueExpression',
  value: 'false',
  data: {
    estree: {
      type: 'Program',
      sourceType: 'module',
      body: [{ type: 'ExpressionStatement', expression: { type: 'Literal', value: false, raw: 'false' } }],
    },
  },
};

function remarkCrossSiteLinks(site) {
  const attribute = (name, value) => ({ type: 'mdxJsxAttribute', name, value });
  const walk = (node) => {
    (node.children || []).forEach((child, i) => {
      if (child.type === 'link' && typeof child.url === 'string' && child.url.startsWith('/')) {
        const target = siteOf(child.url.split(/[?#]/)[0]);
        if (target && target !== site) {
          node.children[i] = {
            type: 'mdxJsxTextElement',
            name: 'a',
            attributes: [
              attribute('href', `pathname://${child.url}`),
              attribute('autoAddBaseUrl', FALSE),
              attribute('target', '_self'),
            ],
            children: child.children,
            position: child.position,
          };
        }
      }
      walk(node.children[i]);
    });
  };
  return () => (tree) => walk(tree);
}

const siteConfig = {
  url: SITE_URL,
  trailingSlash: true,
  organizationName: 'okteto',
  projectName: 'okteto',
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  onDuplicateRoutes: 'warn',
  clientModules: [require.resolve('../src/clientModules/mixpanel.js'), require.resolve('../src/clientModules/pageHistory.js')],
  // Docusaurus Faster (@docusaurus/faster): Rspack, SWC and Lightning CSS
  // instead of Webpack, Babel and Terser, and static pages rendered in
  // worker threads. The worker threads need the v4 flag below; no plugin
  // here reads the legacy `head` prop in postBuild.
  future: {
    faster: true,
    v4: {
      removeLegacyPostBuildHeadAttribute: true,
    },
  },
};

// shared/static holds the fonts, favicons and logo. Every site includes it, so
// /docs/fonts/... and /blog/fonts/... resolve from the same files.
const staticDirectories = (own) => [own, 'shared/static'];

function headTags(baseUrl) {
  const favicon = (file) => `${baseUrl}favicon/${file}`;
  return [
    { tagName: 'link', attributes: { rel: 'apple-touch-icon', size: '180x180', href: favicon('apple-touch-icon.png') } },
    { tagName: 'link', attributes: { rel: 'icon', type: 'image/png', size: '32x32', href: favicon('favicon-32x32.png') } },
    { tagName: 'link', attributes: { rel: 'icon', type: 'image/png', size: '16x16', href: favicon('favicon-16x16.png') } },
    { tagName: 'link', attributes: { rel: 'manifest', href: favicon('site.webmanifest') } },
    { tagName: 'link', attributes: { rel: 'mask-icon', href: favicon('safari-pinned-tab.svg'), color: '#00d1ca' } },
    { tagName: 'meta', attributes: { name: 'msapplication-TileColor', content: '#da532c' } },
    { tagName: 'meta', attributes: { name: 'theme-color', content: '#fff' } },
  ];
}

// `start` and `end` let a site add its own items (search, version dropdown)
// around the shared ones.
function navbar(site, { start = [], end = [] } = {}) {
  return {
    hideOnScroll: false,
    logo: {
      alt: 'Okteto Logo',
      src: 'img/logo.svg',
      href: SITE_URL,
      target: '_self',
    },
    items: [
      ...start,
      { ...linkTo(site, 'docs', '/', 'Docs'), position: 'left' },
      { ...linkTo(site, 'tutorials', '/', 'Tutorials'), position: 'left' },
      { ...linkTo(site, 'blog', '/', 'Blog'), position: 'left' },
      { href: 'https://community.okteto.com', label: 'Community', position: 'left', target: '_self' },
      ...end,
      // The two calls to action of okteto.com, in the same order and style.
      {
        href: `${SITE_URL}/get-demo/`,
        label: 'Get a demo',
        position: 'right',
        target: '_self',
        className: 'Button teal NavbarButton',
      },
      {
        href: `${SITE_URL}/free-tier/`,
        label: 'Start for Free',
        position: 'right',
        target: '_self',
        className: 'Button light NavbarButton',
      },
    ],
  };
}

function footer(site, { llmsTxtUrl }) {
  return {
    style: 'dark',
    links: [
      {
        title: 'Docs',
        items: [
          linkTo(site, 'docs', '/get-started/install', 'Installation Guide'),
          linkTo(site, 'docs', '/get-started/deploy-your-app', 'Getting Started Guide'),
          linkTo(site, 'docs', '/core/okteto-manifest', 'Okteto Manifest'),
          linkTo(site, 'docs', '/reference/okteto-cli', 'Okteto CLI Reference'),
          linkTo(site, 'docs', '/release-notes', 'Release Notes'),
        ],
      },
      {
        title: 'Resources',
        items: [
          linkTo(site, 'tutorials', '/', 'Tutorials'),
          linkTo(site, 'blog', '/', 'Blog'),
          { label: 'GitHub', href: 'https://github.com/okteto/okteto' },
          { label: 'YouTube', href: 'https://www.youtube.com/@OktetoHQ' },
          { label: 'Pricing', href: `${SITE_URL}/pricing`, target: '_self' },
          { label: 'llms.txt', href: llmsTxtUrl, target: '_self' },
        ],
      },
      {
        title: 'Contact Us',
        items: [
          { label: 'Support', href: 'https://okteto.com/support' },
          { label: 'Community', href: 'https://community.okteto.com' },
          { label: 'Twitter', href: 'https://twitter.com/oktetohq' },
          { label: 'Start for Free', href: `${SITE_URL}/free-tier/` },
        ],
      },
    ],
    copyright: `Copyright © ${new Date().getFullYear()} Okteto, Inc.`,
  };
}

// Algolia search. One index holds the three sites: the crawler adds a
// `docusaurus_tag` to every record (`docs-default-<version>` on docs pages,
// `tutorials` on tutorials, `default` on blog posts), and each search box
// filters on it, so the docs search box returns docs, the tutorials' returns
// tutorials and the blog's returns blog posts.
const algolia = {
  appId: 'RS9BKUCQCT',
  apiKey: '9213a8b24b30e1994c4c8ff5f282cf6f',
  indexName: 'okteto',
  algoliaOptions: {},
  position: 'left',
};

// Navbar item for the search box, placed first on every site.
const searchNavbarItem = { type: 'search', position: 'left' };

const themeConfig = {
  // Default og:image / twitter:image for pages without their own (docs
  // pages, blog index, tag and author pages, posts with no featured image).
  // The website's social card, so links unfurl the same across okteto.com.
  image: `${SITE_URL}/okteto-meta-image.png`,
  colorMode: {
    defaultMode: 'light',
    disableSwitch: false,
  },
  prism: {
    theme: require('../src/theme/theme-okteto.js'),
  },
};

// Options for @docusaurus/preset-classic that every site sets.
const presetOptions = {
  theme: {
    customCss: require.resolve('../src/styles/main.scss'),
  },
  googleAnalytics: {
    trackingID: 'UA-120828135-1',
    anonymizeIP: true,
  },
  gtag: {
    trackingID: 'G-KSKZWJHTJZ',
    anonymizeIP: true,
  },
};

const plugins = [
  'docusaurus-plugin-sass',
  [
    'docusaurus-gtm-plugin',
    {
      id: 'GTM-W6RQFNT',
    },
  ],
];

const scripts = [
  // Hubspot script
  {
    src: '//js.hs-scripts.com/5418301.js',
    async: true,
  },
];

module.exports = {
  SITE_URL,
  SITES,
  remarkCrossSiteLinks,
  siteConfig,
  staticDirectories,
  headTags,
  navbar,
  footer,
  themeConfig,
  algolia,
  searchNavbarItem,
  presetOptions,
  plugins,
  scripts,
};
