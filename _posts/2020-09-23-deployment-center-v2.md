---
title: "Public Preview of the new Deployment Center"
author_name: "Jason Freeberg, Mitren Chinoy"
category: deployment
---

The App Service Deployment Center has been generally available since late 2018. The Deployment Center gives a centralized view of all the deployment methods for your web app. The feature also has a guided experience for setting up continuous integration and delivery (CI/CD) pipelines from source control or container registries. Today, we are happy to announce that a new version of the App Service Deployment Center is available for technical preview in the Azure Portal. The new layout was built with usability and clarity in mind, especially for developers that are new to App Service.

With the new Deployment Center, you can easily set up a CI/CD pipeline with GitHub Actions for your containerized applications. Before today, you would have to create the GitHub Actions CI/CD workflow file from scratch. There is reference material online, but fighting YAML formatting errors can be tricky! Today, you can go to the Deployment Center in the Portal and follow the on-screen, step-by-step instructions to set up the CI/CD workflow. The Portal will guide you through setting up a GitHub Actions workflow to build your container, push it to a registry, and pull it to the web app whenever there is a new commit on your main branch.

![Use the deployment center to wire up GitHub Actions for CI/CD]({{site.baseurl/media/2020/09/deployment-center-code.png}})

GitHub Actions is free for public repositories. For private repositories, please see the [GitHub pricing page](https://github.com/pricing).
