---
title: "We Need a Cloud-Native Development Experience"
description: "If Your Application is Going to Run in a Multi-Node Cluster, Why Are You Developing it in a Single Machine?"
slug: we-need-a-cloud-native-development-experience
date: 2021-09-29
authors: ["ramiro-berrelleza"]
tags: ["ephemeral-environments", "okteto", "development", "best-practices"]
image: ./img/6b6126193d1d.jpg
---

In the beginning, development was straightforward: You wrote code, built a binary, and then ran it in your machine to validate that things worked. You went through this a few times, and once you were happy, you would then SSH into a server, copy your binary, and restart a process. Applications have evolved a lot since those times. Architectural patterns evolved from those single binaries into microservice-based orchestrations that span multiple machines. And our deployment toolkits grew with them: We no longer SSH into servers and copy binaries. We now use sophisticated container orchestrators like Kubernetes and mature deployment practices like GitOps.

<!-- truncate -->

And yet, the development workflow has stayed pretty much the same throughout the years. We clone the code of our project, we start a local copy of the application, we write code, we build a new version of our application, we see the result of it, and we do it all over again (these days, we call this the inner loop). The problem is that instead of compiling a binary and starting a process, we now have to build a bunch of containers and start an entire orchestration of services. 

We go through a lot of trouble to make our machines look like a one-node version of our production clusters. And we are not clueless. We know that this will eat all our memory, CPU, and battery. We know this introduces configuration drift. We know this creates manifest duplication (raise your hand if you run Docker Compose for local dev and Kubernetes in production). We know this makes a dev version, a CI version, and a production version of our services. And still, we keep doing it. Why?

## Development is not production

We have to create these mini-clusters because production and development environments have evolved in opposite directions for the last ten years. Think about this for a second. What do you want from a modern production environment: 

- You want it to be immutable
- Easy to redeploy
- Scalable 
- Resilient
- Automated 

And what does a typical development environment look like:

- It changes with every code change
- Everything runs on a single machine
- It's installed and operated by hand 

The current generation of developer tools helps us a lot. Products like Minikube, Docker Desktop, or VSCode's Dev Containers enable us to transform our development machines into one-node clusters. But the experience is still slow and full of friction. And they do little to solve what I believe is the root cause behind this: **Today, production and development environments are opposites**. 

## Production is not development 

When talking about this problem, the industry's first reaction was: Oh, this is simple; let's give every developer their cluster so they can develop in a realistic development environment. Cloud providers like Civo, AWS, Azure, or Google Cloud certainly make it feasible. Except that now, we've made the developer experience even harder. 

Developers now need to be experts in the cloud provider, the infrastructure, the orchestrator, and even the software distribution model. The developer can't simply change a line of code and see the result anymore, like in the `rails s` days. No, our developer now has to perform all these tasks before seeing the results of their work:
- Change a line of code
- Run a make command to build all the artifacts 
- Push the artifacts to a registry 
- Run the correct argo/helm/kubectl/docker incantation to deploy the application 
- Wait for the application to be redeployed 
- Finally see the result of their changes

Don't you miss running `rails s`?

While this is a step forward in the development vs. production divide, this is a slow inner loop. And a slow inner loop only has two outcomes: very frustrated developers (who will eventually quit your team), or very motivated developers who end up hacking their applications to run them on a one-node cluster. I've been both types of developers. And neither is fun.


## We need a Cloud-Native development experience

I didn't make up the points above. They result from hundreds of conversations about developer experience with developers, designers, product managers, founders, and even execs at hundreds of companies. Yes, I do have a thing for developer experience. I even quit my job to do this full time 😜.

And my conclusion is that a modern Cloud-Native development experience needs to follow these three principles:

1. It has to be fast: developers should see their changes in seconds.
1. It has to be replicable: deploying a new environment should be "free".
1. It has to be realistic: it should use the same configuration and infrastructure as production.

These are the core principles that guide the Cloud-Native development experience we are building. We needed a new generation of developer tools that match the new generation of applications. We need `rails s`, but for a cloud-native world. And that's Okteto.

**If your application is going to run in a multi-node cluster, why are you developing it in a single machine?** [That is precisely the problem we are tackling with Okteto](https://okteto.com), and it would make my day if you were to try our approach, and [let me know what you think about it](https://twitter.com/oktetohq).
