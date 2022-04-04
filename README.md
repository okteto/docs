# Okteto.com/docs

[![Netlify Status](https://api.netlify.com/api/v1/badges/9727b18a-8038-4a4e-91ff-95315bf76ead/deploy-status)](https://app.netlify.com/sites/okteto-docs/deploys)

Okteto's docs site uses [Docusaurus 2](https://v2.docusaurus.io/) and is hosted on [Netlify](https://www.netlify.com/)

## Setup for development

Clone the repo and then run: 

```console
yarn
yarn start
```

## Ejected components

Even if we try to never eject components to facilitate updating Docusaurus, sometime we need to do it to add custom functionalities. Here’s a list of component we ejected and the reasons why:

<details>
  <summary>CodeBlock</summary>
<ul>
<li>Add the ability to filter out `$` in code blocks when using the copy to clipboard button https://github.com/okteto/docs/blob/main/src/theme/CodeBlock/index.js#L83-L84</li>
  </ul>
</details>
<details>
  <summary>DocPaginator</summary>
<ul>
<li>Add our custom Give Feedback component before the pagination
https://github.com/okteto/docs/blob/main/src/theme/DocPaginator/index.js#L10-L12</li>
  </ul>
</details>

## Other repos maintained by the Marketing team

- https://github.com/okteto/website
- https://github.com/okteto/website-cms
