# Okteto Documentation Style Guide

This guide covers voice, tone, formatting, and terminology for the Okteto docs. It applies to all content in `src/content/` and is the reference for both human contributors and automated tools.

---

## Voice and tone

**Direct.** State what a thing is or does. Don't set it up first.

| Avoid | Use instead |
|-------|-------------|
| Before you start, it helps to understand... | _Start with what the feature is._ |
| In this guide, you will learn how to... | _Start with what the feature does._ |
| Understand what each role can do across the platform. | Okteto uses RBAC with two roles: Admin and Developer. |

**Factual.** Describe behavior, not value. Reserve adjectives for cases where they add technical meaning.

| Avoid | Use instead |
|-------|-------------|
| Intelligent traffic routing | Routes traffic across microservice environments |
| Powerful configuration | Central configuration for building and deploying |
| Foundational building blocks | Core concepts |
| Seamless development experience | _Describe the actual behavior instead._ |

**Concise.** Don't pad descriptions with what every docs site contains.

| Avoid | Use instead |
|-------|-------------|
| Guides, references, and tutorials. | _Remove. It adds nothing._ |
| Power your Okteto development experience. | _Remove or replace with specific capability._ |

---

## Page structure

### Opening sentence

Open with the subject — either the feature name or "Okteto" — followed by what it does. No preamble.

**Pattern:** `[Feature] is/does/allows [what it does].`

**Examples from the docs:**
- *"Preview Environments automatically create a live, production-like instance of your application for every pull request."*
- *"Every time you build your images with Okteto, your build is executed in a remote BuildKit server running in your cluster."*
- *"The Okteto Garbage Collector (GC) allows Admins to optimize infrastructure usage by automatically scaling down or deleting inactive Namespaces."*

### Frontmatter `description`

Write a single functional sentence that describes what the page covers. Avoid marketing language.

```yaml
# Good
description: The Okteto Build Service allows you to build your container images remotely.
description: Manage Preview Environments from the Admin Dashboard.

# Avoid
description: Understand the foundational concepts that power your Okteto development experience.
description: A comprehensive guide to getting the most out of Okteto.
```

### Section headings

Use noun phrases, not imperative verbs or questions.

| Avoid | Use instead |
|-------|-------------|
| How to configure the Garbage Collector | Configuring the Garbage Collector |
| Why use Preview Environments? | (just write the section) |
| Understanding namespaces | Namespaces |

---

## Formatting

### Links

Embed links in the flow of the sentence. Don't use standalone "Learn more" lines or arrows.

```mdx
# Good
[Namespaces](core/namespaces.mdx) are isolated workspaces where development environments run.
Okteto uses [role-based access control (RBAC)](core/user-roles-and-permissions.mdx) with two roles.

# Avoid
[Learn more about Namespaces →](core/namespaces.mdx)
[Learn more about roles and permissions →](core/user-roles-and-permissions.mdx)
```

### Code and CLI

Wrap all CLI commands, flags, file names, and code values in backticks.

```mdx
Run `okteto deploy` to deploy your application.
The `okteto.yaml` file defines your development environment.
Set the `--wait` flag to block until the deployment completes.
```

CLI commands are always lowercase: `okteto up`, `okteto deploy`, `okteto test`, `okteto build`.

### Admonitions

Use sparingly — each one interrupts reading flow.

| Type | When to use |
|------|-------------|
| `:::note` | Extra context that doesn't fit inline. Most common. |
| `:::tip` | Optional shortcut or best practice. |
| `:::info` | Important distinction or clarification. |
| `:::warning` | Action that could cause data loss, breakage, or unexpected behavior. |
| `:::caution` | Destructive or irreversible action. |
| `:::danger` | Reserved for security-critical warnings. |

Don't use admonitions for content that reads naturally inline.

### UI elements

Bold UI labels exactly as they appear in the product.

```mdx
Navigate to **Admin → Garbage Collector** and click **Enable**.
```

### Images

