# Okteto Documentation Style Guide

This guide covers voice, tone, formatting, images, and terminology for everything Okteto publishes from this repo: the docs (`src/content/` and `versioned_docs/`), the tutorials (`tutorials/`), and the blog (`blog/`). The three follow the same rules. It is the reference for both human contributors and automated tools.

---

## Voice and tone

**Direct.** State what a thing is or does. Don't set it up first.

| Avoid | Use instead |
|-------|-------------|
| Before you start, it helps to understand... | _Start with what the feature is._ |
| In this guide, you will learn how to... | _Start with what the feature does._ |
| This guide will walk you through... | _Start with what the feature does._ |
| Please note that the CRD is required. | The CRD is required. |
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

**Natural.** Write the way a native English speaker would explain it to a colleague. Prefer possessives and "for" over chains of "of", put one idea in each sentence, and use contractions where they read naturally ("it's", "that's", "doesn't"). Make the subject of each verb the actor that does it: Okteto doesn't develop your application, you do.

| Avoid | Use instead |
|-------|-------------|
| the sandbox of a coding agent | a coding agent's sandbox |
| the images of your services | the images for your services |
| Okteto exposes the endpoints of the application on HTTPS. | Okteto serves the application's endpoints over HTTPS. |
| runs the commands in a container of the `image` you set, in the cluster | runs the commands inside the cluster, in a container started from the `image` you set |
| defines how Okteto builds, deploys, tests, and develops your application | defines how to build, deploy, test, and develop your application |
| Okteto builds an image from the `api` folder, and the deploy commands get it from the `OKTETO_BUILD_API_IMAGE` variable. | Okteto builds an image from the `api` folder. Your deploy commands reference it through the `OKTETO_BUILD_API_IMAGE` variable. |
| The [`build` reference](reference/okteto-manifest.mdx#build-object-optional) describes every option. | See the [`build` reference](reference/okteto-manifest.mdx#build-object-optional) for every option. |

**Second person.** Address the reader as "you". Use "we" only for what Okteto runs as a company, as in the BYOC docs.

---

## Readers

Readers arrive mid-task from search or a link in the product, and they don't read the docs in order. Every page stands on its own: never assume the reader has read another page. Assume the reader's team already runs Kubernetes; don't argue for it.

| Reader | Usually reads | Write for them |
|--------|---------------|----------------|
| Platform engineer | `admin/`, `self-hosted/`, `byoc/`, installation pages | Knows Kubernetes and Helm well. Don't explain Kubernetes primitives. Give exact configuration keys, default values, and failure modes. |
| Application developer | `get-started/`, `application-environments/`, `coding-agents/`, `previews/`, `user-settings/`, `reference/` | Often knows little about Kubernetes. Give the shortest correct path and a command to copy. Don't require cluster internals to finish a task. |
| AI coding agent | Any page | Runs what the page says, verbatim. See below. |

Write so an agent can act on a single section:

- Commands, flags, and paths are complete and exact.
- Prerequisites, interactive prompts, and destructive steps are stated in the text, not implied.
- Commands go in fenced code blocks with a language tag. Options go in tables.
- No references by position ("above", "below", "the previous step"). Link to the section or name it.

---

## Page structure

### Opening sentence

Open with the subject, either the feature name or "Okteto", followed by what it does. No preamble.

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

### Admin Dashboard and CRDs

The Administration pages document the Admin Dashboard: what each section shows and what you can do in it. Settings that you can also manage with Custom Resource Definitions (CRDs), such as Catalog items, Registry Credentials, or Cloud Credentials, are documented in the [CRDs page of Self-Hosted](src/content/self-hosted/manage/crds.mdx). An Administration page doesn't repeat those instructions: it links to the CRDs page where it mentions them, for example to explain the **Read-only** tag of an item defined with a CRD.

### Category index pages

Every category of the sidebar has an index page: set it as the `link` of the category, so clicking the category opens a page instead of only expanding the list. The index opens with what the category covers and lists its pages, with a link and one line for each. A parent index lists its child categories, not every page under them, so the same list isn't repeated at two levels.

When the index of a category has content of its own besides the list of its pages, such as Application Environments or Divert, readers who only expand the category in the sidebar don't see it. Add the index again as the first item of the category, with the label `Overview` (`Introduction` for Get Started):

```js
{
  type: 'category',
  label: 'Divert',
  link: { type: 'doc', id: 'application-environments/divert/index' },
  items: [
    { type: 'doc', id: 'application-environments/divert/index', label: 'Overview' },
    'application-environments/divert/shared-namespace',
  ],
}
```

In the frontmatter of that index page, set `pagination_label` instead of `sidebar_label` (a `sidebar_label` would replace the `Overview` label), and set `pagination_next` to the page that follows it, so its Next button doesn't point to the page itself.

### Section headings

Use noun phrases, not imperative verbs or questions, and write them in title case (`Hot Reload`, `Registry Credentials`, `Stopping the Development Container`), like page titles.

Title case applies to every title a reader sees: the `title` of a page, a tutorial, or a blog post, the labels of the sidebar, and the section headings. Capitalize every word except articles (`a`, `an`, `the`), coordinating conjunctions (`and`, `or`, `but`), and prepositions (`of`, `in`, `on`, `to`, `for`, `with`, `without`, `from`, `as`), which stay lowercase unless they open the title or follow a colon. Pronouns and verbs are capitalized, however short: `Upgrade Your Okteto Instance`, `How It Works`. Commands, filenames, and field names keep their spelling: `Troubleshooting with kubectl`, `What okteto up Does`, `The .env File`. The headings of the references that name a field or a command (`dependencies ([string], optional)`, `deploy`) keep the name as it's written.

The pages that explain a section of the Okteto Manifest take the title of their sidebar label: Build, Deploy, Test, Develop, and Destroy. Their first sentence names the feature (the Okteto Build Service, Okteto Test, Development Containers).

The quickstart (`get-started/quickstart.mdx`) takes the Movies app through Build, Deploy, Test, and Destroy, and ends with the FAQ. It has no Develop and no Next Steps sections. The guides of each language (`application-environments/develop/<language>.mdx`, the pages of the Develop category after its overview) have the sections Prerequisites, Build (with the `Dockerfile`), Deploy, Test, Develop, and Destroy, with the optimizations for that language at each step, and the FAQ of the quickstart, without the question about hot reload: coding agents read them to write or optimize an Okteto Manifest for that language.

| Avoid | Use instead |
|-------|-------------|
| How to configure the Garbage Collector | Configuring the Garbage Collector |
| Why use Preview Environments? | (just write the section) |
| Understanding namespaces | Namespaces |

**Exception: a `## FAQ` section.** At the end of a guide or a tutorial, its `###` headings are the questions a reader asks, ending with a question mark, and each answer starts with the direct answer (`No.`, a command, or the link to follow) before any explanation. Use it for questions that come up after following the page (performance, related setups, where to go next), not for the steps of the page, and keep it short. The section heading itself is `FAQ`.

```mdx
## FAQ

### Do I need to deploy the whole application in every Namespace?

No. [Divert](application-environments/divert/index.mdx) lets you deploy only the services you change and reuse the services of a shared environment.
```

---

## Formatting

### Links

Embed links in the flow of the sentence. Don't use standalone "Learn more" lines or arrows.

```mdx
# Good
[Namespaces](application-environments/namespaces.mdx) isolate the application environments of each team.
Okteto uses [role-based access control (RBAC)](admin/user-roles-and-permissions.mdx) with two roles.

# Avoid
[Learn more about Namespaces →](application-environments/namespaces.mdx)
[Learn more about roles and permissions →](admin/user-roles-and-permissions.mdx)
```

Inside the docs, link to the `.mdx` file with a path relative to `src/content/`, as above, and append anchors normally (`reference/okteto-manifest.mdx#mode-string-optional`). Between the docs, the tutorials, and the blog, link with a root-relative URL: `/tutorials/<slug>/` for a tutorial, `/docs/<path>/` for a docs page, and `/blog/<slug>/` for a post. Don't link to `https://www.okteto.com/...` for a page of one of the three. The build doesn't check links between them, so when you move a page, update the pages of the other two that link to it.

### Code and CLI

Wrap all CLI commands, flags, file names, and code values in backticks.

```mdx
Run `okteto deploy` to deploy your application.
The `okteto.yaml` file defines how to build, deploy, and test your application.
Set the `--wait` flag to block until the deployment completes.
```

CLI commands are always lowercase: `okteto up`, `okteto deploy`, `okteto test`, `okteto build`.

### Admonitions

Use sparingly: each one interrupts reading flow.

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

In docs pages, use the `Image` component (`import Image from "@theme/Image";`), never Markdown `![]()`. Tutorials and blog posts keep their images in their own `img/` folder and show them with a Markdown image (`![alt](./img/diagram.webp)`) or with `Image` and `require('./img/...')`. Always include descriptive `alt` text.

```mdx
<Image src={...} alt="BuildKit architecture diagram showing remote build flow" />
```

Images inside a page (docs, tutorials, and blog posts) have a white background, diagrams included. Only the cover of a blog post or a tutorial has a dark background. In tutorials and blog posts, images are shown at the width of the cover, centered: the styles do it, so don't size or align them one by one. Diagrams are drawn at the size of the cover too (2400x1260), so they keep its proportions. For Kubernetes architectures, the [Kubernetes icon set](https://github.com/kubernetes/community/tree/main/icons) is the reference: one shape per resource type, used the same way in every diagram.

Diagrams and covers are drawn with `scripts/covers` in the docs, the tutorials, and the blog alike (diagrams with `background: 'white'`): see "Images" in [`AGENTS.md`](AGENTS.md#images).

### Version numbers

Never hardcode the Okteto CLI, Helm chart, or Kubernetes versions. Import them from `src/content/variables.json` (`import variables from '../variables.json';`, with the path relative to the page) and write `{variables.cliVersion}`, or `${variables.cliVersion}` inside a template literal.

### Videos

Don't embed or link videos, such as YouTube tutorials or recordings of the product. They go out of date as soon as the product or its UI changes, and nobody updates them. Explain the steps in text, with screenshots or diagrams where they help.

### Agent instructions files

Call the instructions file of a coding agent `AGENTS.md`, the name every agent reads. Don't mention agent-specific files, such as `CLAUDE.md`.

### Samples

- **Development Containers:** every `dev` example sets a `command` that starts the application with hot reload, such as `node --watch`, `air`, or `uvicorn --reload`. It's how `okteto up` is meant to work. Don't use `command: bash`, except for a container that starts without code, such as a remote workspace.
- **Private images and cloud access:** where a sample uses an image or reaches a cloud provider, tell the reader to ask their Admin to configure [Registry Credentials](src/content/admin/registry-credentials/index.mdx) or [Cloud Credentials](src/content/admin/cloud-credentials/index.mdx).

### Coding agents

- A coding agent creates a Namespace for each session, with `okteto namespace create <ns> --use=false`, and passes `-n <ns>` to every command.
- An agent troubleshoots through the Kubernetes API: `kubectl logs`, `kubectl top`, and `kubectl get events`, each with `-n <ns>`. Don't mention `okteto logs` in the pages about agents.
- An agent never runs `okteto up`. In a collaborative workflow the developer runs it, and the agent only edits the code: hot reload applies each change.

### References

Besides the reference of each tool or file format, References holds the pages that explain how a part of Okteto works in detail, with a title of the form "How Remote Execution Works". The pages of Application Environments explain how to use the feature, and link to them.

### Images in samples

Don't use `ghcr.io/okteto/pipeline-runner` in samples, in the `image` of a `deploy` or `destroy` section or anywhere else. Use the public image of the tool that the commands run, with a pinned tag, such as `alpine/helm:4.3.2` for Helm commands.

### Mechanics

- Present tense: "Okteto creates the Namespace", not "Okteto will create the Namespace".
- Active voice, unless the actor is unknown or irrelevant.
- American spelling and the Oxford comma.
- "for example" and "that is", not "e.g." and "i.e.".
- No exclamation points, ellipses, or em dashes. Use a comma, a colon, parentheses, or two sentences instead of an em dash.

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
| **Okteto Test** | Capitalized as a product feature. The CLI command is `okteto test` (lowercase, code-formatted). Don't write "Test Containers" or "test containers" for the entries of the `test` section: readers confuse them with Testcontainers, the testing library. Name the feature Okteto Test, and each entry a test (for example, "the `unit` test"). |
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
| **application environment** | Lowercase. The term for what Okteto deploys: your application, with its services and their dependencies, such as databases and queues, in a Namespace, from the Okteto Manifest. Describe it in terms of Kubernetes only: resources outside the cluster, such as a storage bucket or a managed database, belong to the External Resources page, not to the definition of an application environment. It's the same environment for developers, pull requests, and coding agents: a developer's environment is an application environment too. Preview Environments are application environments. What `okteto deploy` creates from a repository is an application environment too, with the name of the repository by default: write "the name of the application environment", not "of the application". Don't confuse it with the agent sandbox, where a coding agent runs. |
| **Development Environment** | Don't use it. The environment a developer works in is the whole application environment, and `okteto up` doesn't create a different kind of environment: it replaces one service of the application environment with a Development Container. Write "your application environment": "Okteto exposes the endpoints of your application environments", not "of your Development Environments". Keep it only when you quote a UI label verbatim. |
| **Preview Environment** | Capitalized when referring to the Okteto feature. Lowercase when generic. |
| **Namespace** | Capitalize when referring to an Okteto Namespace. Lowercase for generic Kubernetes namespace references. |
| **Development Container** | Capitalized. The container that `okteto up` runs in place of one service of the application environment, with hot reload and a debugger. It's part of an application environment, not an environment of its own. |
| **dev environment** | Don't use it. Write "application environment". Keep it only when you quote a UI label verbatim, such as **Deploy Dev Environment**. |
| **Overlay Namespace** | Capitalized. An application environment that runs only the services that change, on top of a **Shared Namespace** that runs the rest of the application. The other model is a **full replica**, which runs every service. **Divert** is the feature that routes requests between the two Namespaces: it isn't the name of the model. Don't write "overlay environment": the name of the model is always Overlay Namespace. |
| **pull requests, test pipelines** | Either one names the third kind of user of an application environment, next to developers and coding agents: "developers, pull requests, and coding agents" in text, and "test pipelines" where the pipeline is the subject, as in a diagram. |

Other products use near-synonyms for these concepts. Don't use them for Okteto concepts:

| Avoid | Use instead |
|-------|-------------|
| workspace, remote workspace | application environment, or Namespace |
| devbox, cloud IDE | application environment, or Development Container for the container where you code with `okteto up` |
| ephemeral environment | Preview Environment, when you name the feature. The term itself is fine, and worth using for search: application environments are ephemeral, created on demand and deleted when the work is done |

### Access and roles

| Term | Notes |
|------|-------|
| **Admin** | Capitalized when referring to the Okteto role. |
| **Developer** | Capitalized when referring to the Okteto role. Lowercase when referring to engineers in general. |
| **Personal Access Token** | Capitalized. |

### Platform concepts

| Term | Notes |
|------|-------|
| **Divert** | Capitalized as an Okteto feature name. It routes requests from a Shared Namespace to an Overlay Namespace. |
| **Remote Execution** | Capitalized. |
| **File Sync** | Capitalized. The underlying behavior is "file sync" (lowercase) when used as a verb phrase. |
| **Volume Snapshot** | Capitalized when referring to the Okteto feature. |
| **coding agent** | Lowercase. "Coding Agents" is capitalized only as the name of the docs section. Don't write "AI agent". The skills are the "Okteto skills". |

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
> ~~[Learn more about Namespaces →](application-environments/namespaces.mdx)~~

**Don't use "useful for" to describe a feature:**
> ~~Useful for seeding development databases with realistic data.~~  
> Volume snapshots let you initialize a persistent volume from a previous snapshot.

**Don't stack synonyms to sound thorough:**
> ~~consistent, reproducible, and reliable operations~~  
> consistent, reproducible operations

**Don't describe what documentation is:**
> ~~Guides, references, and tutorials for Okteto.~~

**Don't use "powerful" or "seamless"** unless quoting a specific technical property.
