# Contributing to Okteto's Documentation

Thank you for showing interest in contributing to the Okteto docs! We appreciate all kinds of contributions, suggestions, and feedback.

## Code of Conduct

This project adheres to the Contributor Covenant [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report any unacceptable behavior to hello@okteto.com.

## Ways To Contribute

### Reporting Issues

Reporting issues is a great way to help us improve the documentation! This isn't just limited to reporting fixes but can also include requests or suggestions for improvements in the current documentation. We use [GitHub issues](https://github.com/okteto/docs/issues) for tracking all such things.

### Adding New Documentation

When adding new documentation, it'll be helpful to keep the following things in mind:

- Communicating your changes before you start working
- [Signing off](#commit-and-push-your-changes) on all your git commits by running `git commit -s'

Discussing your changes with the maintainers before you start writing is one of the most important steps, as this sets you in the right direction before you begin. The best way to communicate this is through a detailed GitHub issue. Another way to discuss changes with maintainers is using the [#okteto](https://kubernetes.slack.com/messages/CM1QMQGS0/) channel on the Kubernetes slack.

#### Making a Pull Request

The following steps will walk you through the process of opening your first pull request:

##### Fork the Repository

Head over to the project repository on GitHub and click the **"Fork"** button. This allows you to work on your own copy of the project without being affected by the changes on the main repository. Once you've forked the project, clone it using:

```
git clone https://github.com/YOUR-USERNAME/docs.git
```

##### Create a Branch

Creating a new branch for each feature/bugfix on your project fork is recommended. You can do this using:

```
git checkout -b <branch-name>
```

##### Commit and Push Your Changes

Once you've made your changes, you can stage them using:

```
git add .
```

After that, you'll need to commit them. For contributors to certify that they wrote or otherwise have the right to submit the code they are contributing to the project, we require them to acknowledge this by signing their work, which indicates they agree to the DCO found [here](https://developercertificate.org/).

To sign your work, just add a line like this at the end of your commit message:

```
Signed-off-by: Cindy Lopez <cindy.lopez@okteto.com>
```

This can easily be done with the `-s' command-line option to append this automatically to your commit message.

```
git commit -s -m' Meaningful commit message'
```

> In order to use the `-s' flag for auto signing the commits, you'll need to set your `user. name'and'user.email` git configs

Finally, you can push your changes to GitHub using:

```
git push origin <branch-name>
```

Once you do that and visit the repository, you should see a button on the GitHub UI prompting you to make a PR.

## Development Guide

Our documentation uses [Docusaurus 2](https://v2.docusaurus.io/) and is hosted on [Netlify](https://www.netlify.com/).

### Setup for development

Clone the repo and then run: 

"`console
yarn
yarn start
```

### Ejected components

Even if we try never to eject components to facilitate updating Docusaurus, sometimes we need to do it to add custom functionality. Here's a list of the components we've currently ejected and their reasons:

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