Always include descriptive `alt` text.

```mdx
<Image src={...} alt="BuildKit architecture diagram showing remote build flow" />
```

---

## Terminology

Use these terms exactly as written. Capitalization matters.

### Okteto product names

| Term | Notes |
|------|-------|
| **Okteto CLI** | Always "Okteto CLI", never "okteto CLI" or "the CLI" on first reference. "the CLI" is fine on subsequent references. |
| **Okteto Manifest** | Capitalized as a product name. The file itself is `okteto.yaml` (lowercase, code-formatted). |
| **Okteto Registry** | Capitalized. Never "the registry" on first reference. |
| **Okteto Catalog** | Capitalized. |
| **Okteto Insights** | Capitalized. |
| **Okteto Test** | Capitalized as a product feature. The CLI command is `okteto test` (lowercase, code-formatted). |
| **Okteto AI** | Capitalized. |
| **Okteto API** | Capitalized. |
| **Okteto Platform** | Capitalized when referring to the product as a whole. |
| **Build Service** | Capitalized. Full form "Okteto Build Service" on first reference per page. |
| **Garbage Collector** | Capitalized. Abbreviation "GC" is acceptable after first use. |
| **Resource Manager** | Capitalized. |
| **Admin Dashboard** | Capitalized. |

### Environments

| Term | When to use |
|------|-------------|
| **Development Environment** | Capitalized when referring to an Okteto Development Environment specifically. Lowercase "development environment" when referring to the concept generically. |
| **Preview Environment** | Capitalized when referring to the Okteto feature. Lowercase when generic. |
| **Namespace** | Capitalize when referring to an Okteto Namespace. Lowercase for generic Kubernetes namespace references. |
| **Development Container** | Capitalized. |
| **dev environment** | Lowercase. Informal shorthand — acceptable in tutorials and quickstarts, avoid in reference docs. |

### Access and roles

| Term | Notes |
|------|-------|
| **Admin** | Capitalized when referring to the Okteto role. |
| **Developer** | Capitalized when referring to the Okteto role. Lowercase when referring to engineers in general. |
| **Personal Access Token** | Capitalized. |

### Platform concepts

| Term | Notes |
|------|-------|
| **Divert** | Capitalized as an Okteto feature name. |
| **Remote Execution** | Capitalized. |
| **File Sync** | Capitalized. The underlying behavior is "file sync" (lowercase) when used as a verb phrase. |
| **Volume Snapshot** | Capitalized when referring to the Okteto feature. |
| **Agentic Workflows** | Capitalized as a section/feature name. |

### Deployment models

| Term | Notes |
|------|-------|
| **BYOC** | Always uppercase. Full form "Bring Your Own Cloud (BYOC)" on first reference per page. |
| **Self-Hosted** | Always capitalized, hyphenated. |
| **SaaS** | Always uppercase. |

### Third-party terms

| Term | Notes |
|------|-------|
| Kubernetes | Always capitalized. Never "k8s" in prose (acceptable in code/config). |
| BuildKit | Capitalized per upstream project name. |
| GitHub Actions | Capitalized per upstream. |
| Docker Compose | Capitalized per upstream. |
| Helm | Capitalized per upstream. |

---

## Common mistakes to avoid

**Don't editorialize about what to do before using a feature:**
> ~~Before you start building with Okteto, it helps to understand...~~

**Don't use "learn more" as link text:**
> ~~[Learn more about Namespaces →](core/namespaces.mdx)~~

**Don't use "useful for" to describe a feature:**
> ~~Useful for seeding development databases with realistic data.~~  
> Volume snapshots let you initialize a persistent volume from a previous snapshot.

**Don't stack synonyms to sound thorough:**
> ~~consistent, reproducible, and reliable operations~~  
> consistent, reproducible operations

**Don't describe what documentation is:**
> ~~Guides, references, and tutorials for Okteto.~~

**Don't use "powerful" or "seamless"** unless quoting a specific technical property.
