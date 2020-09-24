---
title: "Public Preview of the new Deployment Center"
author_name: "Jason Freeberg, Mitren Chinoy, Byron Tardif"
category: deployment
---

The first version of the App Service Deployment Center has been generally available [since late 2018](https://azure.microsoft.com/updates/azure-app-service-deployment-center-now-available/). The Deployment Center gives a centralized view of all the deployment methods for your web app. It also has a guided experience for setting up continuous integration and delivery (CI/CD) pipelines from source control or container registries.

Today, we are happy to announce that a new version of the App Service Deployment Center is available for technical preview in the Azure Portal. The new experience was built with usability and clarity in mind, especially for developers that are new to App Service. Whether you're deploying code or containers, the new App Service Deployment Center makes it easy.

## Easy CI/CD for Code

The Deployment Center makes it easy to create a CI/CD pipeline from your GitHub, BitBucket, or an external Git repository. If you're using GitHub, the Deployment Center can also create a GitHub Actions workflow for you! See our [previous article](https://azure.github.io/AppService/2020/08/19/github-actions-code-ga.html) for more information. If you're not using GitHub, you can still create a CI/CD pipeline using the Kudu build service.

![Use the deployment center to wire up GitHub Actions for CI/CD]({{site.baseurl}}/media/2020/09/deployment-center-code.png)

## Continuously deploy containers

With the new Deployment Center, you can easily set up a CI/CD pipeline with GitHub Actions for your containerized applications as well. Before today, you would have to create the GitHub Actions CI/CD workflow file yourself. Now you can go to the Deployment Center in the Portal and follow the on-screen, step-by-step instructions to set up the CI/CD automation. *No more YAML indentation errors!* The Portal will guide you through setting up a GitHub Actions workflow to build your container, push it to a registry, and pull it to the web app whenever there is a new commit on your specified branch.

![Use the deployment center to wire up GitHub Actions for CI/CD]({{site.baseurl}}/media/2020/09/deployment-center-container.png)

GitHub Actions is free for public repositories. For private repositories, please see the [GitHub pricing page](https://github.com/pricing).
