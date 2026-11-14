---
title: "Best Practices in Kubernetes Security"
description: "Best practices to secure a Kubernetes cluster: RBAC, Pod Security Standards, network policies, etcd encryption, audit logging, and least privilege."
slug: best-practices-in-kubernetes-security
date: 2021-10-04
authors: ["joydip-kanjilal"]
tags: ["kubernetes", "security", "cloud-native"]
image: ./img/7934a32b2260.jpg
---

Kubernetes is great at orchestrating containers, but a cluster isn't secure by default: every new workload, user, and integration adds to its attack surface. This guide explains which parts of a cluster attackers target, and the best practices that protect them, from access control and pod security to etcd encryption and audit logging.

<!-- truncate -->

## The Kubernetes Control Plane and Its Components

The control plane is the brain of the cluster: it manages the worker nodes and the workloads that run on them, and it's the main point of access for administrators and users. It runs on one or more control plane nodes, and its main components are:

- **etcd**: the key-value store that holds the configuration and state of every object in the cluster.
- **kube-apiserver**: the REST API that every operation in the cluster goes through.
- **kube-controller-manager**: the controllers that watch the state of the cluster and move it toward the desired state.
- **kube-scheduler**: the component that decides which node runs each new pod.

An attacker who gains access to the API server or the control plane can compromise the entire cluster: deploy new pods, modify the existing ones, or delete them. That's why most of the practices below are about who can reach the control plane and what they can do with it.

## Kubernetes Security Challenges

Each new container increases the attack surface, so securing Kubernetes requires visibility into every workload and every request to the API. Kubernetes gives you the building blocks, but you have to configure them.

### Securing the Control Plane

Monitor the integrity of the critical Kubernetes files, so you get notified as soon as the configuration of the cluster changes. Critical files are the ones that, if compromised, could bring down the whole cluster. Watch for:

- Creation or removal of files or directories
- Renaming of files or directories
- Changes to the security settings of a file or directory, such as permissions or ownership
- Changes to the files of a container

