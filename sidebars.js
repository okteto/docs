/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  "docs": {
    "Welcome": [
      "welcome/overview",
      {
        "type": "category",
        "label": "Getting Started",
        "items": [
          "getting-started",
          "using-dev-envs"
        ]
      }
    ],
    "Dev Environments": [
      "reference/development-environments",
      "cloud/okteto-cli",
      "cloud",
      {
        "type": "category",
        "label": "Deploying",
        "items": [
          "cloud/deploy-from-git",
          "cloud/private-repositories",
          "cloud/deploy-from-helm"
        ]
      },
      "cloud/secrets",
      {
        "type": "category",
        "label": "Exposing Your Application",
        "items": [
          "cloud/ssl",
          "cloud/private-endpoints",
          "cloud/custom-domains"
        ]
      },
      "cloud/build",
      "cloud/registry",
      "cloud/namespaces",
      "cloud/credentials",
      "cloud/personal-access-tokens",
      "reference/file-synchronization",
      "reference/ssh-server"
    ],
    "Preview Environments": [
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
    "Administration": [
      "administration/dashboard",
      "administration/cleanup",
      {
        "type": "category",
        "label": "Private Repositories",
        "items": [
          "administration/private-repositories/github-app",
          "administration/private-repositories/ssh-key"
        ]
      },
      "administration/volume-snapshots"
    ],
    "Okteto Self-Hosted": [
      "enterprise",
      {
        "type": "category",
        "label": "Installation",
        "items": [
          "enterprise/install/overview",
          "enterprise/install/preparation",
          "enterprise/install/deployment",
          "enterprise/install/upgrade",
          "enterprise/install/troubleshooting",
          "enterprise/install/releases"
        ]
      },
      {
        "type": "category",
        "label": "Cloud Providers Guides",
        "items": [
          "enterprise/eks",
          "enterprise/aks",
          "enterprise/civo",
          "enterprise/do",
          "enterprise/gke"
        ]
      },
      {
        "type": "category",
        "label": "Configuration",
        "items": [
          "enterprise/configuration/certificates",
          "enterprise/configuration/configuration"
        ]
      }
    ],
    "References": [
      "reference/cli",
      "reference/manifest",
      "reference/manifest-migration",
      "reference/compose",
      "reference/faqs",
      "cloud/permissions",
      "reference/known-issues"
    ],
    "Tutorials": [
      "tutorials/compose-getting-started",
      "tutorials/preview-environments",
      "tutorials/webpack"
    ],
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
  }
}
