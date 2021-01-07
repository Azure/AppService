---
title: "Migrate from Windows Azure Pack Websites to Azure App Service"
author_name: "Andrew Westgarth"
tags: 
    - Windows Azure Pack Web Sites
    - Windows Azure Pack
---

As **Windows Azure Pack Web Sites v2** heads towards the **end** of [extended support](https://support.microsoft.com/help/17140/general-lifecycle-policy-questions) in **2022**, it is important for customers to plan to migrate their workloads from the platform.  Windows Azure Pack Web Sites V2 is an on-premises, high density, multi-tenant web hosting for service providers and enterprise IT and provides an experience similar to the predecessor to Azure App Service, Azure Web Sites.  The product is deployed on top of Windows Server 2012 R2 and is an optional add-on to Windows Azure Pack.

![Windows Azure Pack Web Sites to Azure App Service]({{site.baseurl}}/media/2021/01/waptoappservice.png)

## Benefits of migrating to Azure App Service

[Azure App Service](https://docs.microsoft.com/azure/app-service/overview) is a rich, fully managed enterprise grade service built for hosting web applications, REST APIs and mobile back ends.  Azure App Service builds on the capabilities within Windows Azure Pack Web Sites.  Developers can develop in your favorite language, for example .NET, .NET Core, Java, Node.js, PHP or Python; deploy code or containers; can run and scale with ease of both Windows AND Linux based environments.

App Service is a managed platform powered by Microsoft Azure, offering security, load balancing, automated management, rich DevOps capabilities - continuous deployment from Azure Dev Ops. GitHubs, Container registries such as Docker Hub, staging environments, custom domains and TLS/SSL Certificates.

App Service also provides many [networking options](https://docs.microsoft.com/azure/app-service/networking-features) for enabling hybrid workloads and isolation for both the multi-tenant service and also the single tenant [App Service Environment](https://docs.microsoft.com/azure/app-service/environment/intro) product offering.

In addition to App Service once workloads have been migrated to Azure, customers can also take advantage of a whole plethora of services such as [Azure Functions](https://azure.microsoft.com/services/functions/), [Azure Logic Apps](https://azure.microsoft.com/services/logic-apps/) and [Azure Monitor](https://azure.microsoft.com/services/monitor/) to name just a few, all of which are not available on Windows Azure Pack.

## Migrating from Windows Azure Pack Web Sites

Azure App Service is a natural option for customers operating Windows Azure Pack Web Sites and for tenants who have deployed workloads to Windows Azure Pack Web Sites.  There are no automated procedures for migrating workloads from WAP Web Sites to Azure App Service.

Customers should assess their workloads for migration to Azure App Service and plan to create new Apps in Microsoft Azure, configure and deploy their application content to the new Web App in Azure App Service.  Applications can be created using the [Azure Portal](https://portal.azure.com), [CLI](https://docs.microsoft.com/cli/azure/appservice) or [ARM Template](https://docs.microsoft.com/azure/app-service/deploy-resource-manager-template).  Application content can be deployed using [FTP](https://docs.microsoft.com/azure/app-service/deploy-ftp), [Zip](https://docs.microsoft.com/azure/app-service/deploy-zip) or [Continuous Deployment](https://docs.microsoft.com/azure/app-service/deploy-continuous-deployment) from Source Control, [Container Registries](https://docs.microsoft.com/azure/app-service/deploy-ci-cd-custom-container) or using [GitHub Actions](https://docs.microsoft.com/azure/app-service/deploy-github-actions).

## Key Considerations when migrating from Windows Azure Pack Web Sites to Azure App Service

### Supported Authentication Methods

Windows Azure Pack Web Sites allows customers to use Windows Authentication to restrict access to applications and to secure access from their applications to other resources such as SQL Server, customers were able to define custom application pool identities and choose to use this authentication method within their applications.  This was possible as Windows Azure Pack Web Sites is deployed inside a customer's own organization, network and all underlying infrastructure could be domain joined.

**Azure App Service does ot support Windows Authentication**, therefore Customers need to look to alternative authentication methods to authenticate access to other resources, for example SQL Authentication when connecting to SQL Server Databases on-premises or [Managed Identity](https://docs.microsoft.com/azure/app-service/overview-managed-identity) when connecting to Azure SQL DB instances.

For application developers looking to authenticate users, they can make use of App Service authentication capabilities targeting multiple identity providers such as:

- [Azure Active Directory](https://docs.microsoft.com/azure/app-service/configure-authentication-provider-aad)
- [Microsoft Account](https://docs.microsoft.com/azure/app-service/configure-authentication-provider-microsoft)
- [Facebook](https://docs.microsoft.com/azure/app-service/configure-authentication-provider-facebook)
- [Google](https://docs.microsoft.com/azure/app-service/configure-authentication-provider-google)
- [Twitter](https://docs.microsoft.com/azure/app-service/configure-authentication-provider-twitter)
- [OpenID Connect (preview)](https://docs.microsoft.com/azure/app-service/configure-authentication-provider-openid-connect)
- [Apple (preview)](https://docs.microsoft.com/azure/app-service/configure-authentication-provider-apple)

### Hosting Options

Windows Azure Pack Web Sites offers two different hosting options - shared and dedicated; Azure App Service expands on this and offers few categories of pricing tiers each with different capabilities and limits:

- Shared compute - Free and Shared;
- Dedicated compute - Basic, Standard, Premium, PremiumV2 and PremiumV3;
- Isolated compute

### App Service Plans

All applications in Azure App Service always run in an [App Service Plan](https://docs.microsoft.com/azure/app-service/overview-hosting-plans).  The App Service Plan defines the Azure Region in which the app is deployed, number of worker instances the plan is scaled out to, the size of the instances and the pricing tier.

The wider range of options provided in Azure App Service enable customers to run a wider range of workloads, achieve differing levels of density and isolation dependent on their specific needs.
