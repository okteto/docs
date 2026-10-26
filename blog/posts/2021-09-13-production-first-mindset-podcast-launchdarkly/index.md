---
title: "Production-First Mindset Podcast with LaunchDarkly"
description: "Ephemeral environments can improve the quality of your product because you have that extra level of testing and review. Find out why LaunchDarkly uses Okteto for ephemeral environments."
slug: production-first-mindset-podcast-launchdarkly
date: 2021-09-13
authors: ["melissa-williams"]
tags: ["ephemeral-environments", "launchdarkly", "production-first-mindset", "podcast"]
image: ./img/9e1b4a870a22.jpg
---

We recently listened to this great episode of Production-First Mindset Podcast with guest John Kodumal, CTO for LaunchDarkly. In the episode “The Nirvana of Deploying a 100x A Day” John talks about ephemeral environments for productivity, whether you should build a tool or buy it, how LaunchDarkly maintains consistency as their organization scales and much more. 

<!-- truncate -->

[You can check out the full episode here.](https://web.archive.org/web/20220930093654/https://www.productionfirstmindset.com/1815444/9103285-john-kodumal-launchdarkly-cto-the-nirvana-of-deploying-100x-a-day)


## Ephemeral environments for productivity 

LaunchDarkly uses Okteto to create [ephemeral environments to improve productivity](/blog/preview-environments-for-kubernetes/). One reason ephemeral environments are useful is the ability to spin up a copy of software for every PR. John shared his view that anything you merge to master should be deployable, but if no one has tried the code out, you’re missing something. 

Using ephemeral environments can improve the quality of what you’re producing because you have that extra level of testing, review, and comfort. 

## Build it or buy it?

Sometimes, the decision is not, should we have ephemeral environments, but should we use a SaaS product or should we build our own. John pointed out several reasons why investing in a SaaS rather than building your own could be a good solution for your company. Some examples he gave were:

- Being able to make sure an environment is spun down when a branch is closed 
- The ability to see a list of available environments, and also the ability to test one quickly 
- Having the ability to collaborate with someone in local development, especially in a microservices situation

Another thing to consider is that costs will go up when you start spinning up more environments, so having a lifecycle management system becomes really important. 

Take a listen to the episode to learn more about this and other ways LaunchDarkly is maintaining quality and consistency in their products as their organization scales. Have questions about how preview environments can help your organization be more productive? [Schedule a time to talk with us](https://okteto.com/schedule/) about ephemeral environments for your company.
