---
title: "What's New in Okteto CLI September 2021"
description: "Check out what's new in Okteto CLI! Updates to preview environments, auto scanning with Trivy and more!"
slug: sept-2021-cli-release
date: 2021-09-22
authors: ["melissa-williams"]
tags: ["kubernetes", "cloud-native", "development", "okteto-cli", "preview-environments"]
image: ./img/5736a58ad9f0.jpg
---

There are many new features and upgrades in Okteto CLI this month!

<!-- truncate -->

## Deploy individual services with Okteto Stack

You can now redeploy a single service of an Okteto Stack. Okteto will create the services defined in your [Stack manifest](https://www.okteto.com/docs/reference/stacks/).

We also now support docker compose's extension fields in Okteto Stacks.

## Preview environment updates

Now when you deploy Okteto Pipeline from the command line, GitHub action, or CircleCI, the CLI will display the URL of the preview environment. Run the command `okteto preview deploy` and your URL will appear. Click on it directly from the command line and view your preview environment!

Another change in preview environments is you now have the ability to run a preview while another deployment is running. Instead of the first one failing (as would happen before) the second one will be queued. This is helpful when working on a branch and pushing commits before your previous preview environment deploys.

## More info in the logs

Now, when you run `okteto up`, we’ve added more events to the logs to give you more information as you wait for commands to run. Now you’ll have a clearer picture of what’s happening behind the scenes as you use Okteto.

## Destroy any deployment

We’ve updated our destroy feature so that you can now destroy any pipeline, whether preview or development while it’s running. In the past, you’d have to wait until your deployment was fully deployed, but now you can force destroy as needed. No more waiting for a deployment to finish that you know you need to make changes to before utilizing!

## Auto scanning with Trivy

Trivy is a popular open source scanner for vulnerabilities in container images, Git repositories, file systems, and also scans for configuration issues. In an effort to maintain a secure software supply chain, we’re now automatically scanning the CLI open source repository with Trivy.

## New features to improve your developer experience

Many of the features in Okteto CLI come directly from users of Okteto. We are committed to improving your developer experience, and love hearing from users about what they’d like to see next. If you use Okteto CLI, we’d love to have your feedback. Feel free to open an issue in our [open source repo](https://github.com/okteto/okteto), or star it if you use and love Okteto!

Happy Coding!
