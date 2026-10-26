---
title: "Run your Pull Request Preview Environments on Kubernetes"
description: "Run your Pull Request Preview Environments on Kubernetes"
slug: preview-environments-for-kubernetes
date: 2021-06-07
authors: ["pablo-chico-de-guzman"]
tags: ["kubernetes", "preview", "okteto", "development"]
image: ./img/d9d1d39b8b35.jpg
---

Have you ever wanted to test the changes in one of your teammate's pull requests? Today it looks like this: commit your local changes, switch your local branch, redeploy your application in your local environment, and test the changes if nothing breaks... Have you ever attached a gif in your pull request to help people validate visual changes in your application? Shouldn't there be a better way to do these things?

<!-- truncate -->

Preview environments are the answer. A preview environment is an ephemeral environment associated to the life cycle of a pull request. Preview environments make it super simple to validate the changes in a pull request by anyone in your team. These changes are tested in isolation before merging the branch to master and without polluting other integration environments.

In this blog post, you'll learn how preview environments can increase your team productivity and why Kubernetes is the perfect place to deploy your preview environments.

<!-- more -->

## What is a preview environment

Code reviews are a powerful tool to catch issues before code gets merged to master. But some issues are hard to discover from just reading code. Think about design changes, user onboarding workflows, or performance improvements. If you want to see the code of a pull request in action you will need to clone the branch in your local machine, redeploy your local environment, probably reconfigure your data, and then validate the changes. This is a lot of friction. And it could be hard to do by people from the product team, for example. Luckily, preview environments are here to help!

A **preview environment** is an ephemeral environment created with the code of your pull requests. It provides a realistic environment to see your changes live before merging to master. A link to the preview environment is added to the pull request, so everyone in your team can see your changes live with just one click. The preview environment will be updated on each commit, and finally destroyed when the pull request is closed. They help to catch errors before bad code is merged to master and breaks your staging environments for everyone.

What is the best way to create your preview environments? Do you need a lot of scripts and automations? No, you don't. You can leverage Kubernetes to simplify the management of your preview environments.

## Deploying preview environments on Kubernetes

[Kubernetes](https://kubernetes.io/docs/concepts/overview/what-is-kubernetes/) is the de facto standard to deploy applications. In their own documentation words:

<div class="book-quote">
Kubernetes is a portable, extensible, open-source platform for managing containerized workloads and services, that facilitates both declarative configuration and automation. It has a large, rapidly growing ecosystem.
</div>

I'm not going to extend on the benefits of Kubernetes here (there are tons of blog posts about it). Instead, I will focus on the key features provided by Kubernetes that make it a perfect fit to deploy your preview environments. These features are:

- Namespaces
- Fast application startup times
- Ingress, certificates, and wildcards
- Optimized resource allocation
- Declarative workloads and dynamic infrastructure
- Production-like integrations

Let's get into each of them in detail!

### Namespaces

A namespace is similar to a virtual cluster inside your Kubernetes cluster. You can have multiple namespaces inside a single Kubernetes cluster, and they are all logically isolated from each other.

Namespaces are the perfect boundary for preview environments. Namespaces are easy to create and dispose.
Deploy each preview environment on a different namespace to make sure you don't have name collisions and incompatibilities between your different environments. When your pull request is closed, remove the associated namespace and eveything created by your preview environment will be destroyed in seconds.

### Fast application startup times

A Kubernetes cluster serves as a (pre-created) pool for your preview environments. Each time there's a pull request, you should create a namespace (almost instant), build your Docker images (very fast if you optimize your docker cache behavior) and deploy your application on Kubernetes. Kubernetes is built for high scale and fast deployments. Your containers will be ready in seconds. This is much faster, cheaper, and easier to configure than creating VMs for each preview environment.

### Ingress, certificates, and wildcards

A Kubernetes Ingress Controller is a specialized load balancer for Kubernetes environments. It can be used to share a single cloud load balancer between all the applications running in the cluster. It provides L7 support to route traffic to your application based on the incoming request domain.

Ingress controllers make it easier, faster, and cheaper to configure access to your preview environments. For example, you can create an ingress rule to forward traffic from the https://my-app-pull-request-1.previews.com domain to the preview environment deployed in the namespace `pull-request-1`. And you can create another ingress rule to forward traffic from the https://my-app-pull-request-2.previews.com domain to the preview environment deployed in the namespace `pull-request-2`.

And this is not all. You can associate a wildcard certificate (*.previews.com) to these ingress rules, point the wildcard domain *.previews.com to the public IP of your ingress controller, and you will be good to go. All your preview environments will have a different domain with TLS support 💥.

### Optimized resource allocation

Containers running on the same Kubernetes cluster node share the CPU and Memory resources of the node. This can be fine tuned with [requests and limits](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/), but it's very convenient for preview environments.

Preview environments don't usually receive much traffic. There could be a spike while your application is starting, but they will probably consume almost no CPU and very little memory once they're up and running. This makes it possible to deploy dozens of containers on the same cluster node and reduce your cloud bill when using preview environments 💸.

### Declarative workloads and dynamic infrastructure

One of the core features of Kubernetes is its declarative application deployment approach. This means, for example, that you tell Kubernetes to deploy your application and Kubernetes takes care of recreating your application pods if a cluster node goes down.

This is very handy because you can configure your Kubernetes [Cluster Autoscaler](https://github.com/kubernetes/autoscaler) to create and destroy nodes in the cluster to fit the current number of preview environments. As nodes get created and destroyed, your application pods will be moved between nodes with no downtime. Moreover, you can configure your cluster with AWS spot instances or GCP preemptible nodes and save up to 75% of your cloud provider cost.

### Production-like integrations

Finally, running your preview environments in Kubernetes gives you a much more realistic environment. You'll test your preview environments with the same security, network, ingress configuration, cloud infrastructure, etc...as your production environments. You could even integrate your preview environments with vault secret managers, network policies, monitor tools like Prometheus, visualization tools like Grafana, and any other tool from the rich Kubernetes ecosystem.

## Next steps

Kubernetes has the right building blocks to manage preview environments on each pull request, but it requires you to glue a few pieces together. At [Okteto](https://okteto.com/) we have done this for you to make it super easy to configure preview environments on your Git repositories. Okteto supports your favorite application formats: Helm, Kustomize, Kubectl, or Docker Compose. Head over to our getting started guides to configure preview environments with [GitHub Actions](https://www.okteto.com/docs/cloud/preview-environments/preview-environments-github/) or [Gitlab](https://www.okteto.com/docs/cloud/preview-environments/preview-environments-gitlab/) and start enjoying the benefits of preview environments today.
