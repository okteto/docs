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
        { type: 'doc', id: 'index', label: 'Introduction' },
        {
          type: 'category',
          label: 'Install Okteto Platform',
          link: { type: 'doc', id: 'get-started/install/index' },
          items: [
            'get-started/install/amazon-eks',
            'get-started/install/digitalocean-doks',
            'get-started/install/google-gke',
            'get-started/install/microsoft-aks',
            'get-started/install/nutanix-nkp',
            'get-started/install/openshift',
          ],
        },
        'get-started/install-okteto-cli',
        'get-started/quickstart',
      ],
    },
    {
      type: 'category',
      label: 'Application Environments',
      link: { type: 'doc', id: 'application-environments/index' },
      items: [
        { type: 'doc', id: 'application-environments/index', label: 'Overview' },
        'application-environments/namespaces',
        'application-environments/build-service',
        'application-environments/deploy',
        {
          type: 'category',
          label: 'Endpoints',
          link: { type: 'doc', id: 'application-environments/endpoints/automatic-ssl' },
          items: [
            'application-environments/endpoints/httproutes',
            'application-environments/endpoints/docker-compose',
            'application-environments/endpoints/ingress',
            'application-environments/endpoints/services',
            'application-environments/endpoints/custom-endpoints',
            'application-environments/endpoints/private-endpoints',
          ],
        },
        {
          type: 'category',
          label: 'Divert',
          link: { type: 'doc', id: 'application-environments/divert/index' },
          items: [
            { type: 'doc', id: 'application-environments/divert/index', label: 'Overview' },
            'application-environments/divert/shared-namespace',
            'application-environments/divert/overlay-namespace',
            'application-environments/divert/header-propagation',
            'application-environments/divert/queue-splitting',
            'application-environments/divert/data-cloning',
          ],
        },
        'application-environments/okteto-test',
        {
          type: 'category',
          label: 'Develop',
          link: { type: 'doc', id: 'application-environments/development-containers/index' },
          items: [
            { type: 'doc', id: 'application-environments/development-containers/index', label: 'Overview' },
            'application-environments/development-containers/aspnetcore',
            'application-environments/development-containers/golang',
            'application-environments/development-containers/java',
            'application-environments/development-containers/node',
            'application-environments/development-containers/php',
            'application-environments/development-containers/python',
            'application-environments/development-containers/ruby',
            'application-environments/development-containers/rust',
          ],
        },
        'application-environments/troubleshooting',
        'application-environments/destroy',
        'application-environments/external-resources',
        'application-environments/okteto-variables',
        'application-environments/use-volume-snapshots',
      ],
    },
    {
      type: 'category',
      label: 'Coding Agents',
      link: { type: 'doc', id: 'coding-agents/index' },
      items: [
        { type: 'doc', id: 'coding-agents/index', label: 'Overview' },
        'coding-agents/okteto-skills',
        'coding-agents/autonomous-workflows',
        'coding-agents/collaborative-workflows',
        'coding-agents/best-practices',
      ],
    },
    {
      type: 'category',
      label: 'Preview Environments',
      link: { type: 'doc', id: 'previews/index' },
      items: [
        { type: 'doc', id: 'previews/index', label: 'Overview' },
        'previews/using-github-actions',
        'previews/using-gitlab-cicd',
      ],
    },
    {
      type: 'category',
      label: 'User Settings',
      link: { type: 'doc', id: 'user-settings/index' },
      items: [
        'user-settings/setup',
        'user-settings/personal-access-tokens',
        'user-settings/integrations',
        'user-settings/variables',
      ],
    },
    {
      type: 'category',
      label: 'Administration',
      link: { type: 'doc', id: 'admin/index' },
      items: [
        {
          type: 'category',
          label: 'Cluster Management',
          link: { type: 'doc', id: 'admin/cluster-management' },
          items: [
            'admin/overview',
            'admin/installation',
            'admin/catalog',
            'admin/users',
            'admin/build-service',
            'admin/nodes',
            'admin/namespaces',
            'admin/previews',
          ],
        },
        {
          type: 'category',
          label: 'Settings',
          link: { type: 'doc', id: 'admin/settings' },
          items: [
            'admin/cli',
            'admin/deployments',
            'admin/admin-variables',
            'admin/cleanup',
            'admin/resource-manager',
            'admin/ssh-known-hosts',
          ],
        },
        {
          type: 'category',
          label: 'Integrations',
          link: { type: 'doc', id: 'admin/integrations-overview' },
          items: [
            'admin/integrations',
            'admin/admin-access-tokens',
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
                'admin/cloud-credentials/azure-cloud-credentials',
              ],
            },
          ],
        },
        'admin/user-roles-and-permissions',
        'admin/okteto-insights-dashboards',
      ],
    },
    {
      type: 'category',
      label: 'Okteto Self-Hosted',
      link: { type: 'doc', id: 'self-hosted/index' },
      items: [
        {
          type: 'category',
          label: 'Complete the Installation',
          link: { type: 'doc', id: 'self-hosted/install/index' },
          items: [
            {
              type: 'category',
              label: 'Wildcard Certificate',
              link: { type: 'doc', id: 'self-hosted/install/certificates/index' },
              items: [
                'self-hosted/install/certificates/cert-manager',
                'self-hosted/install/certificates/aws-acm',
                'self-hosted/install/certificates/bring-your-own-certificate',
              ],
            },
            {
              type: 'category',
              label: 'Okteto Registry Storage',
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
            'self-hosted/install/buildkit-high-performance',
            'self-hosted/install/divert/index',
            'self-hosted/install/volume-snapshots',
          ],
        },
        'self-hosted/helm-configuration',
        {
          type: 'category',
          label: 'Operating Okteto',
          link: { type: 'doc', id: 'self-hosted/manage/index' },
          items: [
            'self-hosted/manage/upgrade',
            'self-hosted/manage/migrate-to-gateway-api',
            'self-hosted/manage/argocd',
            'self-hosted/manage/okteto-license',
            'self-hosted/manage/backup',
            'self-hosted/manage/custom-resource-definitions',
            'self-hosted/manage/ipv6',
            'self-hosted/manage/arm-support',
            'self-hosted/manage/air-gapped',
            'self-hosted/manage/troubleshooting',
            'self-hosted/manage/diagnostics',
            'self-hosted/manage/uninstall-okteto',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Okteto BYOC',
      link: { type: 'doc', id: 'byoc/index' },
      items: [
        'byoc/aws/index',
        'byoc/gcp/index'
      ]
    },
    {
      // A line between the product sections and References, Release notes, and Archives.
      type: 'html',
      value: '<hr class="sidebarSeparator" />',
      defaultStyle: true,
    },
    {
      type: 'category',
      label: 'References',
      link: {
        type: 'doc',
        id: 'reference/index',
      },
      items: [
        'reference/okteto-cli',
        'reference/okteto-manifest',
        'reference/docker-compose',
        'reference/feature-flags',
        'reference/okteto-api',
        'reference/okteto-insights-metrics',
        'reference/develop-on-okteto-button',
        'reference/remote-execution',
        'reference/smart-builds',
      ],
    },
    'release-notes',
    {
      type: 'link',
      label: 'Archives',
      href: '/archives',
    },
  ],
};
