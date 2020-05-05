---
title: "Reduce costs and increase agility with App Service and API Management"
author_name: "Mike Budzynski, Jason Freeberg"
toc: true
toc_sticky: true
---

In times of rapid change, developers and IT decision-makers must quickly adjust to a drastically evolving landscape. Successful organizations use managed cloud services to reduce operating costs by increasing developer efficiency, and seize new business opportunities by accelerating delivery of innovation.

> Try [this tutorial](https://aka.ms/app-service-apim-demo) to get started with App Service, GitHub Actions, and API Management.

## Host applications with App Service

App Service is a proven managed service for hosting your web apps and mobile backends with deployment APIs, networking integration, and built-in monitoring.

**Use your preferred technology stack to increase the speed-to-market**. Build your applications with .NET, .NET Core, Java, Node.js, Python or PHP. Deploy them as code or Docker containers and integrate with API management in Visual Studio Code or the Azure Portal.

**Simplify operations with GitHub Actions**. Use [GitHub Actions](https://github.com/features/actions) to automate the testing and deployment of your applications onto App Service’s global infrastructure. The Azure Portal makes it easy to [get started](https://www.youtube.com/watch?v=b2oyxbSbLPA) with a guided developer experience. Then [use deployment slots](https://docs.microsoft.com/azure/app-service/deploy-best-practices#use-deployment-slots) to coordinate your QA, staging, and production deployments.

**Isolate and secure applications with enterprise-grade global datacenter network**. Once your applications are deployed, isolate and secure them in [a Virtual Network](https://azure.github.io/AppService/2020/02/27/General-Availability-of-VNet-Integration-with-Windows-Web-Apps.html) or in an [App Service Environment](https://docs.microsoft.com/azure/app-service/environment/intro). Get more secure, high-speed connections to resources on premises or in the cloud and maintain fine-grained control over network traffic.

## Manage, protect, and publish APIs with API Management

API Management lets you manage and protect APIs throughout their lifecycle and publish them to consumers.

**Increase the speed to market with one-click API import**. Design the API from scratch or generate it automatically from an API definition file (OpenAPI, WSDL, WADL) or an Azure service (App Service, Functions, Logic Apps).

**Simplify management of APIs**. API Management abstracts the APIs from their implementation, allowing you to transform and iterate on your backend services without impacting API consumers. As the backends evolve and API traffic increases, create new API revisions and versions and monitor the usage with Azure Application Insights, Azure Monitor, or custom solutions.

**Protect and secure your APIs from abusive users with policies**. Apply the [rate-limit-by-key](https://docs.microsoft.com/azure/api-management/api-management-access-restriction-policies#LimitCallRateByKey) policy to throttle API calls based on any key – for example, IP address or user credentials. Set long-term quotas with the [quota-by-key policy](https://docs.microsoft.com/azure/api-management/api-management-access-restriction-policies#SetUsageQuotaByKey) to limit the allowed number of calls or data transfer. Secure your APIs with built-in API subscription keys mechanism, client certificates, or [JWT tokens](https://docs.microsoft.com/azure/api-management/api-management-access-restriction-policies#ValidateJWT). The most convenient way to author policies is to use the Azure portal or the [official Visual Studio Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-apimanagement) with the autocomplete feature. Examples of more advanced policies are located in [this GitHub repository](https://aka.ms/apimpolicyexamples).

**Seize new business opportunities by publishing your APIs in the developer portal**. Azure API Management comes with a [built-in developer portal](https://aka.ms/apimdocs/portal). It is an automatically generated, [fully customizable](https://aka.ms/apimdocs/customizeportal) website where visitors can discover your APIs, learn how to use them, try them out interactively, and sign up to acquire access. By publishing your APIs, you can scale your operations and build an ecosystem around your services. You may also monetize them to create new revenue streams.

## Try the sample

To get started with App Service and API Management, [clone this sample application](https://aka.ms/app-service-apim-demo) and follow the instructions. By the end of the tutorial, you will have set up continuous delivery with GitHub Actions and exposed your backend API with API Management.
