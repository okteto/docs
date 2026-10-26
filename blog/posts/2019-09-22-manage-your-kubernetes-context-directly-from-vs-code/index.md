---
title: "Manage your Kubernetes Context Directly from VS Code"
description: "Manage your Kubernetes Context Directly from VS Code"
slug: manage-your-kubernetes-context-directly-from-vs-code
date: 2019-09-22
authors: ["ramiro-berrelleza"]
tags: ["visual-studio-code", "development", "kubernetes", "cloud-native"]
---

Do you keep deploying your applications into the wrong namespace? Now you can see and manage your Kubernetes context directly from VS Code with [our new extension](https://marketplace.visualstudio.com/items?itemName=okteto.kubernetes-context) 🚀.

<!-- truncate -->

Visual Studio Code has taken the IDE world by storm. On [Stack Overflow’s 2019 Developer survey](https://insights.stackoverflow.com/survey/2019#technology-_-most-popular-development-environments) it already appears as the most popular development environment. I’m a big fan of it, mostly because of the extension model. These days, I spend most of my coding time in VS Code windows.

When I’m building Cloud Native applications, I use namespaces extensively. I have dedicated Kubernetes namespace for every application I’m working on, and then I also create one for every branch I’m working on. This lets me switch very quickly not only between branches, but also between different versions of an entire application.

<!-- more -->

I love working in this way, but every now and then I’ll lose track of which namespace I’m on and I’ll end up running `kubectl apply -f deployment.yaml` in the wrong place. Nothing catastrophic (gotta love this whole infrastructure as code trend), but it makes me lose my flow 😒. On my terminal I use [this plugin](https://github.com/superbrothers/zsh-kubectl-prompt), but I couldn’t find anything like this for my IDE.

Until now…

![Manage your Kubernetes context from VS Code](/manage-your-kubernetes-context-directly-from-vs-code/demo.gif)

Like everything else we do around here, we build this extension to make our lives as Cloud Native Developers easier than ever. [Install the Kubernetes context extension](https://marketplace.visualstudio.com/items?itemName=okteto.kubernetes-context), reload your VS Code instance, and your current context name and namespace will be displayed in the bottom right of the screen. Need to change it? Click on the status bar, and select another one, without losing your flow.

I hope you find it as useful as we do. Let us know what you think about it [on Twitter](https://twitter.com/oktetohq), or in the [Okteto community forum](https://community.okteto.com/).
