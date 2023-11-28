/**
 * Copyright (c) 2019-present, Okteto, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  "docs": [
    {
      "Welcome": [
      "overview",
      "saas-vs-self-hosted",
      {
        "type": "category",
        "label": "Getting Started",
        "items": [
          "getting-started",
          "using-dev-envs"
        ]
      }
    ],
  },
  {
    "Dev Environments": [
      "reference/development-environments",
      "cloud/okteto-cli",
      {
        "type": "category",
        "label": "Tutorials",
        "items": [
          "tutorials/compose-getting-started",
          "tutorials/webpack",
          "tutorials/aws-lambda",
        ]
      },
      "cloud/external-resources",
      "cloud/secrets",
      {
        "type": "category",
        "label": "Samples",
        "items": [
          "cloud/ssl",
          "cloud/private-endpoints",
          "cloud/custom-domains"
        ]
      },
      "cloud/build",
      "cloud/registry",
      "cloud/use-volume-snapshots",
      "cloud/namespaces",
      "cloud/credentials",
      "cloud/personal-access-tokens",
      "reference/file-synchronization",
      "reference/ssh-server"
    ],
  },
  {
    "Preview Environments": [
      "cloud/preview-environments/preview-environments",
      {
        "type": "category",
        "label": "Deploy Components",
        "items": [
          "cloud/preview-environments/dashboard",
          "cloud/preview-environments/preview-environments-github"
        ]
      },
      "cloud/preview-environments/preview-environments-gitlab"
    ],
  },
  {
    "Administration": [
      "administration/okteto-license",
      "administration/dashboard",
      "administration/cleanup",
      "administration/catalog",
      {
        "type": "category",
        "label": "Okteto Manifest",
        "items": [
          "administration/private-repositories/github-app",
          "administration/private-repositories/ssh-key"
        ]
      },
      "administration/okteto-insights",
    ],
  },
  {
    "Okteto Self-Hosted": [
      "self-hosted",
      {
        "type": "category",
        "label": "Preview Environments",
        "items": [
          "self-hosted/install/overview",
          "self-hosted/install/preparation",
          "self-hosted/install/deployment",
          "self-hosted/install/backup",
          "self-hosted/install/upgrade",
          "self-hosted/install/custom-resource-definitions",
          "self-hosted/install/troubleshooting",
          "self-hosted/install/releases"
        ]
      },
      {
        "type": "category",
        "label": "Cloud Providers Guides",
        "items": [
          "self-hosted/eks",
          "self-hosted/aks",
          "self-hosted/civo",
          "self-hosted/do",
          "self-hosted/gke"
        ]
      },
      {
        "type": "category",
        "label": "Configuration",
        "items": [
          "self-hosted/administration/certificates",
          "self-hosted/administration/custom-installer-image",
          "self-hosted/administration/configuration",
          "self-hosted/administration/github",
          "self-hosted/administration/volume-snapshots"
        ]
      }
    ],
  },
  {
    "References": [
      "reference/cli",
      "reference/manifest",
      "reference/manifest-migration",
      "reference/compose",
      "reference/faqs",
      "cloud/permissions",
      "reference/known-issues"
    ],
  },
  {
    "Tutorials": [
      "tutorials/compose-getting-started",
      "tutorials/webpack",
      "tutorials/aws-lambda"
    ],
  },
  {
    "Samples": [
      "samples/aspnetcore",
      "samples/golang",
      "samples/java",
      "samples/node",
      "samples/php",
      "samples/python",
      "samples/ruby",
      "samples/more"
    ]
  },
  {
    "type": "link",
    "label": "Archives",
    "href": "/archives"
  }
  ],
}
