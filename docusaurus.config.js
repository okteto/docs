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
          lastVersion: '1.28',
          versions: {
            current: {
              // aka unreleased version in development
              // Remember to also update "unreleased" redirect if changing the value!
              label: '1.29',
              path: '1.29',
            },
            1.28: {
              // aka latest/official version
              // Remember to also update docs root redirect if changing the value!
              label: '1.28',
              path: '/',
              banner: 'none',
            },
            1.27: {
              label: '1.27',
              path: '1.27',
              banner: 'unmaintained',
            },
            1.26: {
              label: '1.26',
              path: '1.26',
              banner: 'unmaintained',
            },
            1.25: {
              label: '1.25',
              path: '1.25',
              banner: 'unmaintained',
            },
            1.24: {
              label: '1.24',
              path: '1.24',
              banner: 'unmaintained',
            },
            1.23: {
              label: '1.23',
              path: '1.23',
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
  scripts: [
    // Hubspot script
    {
      src: '//js.hs-scripts.com/5418301.js',
      async: true,
    },
    // Scarf Tracking Pixel
    {
      src: 'https://static.scarf.sh/a.png?x-pxid=3d66f625-f39a-46bd-8d3c-82d5f7ca6f16',
      referrerPolicy: 'no-referrer-when-downgrade',
      async: true,
    },
  ],
};
