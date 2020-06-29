---
title: "Zero to Hero with App Service, Part 2: Continuous Integration and Delivery"
author_name: "Jason Freeberg"
tags: 
    - zero to hero
toc: true
toc_sticky: true
---

This is the second article in our [Zero to Hero with App Service series]({{site.baseurl}}/tags/#zero-to-hero). This article assumes you have completed [Part 1]({{ site.baseurl }}{% link _posts/2020-06-29-zero_to_hero_pt1.md %}). In the last article you created an App Service Plan, a web app, and forked one of the sample applications. In this article, you will set up a Continuous Integration and Delivery (CI/CD) pipeline using GitHub Actions.

## What is CI/CD?

Continuous Integration and Delivery is not specific to App Service or Azure. It is a modern software development best-practice to automate the testing and deployment of your application. App Service integrates directly with [GitHub Actions](https://github.com/features/actions) and Azure Pipelines, so setting up CI/CD with App Service is easy.

### Continuous Integration

Continuous Integration is the first step of a CI/CD pipeline. In this phase, the pipeline builds and tests the application. This is usually run for any new pull requests targeting the main tracking branch (formerly known as the `master` branch). You can also enforce coding style guides or [lint](https://en.wikipedia.org/wiki/Lint_(software)) the Pull Request during this phase.  

### Continuous Delivery

Assuming the application builds correctly and passes the tests, the new build will be automatically deployed (or _delivered_) to a staging or production server. Advanced development teams may deploy directly to production, but that requires considerable investment in development operations and automated testing. Teams that are just starting with CI/CD can deploy their builds to a staging environment that mirrors production, then manually release the new build once they feel confident.

In the next article, you will learn how to route a percentage of your production traffic to a staging environment to test your new build with _"real"_ traffic.

## Create a Staging Environment

App Service allows you to create and delete independent staging environments, known as [slots](https://docs.microsoft.com/azure/app-service/deploy-staging-slots). You can deploy code or containers to a slot, validate your new build, then _swap_ the staging slot with your production slot. The swap will effectively release the new build to your users. Using the CLI command below, create a staging slot. You will need to replace the `<name>` parameter with the web app's name from the previous article.

```bash
az webapp deployment slot create --slot staging -n <name> -g zero_to_hero
```

Staging slots also get their own default domain names. The domain name follows a similar pattern as the production slot, _http://mycoolapp.azurewebsites.net_ except the slot name is appended to the app's name: _http://mycoolapp<b>-staging</b>.azurewebsites.net_.

> Learn more about [best practices for App Service staging slots](https://docs.microsoft.com/azure/app-service/deploy-best-practices#use-deployment-slots).

## Create a CI/CD Pipeline

Next, you will create a CI/CD pipeline to connect your GitHub repository to the staging slot. App Service has built-in integration with GitHub Actions and Azure Pipelines. Since the sample apps are hosted in GitHub repos, we will use GitHub Actions for our pipeline.

### About GitHub Actions

[GitHub Actions](https://github.com/features/actions) is an automation framework that has CI/CD built in. You can run automation tasks whenever there is a new commit in the repo, a comment on a pull request, when a pull request is merged, or on a CRON schedule. Your automation tasks are organized into [workflow files](https://help.github.com/en/actions/configuring-and-managing-workflows/configuring-a-workflow), which are YAML files in the repository's `.github/workflows/` directory. This keeps your automation tasks tracked in source control along with your application code.

The workflow file defines when the automation is executed. Workflows consist of one or more **jobs** , and jobs consist of one or more **steps**. The jobs define the operating system that the steps are executed on. If you are publishing a library and want to test it on multiple operating systems, you can use multiple jobs. The steps are the individual automation tasks, you can write your own or import actions created by the GitHub community.

An example "Hello World" workflow file is shown below. It runs any time there is a push to the repository and prints _"Hello Keanu Reeves"_ with the current time. If you read the YAML carefully, you can see how the last step references the output from the earlier "Hello world" command using the dotted syntax.

```yaml
name: Greet Everyone
on: [push]  # This workflow is triggered on pushes to the repository.

jobs:
  build:
    name: Greeting  # Job name is Greeting
    runs-on: ubuntu-latest  # This job runs on Linux
    steps:
      # This step uses GitHub's hello-world-javascript-action: https://github.com/actions/hello-world-javascript-action
      - name: Hello world
        uses: actions/hello-world-javascript-action@v1
        with:
          who-to-greet: 'Keanu Reeves'
        id: hello
      # This step prints an output (time) from the previous step's action.
      - name: Echo the greeting's time
        run: echo 'The time was ${{ steps.hello.outputs.time }}.'
```

> Learn more about [the GitHub Actions terms and concepts](https://help.github.com/en/actions/getting-started-with-github-actions/core-concepts-for-github-actions).

### Create the Pipeline

In the [Azure Portal](https://portal.azure.com/), find and click the App Service you created in the previous article. Once you have the App Service open in the portal, select **Deployment Center** on the left side under the **Deployment** header. This will open the App Service Deployment Center. The deployment center will guide you through the CI/CD setup process.

Next, select **GitHub** and click **Continue** at the bottom. In the following page, select **GitHub Actions (Preview)** and click **Continue** at the bottom. In the next screen, select your repository using the dropdowns. (You do not need to edit the language and language version dropdowns.)

![Set up GitHub Actions using the Portal]({{site.baseurl}}/media/2020/06/zero_to_hero_GH_actions_setup.gif)

On the final page you will see a preview of the GitHub Actions workflow file that will be committed into your repository. Click **Complete** to commit the workflow file to the repository. This commit will also trigger the workflow.

![Use the Deployment Center to monitor the CI/CD Pipeline]({{site.baseurl}}/media/2020/06/deployment_center_dashboard.png)

> Learn more about [GitHub Actions](https://docs.microsoft.com/azure/app-service/deploy-github-actions) and [Azure Pipelines](https://docs.microsoft.com/azure/app-service/deploy-continuous-deployment#github--azure-pipelines) integration with App Service.

### Check the Pipeline's Progress

If you go to your GitHub repository you will see a new file in the `.github/workflows/` directory on the master branch. Click on the **Actions** tab in the GitHub repository to see a historical view of all previous GitHub Actions runs. Once the workflow run completes, browse to your staging slot to confirm that the deployment was successful.

## Summary

_Congratulations!_ You now have a CI/CD pipeline to continuously build and deploy your app to your staging environment. In the next article you will learn how to _swap_ the staging and production slots to release new builds to your production users. The next article will also explain how to route a small percentage of your users to a staging slot so you can validate new builds against production traffic or do A/B testing.

### Helpful resources

1. [Using GitHub Actions to deploy a Windows Container to App Service]({{site.baseurl}}{% link _posts/2020-06-09-App Service Continuous Deployment for Windows Containers with GitHub Actions.md %})
2. [GitHub Workflows to create and delete a slot for Pull Requests](https://github.com/JasonFreeberg/create-and-delete-slots)
