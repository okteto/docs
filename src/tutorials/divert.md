---
title: Getting started with Okteto Divert
description: Include external resources in your development environments
id: divert
---

import Image from "@theme/Image";
import useBaseUrl from '@docusaurus/useBaseUrl';

 enables you to create development environments with only the services you are actively developing while sharing an existing shared environment that runs all your microservices. For large environments, this often results in a substantial reduction of infrastructure cost and complexity.

This tutorial will show you how to use [Okteto Divert](/docs/reference/okteto-manifest#divert) to configure and deploy a Development Environment that only includes the services that you are actively developing and automatically falls back to a shared ephemeral environment for the rest of the services. You can find the code for the sample app we work with [for this tutorial here](https://github.com/okteto/movies-catalog).

## Prerequisites
- Access to an Okteto instance
- Okteto CLI installed and configured

## Step 1: Deploy the shared environment

We will use [the movies app](https://github.com/okteto/movies-catalog) to illustrate divert as part of your development environment.  To begin, create a namespace named `staging` on your Okteto instance. This is where our shared environment will run.

```
okteto namespace create staging
```

Then, deploy the Movies app:

```
git clone https://github.com/okteto/movies-catalog
cd movies-catalog
okteto deploy
```
The `movies-catalog` application is composed of three microservices: Frontend, Catalog, and Rentals. Each service is defined in a dedicated repository and deployed together using the [dependencies](/docs/reference/okteto-manifest#divert) feature of the Okteto manifest. 

This is what the application looks like:

 <Image
    src={require("@site/static/img/divert-staging-diagram.png").default}
    alt="Movies App diagram"
    width="900"
  />

After a few seconds, the entire application will be built and deployed in the `staging` service. Feel free to interact with it to familiarize yourself with it.  Rent one or two movies.


## Step 2: Deploy your personal development environment

One of the main advantages of `divert` is that you only need to deploy the services you are actively developing on your namespace rather than the full application. For the purpose of this tutorial, we are going to work on the `rentals` service.

First, switch back to your personal namespace (replacing `cindy` with your Okteto username):

```
okteto namespace cindy
```

Then, deploy the Rentals service of the Movies app:
```
git clone https://github.com/okteto/movies-rentals
cd movies-rentals
okteto deploy
```

While the application deploys, let's take a look at the deploy section of the Okteto manifest:
```
deploy:
  commands:
    - okteto deploy -f mongodb-compose.yml
    - helm upgrade --install rentals chart --set image=${OKTETO_BUILD_RENTALS_IMAGE}
  divert:
    namespace: staging
``` 

The `deploy` commands tell Okteto to deploy the rentals service and database. The `divert` key tells Okteto to divert traffic to the `staging` namespace for all the other services. 


## Step 3: Interact with the application

Now, let's interact with your `diverted` application. To try the application, click on the endpoint of the frontend service (e.g. https://movies-cindy.okteto.example.com). Thanks to divert, you can interact with the entire application, even if you only deployed one service.

If you remember, we rented a few movies in Step 1 of the tutorial. Now check out the version deployed on your personal namespace. Notice that the movies rented are different than the ones in staging? This is because Okteto is using your copy of the rental service, including the database. Any changes you make to that service (including synchronizing your code via `okteto up`) will only impact the services deployed on your namespace.

:::note
### How does this work?
When using Divert, Okteto will use the hostname of the endpoint to route things accordingly. In this example, a request to `https://movies-staging.okteto.example.com` will only use the staging services, while a request to `https://movies-cindy.okteto.example.com` will go to your namespace first, and if the service is not there, then it will fallback to the shared namespace.

<Image
    src={require("@site/static/img/divert-personal-diagram.png").default}
    alt="Movies App diverted"
    width="900"
  />
  
:::

## Next steps
Congratulations, you just deployed your first `diverted` development environment 🚀

Diverted development environments are compatible with the rest of Okteto's features. Head over to our getting started guides for Go, ASP.NET, Java, Node.js, PHP, Python, or Ruby to see how to integrate it with the rest of your applications.
