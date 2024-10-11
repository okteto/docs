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
        "get-started/install-okteto-cli",
        {
          type: "category",
          label: "Install Okteto Platform",
          link: { type: 'doc', id: 'get-started/install/index' },
          items: [
            "get-started/install/amazon-eks",
            "get-started/install/civo",
            "get-started/install/digitalocean-doks",
            "get-started/install/google-gke",
            "get-started/install/microsoft-aks",
            "get-started/install/openshift"
          ]
        },
        {
          type: "category",
          label: "For Developers",
          items: [
            "get-started/dev-quickstart",
            "get-started/using-okteto-cli-and-dashboard",
            "get-started/advanced-commands-and-concepts",
          ]
        },
        {
          type: "category",
          label: "Deploy your app",
          link: { type: 'doc', id: 'get-started/deploy-your-app/index' },
          items: [
            "get-started/deploy-your-app/deploy",
            "get-started/deploy-your-app/dependencies",
            "get-started/deploy-your-app/endpoints",
            "get-started/deploy-your-app/build",
          ]
        },
        ],
    },
    {
      type: 'category',
      label: 'Core concepts',
      items: [
        {
          type: 'category',
          label: 'Credentials',
          items: [
            'core/credentials/kubernetes-credentials',
            'core/credentials/personal-access-tokens',
            'core/credentials/environment-variables',
          ],
        },
        {
          type: 'category',
          label: 'Endpoints',
          items: ['core/endpoints/automatic-ssl', 'core/endpoints/private-endpoints'],
        },
        'core/namespaces',
        'core/build-service',
        'core/okteto-insights-dashboards',
        'core/okteto-manifest',
        'core/container-registry',
        'core/okteto-variables',
        'core/remote-execution',
        'core/user-roles-and-permissions',
        'core/use-volume-snapshots',
      ],
    },
    {
      type: 'category',
      label: 'Development Environments',
      link: { type: 'doc', id: 'development/index' },
      items: [
        'development/using-okteto-cli',
        {
          type: 'category',
          label: 'Development Containers',
          link: { type: 'doc', id: 'development/containers/index' },
          items: [
            {
              type: 'category',
              label: 'File Sync Mode',
              link: { type: 'doc', id: 'development/containers/file-sync/index' },
              items: [
                'development/containers/file-sync/aspnetcore',
                'development/containers/file-sync/golang',
                'development/containers/file-sync/java',
                'development/containers/file-sync/node',
                'development/containers/file-sync/php',
                'development/containers/file-sync/python',
                'development/containers/file-sync/ruby',
                ],
            },
            {
              type: 'category',
              label: 'Hybrid Mode',
              link: { type: 'doc', id: 'development/containers/hybrid/index' },
              items: [
                'development/containers/hybrid/hybrid-frontend',
                'development/containers/hybrid/hybrid-java',
              ],
            },
          ],
        },
        "development/images",
        {
          type: 'category',
          label: 'Deploy environments',
          link: { type: 'doc', id: 'development/deploy/index' },
          items: [
            'development/deploy/deploy-from-catalog',
            'development/deploy/deploy-from-git',
            'development/deploy/from-private-repositories',
            'development/deploy/develop-on-okteto-button',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Okteto Test',
      link: { type: 'doc', id: 'testing/index' },
      items: [
        'testing/getting-started-test',
      ],
    },
    {
      type: 'category',
      label: 'Preview Environments',
      link: { type: 'doc', id: 'previews/index' },
      items: [
        'previews/using-github-actions',
        'previews/using-gitlab-cicd',
      ],
    },
    {
      type: 'category',
      label: 'Administration',
      link: { type: 'doc', id: 'admin/index' },
      items: [
        'admin/dashboard',
        'admin/catalog',
        'admin/cleanup',
        'admin/okteto-insights',
        {
          type: 'category',
          label: 'Private Repositories',
          items: [
            'admin/private-repositories/github-app',
            'admin/private-repositories/ssh-key',
          ],
        },
        'admin/custom-installer-image',
        {
          type: 'category',
          label: 'Registry Credentials',
          link: { type: 'doc', id: 'admin/registry-credentials/index' },
          items: [
            'admin/registry-credentials/amazon-ecr',
            'admin/registry-credentials/azure-acr',
            'admin/registry-credentials/dockerhub',
            'admin/registry-credentials/google-artifact-registry',
          ],
        },
        {
          type: 'category',
          label: 'Cloud Credentials',
          link: { type: 'doc', id: 'admin/cloud-credentials/index' },
          items: [
            'admin/cloud-credentials/aws-cloud-credentials',
            'admin/cloud-credentials/gcp-cloud-credentials',
          ],
        },
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
            {
              type: 'category',
              label: 'Wildcard certificate',
              link: { type: 'doc', id: 'self-hosted/install/certificates/index' },
              items: [
                'self-hosted/install/certificates/cert-manager',
                'self-hosted/install/certificates/aws-acm',
                'self-hosted/install/certificates/bring-your-own-certificate',
              ],
            },
            {
              type: 'category',
              label: 'Okteto Registry storage',
              link: { type: 'doc', id: 'self-hosted/install/okteto-registry-storage/index' },
              items: [
                'self-hosted/install/okteto-registry-storage/filesystem',
                'self-hosted/install/okteto-registry-storage/aws-s3-bucket',
                'self-hosted/install/okteto-registry-storage/azure-storage-container',
                'self-hosted/install/okteto-registry-storage/digitalocean-spaces',
                'self-hosted/install/okteto-registry-storage/google-cloud-storage',
              ],
            },
            {
              type: 'category',
              label: 'Authentication',
              link: { type: 'doc', id: 'self-hosted/install/auth/index' },
              items: [
                'self-hosted/install/auth/azure-ad',
                'self-hosted/install/auth/bitbucket',
                'self-hosted/install/auth/github',
                'self-hosted/install/auth/gitlab',
                'self-hosted/install/auth/google',
                'self-hosted/install/auth/okta',
                'self-hosted/install/auth/openid-connect',
                'self-hosted/install/auth/token',
              ],
            },
            'self-hosted/install/github-integration',
            'self-hosted/install/volume-snapshots',
          ],
        },
        'self-hosted/helm-configuration',
        {
          type: 'category',
          label: 'Operating Okteto',
          items: [
            'self-hosted/manage/upgrade',
            'self-hosted/manage/argocd',
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
        'tutorials/aws-lambda',
        'tutorials/compose-getting-started',
        'tutorials/getting-started-with-okteto',
        'tutorials/external-resources',
        'tutorials/webpack',
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
        'reference/feature-flags',
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
    "release-notes",
    {
      type: 'link',
      label: 'Archives',
      href: '/archives',
    },
  ],
};