You can read more about it in [this guide from Trend Micro](https://www.trendmicro.com/vinfo/us/security/news/virtualization-and-cloud/the-basics-of-keeping-your-kubernetes-cluster-secure-part-1).

### Securing the Kubernetes API Server

The API server is the gateway to the control plane. Give it a private IP address, keep the cluster private, and disable access to the API server from public IP addresses, so attackers can't reach it from the internet. Expose your services through a load balancer or an API gateway that opens only the ports you need, and use Role-Based Access Control (RBAC) to restrict what authenticated users can do.

## Kubernetes Security Best Practices

Kubernetes is completely API-driven, so the first strategy is to control who can access the cluster and what they can do. These are the practices to follow.

### Enable Role-Based Access Control (RBAC)

[RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) controls who can access the Kubernetes API and which actions they can perform, such as creating, editing, or deleting resources. Most distributions enable it by default, but it still has to be used well:

- Prefer namespace-scoped permissions (Roles and RoleBindings) over cluster-wide ones (ClusterRoles and ClusterRoleBindings).
- Don't grant cluster-admin rights, not even for debugging. Grant access only when it's needed.
- Remove duplicated, inactive, and unused roles, so every permission that exists is one that's in use.
- Disable the legacy Attribute-Based Access Control (ABAC) authorizer.

Tools like [audit2rbac](https://github.com/liggitt/audit2rbac), which generates roles from the requests in your audit logs, and [rbac-tool](https://github.com/alcideio/rbac-tool), which analyzes and visualizes your RBAC configuration, help you keep permissions to the minimum. [Demystifying RBAC in Kubernetes](https://www.cncf.io/blog/2018/08/01/demystifying-rbac-in-kubernetes/), from the CNCF, is a good introduction.

### Enforce Pod Security Standards

The [Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/) define three levels of restrictions for pods: Privileged, Baseline, and Restricted. Pod Security Admission, built into Kubernetes, enforces them per namespace with a label. Use the Restricted level wherever you can: it prevents privileged containers, running as root, host namespaces, and privilege escalation. Pod Security Admission replaced PodSecurityPolicy, which was removed in Kubernetes 1.25.

### Enforce Resource Limits With Policy as Code

Without limits, a container or a pod can consume more resources than the node has, and a compromised workload can starve the rest of the cluster. Require every workload to set resource requests and limits, and enforce it with policy-as-code tools such as [Kyverno](https://kyverno.io/), [OPA Gatekeeper](https://open-policy-agent.github.io/gatekeeper/), or [Terrascan](https://github.com/tenable/terrascan), which check configurations against your policies and flag any violation.

### Keep Kubernetes Updated

Older Kubernetes versions have known vulnerabilities that attackers can exploit. The Kubernetes project maintains only the three most recent minor releases, so upgrade your clusters regularly to stay on a supported version and get its security patches.

### Restrict API Access

Most managed Kubernetes services already integrate access to the API with Identity and Access Management (IAM) or a directory service like Active Directory. If your cluster doesn't, configure an authentication method, for example with OpenID Connect. Also restrict access to the API by IP address, so only trusted networks can reach it.

### Restrict SSH Access to the Nodes

Disable SSH access to the Kubernetes nodes to reduce the risk of unauthorized access to their resources. Users who need to inspect a container can use `kubectl exec`, which goes through the API server and its access controls, instead of connecting to the host.

### Isolate the Kubernetes Nodes

Put the Kubernetes nodes on a dedicated network that isn't reachable from the corporate network, keep control plane traffic and data traffic separate, and configure the nodes to accept connections only from the control plane.

### Apply Network Policies and Monitor Network Traffic

By default, every pod can talk to every other pod. [Network policies](https://www.okteto.com/blog/kubernetes-network-policies/) restrict that traffic: start by denying all traffic in a namespace and then allow only the connections each workload needs. Monitor network activity, compare it to the traffic your policies allow, and remove the connections that are no longer needed to keep the attack surface small.

### Allowlist Processes

Define the list of processes that are allowed to run in each pod. If an attacker gets into the cluster and starts a malicious process, it isn't on the allowlist, so you can detect it and report it immediately. [AppArmor](https://kubernetes.io/docs/tutorials/security/apparmor/), a Linux security module that Kubernetes supports, can restrict what each container is allowed to run.

### Monitor the Cluster

Monitoring tells you about the health of your cluster and its workloads, and it gives you the context to investigate suspicious behavior: unusual resource usage, pods that restart, or traffic that doesn't match the usual patterns. Tools like Prometheus, Grafana, and Jaeger collect metrics and traces, and alerts let you act as soon as something goes wrong.

### Protect etcd With TLS, a Firewall, and Encryption

etcd holds every object in the cluster, Secrets included. An attacker with access to etcd controls the whole cluster, and even read access is dangerous, because it can be used to escalate privileges. Protect etcd with TLS and a firewall, so only the API server can reach it, and [encrypt its data at rest](https://kubernetes.io/docs/tasks/administer-cluster/encrypt-data/).

### Turn On Audit Logging

[Audit logs](https://kubernetes.io/docs/tasks/debug/debug-cluster/audit/) record the sequence of requests to the Kubernetes API: who did what, when, and how. They help you investigate incidents and detect misconfigurations or misuse before sensitive data is compromised.

Enable audit logging and watch for unusual requests, particularly authorization failures, which are logged with the status "Forbidden": an attacker may be trying to use stolen credentials. An audit policy file defines which events to record and at which level: None, Metadata, Request, or RequestResponse.

### Secure Every Layer

Kubernetes security goes beyond the cluster. The [Kubernetes documentation](https://kubernetes.io/docs/concepts/security/overview/) describes four layers, the 4Cs of cloud native security, and each one needs its own controls:

- **Cloud**: the cloud or data center infrastructure the cluster runs on.
- **Cluster**: the Kubernetes components and the workloads that run on them.
- **Container**: the container images and runtimes. Scan images for vulnerabilities and use images from trusted registries.
- **Code**: the source code of your applications and their dependencies.

No single tool protects every layer, so combine the right tools for each one.

### Apply Least Privilege and Defense in Depth

Give every user, workload, and component only the permissions it needs, and layer your controls. If an attacker compromises one component, they still have to get through several more layers before they can cause real damage or reach sensitive data.

## Conclusion

Securing Kubernetes is hard, but not impossible. Start with the practices in this guide to reduce the attack surface of your clusters, and keep in mind that securing the cluster is only part of the job: your container images, configurations, and runtime operations need the same attention. Kubernetes has a large community that faces the same problems, so learn from it, and contribute back when you can.
