// Configuration shared by the two Docusaurus sites built from this repo:
//
//   docusaurus.config.js       -> https://www.okteto.com/docs/
//   docusaurus.blog.config.js  -> https://www.okteto.com/blog/
//
// Docusaurus applies `baseUrl` to the whole site, so serving /docs/ and /blog/
// from one repo means two builds. Everything that should look and behave the
// same on both (identity, navbar, footer, analytics, styles) lives here, and
// each config only adds what is specific to it.

const SITE_URL = 'https://www.okteto.com';

// Links between the two sites are root-relative (/docs/..., /blog/...), so
// they stay on whatever host serves the page: production, a Netlify deploy
// preview or an Okteto preview environment. Two switches make Docusaurus
// emit them as plain links: `autoAddBaseUrl: false` stops it from prefixing
// the current site's baseUrl (/docs/blog/), and `pathname://` makes it a full
// page load instead of a client-side route the current site doesn't have.
// Inside the current site, links use `to` so they go through the router.
function linkTo(site, target, path, label) {
  if (site === target) return { label, to: path };
  // Both sites use trailing slashes; without one the link costs a redirect.
  const withSlash = path.endsWith('/') ? path : `${path}/`;
  return { label, href: `pathname:///${target}${withSlash}`, autoAddBaseUrl: false, target: '_self' };
}

const siteConfig = {
  url: SITE_URL,
  trailingSlash: true,
  organizationName: 'okteto',
  projectName: 'okteto',
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  onDuplicateRoutes: 'warn',
};

// shared/static holds the fonts, favicons and logo. Both sites include it, so
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
      { href: SITE_URL, label: 'Product', position: 'left', target: '_self' },
      { ...linkTo(site, 'docs', '/', 'Docs'), position: 'left' },
      { ...linkTo(site, 'blog', '/', 'Blog'), position: 'left' },
      { href: 'https://community.okteto.com', label: 'Community', position: 'left', target: '_self' },
      ...end,
      {
        href: `${SITE_URL}/free-trial`,
        label: 'Get Started',
        position: 'right',
        target: '_self',
        className: 'Button teal GetFreeTrialButton',
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
          { label: 'Get 30 Days Free', href: `${SITE_URL}/free-trial` },
        ],
      },
    ],
    copyright: `Copyright © ${new Date().getFullYear()} Okteto, Inc.`,
  };
}

// Algolia search. One index holds both sites: the crawler adds a
// `docusaurus_tag` to every record (`docs-default-<version>` on docs pages,
// `default` on blog posts), and Docusaurus's contextual search filters on it,
// so the docs search box returns docs and the blog's returns blog posts.
const algolia = {
  appId: 'RS9BKUCQCT',
  apiKey: '9213a8b24b30e1994c4c8ff5f282cf6f',
  indexName: 'okteto',
  algoliaOptions: {},
  position: 'left',
};

// Navbar item for the search box, placed first on both sites.
const searchNavbarItem = { type: 'search', position: 'left' };

const themeConfig = {
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
  [
    'posthog-docusaurus',
    {
      apiKey: 'phc_hABE2tLx6OC3RdADvVeFYfwtQQhYSE5swoqkQQscU6K',
      appUrl: 'https://us.i.posthog.com', // optional, defaults to "https://us.i.posthog.com"
      enableInDevelopment: false, // optional
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
