---
title: Welcome to Okteto!
description: This section will give you a brief overview of Okteto and its features
---

Okteto is a platform that simplifies the process of launching cloud development environments without requiring the expertise to do this yourself. This enables developers to automatically spin up fully-managed development environments that emulate production as closely as possible. Okteto eliminates the friction of local development environments, the many deviations that can exist for the same engineering organization, and the troubleshooting that comes with them.

This overview covers what Okteto offers and how you can get started.

## Development Environments
Okteto's [Development Environments](deploy/development-environments.mdx) enable you to deploy and develop applications directly in the cloud with a single [CLI command](core/using-okteto-cli.mdx). Traditional development workflows involve committing and pushing your changes, then waiting for the CI pipeline to build and deploy them before you can take a look. If you have to do this multiple times a day this can be frustrating and time-consuming. The problem only compounds when multiple developers are using a single staging environment.

Development Environments solve this problem by allowing you to write code locally on your machine but view your changes live, deployed in a managed Kubernetes cluster **as soon as you hit save**! You don't have to spend time configuring anything to do this. Okteto takes care of it all for you. Try for yourself by [Getting Started](get-started/install-okteto-cli.mdx). We also have more detailed documentation about development environments available [here](deploy/development-environments.mdx).

## Preview Environments
Using Okteto, you can configure [Preview Environments](preview/overview.mdx) for your code repositories. Every pull request will be deployed and will generate its own sharable URL. This helps teams browse the changes in a pull request before it gets merged without having to take care of any deployment-related setup. These URLs can also be shared with other stakeholders so the review process isn't just limited to developers.

You can learn how to configure Preview Environments [here](preview/overview.mdx).

## Why Okteto?

Okteto was built for developers, by developers. We understand how frustrating it is to deal with the modern-day challenges of cloud-native development.

Seeing what you're developing, deployed in a realistic production-like environment, while you're still actively writing the code is a problem multiple tools try to solve, but none are as effective as Okteto. We know that developers want to focus on writing code, not setting up or troubleshooting environments. We abstract away the complexities of developing on a cloud environment so you can focus only on what you enjoy: solving problems with code.

Okteto's goal is to give developers the freedom they love. Developers can focus on writing code and Okteto takes care of setting up and managing the development infrastructure.

Simplify your development process with Okteto. Let us show you how. [Talk to us](https://okteto.com/schedule/)!