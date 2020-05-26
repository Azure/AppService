---
title: "App Service //Build 2020 Recap"
author_name: "Jason Freeberg"
toc: true
toc_sticky: true
---

This year, [Microsoft Build](https://mybuild.microsoft.com/) is entirely online. Live and pre-recorded sessions are available for anyone to view. This article is a recap of the sessions from the App Service team, along with links to more information.

## Building and Managing .NET Core with App Service

*Building web apps with .NET Core? Check out the latest from the App Service team including how to build a continuous delivery pipeline using GitHub Actions, how to use Event Grid to subscribe and act on deployment events and how to monitor your production apps with Health Checks.*

**[Watch the session here](https://channel9.msdn.com/Events/Build/2020/BOD126/player)**.

### GitHub Actions

GitHub Actions is a flexible automation framework that allows developers to (among other things) continuously deploy their applications to App Service.

- [Webapps deploy Action](https://github.com/Azure/webapps-deploy)
- [GitHub Actions for Azure](https://github.com/azure/actions)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)

### App Service Health Checks

App Service Health Checks will automatically remove and restart unhealthy instances of your application when you are scaled out.

- [Documentation](https://github.com/projectkudu/kudu/wiki/Health-Check-(Preview))

### Event Grid Integration

Event Grid is a high performance publish/subscribe messaging system. App Service now emits events that can be handled with Functions, Logic Apps, and more.

- [Getting started guide](https://azure.github.io/AppService/2020/05/11/event-grid-integration.html)
- [Event Grid overview](https://docs.microsoft.com/azure/event-grid/overview)
- [Comparison of Azure messaging services](https://docs.microsoft.com/azure/event-grid/compare-messaging-services)

## Migrate Applications to Azure App Service

See how Azure is making it easy to quickly get your application running on App Service. We’ll show you how to use Migration Assistant for moving IIS sites and Linux containers to the cloud.

[Watch the session here](https://mybuild.microsoft.com/sessions/737d89e2-4255-4017-89df-2aa2adf9e348)

## FAQ

Many of you attended our "Ask the Experts" live session and sent us your questions. Here are some common questions you asked, along with their answers.

- **Can you use LetsEncrypt certificates with Azure App Services?** You're still able to use Let's Encrypt certs with App Service, however there is no official support when it comes to integrating it with auto-renew. We have [App Service Managed Certificates](https://azure.microsoft.com/updates/secure-your-custom-domains-at-no-cost-with-app-service-managed-certificates-preview/), which is our free certificate offering that supports auto-renew. This feature is currently in preview and only currently supports CNAME Records. [Documentation](https://docs.microsoft.com/azure/app-service/configure-ssl-certificate#create-a-free-certificate-preview).
- **What is the status for App Service Managed Certificates supporting apex/naked domains?** This is the next milestone for this feature that we are currently working on. We don't have an ETA to provide as of now. 
- **Is it a good strategy to use deployment slots to define environments (eg. myapp, myapp/uat, myapp/qa) or would it be better to have different resources for each environment? Would it affect the performance of the main prod "myapp" service?** You can certainly use slots to stage your test, QA, and other environments. This works especially well if your team uses the Gitflow branching strategy, as each branch can be [continuously deployed to a staging slot](https://docs.microsoft.com/azure/app-service/deploy-best-practices#use-deployment-slots). If you are worried about the extra slots consuming too many resources, you can actually host the production slot on it's own, independent App Service Plan.
- **What is the status for the different logs with the Azure Monitor integration?** We will be releasing AppServiceAppLogs for Windows soon -- estimating the next two/three months. We don't have an ETA for the other logs as of now.
