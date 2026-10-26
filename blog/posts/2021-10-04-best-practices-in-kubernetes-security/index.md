---
title: "Best Practices in Kubernetes Security"
description: "Learn how you can include preview environments and automate your CI/CD process using GitHub Actions and Okteto."
slug: best-practices-in-kubernetes-security
date: 2021-10-04
authors: ["joydip-kanjilal"]
tags: ["kubernetes", "security", "cloud-native"]
image: ./img/7934a32b2260.jpg
---

> Joydip is a Microsoft Most Valuable Professional in ASP.NET, speaker, and author of several books and articles. He has more than 25 years of experience in IT, and more than 18 years in Microsoft .NET and its related technologies. He has authored more than 500 articles in some of the most reputed sites worldwide, including MSDN, InfoWorld, CodeMag, Tech Beacon, Auth0, MSSQLTips, Tech Target, etc.

<!-- truncate -->

## Introduction

There has been a surge in the adoption of containers such as Docker over the past few years. These containers offer lightweight virtualization and encapsulation for packing, deploying, and scaling microservices.

Containers are small, portable, executable application components that comprise source code and the operating system libraries and dependencies required for the code to run in any environment. You can quickly and effortlessly start new services, run several instances on the same host to save resources, and scale up and down as needed.

Containers are becoming more popular, driving the need for tools to manage and orchestrate them on a larger scale. With the introduction of containers came the expansion of the size of clusters and the diversification of microservices. As a result, container orchestration has become more crucial.

This is exactly where Kubernetes comes to the rescue. Over the past few years, Kubernetes' acceptance has grown leaps and bounds. This exponential growth is predominantly because of its ability to improve efficiency and agility in an organization.

## What is Kubernetes?

Kubernetes, also known as K8s, is a portable, open-source, extensible, vendor and cloud-agnostic container orchestration platform designed to automate container scaling, deployment, and management. Although Kubernetes is excellent at orchestration, it's not adept at handling security. As a result, you must use the appropriate deployment architecture and security best practices to eliminate security flaws and thwart any security attacks.

Here are a few reasons why you should use Kubernetes:

**Open-Source:** Kubernetes is an open-source container orchestration system and a community-led initiative governed by Certified Kubernetes Conformance Program (CNCF).

**Portability and Flexibility:** You can use Kubernetes with any container runtime and any underlying infrastructure provided that the host operating system is either Windows or Linux.

**Multi-cloud support:** Kubernetes can host workloads that are executed both on a single cloud as well as distributed across several clouds.

**Load balancing:** To guarantee that the deployment is reliable, Kubernetes supports load balancing and network traffic distribution.

**Scalability:** Kubernetes enables your application to be scaled both vertically and horizontally. Since containers are lightweight by design, you can build them at the drop of a hat and then scale your application quickly.

**Vendor and Cloud agnostic:** Kubernetes is Cloud and Vendor neutral. It can run on Amazon Web Services (AWS), Microsoft Azure, Google Cloud Platform (GCP), or even on premise.

## The Kubernetes Control Plane and its Components

The Kubernetes Control Plane, a.k.a. the Master Node, serves as the brain of the cluster that manages the worker nodes. It's responsible for ensuring that the system is up and running and is in perfect working order. For administrators and users, it acts as the main point of access for managing the various nodes in the cluster. The control plane comprises the Kubernetes API server, etcd, and several controllers.

The following are the purposes of each of the components of the control plane:

-   etcd - This is the fundamental component of a Kubernetes cluster used to store configuration data such that it's accessible to each node in a Kubernetes cluster.
-   kube-apiserver - This is a REST-based interface through which all communications pass and controls all management and operational functions in Kubernetes.
-   kube-controller-manager - This is a service that is responsible for keeping a close eye on the state of a cluster.
-   kube-scheduler - This component is accountable for scheduling cluster workloads.

Malicious attackers might try to gain access to the Kubernetes API Server and Control Plane. Once they have been hacked, the attackers may compromise the entire cluster by altering the pods. They can deploy new ones or modify or even delete the existing pods from the cluster.

## Kubernetes Security: Understanding the Challenges

