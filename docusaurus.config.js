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
  onDuplicateRoutes: 'warn',
  customFields: {
    image: 'https://www.okteto.com/docs/okteto-meta-image.png'
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
      algoliaOptions: {},
      position: 'left',
    },
    navbar: {
      title: 'Okteto',
      hideOnScroll: false,
      logo: {
        alt: 'Okteto Logo',
        src: 'img/logo.svg',
        href: 'https://www.okteto.com',
        target: '_self'
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
          target: '_self'
        },
        {
          href: 'https://www.okteto.com/blog/',
          label: 'Blog',
          position: 'left',
          target: '_self'
        },
        {
          href: 'https://community.okteto.com',
          label: 'Community',
          position: 'left',
          target: '_self'
        },
        {
          type: 'docsVersionDropdown',
          position: 'right',
          dropdownActiveClassDisabled: true,
          dropdownItemsAfter: [
            {
              to: '/archives',
              label: 'Archives'
            }
          ],
        },
        {
          href: 'https://www.okteto.com/free-trial',
          label: 'Get Free Trial',
          position: 'right',
          target: '_self',
          className: "Button teal"
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
              href: 'https://www.okteto.com/blog/',
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
              href: 'https://www.okteto.com/pricing',
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
          lastVersion: '1.4',
          versions: {
            current: {
              label: '1.5 (not yet released)',
            }
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
        to: '/self-hosted/install/overview/',
        from: ['/enterprise/dns/']
      }, {
        to: '/tutorials/compose-getting-started/',
        from: ['/tutorials/stacks-getting-started/']
      },
      {
        to: '/reference/compose/',
        from: ['/reference/stacks/']
      },
      {
        to: '/administration/dashboard/',
        from: ['/enterprise/administration/dashboard/']
      },
      {
        to: '/administration/cleanup/',
        from: ['/enterprise/administration/cleanup/']
      },
      {
        to: '/administration/private-repositories/github-app/',
        from: ['/enterprise/administration/private-repositories/github-app/']
      },
      {
        to: '/administration/private-repositories/ssh-key/',
        from: ['/enterprise/administration/private-repositories/ssh-key/']
      },
      {
        to: '/welcome/overview/',
        from: ['/cloud/']
      },
      {
        to: '/cloud/starter-plan/',
        from: ['/cloud/developer-plan/']
      }
    ]
    }],
    ['docusaurus-gtm-plugin', {
      id: 'GTM-W6RQFNT'
    }]
  ],
  scripts: [
    '//js.hs-scripts.com/5418301.js'
  ]
};
