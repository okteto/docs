/**
 * Copyright (c) 2019-present, Okteto, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  docs: [
    {
      type: 'category',
      label: 'Get Started',
      link: { type: 'doc', id: 'index' },
      items: [
        {
          type: "category",
          label: "Install Okteto",
          link: { type: 'doc', id: 'get-started/overview' },
          items: [
            "get-started/cloud-provider-guides/amazon-eks",
            "get-started/cloud-provider-guides/civo",
            "get-started/cloud-provider-guides/digitalocean-doks",
            "get-started/cloud-provider-guides/google-gke",
            "get-started/cloud-provider-guides/microsoft-aks"
          ]
        },
        "get-started/install-okteto-cli",
        {
          type: "category",
          label: "Deploy your app",
          link: { type: 'doc', id: 'get-started/deploy-your-app/index' },
          items: [
            "get-started/deploy-your-app/deploy",
            "get-started/deploy-your-app/endpoints",
            "get-started/deploy-your-app/dependencies",
            "get-started/deploy-your-app/build",
          ]
        },
        "get-started/next-steps",
      ],
    },
    {
      type: 'category',
      label: 'Core concepts',
      items: [
        'core/components/namespaces',
        'manifest/overview-manifest',
        'core/components/build-service',
        'core/components/container-registry',
        'manifest/okteto-variables',
        {
          type: 'category',
          label: 'Endpoints',
          items: ['core/ingress/automatic-ssl', 'core/ingress/private-endpoints'],
        },
        'core/components/use-volume-snapshots',
        {
          type: 'category',
          label: 'Credentials',
          items: [
            'core/credentials/kubernetes-credentials',
            'core/credentials/personal-access-tokens',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Development Environments',
      link: { type: 'doc', id: 'deploy/index' },
      items: [
        'core/using-okteto-cli',
        {
          type: 'category',
          label: 'Development Containers',
          link: { type: 'doc', id: 'deploy/development-containers/index' },
          items: [
            {
              type: 'category',
              label: 'File Sync Mode',
              link: { type: 'doc', id: 'deploy/development-containers/file-sync/index' },
              items: [
                'guides/samples/aspnetcore',
                'guides/samples/golang',
                'guides/samples/java',
                'guides/samples/node',
                'guides/samples/php',
                'guides/samples/python',
                'guides/samples/ruby',
                ],
            },
            {
              type: 'category',
              label: 'Hybrid Mode',
              link: { type: 'doc', id: 'deploy/development-containers/hybrid/index' },
              items: [
                'deploy/development-containers/hybrid/hybrid-frontend',
                'deploy/development-containers/hybrid/hybrid-java',
              ],
            },
          ],
        },
        "deploy/development-environments",
        {
          type: 'category',
          label: 'Deploy environments',
          link: { type: 'doc', id: 'deploy/deploy-index' },
          items: [
            'deploy/deploy-from-catalog',
            'deploy/deploy-from-git',
            'deploy/from-private-repositories',
            'deploy/develop-on-okteto-button',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Preview Environments',
      link: { type: 'doc', id: 'preview/overview-prev-env' },
      items: [
        'preview/github/using-github-actions',
        'preview/using-gitlab-cicd',
      ],
    },
    {
      type: 'category',
      label: 'Administration',
      items: [
        'admin/dashboard',
        'admin/catalog',
        'admin/cleanup',
        'admin/okteto-insights',
      ],
    },
    {
      type: 'category',
      label: 'Okteto Self-Hosted',
      link: { type: 'doc', id: 'self-hosted/index' },
      items: [
        {
          type: 'category',
          label: 'Complete the installation',
          items: [
            'self-hosted/install/certificates',
            'self-hosted/install/custom-installer-image',
            'self-hosted/install/argocd',
            'self-hosted/install/github-integration',
            'self-hosted/install/volume-snapshots',
            {
              type: 'category',
              label: 'Private Repositories',
              items: [
                'self-hosted/install/private-repositories/github-app',
                'self-hosted/install/private-repositories/ssh-key',
              ],
            },
          ],
        },
        'reference/helm-chart-values',
        {
          type: 'category',
          label: 'Manage Okteto',
          items: [
            'self-hosted/manage/upgrade',
            'self-hosted/manage/okteto-license',
            'self-hosted/manage/backup',
            'self-hosted/manage/custom-resource-definitions',
            'self-hosted/manage/troubleshooting',
            'self-hosted/manage/diagnostics',
            'self-hosted/manage/uninstall-okteto',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Tutorials',
      items: [
        'guides/tutorials/aws-lambda',
        'guides/tutorials/compose-getting-started',
        'guides/tutorials/getting-started-with-okteto',
        'manifest/external-resources',
        'guides/tutorials/webpack',
      ],
    },
    {
      type: 'category',
      label: 'References',
      items: [
        'reference/okteto-cli',
        'reference/okteto-manifest',
        'reference/docker-compose',
        'reference/supported-github-actions',
        'reference/file-synchronization',
        'reference/ssh-server',
      ],
    },
    {
      type: 'category',
      label: 'Community and support',
      items: [
        'reference/faqs',
        {
          type: 'link',
          label: 'Community forum',
          href: 'https://community.okteto.com/',
        },
      ],
    },
    {
      type: 'link',
      label: 'Release notes',
      href: '/release-notes',
    },
    {
      type: 'link',
      label: 'Archives',
      href: '/archives',
    },
  ],
};
