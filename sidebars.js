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
      "self-hosted/install/preparation",
      {
        "type": "category",
        "label": "Installing Okteto",
        "items": [
          "self-hosted/install/deployment",
          {
            "type": "category",
            "label": "Cloud provider guides",
            "items": [
              "self-hosted/eks",
              "self-hosted/aks",
              "self-hosted/civo",
              "self-hosted/do",
              "self-hosted/gke"
            ]
          },
        ]
      },
      "using-dev-envs"
    ],
  },
  {
    "Core concepts": [
      "cloud/okteto-cli",
      {
        "type": "category",
        "label": "Okteto components",
        "items": [
          "cloud/namespaces",
          "cloud/build",
          "cloud/registry",
          "cloud/use-volume-snapshots",
        ],
      },
      {
        "type": "category",
        "label": "Ingress",
        "items": [
          "cloud/ssl",
          "cloud/private-endpoints",
        ],
      },
      {
        "type": "category",
        "label": "Credentials",
        "items": [
          "cloud/credentials",
          "cloud/personal-access-tokens",
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
          "self-hosted/install/releases"
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
  {
    "type": "link",
    "label": "Archives",
    "href": "/archives"
  }
  ],
}
