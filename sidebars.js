/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  docs: {
    'Okteto CLI': [
      'getting-started/installation',
      'reference/cli',
      'reference/manifest',
      'reference/stacks',
      'reference/development-environment',
      'reference/file-synchronization',
      'reference/ssh-server',
      'reference/faqs',
      'reference/known-issues',
    ],
    'Okteto Cloud': [
      'cloud',
      'getting-started',
      {
        "type": "category",
        "label": "Deploy Methods",
        "items": [
          {
            "type": "category",
            "label": "Deploy from Git",
            "items": [
              'cloud/deploy-from-git',
              'cloud/okteto-pipeline',
              'cloud/secrets',
              'cloud/develop-on-okteto-button',
              'cloud/private-repositories',
            ]
          },
          'cloud/deploy-from-helm',
          'cloud/deploy-from-terminal',
        ]
      },
      {
        "type": "category",
        "label": "Preview Environments",
        "items": [
          'cloud/preview-environments/preview-environments',
          'cloud/preview-environments/preview-environments-github',
          'cloud/preview-environments/preview-environments-gitlab',
        ]
      },
      'cloud/ssl',
      'cloud/private-endpoints',
      'cloud/custom-domains',
      'cloud/build',
      'cloud/registry',
      'cloud/namespaces',
      'cloud/multitenancy',
      'cloud/credentials',
      'cloud/github-actions',
      'cloud/personal-access-tokens',
    ],
    'Okteto Enterprise': [
      'enterprise',
      {
        "type": "category",
        "label": "Installation",
        "items": [
          'enterprise/install/overview',
          'enterprise/install/preparation',
          'enterprise/install/deployment',
          'enterprise/install/upgrade',
          'enterprise/install/troubleshooting',
          'enterprise/install/releases',
        ]
      },
      {
        "type": "category",
        "label": "Administration",
        "items": [
          'enterprise/administration/dashboard',
          'enterprise/administration/certificates',
          'enterprise/administration/configuration',
          'enterprise/administration/cleanup',
          {
            "type": "category",
            "label": "Private Repositories",
            "items": [
              'enterprise/administration/private-repositories/github-app',
              'enterprise/administration/private-repositories/ssh-key',
            ]
          },
          'enterprise/administration/volume-snapshots',
        ]
      },
    ],
    'Tutorials': [
      'tutorials/getting-started-with-pipelines',
      'tutorials/getting-started-with-divert',
      'tutorials/repos',
      'tutorials/stacks-getting-started',
      'tutorials/preview-environments',
      'tutorials/webpack'
    ],
    'Samples': [
      'samples/aspnetcore',
      'samples/golang',
      'samples/java',
      'samples/node',
      'samples/php',
      'samples/python',
      'samples/ruby',
      'samples/more'
    ],
    'Use Cases': [
      'use-cases/ephemeral-development-environments',
      'use-cases/sharable-preview-environments',
      'use-cases/docker-compose',
      'use-cases/speed-up-computer',
      'use-cases/hot-reloading',
      'use-cases/divert',
      'use-cases/okteto-cli-without-account',
      'use-cases/kubernetes-without-devops',
      'use-cases/test-environments',
      'use-cases/sales-team-demos',
    ]
  },
};
