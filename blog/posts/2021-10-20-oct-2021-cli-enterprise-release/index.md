---
title: "What's New in Okteto CLI and Enterprise October 2021"
description: "Check out what's new in Okteto CLI and Enterprise! You can now set your context for all Okteto commands, manually sleep a namespace and more!"
slug: oct-2021-cli-enterprise-release
date: 2021-10-20
authors: ["melissa-williams"]
tags: ["kubernetes", "cloud-native", "development", "okteto-cli", "okteto-enterprise"]
image: ./img/6b6126193d1d.jpg
---

Fall is here, and with it, we have some cool new features that we hope will help you have a better developer experience while using Okteto. 

<!-- truncate -->

Here’s what’s new in both our CLI and Okteto Self-Hosted. 

## What’s new in CLI

### Okteto context 

We’re really excited about our new command `okteto context` which allows you to set your context once, and then all okteto commands you run will use that particular context. Specifically, this will help to avoid those instances when you might accidentally run `okteto up` against production and cause an outage. 

### `okteto up` translation uses a mirror 

This change allows a user to do `kubectl apply` changes to their deployments while there is an active okteto up session.

### Support for building docker images locally 

Thanks to our new support for building images using your local docker daemon, you can now tell Okteto to use your local docker to build images instead of using Okteto’s build service. This is another features that makes using our open source CLI easier for customers and helps to improve the overall developer experience. 


### Support for Okteto Manifest override 

We now support multiple manifests in Okteto CLI, which means you can override values in the manifest that will affect only your stack, and not affect the rest of the team. This allows you to test things out on your end and not affect anyone else’s stack in the process. 

## What’s new in Okteto Self-Hosted 

### Disable CLI metrics 

We’ve always had a way for our Self-Hosted admins to disable analytics coming from their Self-Hosted accounts. Now, we also have a way for them to disable analytics from both their Self-Hosted and CLI accounts if the admin doesn’t want those metrics being saved. 

### Manually sleep a namespace 

Coming this month: Admins can sleep a namespace manually, rather than just waiting for it to naturally sleep. This is helpful in conserving resources when an employee is going to be out of the office, or when you know they won’t be using a namespace during a specified time.  

### New destroy all command 

We have now created the ability for a developer to destroy all resources in a namespace at once without actually having to destroy the namespace in the process.

### Namespaces that are terminating 

You can now see a list of namespaces that are currently in the process of terminating, rather than just those that are still active. 

## Upgrading dependencies

Of course, we’re always upgrading dependencies to make sure we have an efficient and secure product for our customers. This month, we’re upgrading to buildkit 0.9.

Have you tried Okteto? We’d love for you to try it out for yourself and see how developers are coding faster with Okteto, and avoiding the dreaded sluggish laptop. [Click here to get your free account](https://www.okteto.com/signup/) Log in with GitHub and give it a try!

Happy coding!
