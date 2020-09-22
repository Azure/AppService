---
title: "Public Preview of JBoss EAP on App Service"
author_name: "Christina Compy and Jason Freeberg"
category: java
---

For several years, Red Hat and Microsoft have [partnered](https://www.redhat.com/en/red-hat-microsoft-partnership) to create cloud solutions that enable enterprises to achieve more. Today, we are happy to announce that Red Hat JBoss Enterprise Application Platform (EAP) is now in Public Preview on Azure App Service. App Service has supported Tomcat and Java SE applications on Linux since 2018. Since then, our customers made it clear that they wanted an equivalent service for their Jakarta EE applications. 

> **[Try JBoss EAP on App Service](https://github.com/Azure-Samples/jboss-on-app-service) today** and [send us your feedback](mailto:java-on-app-service@microsoft.com).

## JBoss EAP across Azure

Whether your organization is running a heavily customized, clustered JBoss EAP deployment or has embraced container technologies, Azure has a cloud service to fit your needs. With Red Hat Enterprise Linux on Azure Virtual Machine Scale Sets (VMSS), you can easily lift-and-shift your on-prem JBoss EAP deployments. [Azure Red Hat Openshift](https://www.redhat.com/en/about/press-releases/red-hat-and-microsoft-fuel-hybrid-cloud-development-azure-red-hat-openshift) combines the innovation of enterprise Kubernetes with the world’s leading enterprise Linux platform, Red Hat Enterprise Linux.

App Service gives organizations the option to leverage a managed Platform-as-a-Service (PaaS) for their cloud migrations. App Service provides APIs for deployment, features for network isolation, and auto scaling.

## JBoss EAP on App Service

To create a JBoss EAP instance, head to the Azure Portal and create a new web app. In the stack selector, choose **JBoss EAP 7.2 (Preview)**. JBoss EAP on App Service is jointly developed and supported by Red Hat and Azure. Any support cases concerning the JBoss server will be handled by the experts at Red Hat. Any cases concerning the App Service platform will be resolved by Azure support. Developer tooling for JBoss EAP will be released during the Public Preview release, subscribe to the App Service Blog to stay up-to-date on news regarding Maven plugins, GitHub Actions, and IDE plugins. 

### Public Preview release notes

You can create a JBoss EAP 7.2 instance on App Service in the Azure Portal. Simply select "JBoss EAP 7.2 (Preview)" in the language stack dropdown. JBoss  EAP on App Service is available on all hardware tiers at current prices. As a preview release, this is recommended for development and testing your applications. The General Availability release of JBoss EAP on App Service will include a service fee for the integrated technical support. If you create a JBoss EAP instance on App Service, you will receive an email notice prior to the GA release with more details on the pricing changes.

> **[Try JBoss EAP on App Service](https://github.com/Azure-Samples/jboss-on-app-service) today** and [send us your feedback](mailto:java-on-app-service@microsoft.com).

## Helpful links

- [Java on App Service documentation](https://docs.microsoft.com/en-us/azure/app-service/configure-language-java?pivots=platform-linux)
- [JBoss EAP on App Service Tutorial](https://github.com/Azure-Samples/jboss-on-app-service) 
