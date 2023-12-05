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
      "overview",
      "get-started/preparation",
      {
        "type": "category",
        "label": "Install Okteto",
        "items": [
          "get-started/quickstart-guide",
          {
            "type": "category",
            "label": "Cloud provider guides",
            "items": [
              "get-started/cloud-provider-guides/amazon-eks",
              "get-started/cloud-provider-guides/civo",
              "get-started/cloud-provider-guides/digitalocean-doks",
              "get-started/cloud-provider-guides/google-gke",
              "get-started/cloud-provider-guides/microsoft-aks"
            ]
          },
        ]
      },
      "get-started/install-okteto-cli",
      "get-started/deploy-first-environment"
    ],
  },
  {
    "Core concepts": [
      "core/using-okteto-cli",
      {
        "type": "category",
        "label": "Okteto components",
        "items": [
          "core/components/namespaces",
          "core/components/build-service",
          "core/components/container-registry",
          "core/components/use-volume-snapshots",
        ],
      },
      {
        "type": "category",
        "label": "Ingress",
        "items": [
          "core/ingress/automatic-ssl",
          "core/ingress/private-endpoints",
        ],
      },
      {
        "type": "category",
        "label": "Credentials",
        "items": [
          "core/credentials/kubernetes-credentials",
          "core/credentials/personal-access-tokens",
        ],
      },
    ]
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
        ],
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
        ],
      },
    ]
  },
  {
    "Okteto manifest": [
      "cloud/external-resources",
      "cloud/secrets"
    ]  
  },
  {
    "Deploy development environments": [
      "reference/development-environments",
      "cloud/launch-from-catalog",
      "cloud/deploy-from-git",
    ],
  },
  {
    "Deploy preview environments": [
      "cloud/preview-environments/preview-environments",
      {
        "type": "category",
        "label": "For GitHub",
        "items": [
          "cloud/preview-environments/dashboard",
          "cloud/preview-environments/preview-environments-github"
        ]
      },
      "cloud/preview-environments/preview-environments-gitlab"
    ],
  },
  {
    "Okteto Self-Hosted": [
      "self-hosted",
      "self-hosted/install/overview",
      {
        "type": "category",
        "label": "Admin features",
        "items": [
          "administration/dashboard",
          "administration/catalog",
          "administration/okteto-insights",
          "administration/cleanup"
        ]
      },
      {
        "type": "category",
        "label": "Manage Okteto",
        "items": [
          "self-hosted/install/upgrade",
          "administration/okteto-license",
          "self-hosted/install/backup",
          "self-hosted/install/custom-resource-definitions",
          "self-hosted/install/troubleshooting"
        ]
      },
      {
        "type": "category",
        "label": "Complete the installation",
        "items": [
          "self-hosted/administration/certificates",
          "self-hosted/administration/custom-installer-image",
          "self-hosted/administration/github",
          "self-hosted/administration/volume-snapshots",
          {
            "type": "category",
            "label": "Private Repositories",
            "items": [
              "administration/private-repositories/github-app",
              "administration/private-repositories/ssh-key"
            ]
          },
        ]
      },
    ],
  },
  {
    "References": [
      "reference/cli",
      "reference/manifest",
      "reference/compose",
      "self-hosted/administration/configuration",
      "reference/file-synchronization",
      "reference/ssh-server",
    ],
  },
  {
    "Community and support": [
      "reference/faqs",
      {
        "type": "link",
        "label": "Community forum",
        "href": "https://community.okteto.com/"
      },
    ]  
  },
  "self-hosted/install/releases",
  {
    "type": "link",
    "label": "Archives",
    "href": "/archives"
  }
  ],
}
