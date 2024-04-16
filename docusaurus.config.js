const path = require("path");

const docsContentPath = "src/content";

module.exports = {
  title: "Okteto Documentation",
  tagline: "Kubernetes for Developers",
  url: "https://www.okteto.com",
  baseUrl: "/docs/",
  trailingSlash: true,
  organizationName: "okteto", // Usually your GitHub org/user name.
  projectName: "okteto", // Usually your repo name.
  favicon: "img/favicon.ico",
  // onBrokenLinks: "throw",
  onBrokenLinks: "warn",
  // onBrokenAnchors: "throw",
  onBrokenMarkdownLinks: "throw",
  // onBrokenMarkdownLinks: "warn",
  onDuplicateRoutes: "warn",
  customFields: {
    image: "https://www.okteto.com/docs/okteto-meta-image.png",
  },
  themeConfig: {
    colorMode: {
      defaultMode: "light",
      disableSwitch: false,
    },
    tableOfContents: {
      maxHeadingLevel: 4,
    },
    prism: {
      theme: require("./src/theme/theme-okteto.js"),
    },
    algolia: {
      appId: "RS9BKUCQCT",
      apiKey: "ac5c1ba5f3d4e8eceb4ce860d568da39",
      indexName: "okteto",
      algoliaOptions: {},
      position: "left",
    },
    navbar: {
      hideOnScroll: false,
      logo: {
        alt: "Okteto Logo",
        src: "img/logo.svg",
        href: "https://www.okteto.com",
        target: "_self",
      },
      items: [
        {
          type: "search",
          position: "left",
        },
        {
          href: "https://www.okteto.com",
          label: "Product",
          position: "left",
          target: "_self",
        },
        {
          href: "https://www.okteto.com/blog/",
          label: "Blog",
          position: "left",
          target: "_self",
        },
        {
          href: "https://community.okteto.com",
          label: "Community",
          position: "left",
          target: "_self",
        },
        {
          type: "docsVersionDropdown",
          position: "right",
          dropdownActiveClassDisabled: true,
          dropdownItemsAfter: [
            {
              type: 'html',
              value: '<hr class="dropdown-separator">',
            },
            {
              to: "/archives",
              label: "Archives",
            },
            {
              to: "/release-notes",
              label: "Release Notes",
            },
          ],
        },
        {
          href: "https://www.okteto.com/free-trial",
          label: "Get Free Trial",
          position: "right",
          target: "_self",
          className: "Button teal GetFreeTrialButton",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Installation Guide",
              to: "/get-started/install",
            },
            {
              label: "Getting Started Guide",
              to: "/get-started/deploy-your-app",
            },
            {
              label: "Okteto Manifest",
              to: "/core/okteto-manifest",
            },
            {
              label: "Okteto CLI Reference",
              to: "/reference/okteto-cli"
            },
            {
              label: "Release Notes",
              to: "/release-notes"
            }
          ],
        },
        {
          title: "Resources",
          items: [
            {
              label: "Blog",
              href: "https://www.okteto.com/blog/",
              target: "_self",
            },
            {
              label: "Community",
              href: "https://community.okteto.com",
              target: "_self",
            },
            {
              label: "GitHub",
              href: "https://github.com/okteto/okteto",
            },
            {
              label: "YouTube",
              href: "https://www.youtube.com/@OktetoHQ",
            },
            {
              label: "Pricing",
              href: "https://www.okteto.com/pricing",
              target: "_self",
            },
          ],
        },
        {
          title: "Contact Us",
          items: [
            {
              label: "hello@okteto.com",
              href: "mailto:hello@okteto.com",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/oktetohq",
            },
            {
              label: "Get 30 Days Free",
              href: "https://www.okteto.com/free-trial",
            }
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Okteto, Inc.`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          path: docsContentPath,
          routeBasePath: "/",
          editUrl: "https://github.com/okteto/docs/edit/main",
          breadcrumbs: false,
          sidebarPath: require.resolve("./sidebars.js"),
          lastVersion: "1.19",
          versions: {
            current: {
              // aka unreleased version in development
              // Remember to also update "unreleased" redirect if changing the value!
              label: "1.20",
              path: "1.20",
            },
            1.19: {
              // aka latest/official version
              // Remember to also update docs root redirect if changing the value!
              label: "1.19",
              path: "/",
              banner: "none",
            },
            1.18: {
              label: "1.18",
              path: "1.18",
              banner: "unmaintained",
            },
            1.17: {
              label: "1.17",
              path: "1.17",
              banner: "unmaintained",
            },
            1.16: {
              label: "1.16",
              path: "1.16",
              banner: "unmaintained",
            },
            1.15: {
              label: "1.15",
              path: "1.15",
              banner: "unmaintained",
            },
            1.14: {
              label: "1.14",
              path: "1.14",
              banner: "unmaintained",
            },
            1.13: {
              label: "1.13",
              path: "1.13",
              banner: "unmaintained",
            },
            1.12: {
              label: "1.12",
              path: "1.12",
              banner: "unmaintained",
            },
            1.11: {
              label: "1.11",
              path: "1.11",
              banner: "unmaintained",
            },
          },
          include: ["**/*.md", "**/*.mdx"],
        },
        theme: {
          customCss: require.resolve("./src/styles/main.scss"),
        },
        googleAnalytics: {
          trackingID: "UA-120828135-1",
          anonymizeIP: true,
        },
        gtag: {
          trackingID: "G-KSKZWJHTJZ",
          anonymizeIP: true,
        },
      },
    ],
  ],
  plugins: [
    "docusaurus-plugin-sass",
    [
      "docusaurus-plugin-copy",
      {
        include: ["**/*.{png,jpg,jpeg,svg,yaml,yml}"],
        path: docsContentPath,
        context: docsContentPath,
      },
    ],
    [
      "@docusaurus/plugin-client-redirects",
      {
        fromExtensions: ["html"],
        redirects: [],
      },
    ],
    [
      "docusaurus-gtm-plugin",
      {
        id: "GTM-W6RQFNT",
      },
    ],
  ],
  scripts: ["//js.hs-scripts.com/5418301.js"],
};
