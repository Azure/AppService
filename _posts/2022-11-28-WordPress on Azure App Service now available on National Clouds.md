---
title: "WordPress on Azure App Service now available on National Clouds"
tags: 
  - Azure App Service
author_name: "Abhishek Reddy"
---
WordPress on Azure App Service has been gaining popularity since it has been made generally available. Read the GA Announcement here: [Announcing the General Availability of WordPress on Azure App Service - Microsoft Community Hub](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/announcing-the-general-availability-of-wordpress-on-azure-app/ba-p/3593481)

We received multiple requests to make the service available in National clouds. We are excited to announce that WordPress on Azure App Service is available on all National Clouds.

### What are national clouds? ###

National Clouds, also known as sovereign clouds, are physical and logical network-isolated instances of Azure that are confined within a country to honor residency, sovereignty, and compliance requirements within geographical boundaries.

In addition to the global Azure Cloud, there are two national clouds:

1. [Microsoft Cloud for US Government](https://portal.azure.us/)

2. [Microsoft Azure operated by 21Vianet (Azure China)](https://portal.azure.cn/)

Microsoft Cloud for US Government also has three separate air-gapped clouds - Fairfax, USNat, USSec.

### WordPress on Azure App Service (National Clouds) ###

It is important to remember that each national cloud is unique and different from Azure Global Cloud. While we have made sure that the WordPress on Azure App Service experience remains same across clouds, there are a few differences you must be aware of:

1. Azure Content Delivery Network (CDN) and Azure Front Door (AFD) are not available in **Azure China**. These advanced features have thus been disabled in WordPress on Azure App Service in Azure China cloud.

2. Azure Front Door (AFD) is not available in **Microsoft Cloud for US Government**. We recommend that you use Azure Content Delivery Network (CDN) when you are deploying WordPress on Azure App Service in Fairfax, USNat, or USSec.

### Support and Feedback ###

In case you need any support, you can open a support request at [New support request - Microsoft Azure](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/NewSupportRequestV3Blade).

Visit [QuickStart: Create a WordPress site - Azure App Service \| Microsoft Docs](https://docs.microsoft.com/en-us/azure/app-service/quickstart-wordpress) for a step-by-step guide on how to create your WordPress website on Azure.

For more details about the offering, please visit [Announcing the General Availability of WordPress on Azure App Service - Microsoft Tech Community](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/announcing-the-general-availability-of-wordpress-on-azure-app/ba-p/3593481).
