/**
 * Copyright (c) 2019-present, Okteto, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

module.exports = {
  "docs": [
    {
      "What is Okteto": [
        "overview",
        {
          "type": "category",
          "label": "Getting Started",
          "items": [
            "getting-started-install-okteto",
            "getting-started-install-okteto-cli",
            "using-dev-envs"
          ]
        },
        "saas-vs-self-hosted"
      ],
    },
    {
      "Prepare your application for Okteto": [
        "cloud/okteto-cli",
        "reference/manifest",
        "reference/compose",
      ],
    },
    {
      "Develop with Okteto": [
        {
          "Dev Environments": [
            "reference/development-environments",
            {
              "type": "category",
              "label": "Deploying",
              "items": [
                "cloud/launch-from-catalog",
                "cloud/deploy-from-git",
                "cloud/private-repositories",
                "cloud/deploy-from-helm"
              ]
            },
            "cloud/external-resources",
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
              "label": "For GitHub",
              "items": [
                "cloud/preview-environments/dashboard",
                "cloud/preview-environments/preview-environments-github",
                "cloud/permissions",
              ]
            },
            "cloud/preview-environments/preview-environments-gitlab"
          ]
        },
        {
          "Test Environments": [
            "cloud/preview-environments/preview-environments",
          ]
        }
      ]
    },
    {
      "Managing Okteto": [
        "administration/dashboard",
        "administration/cleanup",
        "administration/catalog",
        {
          "type": "category",
          "label": "Private Repositories",
          "items": [
            "administration/private-repositories/github-app",
            "administration/private-repositories/ssh-key"
          ]
        },
        {
          "type": "category",
          "label": "Configure Okteto Self-Hosted",
          "items": [
            "self-hosted/install/releases",
            "self-hosted/administration/configuration",
            "self-hosted/install/upgrade",
            "self-hosted/install/troubleshooting",
            "self-hosted/administration/certificates",
            "self-hosted/administration/custom-installer-image",
            "self-hosted/administration/github",
            "self-hosted/administration/volume-snapshots",
            {
              "type": "category",
              "label": "Reference Architectures",
              "items": [
                "self-hosted/eks",
                "self-hosted/aks",
                "self-hosted/civo",
                "self-hosted/do",
                "self-hosted/gke"
              ]
            }
          ]
        },
      ]
    },
    {
      "Guides and Examples": [
        "tutorials/compose-getting-started",
        "tutorials/webpack",
        "tutorials/aws-lambda",
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
    {
      "References": [
        "reference/cli",
        "reference/manifest-migration",
        "reference/faqs",
        "reference/known-issues"
      ],
    },
    {
      "type": "link",
      "label": "Archives",
      "href": "/archives"
    }
  ]
}
