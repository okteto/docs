---
title: Install Okteto CLI
description: Follow these steps to install the Okteto CLI, a client-side tool that works in any Kubernetes cluster
sidebar_label: Installation
id: installation
---

Okteto provides a local development experience for Kubernetes applications. You code locally in your favorite IDE and Okteto synchronizes it automatically to your cluster. The Okteto CLI is open source, and the code is available at [GitHub](https://github.com/okteto/okteto). It is a client-side only tool that works in any Kubernetes cluster.

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