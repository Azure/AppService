---
title: "Announcing Public Preview of Free Hosting Plan for WordPress on App Service"
author_name: "Abhishek Reddy"
toc: true
---

We are excited to announce that we have released the public preview of free hosting plan for WordPress on App Service.

We announced the General Availability of WordPress on App Service one year ago, in August 2022 with 3 paid hosting plans. We learnt that sometimes you might need to try out the service before you migrate your production applications. So, we are offering you a playground for a limited period - a free hosting plan to and explore and experiment with WordPress on App Service. This will help you understand the offering better before you make a long-term investment.

| **Note**: This hosting plan is not suitable for Production workloads. So, it is highly recommended that you do not use this plan for production setup. |

**Updated Hosting Plans:**

| **Hosting Plan** | **WebApp Server** | **Database Server** |
|------------------|-------------------|---------------------|
| Free | F1 Free Tier (60 CPU minutes per day, 1 GB RAM, 1 GB Storage) | Burstable, B1ms Free trial (1 vCores, 2 GB RAM, 32 GB storage, 396 IOPS) |
| Basic | B1 (1 vCores, 1.75 GB RAM, 10 GB Storage) | Burstable, B1s (1 vCores, 1 GB RAM, 20 GB storage, Auto IOPS)|
| Standard| P1V2 (1 vCores, 3.5 GB RAM, 250 GB Storage) | Burstable, B2s (2 vCores, 4 GB RAM, 128 GB storage, Auto IOPS) |
| Premium | P1V3 (2 vCores, 8 GB RAM, 250 GB Storage) | General Purpose, D2ds\_v4 (2 vCores, 16 GB RAM, 256 GB storage, Auto IOPS) |

**Eligibility**:

The free hosting plan take advantage of App Service F1 free tier and Azure Database for MySQL free trial. Your eligibility depends on your subscription type:

| **Subscription Type** | **App Service F1** | **Azure Database for MySQL B1ms** |
|-----------------------|--------------------|-----------------------------------|
| Free Account | Free Forever | 750 hours per month for 12 months |
| Student Account | Free Forever | 750 hours per month for 12 months|
| Pay as you go with Free MySQL | Free Forever | 750 hours per month for 12 months |
| Pay as you go without Free MySQL | Free Forever | Chargeable |

Note: Please refer to this FAQ for more details on Free Account : [Azure Free Account FAQ \| Microsoft Azure](https://azure.microsoft.com/free/free-account-faq)

**Features and Limitations**:

The free hosting plan takes advantage of multiple optimizations and features we built for WordPress on App Service on top of the inbuilt features for App Service and Azure Database for MySQL.

1. Easy and Automated deployments from the Azure Portal
2. Inbuilt Redis cache
3. Accelerated WP Admin using local storage caching
4. PhpMyAdmin for database management

However, there are certain points that you need to keep in mind.

1. App Service F1 plan has limited capabilities compared to shared to Basic or Standard plans. Read [Azure App Service Plans \| Microsoft Learn](https://learn.microsoft.com/en-in/azure/azure-resource-manager/management/azure-subscription-service-limits#app-service-limits)
2. Azure Database for MySQL has 750 hours of Burstable B1ms instance for this free hosting plan. Read [Azure Database for MySQL Free Trial \| Microsoft Learn](https://learn.microsoft.com/en-us/azure/mysql/flexible-server/how-to-deploy-on-azure-free-account)
3. Integration with Paid services such as CDN, Front Door, Blob Storage, and Email Service is not included in the free hosting plan.
4. Local storage caching is limited to 500 MB. We recommend that you do not exceed 500 MB in content, themes, and plugins.

Limitations:

1. Since you are running on Free Tier, for App Service there is no support for Scale out capability and ‘Always on’ feature. They are disabled for F1 SKU.
2. There is no VNET support, hence you cannot configure your WordPress site which is on Free trial within a VNET. However to secure your data, you can configure the database behind the private end point. Details on how to configure with private end point can be found here: [Use an Azure free account to try Azure Database for MySQL - Flexible Server for free \| Microsoft Learn](https://learn.microsoft.com/azure/mysql/flexible-server/how-to-deploy-on-azure-free-account)

**Upgrading to higher SKUs**:

When running on Azure App Service F1 SKU, it is not supported to scale-out to multiple instances.  You can scale-up your App Service to next highest SKU that suits your workloads. Upgrade your WordPress site to higher SKUs based on your workloads. You can refer to the guidance described here: [Price reduction in Hosting Plans for WordPress on Azure App Service - Microsoft Community Hub](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/price-reduction-in-hosting-plans-for-wordpress-on-azure-app/ba-p/3786290)

**Monitor and track free service usage**:

You’re not charged for Azure App Service F1 SKU as this SKU is forever free. You're not charged for Azure Database for MySQL - Flexible Server services included for free with your Azure free account unless you exceed the free service limits. To remain within the limits, use the Azure portal to track and monitor your free services usage.  For tracking and monitoring your free services usage, refer to this document: [Monitor and track Azure free service usage - Microsoft Cost Management \| Microsoft Learn](https://learn.microsoft.com/azure/cost-management-billing/manage/check-free-service-usage)

**Additional references**:

1. How to create student account for College students/teachers/profressors: [Azure for Students – Free Account Credit \| Microsoft Azure](https://azure.microsoft.com/free/students/)
2. How to create Azure Free account: [Create Your Azure Free Account Today \| Microsoft Azure](https://azure.microsoft.com/free)

**Support and Feedback**:

In case you need any support, you can open a support request at [New support request - Microsoft Azure](https://ms.portal.azure.com/#view/Microsoft_Azure_Support/NewSupportRequestV3Blade).  

For more details about the offering, please visit  [Azure/wordpress-linux-appservice (github.com)](https://github.com/Azure/wordpress-linux-appservice)  

If you have any ideas about how we can make WordPress on Azure App Service better, please post your ideas at [Post idea · Community (azure.com)](https://feedback.azure.com/d365community/post/b09330d1-c625-ec11-b6e6-000d3a4f0f1c?page=1&sort=newest) or report an issue at [Issues · Azure/wordpress-linux-appservice (github.com)](https://github.com/Azure/wordpress-linux-appservice/issues)

or you could email us at [wordpressonazure@microsoft.com](mailto:wordpressonazure@microsoft.com) to start a conversation.
