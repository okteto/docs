---
title: "Automating the deployment of your development environment using Okteto Actions and GitHub Actions."
description: "Learn how you can include preview environments and automate your CI/CD process using GitHub Actions and Okteto."
slug: ci-cd-using-gh-actions-and-okteto
date: 2021-09-10
authors: ["nwani-victory"]
tags: ["kubernetes", "python", "flask", "gh-actions"]
image: ./img/861bcaeed5e2.jpg
---

> Nwani Victory works remotely as a software engineer, building scalable and sustainable software.
  Outside working hours, he doubles as a technical writer, creating technical articles focused on modern web technologies and public cloud providers.

<!-- truncate -->

## Introduction

GitHub Actions provides developers with the functionality of building and automating the execution of their software development workflows directly in a project’s repository.

In this tutorial you'll learn how you can automate the workflow of an existing Flask API whose continuous integration process is managed using [GitHub Actions](https://github.com/features/actions/).
You'll learn about the GitHub actions created by Okteto and how you can use them to work with Okteto with a GitHub Action workflow.


## Why automate your workflow?

The [Okteto CLI](https://www.okteto.com/docs/get-started/install-okteto-cli) does a fantastic job at simplifying the process of working with your Okteto resources. However, over time, executing commands to build and deploy your docker image to Okteto after major changes could become repetitive and tiring.

According to [Google’s SRE](https://sre.google/) practices, a way to [eliminate the toil time](https://sre.google/sre-book/eliminating-toil/) resulting from such operations is to automate the execution of such commands through the use of a script, or an external automation service.

For this article, we'll be using [GitHub Actions](https://github.com/features/actions) as an automation tool to build a docker image from merged code changes and deploy the docker image to Okteto using the available [Okteto Actions](https://github.com/okteto/actions/).

## Prerequisites

In order to follow along with this tutorial, it's expected that you satisfy the following requirements;


- Have [access to an Okteto instance](https://www.okteto.com/docs/).
- Have the [Okteto CLI](https://www.okteto.com/docs/get-started/install-okteto-cli) installed on your machine.
- Have a [GitHub account](https://github.com/) with [Git](https://git-scm.com/) installed on your machine.
- Have an understanding of the [Python](https://www.python.org/) programming language, with an installation of [python](https://www.python.org/) on your machine.
- Have an installation of [Docker](https://www.docker.com/) on your machine.


## Step 1: Clone a sample Python Flask app

To get started, fork the sample application from its repository [here](https://github.com/okteto-community/okteto-flask-app). After forking the repository, execute the command below from your terminal to clone your forked copy of the repository to your host machine;

> Replace the `GITHUB_USERNAME` in the URL below with your GitHub username to match the remote origin of the forked repository.

```console
$ git clone https://github.com/{{GITHUB_USERNAME}}/okteto-flask-app
```

In the `flaskr.py` file, there are three API routes defined for performing a create, retrieve, and delete operation against a connected [Couch database](https://couchdb.apache.org/).

The cloned project also contains a `Dockerfile` and `docker-compose.yml` file that contains all defined steps and services needed to create a multi-stage build for this application.

To run this application, execute the [docker-compose](https://docs.docker.com/compose/) command below to build and run the application container that consists of a `database` and `app` service.

```console
$ docker-compose up --build
```

To test the application above, execute the command below from a new terminal window to make a POST request to the `/api/customer` api route within the flask API using [cURL](https://curl.se/) which inserts a new document into the customer collection within the running Couch database through it’s RESTful Apiserver.


```console
$ curl -X POST -d '{"name":"Victory Nwani","occupation":"Software Engineer"}'  -H 'Content-Type: application/json' http://localhost:5050/api/customer
 ```

To view the data inserted from the `POST` request above, execute the command below from your terminal to make a GET request to the `/api/customer` api route within the flask API using [cURL](https://curl.se/) which retrieves all documents in the customer collection within the couch database.

```console
$ curl http://localhost:5050/api/customer
```

You can also work with the running couch database through the [Fauxton web interface](https://couchdb.apache.org/fauxton-visual-guide/index.html) that comes by default with couchdb image at [http://localhost:5984/_utils](http://localhost:5984/_utils).

> As defined in the environment field within the database service in the `docker-compose.yml` file, the couchdb username is **couchdb-admin**, while the password is **couchdb-password**. Feel free to change them to your own preferred secured values.


## Step 2: Deploy Flask application To Okteto

Now that you have the cloned application working locally on your computer, you'll deploy the cloned version to Okteto to serve as a deployment for your development environment. The folder already contains a `Dockerfile` and a `docker-compose.yml` file that defines the services and steps needed to build the image for this application.

To begin the deployment from your terminal using the Okteto CLI, execute the command below to log in and create a session between your Okteto account and your local terminal;

```console
$ okteto context
```

Next, build a docker image of the entire application using the `docker-compose.yml` file and deploy it to your Okteto namespace:

```console
$ okteto deploy --build
```

Going through the resources listed in your Okteto dashboard, you would find the deployed application, and the two services specified in the `docker-compose.yml` file.


## Step 3: Write unit tests for the Flask application

One important step within any continuous integration pipeline is to **Test** new commits made to the code source before a new release is pushed to the continuous deployment pipeline to avoid a regression.

To get started, execute the command below from your terminal to create a new [git branch](https://git-scm.com/docs/git-branch) where you would create unit tests for the flask API.

```console
$ git checkout -b feat/ci-pipeline
```

From your code editor, create a `tests` directory with a `test_flask.py` file within the `okteto-flask-app` project. This file would be used to test the three API endpoints within the flask application. Executing the commands below will create the test file, or you can alternatively use the editor interface to create the file.

```console
$ mkdir tests && cd tests
$ touch test_flaskr.py
```

> All HTTP requests that were to be made to the Couch Apiserver from the API routes were intercepted and mocked in the test suites using the [Httpretty package](https://httpretty.readthedocs.io/).

Add the test suite in the code block below to test the default route handler that returns a response with some information about the REST API.


```python
import os
from requests import get, post

STAGING_API_ENDPOINT = os.environ.get("STAGING_COUCHDB_URL")

def test_handle_default_route():
 request = get(STAGING_API_ENDPOINT)
 response = request.json()
 assert (response['status'] == "OK")
 assert 'description' in response
```

The test suite above asserts that a JSON response containing an “OK” status, and description field will be returned each time a request is made to the default route. Looking through the code block, you might have taken note of the `STAGING_API_ENDPOINT` variable whose value will be gotten from the `STAGING_COUCHDB_URL` environment variable. The `STAGING_COUCHDB_URL` environment variable will be set during the continuous flow, and will point to a staging version of the API within an Okteto namespace. You will learn more about this when setting up the GitHub actions flow.

Next, add the code block below into the `test_flaskr.py` file to test the route POST request handler within the `api/customer` endpoint by making a POST HTTP verb to insert a new document into the `customer` collection.

```python
def test_handle_items_post():
    request = post('/api/customer', json={
           'name': 'John Mike',
           'occupation': 'Software Eng'
        })

    responseData = request.json()
    assert responseData['status'] == "USER CREATED"

```

The test case above asserts that a `status` field with a `USER CREATED` value was returned from the POST request to insert a test document into the customer collection. After the test case above is executed successfully, you can rightly expect that a sample document will exist within the customer collection. The next test case will use this sample document to assert that the GET handler is within the `api/customer` endpoint.

Add the code block below into the `test_flaskr.py` file to test the route handling all requests made to the `api/customer` route with a GET HTTP verb to fetch all documents within the `customer` collection.

```python
import json

def test_handle_items_fetch():

    request = get('{}/api/customer'.format(STAGING_API_ENDPOINT))
    data = request.json()
    assert (data['status'] == 'OK')
    assert 'customers' in data
    assert '_id' in data['customers'][0]
```

When the test case above is executed, a GET request will be made to the GET handler within `api/customer` route. The test case will further run assertions against the JSON response to ensure that an OK status field was returned, alongside a list of customers.

At this point we have three test suites to test the three corresponding endpoints exposed within this API. In the next step you'll create a GitHub Actions workflow that runs them automatically.

## Step 4: Automate deployments with a GitHub Actions workflow

With tests in place, you can create a GitHub Actions workflow that spins up an Okteto [preview environment](https://www.okteto.com/docs/previews/) for every pull request and runs your tests against it. Okteto publishes a set of [GitHub Actions](https://github.com/okteto/actions) for this; the two you'll use here are `okteto/context`, to authenticate against your Okteto instance, and `okteto/deploy-preview`, to deploy the preview environment.

### Configure the required secrets

The workflow authenticates to your Okteto instance using two repository secrets:

- `OKTETO_TOKEN`: an Okteto personal access token. See [Personal Access Tokens](https://www.okteto.com/docs/core/credentials/personal-access-tokens) for how to create one.
- `OKTETO_CONTEXT`: the URL of your Okteto instance (for example, `https://okteto.example.com`).

Add both to your forked repository by following [GitHub's encrypted secrets guide](https://docs.github.com/en/actions/security-guides/encrypted-secrets). GitHub provides `GITHUB_TOKEN` automatically.

### Add the workflow

Create a `.github/workflows/ci.yml` file in your repository with the following content:

```yaml
name: Okteto Flask REST API CI

on:
  pull_request:
    branches:
      - master

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: false

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set context to Okteto
        uses: okteto/context@latest
        with:
          url: ${{ secrets.OKTETO_CONTEXT }}
          token: ${{ secrets.OKTETO_TOKEN }}

      - name: Deploy preview environment
        uses: okteto/deploy-preview@latest
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          name: pr-${{ github.event.number }}
          timeout: 15m

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.12'

      - name: Install python dependencies
        run: pip install -r requirements.txt

      - name: Run API tests against the preview environment
        run: pytest
        env:
          STAGING_COUCHDB_URL: https://api-pr-${{ github.event.number }}-your-namespace.okteto.example.com
```

Each time a pull request is opened against your default branch, this workflow authenticates to your Okteto instance, deploys an isolated preview environment for that pull request, and runs the test suite against it. The `STAGING_COUCHDB_URL` value points pytest at the endpoint Okteto generates for the preview, so your tests exercise a production-like deployment instead of a local mock.

To keep your instance tidy, Okteto can tear the preview down automatically when the pull request is closed, using the `okteto/destroy-preview` action in a companion workflow. The [Preview Environments with GitHub Actions](https://www.okteto.com/docs/previews/using-github-actions) guide walks through the complete, maintained setup, including the cleanup workflow and the exact secret configuration.

### Trigger the workflow

Commit and push your changes to a branch in your fork, then open a pull request against the default branch:

```console
$ git add .
$ git commit -m "ci: add tests and Okteto preview workflow"
$ git push -u origin feat/ci-pipeline
```

When the pull request is opened, GitHub Actions runs the workflow: it deploys the preview environment and runs your tests against it. You can follow the run from the **Actions** tab of your repository, and Okteto adds the preview environment's endpoints to the pull request so you can review the running application before merging.

## Conclusion

In this article you cloned a sample Python application, built and deployed a docker image of the application to Okteto, and automated testing against an Okteto preview environment for every pull request using a GitHub Actions workflow.

For the complete, maintained reference, including the preview cleanup workflow, see [Preview Environments with GitHub Actions](https://www.okteto.com/docs/previews/using-github-actions) in the Okteto docs.

The sample application used in this tutorial is available on GitHub in [this repository](https://github.com/okteto-community/okteto-flask-app), for you to clone and use.