While Kubernetes is a popular technology for delivering containerized apps, scaling Kubernetes environments is challenging. Each new container increases the attack surface. To effectively deal with Kubernetes security, you must have complete visibility into every managed container and application request.
Kubernetes is great at orchestration but not as adept at security. For all deployments, it's imperative to employ the appropriate deployment architecture and security best practices. We'll take a deep dive into some of the Kubernetes security best practices in the following sections.

### Securing the Control Plane

Integrity monitoring on the most critical Kubernetes files is a vital first step to securing the control plane. This way, you'll get an instant notification if the settings of your Kubernetes environment are altered in any way. Note that critical files are those that, if hacked or compromised, might cause the whole cluster to fail.

This can be achieved by implementing detection policies to monitor any suspicious filesystem changes on critical Kubernetes files such as the following:

- Creation or removal of files or directories
- Renaming of files or directories
- Changes to the security settings of a file or directory, such as permissions, ownership, and so on
- Changes made to the files pertaining a container

You can read more on this [here](https://www.trendmicro.com/vinfo/us/security/news/virtualization-and-cloud/the-basics-of-keeping-your-kubernetes-cluster-secure-part-1).

### Securing the Kubernetes API Server

To safeguard your Kubernetes API server, ensure it's on an authorized network and in a private cluster. To restrict unauthorized access to the Kubernetes API server, you should utilize Kubernetes Role-Based Access Control (RBAC).

Considered the Kubernetes control plane gateway, you should allocate a private IP address to the Kubernetes API server to protect it. Access to the Kubernetes API server from any public IP address should be disabled.

What then is the need to disable access from a public IP? The objective should always be to work with private nodes by disabling public access to prevent attackers from gaining control of the control plane. You should use a load balancer or an API gateway to expose a service on the web and enable the ports you require. The essence is that we should always strive to apply the least-privileged concept and ensure that everything is closed as a preventative measure.

## What is Kubernetes Monitoring?

Traditional monitoring no longer works for Kubernetes environments. However, you can adhere to the Kubernetes monitoring best practices to gain a deep insight into your system availability, performance, and the proper context to troubleshoot any problem if need be.

When you use Kubernetes monitoring, you may get insight into the current health of your cluster by looking at performance indicators such as resource counts, performance metrics, and a high-level overview of what is going on within your containerized application. It will help if you're notified when errors occur so that you may take appropriate action and resolve the issues.

Some of the popular Kubernetes monitoring tools include Prometheus, Grafana, Dashboard, Jaeger, etc.

## Kubernetes Security: The Best Practices

Since Kubernetes is completely API-driven, your first strategy should be managing and restricting who has access to the cluster and what activities they can do. To help you in this pursuit, take a look at these Kubernetes security best practices and guidelines you should adhere to protect your infrastructure.

### Enable Role-Based Access Control (RBAC)

Role-Based Access Control (RBAC) allows you to control who has access to the Kubernetes API and their actions, such as creating, editing, and deleting resources. Since the authorization controllers in Kubernetes are combined, you must activate RBAC and disable traditional Attribute-Based Access Control. Once RBAC has been implemented, you must ensure that it's used properly. For example, it's usually recommended to avoid using cluster-wide permissions in favor of namespace-specific permissions. If possible, avoid granting anybody cluster-admin rights, even for debugging purposes. It's far more secure to give access only when it's needed.

### Enforce Resource Management using Policy-as-Code

You need proactive resource management to establish predefined limitations on the resources used by both pods and containerized workloads. For DevOps teams, it's the most effective method to manage the production environment and to improve both operations and security at the same time. You can take advantage of policy-as-code tools to scan configuration data and check if it conforms to the codified policies.

In the absence of limitations on the resources that your containers and pods may use, you might find yourself in a position where they need more resources than are available. It would help if you created a policy that would make it imperative for Kubernetes configurations to specify resource limits to prevent such issues in the future. You might want to use policy-as-code tools like Terrascan to scan configurations and flag as soon as there is any non-conformance to the predefined codified policies.

### Always Keep Kubernetes Updated

Keeping your Kubernetes cluster up to date with the most current version is one of the most important security best practices you can follow. The old version of Kubernetes might be susceptible to attackers since they might get access to your Kubernetes cluster if you don't update Kubernetes with its most recent version. This activity must be performed regularly so that you have a most recent copy of Kubernetes.

### Restrict API Access

Most cloud-based Kubernetes implementations already limit access to the Kubernetes API of your cluster via the use of Identity and Access Management (IAM), Role-Based Access Control (RBAC), or Active Directory (AD). If your cluster doesn't already use one of these methods, you can typically configure one by using open-source projects to deal with different authentication methods. Additionally, access to the API should also be limited by the IP address, and access should only be provided to the trustworthy IPs.

The following open-source projects can help in this regard:

- [Audti2rbac](https://github.com/liggitt/audit2rbac)
- [Kubernetes RBAC](https://github.com/alcideio/rbac-tool)
- [StrongDM](https://www.strongdm.com/)

### Restrict SSH Access

It's an excellent practice to disallow SSH access to the Kubernetes nodes. This will lower the risk of unauthorized access to host resources on the cluster. Instead, it would help to ask the users to use the "kubectl exec" command to access the container environment without directly connecting to the host. You can also take advantage of Kubernetes Authorization Plugins to restrict user access to resources. You can even define access control rules for containers, namespaces, and operations.

### Isolate Kubernetes Nodes

You should ensure that a distinct network is dedicated to Kubernetes nodes. Additionally, it would help ensure that Kubernetes nodes are not accessible to the corporate network. Hence, Kubernetes control and data traffic should be kept separate. You should configure nodes in such a way that they allow connections from the master node only.

### Use Process Whitelisting

Process whitelisting is an efficient Kubernetes security technique that provides zero-trust guarantee as far as process security is concerned. You should create a list of processes that are allowed to run on each pod. Next, you should use this list as your application's whitelist.

Suppose an attacker succeeds in getting access to your cluster and begins running a malicious process. In that case, you'll easily identify the user since it's a new non-whitelisted process. If it isn't on the whitelist and isn't part of the pod's normal behavior either, it should be reported immediately.

The user can do process Whitelisting with admin privileges. [AppArmor](https://www.alcide.io/whitelisting-processes-on-kubernetes-using-apparmor/) is a popular security module for Linux that can be used for implementing process whitelisting in Kubernetes. [Here](https://www.alcide.io/securing-kubernetes-clusters-using-process-whitelisting/) is a good read on process whitelisting.

### Deploy Additional Controls

If you're using Kubernetes in a production environment, it's imperative that you deploy additional security controls. The reason is that you need complete visibility into the Kubernetes environment and the activities going on there. 

This would help you to avoid potential downtimes when deploying mission-critical applications. These controls exist as policies to enable you to restrict access to resources in the cluster.

Here are the security best practices for Kubernetes in production:

- Enable Kubelet authentication and authorization
- Establish security boundaries and isolate Kubernetes Nodes
- Monitoring network traffic to be able to limit communications
- Implement network security policies
- Create security policy for pods
- Use Process Whitelisting
- Images should be scanned for any security vulnerabilities
- Apply security updates on a regular basis
- Log extensively

### Monitor Network Traffic

Ideally, you should keep an eye on network activity and compare it to authorized traffic and traffic permitted by the Kubernetes network policy. The goal is to eliminate connections that are no longer required in order to minimize the attack surface. Additionally, you may strengthen the permitted network policy by removing any connections that aren't required.

### Adopt a Multi-Layered Security Approach

Cloud-native applications have diverse components and elements, making it imperative to look beyond containerized workloads to safeguard your Kubernetes deployments. Hence to secure your Kubernetes environment, you should adopt a multi-layered security strategy. The Kubernetes documentation recommends a multi-layered approach called 4C (Cloud, Container, Cluster, and Cloud) for securing your Kubernetes environments.

-   Cloud and data center infrastructure and other resources required to create Kubernetes environments
-   Container clusters that comprise the workloads that run on a particular cluster
-   Individual Containers, i.e., the software images used to instantiate workloads.
-   Source Code and container images

It would help if you took advantage of recommended tools to secure and protect each of these layers. However, you should know that you don't have one tool that can help protect all these layers.

### Enable Kubernetes Role-Based Access Control

Role-Based Access Control or RBAC is a critical security component of Kubernetes and one of the Kubernetes Deployment best practices. It enables you to implement access control rules to your Kube API; you may specify the permissions granted to users through RBAC.

Although RBAC is enabled by default, starting with Kubernetes 1.6, it should be used appropriately. It would be best if you took appropriate measures to minimize permission duplication and deactivate inactive and unused roles so that you can concentrate only on active components and avoid providing unnecessary permissions to a user.

If you want to specify who has access to the Kubernetes API and what rights they have, RBAC may assist you in doing so. When you activate RBAC, you must also disable the old Attribute-Based Access Control (ABAC) mechanism.

When implementing RBAC, you should prefer namespace-specific rights over cluster-wide permissions. Even while debugging, don't give cluster administrator access. It's safer to provide access only when required.

[Here]( https://www.strongdm.com/blog/kubernetes-rbac-role-based-access-control) is a good read on working with RBAC in Kubernetes. Here are some additional references that might help:

- https://docs.giantswarm.io/getting-started/rbac-and-psp/
- https://www.cncf.io/blog/2018/08/01/demystifying-rbac-in-kubernetes/
- https://jeremievallee.com/2018/05/28/kubernetes-rbac-namespace-user.html
- https://docs.openshift.com/container-platform/4.1/authentication/using-rbac.html
- https://thenewstack.io/three-realistic-approaches-to-kubernetes-rbac/

### Protect etcd with TLS, Firewall and Encryption

The etcd database is the primary source of data within a Kubernetes cluster and contains all cluster objects. It's where all your cluster objects are kept safe and secure. If the etcd database is exposed, sensitive data can be compromised. This will enable an attacker to gain access and control on your cluster in its entirety. You should take advantage of both encryptions for the data in transit and at rest to secure your data.

Note that even read access is not safe since it would enable an attacker to elevate privileges. You can protect etcd using TLS encryption and Firewall. Once you've secured the data in transit, you can encrypt the entire etcd data at rest so that the data residing inside your clusters are secure.

### Turn on Audit Logging

Audit logging keeps track of the sequence of events in a Kubernetes cluster. It helps the administrators investigate a potential issue by keeping a close eye on the activities performed by the users and the Kubernetes API and examine the sequence of events that caused the problem.

You can take advantage of Kubernetes audit logs to keep track of everything that happens in your Kubernetes control plane, including who, what, when, and how it happened. It may be very beneficial to keep an eye on your audit logs since it can assist you in detecting and mitigating misconfigurations or misuse of Kubernetes resources before sensitive data is compromised.

Ensure that audit logging is enabled and that you monitor API requests that are unusual or unwanted, particularly authentication failures. These log entries are marked with the status message "Forbidden." An attacker may be attempting to use stolen credentials if an authorization request is denied.

You can take advantage of the audit policy file to enable audit logging while specifying which events should be captured in the logs. You may choose from four different logging levels: None, Metadata only, Request, and RequestResponse.

### Leverage the Principle of Least Privilege and Defense-in-Depth

Take advantage of the principles of least privilege and defense-in-depth to protect your Kubernetes environments. As a result, even if the attacker has breached one component, i.e., one of the components has been compromised, the attacker will still not have complete access to the system. In essence, the attacker will have to penetrate several additional layers to cause any substantial damage or gain access to the sensitive data.

## What’s Next?

Keeping up with security concerns may be difficult. Just keep in mind that adopting several levels of protection will significantly decrease your organization's risk. Kubernetes has a vibrant community that shares many of your organization's issues; consider using this community and contribute back when you can to help make Kubernetes more secure for everyone.

Use these recommendations to protect your Kubernetes cluster. Even if you follow these guidelines to protect your Kubernetes cluster, you must still secure your container configurations and runtime operations. Look for solutions that provide centralized governance, continuous monitoring, and security for containers and cloud-native applications.

## Conclusion

Because of its complexity, cloud-native systems such as Kubernetes offer rapidly growing challenges in adopting security best practices and fulfilling corporate security policy and compliance objectives. Securing your Kubernetes deployments can be excruciatingly difficult but not impossible.

Start by implementing the recommendations provided here as a starting point for securing your Kubernetes environment and decreasing the number of attack surfaces. The use of robust security guidelines will empower you to have complete transparency into and control over every layer of your Kubernetes deployment.
