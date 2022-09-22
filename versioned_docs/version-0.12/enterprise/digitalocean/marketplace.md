---
title: Getting started after deploying Okteto
---

After you have downloaded your `kubeconfig` file and can successfully connect to your DigitalOcean Kubernetes cluster (see https://cloud.digitalocean.com/kubernetes/clusters/ if you haven't connected to your cluster), follow the instructions below to start using Okteto.

## Initial Configuration

The first step is to get your admin token. Run the following command in a terminal shell to retrieve it:

```console
kubectl get sa -n=okteto do-okteto-enterprise -ojsonpath='{.metadata.labels.dev\.okteto\.com/token}'
```

Second, start a port-forward to the ingress service by running the command below:

```console
kubectl port-forward service/do-ingress-nginx-controller 8443:443 --namespace okteto
```

Third, open your browser and go to [https://localhost:8443/#admin](https://localhost:8443/#admin) to load the admin screen.

Use the admin token you retrieved on the first step to log in to the admin screen.

Once you log in to the admin page, you'll need to provide the following values to complete Okteto's initial configuration.

1. The email of the owner of the application
1. A [dedicated subdomain](#Subdomain) for your Okteto instance
1. Your Kubernetes cluster's [public endpoint](#Cluster-Public-Endpoint)
1. Your [Okteto Enterprise license](#License) (optional)
1. The Client ID and Client Secret of a [GitHub OAuth app](#Authentication)
1. A list of the GitHub Usernames allowed to log into your Okteto instance (optional, leave it empty to allow everyone)
1. A DigitalOcean [personal access token](#Personal-Access-Token)

Press `Save` once you're ready to apply the new configuration. It'll take about 30 seconds for the configuration to be applied.

Your Okteto instance is now fully configured. It will be available via https://okteto.$SUBDOMAIN (e.g. https://okteto.dev.example.com). The [next section ](#DNS-configuration) explains how to configure the DNS for this.

## DNS configuration

Run the following command in a terminal shell to get the External IP address of the Load Balancer.

```console
kubectl get svc -n=okteto -l="app=nginx-ingress,component=controller"
```

Create a [wildcard A record](https://cloud.digitalocean.com/networking/domains) for the entire subdomain and point it to the load balancer's external IP.

![DNS configuration](https://www.okteto.com/docs/enterprise/digitalocean/dns.png)

## More information

### Subdomain

Okteto can automatically create HTTPS endpoints for the applications you deploy in your cluster. We recommend that you give Okteto a dedicated subdomain to prevent endpoint clashes with other applications.

The Okteto web UI will always be available at https://okteto.$SUBDOMAIN.

The subdomain must be [registered with Digital Ocean](https://www.digitalocean.com/docs/networking/dns/how-to/add-domains/).

### Cluster Public Endpoint

This is the fully qualified URL of your Kubernetes cluster's apiserver. You can get it from the `kubeconfig` file you downloaded from DigitalOcean:

```
apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: DATA+OMITTED
    server: https://0b84ec60-fe41-4994-8e76-b53e00859ef9.k8s.ondigitalocean.com
  name: do-sfo2-ramiro
  ...
```

### License
Okteto Enterprise is free to try. You get all the features of [Okteto Enterprise](/docs/0.12/enterprise/) for up to 3 users with 3 namespaces each. Need more? [Let's talk](https://okteto.com/#talktous).

### Authentication

Okteto Enterprise uses GitHub OAuth as the authentication provider. You'll need to create a [GitHub OAuth app](https://developer.github.com/apps/building-oauth-apps/creating-an-oauth-app/) with the following values:

*Homepage URL:*
https://okteto.$SUBDOMAIN

*Authorization callback URL:*
https://okteto.$SUBDOMAIN/auth/callback

### Personal Access Token

Okteto Enterprise requires a DigitalOcean personal access token with read/write permissions to create DNS entries when responding to [ACME DNS-01 challenges](https://letsencrypt.org/docs/challenge-types/#dns-01-challenge). The entries will be created in the subdomain you provided in the configuration. Create your [personal access token here](https://cloud.digitalocean.com/account/api/tokens).

## Support

If you get stuck or have any questions, feel free to reach out to us at hello@okteto.com, [Twitter](https://twitter.com/oktetohq), or [our community](https://community.okteto.com/).