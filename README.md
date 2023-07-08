# The Okteto Documentation

[![Netlify Status](https://api.netlify.com/api/v1/badges/9727b18a-8038-4a4e-91ff-95315bf76ead/deploy-status)](https://app.netlify.com/sites/okteto-docs/deploys)

This repository is the source for https://okteto.com/docs. If you'd like to contribute to the documentation, please first check out our [contributing guide](CONTRIBUTING.md) for info on how to get started.

## Development

### 💻 Develop locally

*You'll need to install `node` 16+ and `yarn` 1.22+ locally in order to be able to build the doc site locally.* 


Clone the repo and then run:

```console
yarn
yarn start
```

However, it is possible to build the website locally using okteto itself without any need to install required dependencies and specific version of build tool.

### 💻 Develop locally (using Okteto)

You can launch a remote Development Environment on [Okteto Cloud](https://cloud.okteto.com) or any Kubernetes cluster with the Okteto CLI.

1. In order to configure Okteto CLI to use Okteto Cloud, run the following command at the root:

    ```
    okteto context use https://cloud.okteto.com
    ```
    **Note:** If you'd like to use any Kubernetes cluster with Okteto CLI, run the `okteto context` command and select the context you'd like to go with using arrows key

2. Once the context is setup, run the `okteto up` command. This will make sure the required docker images are built by Okteto CLI.
   
3. Once the development environment is built, go to [Okteto Cloud](https://cloud.okteto.com) and preview your changes. As soon as you hit the save, the changes will be reflected in the Okteto cloud as it'd look like in production.


## Create a new version of the Docs

*A new version of the docs is created once the documentation for a certain version is "finished". This is typically done in preparation of a new release.*


### Create a new version
To create a new version, run the following commands:

```
yarn add docusaurus
yarn run docusaurus docs:version 1.XX
```

This will create a new version with the docs on your current branch. 

### Change the default version

*The default version of the docs is created and published once a new version of Okteto is available. This is typically done as part of the release process of Okteto Self-Hosted.*


Modify the `presets.docs.versions` section of  [`docusaurus.config.js`](docusaurus.config.js) as follows:


1. Update `lastVersion` to the new official version

2. Update `current` to the version in development

3. Update the values of the `path` of the  previous official version in the  `versions` subsection to match the version number. 

    Before
    ```
        '1.4': {
            label: '1.4',
            path: '/'
            banner: 'none',
        },
    ```

    After
    ```
        '1.4': {
            label: '1.4',
            path: '1.4'
            banner: 'none',
        },
    ```

4. Add a new entry in the `versions` subsection to match the new official version, with `/` as the path.
    
    ```
        '1.5': {
            label: '1.5',
            path: '/'
            banner: 'none',
        },
    ```

Modify the redirection rules on `netlify.toml` so that `/docs/$OFFICIAL_VERSION/` redirects to `/docs`

```
# Redirect the current version to /docs/
[[redirects]]
  from = "/docs/1.5/*"
  to = "/docs/:splat"
  status = 301
```

Update [/src/pages/archives.md](the archives page) with the new latest version

https://github.com/okteto/docs/pull/314 is a good example of how to set up the files



### Request a new search index
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

## Contributors

<a href="https://github.com/okteto/docs/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=okteto/docs" />
</a>

<!--  https://contrib.rocks -->
