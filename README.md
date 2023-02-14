# The Okteto Documentation

[![Netlify Status](https://api.netlify.com/api/v1/badges/9727b18a-8038-4a4e-91ff-95315bf76ead/deploy-status)](https://app.netlify.com/sites/okteto-docs/deploys)

This repository is the source for https://okteto.com/docs. If you'd like to contribute to the documentation, please first check out our [contributing guide](CONTRIBUTING.md) for info on how to get started.

## Development

### ☁️ Develop With Okteto

- [Install Okteto CLI](https://www.okteto.com/docs/getting-started/#installing-okteto-cli)
- [Set your `okteto context`](https://www.okteto.com/docs/getting-started/#configuring-okteto-cli-with-okteto-cloud)
- Clone the repo and run `okteto up` from the root of the repo

You should now see the docs deployed on http://localhost:8080/docs/ 🚀

### 💻 Develop locally

Clone the repo and then run:

```console
yarn
yarn start
```
## Version

To create a new version, run the following commands:

```
yarn add docusaurus
yarn run docusaurus docs:version 1.x
```

This will create a new version with the docs on your current branch. Do this before you start merging the docs for the next version. 

After this, modify [`docusaurus.config.js`](docusaurus.config.js) to add the version to the dropdown. We typically keep the last 6 versions in the dropdown.

## Components

### Product tiers list

Sometimes, documentation is specific to a product tier. You can add a badge beside headings using the [TiersList](https://github.com/okteto/docs/blob/main/src/theme/TiersList/index.js) component.

##### Usage

Tiers is a `string` of tier separated by a space

```md
# Page heading<TiersList tiers="Scale Self-Hosted" />
```

## Contributors

Made with [contributors-img](https://contrib.rocks).
