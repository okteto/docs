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
        'agentic-workflows',
        'preview-environments',
        'agent-ticket-to-pr',
        'aws-lambda',
        'compose-getting-started',
        'helm',
        'cloud-infrastructure',
        'webpack',
        'optimize-your-development-environment',
        'create-and-use-volume-snapshots',
      ],
    },
    {
      type: 'link',
      label: 'Community forum',
      href: 'https://community.okteto.com/',
    },
  ],
};
