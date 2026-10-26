---
title: "Okteto Self-Hosted vs. Bring Your Own Cloud: Which Is Right for Your Team?"
description: "There are two ways to run Okteto, and both keep your code and data in your own infrastructure: Self-Hosted in your own Kubernetes cluster, or Bring Your Own Cloud, where Okteto manages the platform in your cloud account. Here is how to choose."
slug: okteto-for-teams
date: 2021-10-06
authors: ["melissa-williams"]
tags: ["kubernetes", "cloud-native"]
image: ./img/add851e1aa67.jpg
---

If you've been following Okteto, you know our mission hasn't changed: give every developer a production-like environment on demand, so teams can build, preview, and test against something real instead of a laptop-sized approximation. What has evolved is *how* you bring that capability into your organization.

<!-- truncate -->

The question we hear most often from platform teams isn't "should we adopt Okteto?" It's "how should we run it?" The answer depends on how much of the underlying infrastructure your team wants to own. Today there are two ways to run Okteto, and both keep your code and data inside your own cloud: **Okteto Self-Hosted** and **Okteto Bring Your Own Cloud (BYOC)**.

## Okteto Self-Hosted

With Okteto Self-Hosted, you install and run Okteto in your own Kubernetes cluster. Your team owns the deployment end to end: the cluster, the upgrades, the configuration, and the day-to-day operations.

This is the right fit for organizations that already have deep Kubernetes expertise, that have strict requirements about what runs where, or that simply want full control over every layer of the stack. Nothing leaves your environment, and nothing is out of your hands.

The tradeoff is ownership. Running a platform is real work, and Self-Hosted assumes your team is ready to take that on.

## Okteto Bring Your Own Cloud

Not every team wants to operate the platform, even when they want the control that comes with running it in their own environment. That's the gap [Okteto Bring Your Own Cloud](https://www.okteto.com/docs/byoc/) fills.

With BYOC, Okteto runs on your own cloud account, but we handle the operational side: installation, upgrades, patching, monitoring, and the daily reconciliation that keeps the platform healthy. You keep full ownership of your cloud environment and your data. Okteto only interacts with the workloads required to run the platform itself.

In other words, your data never leaves your cloud, and your team never has to become a full-time platform operator. For teams with strong security or compliance requirements, or those running at scale, that combination of control and low operational overhead is often the deciding factor.

## Which one is right for your team?

It comes down to a single question: how much of the platform do you want to run yourself?

- Choose **Self-Hosted** if you have the Kubernetes expertise in-house and want to own every part of the deployment.
- Choose **Bring Your Own Cloud** if you want the security and data-residency benefits of running in your own cloud, but would rather Okteto handle the undifferentiated heavy lifting of operating the platform.

The important part, and what sets both apart from the multi-tenant SaaS model many tools default to, is that in either case your environments, your source code, and your data stay inside infrastructure you own.

## Learning from teams already doing this

One of the clearest examples comes from Monday.com. They needed to give a large engineering organization realistic development environments for an application with more than 30 microservices, without asking every developer to run all of it on their laptop.

You can read about [Monday.com's experience](https://engineering.monday.com/development-environments-in-the-cloud/) in their own words. It's a good look at what changes for a team when production-like environments become something developers can spin up on demand.

## What you get, either way

Whichever model you choose, the developer experience is the same. Both Self-Hosted and BYOC give your team:

- Preview environments with every pull request
- Development environments that are realistic replicas of production
- Single sign-on so you can plug into your existing identity provider
- Namespace sharing for real-time collaboration
- Custom roles and security policies
- Support from the Okteto team

## Not sure which fits?

If you're weighing Self-Hosted against Bring Your Own Cloud, or you just want to see what Okteto looks like for a team your size, [book a demo](https://www.okteto.com/get-demo/) and we'll walk you through both and help you figure out which one fits your organization.
