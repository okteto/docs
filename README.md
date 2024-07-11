# The Okteto Documentation

[![Netlify Status](https://api.netlify.com/api/v1/badges/9727b18a-8038-4a4e-91ff-95315bf76ead/deploy-status)](https://app.netlify.com/sites/okteto-docs/deploys)

This repository is the source for https://okteto.com/docs. If you'd like to contribute to the documentation, please first check out our [contributing guide](CONTRIBUTING.md) for info on how to get started.

## Development

### 💻 Develop locally

*You'll need to install `node` 20+ and `yarn` 1.22+ locally in order to be able to build the doc site locally.* 


Clone the repo and then run:

```console
yarn
yarn start
```

However, it is possible to build the website locally using okteto itself without any need to install required dependencies and specific version of build tool.

### 💻 Develop locally (using Okteto)

You can launch a remote Development Environment with [Okteto](https://okteto.com) on any Kubernetes cluster with the Okteto CLI.

1. In order to configure Okteto CLI to use Okteto, run the following command at the root (replace the URL with your Okteto instance):

    ```
    okteto context use https://okteto.example.com
    ```
    **Note:** If you'd like to use any Kubernetes cluster with Okteto CLI, run the `okteto context` command and select the context you'd like to go with using arrows key

2. Once the context is setup, run the `okteto up` command. This will make sure the required docker images are built by Okteto CLI.
   
3. Once the development environment is built, go to your [Okteto](https://okteto.com/docs) and preview your changes. As soon as you hit the save, the changes will be reflected in Okteto as it'd look like in production.


## Create a new version of the Docs

*A new version of the docs is created once the documentation for a certain version is "finished". This is typically done in preparation of a new release.*


### Update Variables

Review the content of `src/content/variables.json` and update the values of `cliVersion` and `chartVersion`.

If the release comes with a new or a removed Kubernetes version, update `kubernetesMinVersion` and `kubernetesMaxVersion` accordingly.

### Create a new version
To create a new version, run the following commands:

```
yarn run docusaurus docs:version 1.XX
```

This will create a new version with the docs on your current branch. 

### Change the default version

*The default version of the docs is created and published once a new version of Okteto is available. This is typically done as part of the release process of Okteto Self-Hosted.*


Modify the `presets.docs.versions` section of  [`docusaurus.config.js`](docusaurus.config.js) as follows:


1. Update `lastVersion` to the new _official_ version

2. Update `current` to _unreleased_ version in development

3. Update the values of the `path` of the previous official version in the `versions` subsection to match the version number. 

    Before
    ```
        "1.4": {
            label: "1.4",
            path: "/",
            banner: "none",
        },
    ```

    After
    ```
        "1.4": {
            label: "1.4",
            path: "1.4",
            banner: "none",
        },
    ```

4. Add a new entry in the `versions` subsection to match the new _official_ version, with `/` as the path.
    
    ```
        "1.5": {
            label: "1.5",
            path: "/",
            banner: "none",
        },
    ```

Modify the redirection rules on `netlify.toml` so that `/docs/<OFFICIAL_VERSION>/` redirects to `/docs` and `/docs/unreleased/` redirects to `/docs/<CURRENT_VERSION>`.

```
# Redirect official version to docs root
[[redirects]]
  from = "/docs/1.5/*"
  to = "/docs/:splat"
  status = 301

# Redirect unreleased to "current" version
[[redirects]]
  from = "/docs/unreleased/*"
  to = "/docs/1.6/:splat"
  status = 302
```

Update `/src/pages/archives.md` with the new latest version.

Remove the oldest version by following these steps:

- Remove the files for the oldest version from the folders `versioned_docs` and p versioned_sidebars`.
- Remove the oldest version from the file `versions.json`.
- Modify the `presets.docs.versions` section of  [`docusaurus.config.js`](docusaurus.config.js) to remove the entry in the `versions` subsection for the oldest version to only keep 6 versions.
- Move the release notes from the oldest version from the bottom of the [Release Notes page](release-notes.mdx) to the top of the [Archived Release Notes page](archived-release-notes.mdx).
- Run `yarn build` to catch any broken anchors resulting from the previous step.
- Add a redirect in the file `netlify.toml` from the oldest version to the default version:

```
# Redirect official version to docs root
[[redirects]]
  from = "/docs/1.5/*"
  to = "/docs/:splat"
  status = 301
```

https://github.com/okteto/docs/pull/314 is a good example of how to set up the files


### After the new version has been merged, request a new search index
Once the new version is live in production, you need to request a new search index to Algolia.

1. Log in [Algolia](https://crawler.algolia.com/admin/crawlers)
2. On the crawlers’ page, select "Okteto"
3. Click on "Restart crawling"

It should take a few minutes and the search index will be completed.

## Components

### Product tiers list

Sometimes, documentation is specific to a product tier. You can add a badge beside headings using the [TiersList](https://github.com/okteto/docs/blob/main/src/theme/TiersList/index.js) component.

##### Usage

Tiers is a `string` of tier separated by a space

```md
# Page heading<TiersList tiers="Scale Self-Hosted" />
```

### Image

Since many of our images are used across multiple versions, if a screenshot is updated but should only apply to certain versions, please create a new image with the version number included in the filename. For example, `my-image-v1.22+.png`.

##### Usage

```mdx
import Image from "@theme/Image";

<p align="center">
  <Image
    src={require("@site/static/img/my-image-v1.22+.png").default}
    alt="Movies app architecture"
    width="850"
  />
</p>
```

## Contributors

<a href="https://github.com/okteto/docs/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=okteto/docs" />
</a>

<!--  https://contrib.rocks -->
