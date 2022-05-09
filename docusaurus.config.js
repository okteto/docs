const path = require('path');

const docsContentPath = 'src/content';

module.exports = {
  title: 'Okteto Documentation',
  tagline: 'Kubernetes for Developers',
  url: 'https://okteto.com',
  baseUrl: '/docs/',
  trailingSlash: true,
  organizationName: 'okteto', // Usually your GitHub org/user name.
  projectName: 'okteto', // Usually your repo name.
  favicon: 'img/favicon.ico',
  onBrokenLinks: 'error',
  onDuplicateRoutes: 'warn',
  customFields: {
    image: 'https://okteto.com/docs/okteto-meta-image.png'
  },
  themeConfig: {
    colorMode: {
      defaultMode: 'light',
      disableSwitch: true
    },
    tableOfContents: {
      maxHeadingLevel: 4,
    },
    prism: {
      theme: require('./src/theme/CodeBlock/theme-okteto.js'),
    },
    algolia: {
      appId: 'RS9BKUCQCT',
      apiKey: 'ac5c1ba5f3d4e8eceb4ce860d568da39',
      indexName: 'okteto',
      algoliaOptions: {}
    },
    navbar: {
      title: 'Okteto',
      hideOnScroll: false,
      logo: {
        alt: 'Okteto Logo',
        src: 'img/logo.svg',
        href: 'https://okteto.com',
        target: '_self'
      },
      items: [
        {
          type: 'docsVersionDropdown',
          position: 'left',
          dropdownActiveClassDisabled: true,
        },
        {
          to: 'getting-started/',
          activeBasePath: 'nothing',
          label: 'Documentation',
          position: 'right',
        },
        {
          href: 'https://okteto.com/pricing/',
          label: 'Pricing',
          position: 'right',
          target: '_self'
        },
        {
          href: 'https://okteto.com/blog/',
          label: 'Blog',
          position: 'right',
          target: '_self'
        },
        {
          href: 'https://kubernetes.slack.com/?redir=%2Fmessages%2FCM1QMQGS0%2F',
          label: 'Slack',
          position: 'right',
        },
        {
          href: 'https://github.com/okteto/okteto',
          label: 'GitHub',
          position: 'right',
        }
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started Guide',
              to: 'getting-started/',
            },
            {
              label: 'Samples',
              to: 'samples/golang/',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Blog',
              href: 'https://okteto.com/blog/',
              target: '_self'
            },
            {
              label: 'Community',
              href: 'https://community.okteto.com',
              target: '_self'
            },
            {
              label: 'GitHub',
              href: 'https://github.com/okteto/okteto',
            },
            {
              label: 'Pricing',
              href: 'https://okteto.com/pricing',
              target: '_self'
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
          breadcrumbs: false,
          sidebarPath: require.resolve('./sidebars.js'),
          lastVersion: 'current',
          versions: {
            current: {
              label: 'Current',
              path: '/',
            },
            '0.10': {
              label: 'OE 0.10',
              path: '0.10',
              banner: 'none',
            },
          },
          include: [
            '**/*.md',
            '**/*.mdx'
          ]
        },
        theme: {
          customCss: require.resolve('./src/styles/main.scss')
        },
        googleAnalytics: {
          trackingID: 'UA-120828135-1',
          anonymizeIP: true
        },
        gtag: {
          trackingID: 'G-KSKZWJHTJZ',
          anonymizeIP: true
        },
      }
    ]
  ],
  plugins: [
    'docusaurus-plugin-sass',
    ['docusaurus-plugin-copy', {
      include: ['**/*.{png,jpg,jpeg,svg,yaml,yml}'],
      path: docsContentPath,
      context: docsContentPath
    }],
    ['@docusaurus/plugin-client-redirects', {
      fromExtensions: ['html'],
      redirects: [{
        to: '/welcome/overview/',
        from: ['/']
      }, {
        to: '/enterprise/install/overview/',
        from: ['/enterprise/dns/']
      }, {
        to: '/tutorials/compose-getting-started/',
        from: ['/tutorials/stacks-getting-started/']
      },
      {
        to: '/reference/compose/',
        from: ['/reference/stacks/']
      }]
    }],
    ['docusaurus-gtm-plugin', {
      id: 'GTM-W6RQFNT'
    }]
  ],
  scripts: [
    '//js.hs-scripts.com/5418301.js'
  ]
};
