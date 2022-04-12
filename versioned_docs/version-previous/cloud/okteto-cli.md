---
title: Okteto CLI
description: Follow these steps to install the Okteto CLI, a client-side tool that works in any Kubernetes cluster
sidebar_label: Okteto CLI
id: okteto-cli
---

[Dev Environments](/docs/previous/reference/development-environment) allow you to develop your deployed application locally. You continue coding  in your favorite IDE and see the changes live on the deployed version of your application as soon as you hit save. Okteto CLI is an [open source](https://github.com/okteto/okteto) client-side only tool that allows you to set up Dev Environments with any Kubernetes cluster - your own, Okteto Cloud, or Okteto Self-Hosted.

Below are instructions on how you can install Okteto CLI. Some other important topics related to the CLI are documented here:

- [Okteto CLI Reference](/docs/previous/reference/cli)
- [File Synchronization](/docs/previous/reference/file-synchronization)
- [SSH Server](/docs/previous/reference/ssh-server)
- [FAQs](/docs/previous/reference/faqs)
- [Known Issues](/docs/previous/reference/known-issues)

## Installation

Install the Okteto CLI following these steps:

### MacOS / Linux

```console
$ curl https://get.okteto.com -sSfL | sh
```

You can also install via [brew](https://brew.sh/) by running:

```console
$ brew install okteto
```

### Windows

Download https://downloads.okteto.com/cli/okteto.exe and add it to your `$PATH`.

You can also install via [scoop](https://scoop.sh/) by running:

```console
$ scoop install okteto
```

### GitHub
Alternatively, you can directly download the binary [from GitHub](https://github.com/okteto/okteto/releases).