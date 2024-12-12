---
title: "Unlocking Possibilities: Introducing Sidecar Pattern and Webjobs for Linux App Service in Public Preview!"
author_name: "Tulika Chaudharie"
toc: true
toc_sticky: true
tags:
    - Linux App Service
---

Today marks an important milestone in the evolution of our Linux App Service offering as we announce the launch of two powerful features, both now available in Public Preview: the Sidecar Pattern and Webjobs.

## Introducing the Sidecar Pattern

As highlighted in our recent blog post [A Glimpse into the Future: The Sidecar Pattern on Linux App Service](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/a-glimpse-into-the-future-the-sidecar-pattern-on-linux-app/ba-p/4045680), the Sidecar pattern allows you to co-locate a cohesive set of tasks with the primary application but place them inside their own process or container. This allows you to seamlessly extend the functionality of your primary application by attaching companion containers, or "sidecars," each serving a specific purpose or function.

We now have a rich experience on the Azure portal which allows you to create a sidecar-enabled Linux web app. To delve deeper into the feature and create your first Sidecar application, please refer to [Tutorial: Configure a sidecar container for custom container in Azure App Service (preview)](https://go.microsoft.com/fwlink/?linkid=2257512)

Currently, the feature is enabled scenarios where you want to use a custom Container image. We are working to enable it for our pre-defined application stacks as well. More on that is coming soon.

## Webjobs for Linux App Service and Windows Containers

Another feature that we are enabling for Linux App Service is the ability to create Webjobs. Designed to streamline the execution of background tasks and scheduled processes, Webjobs offer a solution for automating routine operations within your applications hosted on the Linux App Service. We have always had the feature for our Windows offerings and now we are bringing the same convenience to Linux App Service.

We are also introducing the feature for [Windows Containers](https://learn.microsoft.com/azure/app-service/quickstart-custom-container?tabs=dotnet&pivots=container-windows-azure-portal). 

To learn more about webjobs and how to use it, please refer to [Run background tasks with WebJobs in Azure App Service](https://learn.microsoft.com/azure/app-service/webjobs-create).

**Conclusion**

Exciting times lie ahead for Linux App Service, and we're thrilled to have you along for the ride. We are actively working to add more experiences to the service and we are always interested in your feedback.

Remember to checkout our [Community Standup on 10th April 2024](https://www.youtube.com/live/s7pT0oX7jcs?si=QKTRLYbMuS18kHy4) to learn more about both features. 
