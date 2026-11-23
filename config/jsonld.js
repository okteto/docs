// JSON-LD entities shared by the sites built from this repo: who publishes
// them (Organization) and the product they document (SoftwareApplication).
// Each site puts them in the site-level graph in its <head>, next to a WebSite
// entity of its own (see siteJsonLd below), so answer engines and search read
// the publisher and product identity instead of inferring it.
//
// The @id values are the identity: they must be the same, character for
// character, on every site and in every page-level block that references them
// (src/theme/DocItem/Metadata). Change them here only.

const { SITE_URL, SITES } = require('./shared');

const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const PRODUCT_ID = `${SITE_URL}/#product`;

const organization = {
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: 'Okteto, Inc.',
  url: `${SITE_URL}/`,
  description: 'Okteto runs coding agents and application environments on your Kubernetes infrastructure.',
  logo: {
    '@type': 'ImageObject',
    '@id': `${SITE_URL}/#logo`,
    // Google requires a raster logo (no SVG), at least 112x112 px.
    url: `${SITE_URL}${SITES.docs}favicon/android-chrome-512x512.png`,
    width: 512,
    height: 512,
  },
  sameAs: [
    'https://github.com/okteto/okteto',
    'https://twitter.com/oktetohq',
    'https://www.youtube.com/@OktetoHQ',
    'https://www.linkedin.com/company/okteto',
  ],
};

const product = {
  '@type': 'SoftwareApplication',
  '@id': PRODUCT_ID,
  name: 'Okteto Platform',
  description:
    'Okteto launches coding agents on your Kubernetes cluster and gives every developer, coding agent and pull request an on-demand application environment, built from a single definition.',
  url: `${SITE_URL}/`,
  applicationCategory: 'DeveloperApplication',
  publisher: { '@id': ORGANIZATION_ID },
};

// The site-level graph of one site: the Organization, the site itself
// (WebSite) and the product. `baseUrl` is the site's base URL (SITES.docs,
// SITES.tutorials), and `name` its title.
function siteJsonLd({ baseUrl, name }) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization,
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}${baseUrl}#website`,
        url: `${SITE_URL}${baseUrl}`,
        name,
        publisher: { '@id': ORGANIZATION_ID },
        inLanguage: 'en-US',
      },
      product,
    ],
  };
}

// The <head> tag that renders a site's graph, for the site's `headTags`.
// Rendered at build time, so crawlers that don't run JavaScript read it too.
function siteJsonLdHeadTag(site) {
  return {
    tagName: 'script',
    attributes: { type: 'application/ld+json' },
    innerHTML: JSON.stringify(siteJsonLd(site)),
  };
}

module.exports = {
  siteJsonLd,
  siteJsonLdHeadTag,
};
