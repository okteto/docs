/**
 * Copyright (c) 2019-present, Okteto, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  "docs": [
  {
    "Get started": [
      "introduction",
      {
        "type": "category",
        "label": "Installing Okteto",
        "items": [
          "get-started/install/overview",
          "get-started/install/prerequisites",
          {
            "type": "category",
            "label": "Configuration",
            "items": [
              "get-started/configure/custom-certificates",
              "get-started/configure/custom-installer-image",
              "get-started/configure/configuration-settings",
              "get-started/configure/github-integration",
              "get-started/configure/configure-volume-snapshots"
            ]
          },
          "get-started/install/deploy-okteto-instance",
          "get-started/install/upgrade-okteto-instance",
        ]
          
      },
    ],
  },
  {
    "Guides": [
      {
        "type": "category",
        "label": "Tutorials",
        "items": [
          "tutorials/compose-getting-started",
          "tutorials/webpack",
          "tutorials/aws-lambda"
        ]
      },
      {
        "type": "category",
        "label": "Samples",
        "items": [
          "samples/aspnetcore",
          "samples/golang",
          "samples/java",
          "samples/node",
          "samples/php",
          "samples/python",
          "samples/ruby",
          "samples/more"
        ]
      }
    ],
  },
  {
    "Deploy an application": [
      {
        "type": "category",
        "label": "Deploy Components",
        "items": [
          "deploy/components/build-service",
          "deploy/components/container-registry",
          "deploy/components/use-volume-snapshots",
          "deploy/components/kubernetes-credentials"
        ]
      },
      {
        "type": "category",
        "label": "Okteto Manifest",
        "items": [
          "deploy/manifest/external-resources",
          "deploy/manifest/secrets"
        ]
      },
      "deploy/deploy-from-catalog",
      "deploy/deploy-from-git",
      "deploy/using-the-cli"
    ],
  },
  {
    "Manage an application": [
      {
        "type": "category",
        "label": "Expose your application",
        "items": [
          "manage-app/automatic-ssl",
          "manage-app/private-endpoints",
          "manage-app/custom-domains"
        ]
      },
      {
        "type": "category",
        "label": "Preview Environments",
        "items": [
          "manage-app/preview-environments/preview-environments-overview",
          {
            "type": "category",
            "label": "For GitHub",
            "items": [
              "manage-app/preview-environments/configure-github",
              "manage-app/preview-environments/configure-github-actions"
            ]
          },
          "manage-app/preview-environments/configure-gitlab"
        ]
      },
      "manage-app/namespaces",
      "manage-app/personal-access-tokens",
      "manage-app/file-synchronization",
      "manage-app/connect-via-ssh"
    ],
  },
  {
    "Manage Okteto": [
      "manage-okteto/okteto-license",
      "manage-okteto/admin-dashboard",
      "manage-okteto/catalog",
      "manage-okteto/okteto-insights",
      {
        "type": "category",
        "label": "Private repositories",
        "items": [
          "manage-okteto/private-repositories/connect-github",
          "manage-okteto/private-repositories/ssh-key-auth"
        ]
      },
      "manage-okteto/manage/backup-restore",
      "manage-okteto/manage/custom-resource-definitions",
      "manage-okteto/manage/troubleshooting"
    ],
  },
  {
    "Okteto self-hosted": [
      "self-hosted/self-hosted-introduction",
      {
        "type": "category",
        "label": "Guides",
        "items": [
          "self-hosted/guides/amazon-eks",
          "self-hosted/guides/microsoft-aks",
          "self-hosted/guides/digitalocean-doks",
          "self-hosted/guides/google-gke",
          "self-hosted/guides/civo"
        ]
      }
    ],
  },
  {
    "References": [
      "reference/okteto-cli",
      "reference/okteto-manifest",
      "reference/migrate-cli-10-20",
      "reference/docker-compose",
      "reference/github-permissions"
    ]
  },
  {
    "Additional resources": [
      "additional-resources/releases",
    ],
  },
  {
    "Community & Support": [
      {
        "type": "link",
        "label": "Forums & Discussions",
        "href": "https://community.okteto.com"
      }
    ],  
  },
  ],
}
