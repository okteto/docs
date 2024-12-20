/**
 * Copyright (c) 2019-present, Okteto, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  docs: [
    {
      type: 'link',
      label: 'Documentation',
      href: '/docs',
    },
    {
      type: 'category',
      label: 'Tutorials',
      className: 'sidebarCategoryHideLinks',
      collapsed: false,
      link: {
        type: 'doc',
        id: 'index',
      },
      items: [
        'getting-started-with-okteto',
        'aws-lambda',
        'compose-getting-started',
        'external-resources',
        'webpack',
        'using-launchdarkly-and-okteto-to-automate-modern-feature-flag-management',
        'using-github-actions-and-okteto-cloud-to-preview-changes',
      ],
    },
    {
      type: 'link',
      label: 'Community forum',
      href: 'https://community.okteto.com/',
    },
  ],
};
