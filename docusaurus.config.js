const path = require('path');

const docsContentPath = 'src/content';

module.exports = {
  title: 'Okteto Documentation',
  tagline: 'Kubernetes for Developers',
  url: 'https://www.okteto.com',
  baseUrl: '/docs/',
  trailingSlash: true,
  organizationName: 'okteto', // Usually your GitHub org/user name.
  projectName: 'okteto', // Usually your repo name.
  favicon: 'img/favicon.ico',
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  onBrokenMarkdownLinks: 'throw',
  onDuplicateRoutes: 'warn',
  customFields: {
    image: 'https://www.okteto.com/docs/okteto-meta-image.png',
  },
  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'apple-touch-icon',
        size: '180x180',
        href: '/docs/favicon/apple-touch-icon.png',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        size: '32x32',
        href: '/docs/favicon/favicon-32x32.png',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'icon',
        type: 'image/png',
        size: '16x16',
        href: '/docs/favicon/favicon-16x16.png',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'manifest',
        href: '/docs/favicon/site.webmanifest',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'mask-icon',
        href: '/docs/favicon/safari-pinned-tab.svg',
        color: '#00d1ca',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'msapplication-TileColor',
        content: '#da532c',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'theme-color',
        content: '#fff',
      },
    },
  ],
  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
    },
    tableOfContents: {
      maxHeadingLevel: 4,
    },
    prism: {
      theme: require('./src/theme/theme-okteto.js'),
    },
    algolia: {
      appId: 'RS9BKUCQCT',
      apiKey: 'ac5c1ba5f3d4e8eceb4ce860d568da39',
      indexName: 'okteto',
      algoliaOptions: {},
      position: 'left',
    },
    navbar: {
      hideOnScroll: false,
      logo: {
        alt: 'Okteto Logo',
        src: 'img/logo.svg',
        href: 'https://www.okteto.com',
        target: '_self',
      },
      items: [
        {
          type: 'search',
          position: 'left',
        },
        {
          href: 'https://www.okteto.com',
          label: 'Product',
          position: 'left',
          target: '_self',
        },
        {
          href: 'https://www.okteto.com/blog/',
          label: 'Blog',
          position: 'left',
          target: '_self',
        },
        {
          href: 'https://community.okteto.com',
          label: 'Community',
          position: 'left',
          target: '_self',
        },
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
        {
          href: 'https://www.okteto.com/free-trial',
          label: 'Get Free Trial',
          position: 'right',
          target: '_self',
          className: 'Button teal GetFreeTrialButton',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Installation Guide',
              to: '/get-started/install',
            },
            {
              label: 'Getting Started Guide',
              to: '/get-started/deploy-your-app',
            },
            {
              label: 'Okteto Manifest',
              to: '/core/okteto-manifest',
            },
            {
              label: 'Okteto CLI Reference',
              to: '/reference/okteto-cli',
            },
            {
              label: 'Release Notes',
              to: '/release-notes',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Blog',
              href: 'https://www.okteto.com/blog/',
              target: '_self',
            },
            {
              label: 'Community',
              href: 'https://community.okteto.com',
              target: '_self',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/okteto/okteto',
            },
            {
              label: 'YouTube',
              href: 'https://www.youtube.com/@OktetoHQ',
            },
            {
              label: 'Pricing',
              href: 'https://www.okteto.com/pricing',
              target: '_self',
            },
          ],
        },
        {
          title: 'Contact Us',
          items: [
            {
              label: 'hello@okteto.com',
              href: 'mailto:hello@okteto.com',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/oktetohq',
            },
            {
              label: 'Get 30 Days Free',
              href: 'https://www.okteto.com/free-trial',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Okteto, Inc.`,
    },
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
          lastVersion: '1.24',
          versions: {
            current: {
              // aka unreleased version in development
              // Remember to also update "unreleased" redirect if changing the value!
              label: '1.25',
              path: '1.25',
            },
            1.22: {
              // aka latest/official version
              // Remember to also update docs root redirect if changing the value!
              label: '1.24',
              path: '/',
              banner: 'none',
            },
            1.23: {
              label: '1.23',
              path: '1.23',
              banner: 'unmaintained',
            },
            1.22: {
              label: '1.22',
              path: '1.22',
              banner: 'unmaintained',
            },
            1.21: {
              label: '1.21',
              path: '1.21',
              banner: 'unmaintained',
            },
            '1.20': {
              label: '1.20',
              path: '1.20',
              banner: 'unmaintained',
            },
            1.19: {
              label: '1.19',
              path: '1.19',
              banner: 'unmaintained',
            },
          },
          include: ['**/*.md', '**/*.mdx'],
        },
        theme: {
          customCss: require.resolve('./src/styles/main.scss'),
        },
        googleAnalytics: {
          trackingID: 'UA-120828135-1',
          anonymizeIP: true,
        },
        gtag: {
          trackingID: 'G-KSKZWJHTJZ',
          anonymizeIP: true,
        },
      },
    ],
  ],
  plugins: [
    'docusaurus-plugin-sass',
    [
      'docusaurus-plugin-copy',
      {
        include: ['**/*.{png,jpg,jpeg,svg,yaml,yml}'],
        path: docsContentPath,
        context: docsContentPath,
      },
    ],
    [
      '@docusaurus/plugin-client-redirects',
      {
        fromExtensions: ['html'],
        redirects: [],
      },
    ],
    [
      'docusaurus-gtm-plugin',
      {
        id: 'GTM-W6RQFNT',
      },
    ],
  ],
  scripts: ['//js.hs-scripts.com/5418301.js'],
};
