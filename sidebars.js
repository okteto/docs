/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

 module.exports = {
  docs: {
    'Welcome': [
      'welcome/overview',
      'getting-started',
    ],
    'Dev Environments': [
      'reference/development-environments',
      'cloud/okteto-cli',
      'cloud',
      {
        "type": "category",
        "label": "Deploying",
        "items": [
          'cloud/deploy-from-git',
          // 'cloud/develop-on-okteto-button',
          'cloud/private-repositories',
          'cloud/deploy-from-helm',
          // 'cloud/deploy-from-terminal',
        ]
      },
      'cloud/secrets',
      {
        "type": "category",
        "label": "Exposing Your Application",
        "items": [
          'cloud/ssl',
          'cloud/private-endpoints',
          'cloud/custom-domains',
        ]
      },
      'cloud/build',
      'cloud/registry',
      'cloud/namespaces',
      'cloud/credentials',
      'cloud/personal-access-tokens',
      // 'cloud/multitenancy',
      'reference/file-synchronization',
      'reference/ssh-server',
    ],
    'Preview Environments': [
      'cloud/preview-environments/preview-environments',
      'cloud/preview-environments/preview-environments-github',
      'cloud/preview-environments/preview-environments-gitlab',
      // 'cloud/github-actions',
    ],
    'Okteto Self-Hosted': [
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
    'References': [
      {
        "type": "category",
        "label": "Okteto CLI",
        "items": [
          'reference/cli-v1',
          'reference/cli',
        ]
      },
      {
        "type": "category",
        "label": "Manifest Reference",
        "items": [
          'reference/manifest-v1',
          'reference/manifest',
        ]
      },
      'reference/compose',
      'reference/faqs',
      'reference/known-issues',
    ],
    'Tutorials': [
      'tutorials/getting-started-with-okteto',
      'tutorials/compose-getting-started',
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
    ]
    // 'Use Cases': [
    //   'use-cases/ephemeral-development-environments',
    //   'use-cases/sharable-preview-environments',
    //   'use-cases/docker-compose',
    //   'use-cases/speed-up-computer',
    //   'use-cases/hot-reloading',
    //   'use-cases/divert',
    //   'use-cases/okteto-cli-without-account',
    //   'use-cases/kubernetes-without-devops',
    //   'use-cases/test-environments',
    //   'use-cases/sales-team-demos',
    // ]
  },
};