---
title: "Zero to Hero with App Service, Part 1: Setting Up"
tags: 
    - zero to hero
author_name: "Jason Freeberg"
toc: true
toc_sticky: true
---

In times of rapid change, developers and IT decision-makers must quickly adjust to a drastically evolving landscape. Successful organizations use managed cloud services to reduce operating costs by increasing developer efficiency and seize new business opportunities by accelerating delivery of innovation. App Service is a proven, high-productivity Platform-as-a-Service for hosting web apps and mobile backends. The service provides deployment APIs, networking integration, and built-in monitoring.

This is the first article in a [multi-part series]({{site.baseurl}}/tags/#zero-to-hero) on moving applications to App Service. The series will cover how to continuously deploy your applications, register your site with a custom domain and certificate, securely access other cloud services, and how to properly scale and configure your site. Following this guide will help you get started with App Service and put you on excellent foundation for more advanced uses in the future.

## Prerequisites

You will need an Azure subscription to complete this guide. [You can create a subscription for free](https://azure.microsoft.com/free/search). Some parts of this blog series will use the Azure CLI. You can install the CLI locally by following [this guide](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest), or you can use the [Azure Cloud Shell](https://docs.microsoft.com/azure/cloud-shell/overview). The Cloud Shell is a virtual terminal associated with your Azure Subscription, allowing you to run Bash or PowerShell commands to create and update Azure resources.

You will also need to [create a GitHub account](https://github.com/join) if you do not have one already. Once you have a GitHub account, fork one of the repositories below and clone it to your local computer. Make sure you **fork** the repository. The next article will show how to set up Continuous Integration and Delivery with GitHub Actions.

- [.NET Core](https://github.com/AzureAppService/github-action-testapp-dotnetcore)
- [Node.js](https://github.com/AzureAppService/github-action-testapp-node)
- [Spring Boot](https://github.com/AzureAppService/github-action-testapp-spring)

> New to Git and GitHub? [Click here](https://help.github.com/en/github/getting-started-with-github)

## Create the resources

Now that you have an Azure Subscription, the CLI, and the repository, it&#39;s time to create the cloud resources we need. First, open the [Azure Portal](https://portal.azure.com/) and click **Create a Resource** in the top-left dropdown. In the menu, select **Web App**. This will open the blade to create a web app.

![Create your webapp using the Portal]({{site.baseurl}}/media/2020/06/zero_to_hero_portal_create.png)

The form will ask for the following inputs:

1. **Resource Group** : This is a group for all the resources for your project. Create a new resource group and name it **zero_to_hero**.
2. **Name** : The name used for the web app. This name will also be used for the default domain name, so it must be globally unique. Try using your own name and some combination of numbers. For example, **john-doe-1**.
3. **Publish** : Leave this as **code** , since we are deploying application code. App Service also supports [deploying Docker containers](https://docs.microsoft.com/azure/app-service/containers/quickstart-docker), which is not covered in this guide.
4. **Runtime stack** : Choose the runtime based on the repo you cloned earlier. If you chose the .NET Core repo, then you should choose **.NET Core 2.1**. For Node.js, select **Node 12 LTS**. For Spring, select **Java 8 SE**. (If you are following this guide using your own application, choose an appropriate runtime and version for your app.)
5. **Region** : Select a region close to you or leave this as the default.

When you are ready, click **Review + create** , and complete the creation after reviewing your inputs.

> The Azure CLI has commands to create and configure your web apps. For more information, see [this guide](https://docs.microsoft.com/cli/azure/webapp?view=azure-cli-latest)

## The App Service Plan

The [App Service Plan](https://docs.microsoft.com/azure/app-service/overview-hosting-plans) represents the underlying Virtual Machine and can host multiple App Services. As you might expect, the higher hardware tiers have more compute resources and features. The plan is also responsible for scaling, which will be covered in a future article. You can always change the hardware tier after creation.

## Wrapping Up

Congratulations! You have created an App Service Plan and a web app. You are one step closer to cloud hero status. In the [next article]({{site.baseurl}}{% link _posts/2020-06-29-zero_to_hero_pt2.md %}) you will set up a Continuous Integration and Delivery pipeline to build and deploy your code onto the web app. If you ran into any issues, please comment on this article.

### Helpful Resources

1. [App Service Plan tiers and pricing information](https://azure.microsoft.com/pricing/details/app-service/windows/)
2. [How many sites can I put in an App Service Plan?](https://azure.github.io/AppService/2019/05/21/App-Service-Plan-Density-Check.html)
3. [App Service Documentation](https://docs.microsoft.com/zure/app-service/overview-hosting-plans)
4. [App Service Team Blog](https://azure.github.io/AppService/)
