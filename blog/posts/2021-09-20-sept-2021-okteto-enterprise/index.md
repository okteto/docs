---
title: "September 2021 Okteto Enterprise Release"
description: "New features in Okteto Enterprise include updates to preview environments, more info available in the administrator dashboard, and more!"
slug: sept-2021-okteto-enterprise
date: 2021-09-20
authors: ["melissa-williams"]
tags: ["kubernetes", "cloud-native", "development", "okteto-enterprise", "preview-environments"]
image: ./img/02dba3739471.jpg
---

September included many upgrades and updates to features and dependencies for Okteto Self-Hosted customers. Read on to find out what’s new in Okteto Self-Hosted.

<!-- truncate -->


## Preview environments

One big change to preview environments this month is you can now run a preview environment while another deployment is running. When your additional preview environment is from the same repo, it will go into the queue, instead of the first preview environment failing. This feature can be helpful when you’re pushing several commits to a repo and want changes to show as they are added. 

## Upgrades and updates

We can now support Kubernetes 1.20 and 1.21. 

We’ve updated to `cert-manager` 1.5.2, and `reloader` 0.0.99.

## Autoscaler and garbage collector updates

Information about your autoscaler and garbage collector are now available right on the administrator dashboard. 

It's now possible to configure your autoscaler based on the number of pods, cpu, and memory. Previously, the autoscaler could only be configured by number of pods, which made for an easy configuration, but was less flexible. We’re happy to report that we can now support all these other configuration options as well! 

## Updates to logs

The display of logs is now based on events, which means that logs will not only arrive more smoothly, but okteto will also make significantly less calls to Kubernetes, improving the performance of both Okteto and the cluster.


## Manually sleep a namespace 

Administrators can now manually sleep a namespace in addition to the auto sleep function that already exists. This is helpful if you have a team member who will be on vacation or won’t be using their namespace for a prolonged period of time. 

## Updated pipeline 

We’ve been updating our pipeline to have more pre-installed tools. This month, we’ve added two popular open source file management tools `jq` and `yq`. 

## Improving build stickiness 

When you deploy a build on a pipeline, typically you’ll run more than one build server. In the past, this meant your build would get randomly assigned to one of the available services and could be slow. Now, we've made your okteto builds sticky, which will make your builds run much faster. For example, if you run `okteto build` 3 times it will now go to the same build server each time so you reuse connections, caches, and previous artifacts.

## Security is a top priority 

We’re investing in a lot in scanning capabilities and fixing vulnerabilities. We care about security so we continue to fix critical and high vulnerabilities as they arise. 

## Questions?

Have questions about using self-hosted Okteto with your team? [Schedule a time on our calendar](https://okteto.com/schedule/) to chat with us and see a demo of our Self-Hosted offering (suitable for teams of any size).
 
Happy Coding!
