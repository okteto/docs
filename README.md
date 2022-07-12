# The Okteto Documentation

[![Netlify Status](https://api.netlify.com/api/v1/badges/9727b18a-8038-4a4e-91ff-95315bf76ead/deploy-status)](https://app.netlify.com/sites/okteto-docs/deploys)

This repository is the source for https://okteto.com/docs. If you'd like to contribute to the documentation, please first check out our [contributing guide](CONTRIBUTING.md) for info on how to get started.

## Development

### ☁️ Develop With Okteto

- [Install okteto cli](https://www.okteto.com/docs/getting-started/#installing-okteto-cli)
- [Configure okteto context for cloud](https://www.okteto.com/docs/getting-started/#configuring-okteto-cli-with-okteto-cloud)
- Clone the repo and then run `okteto up` from the terminal

You should now see the docs deployed on http://localhost:8080/docs/ 🚀

### 💻 Develop locally

Clone the repo and then run:

```console
yarn
yarn start
```

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
