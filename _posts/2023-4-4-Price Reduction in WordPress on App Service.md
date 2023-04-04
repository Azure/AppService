---
title: "Price reduction in Hosting Plans for WordPress on App Service"
author_name: "Abhishek Reddy"
---
Azure Database for MySQL – Flexible Server announced a new feature: Autoscale IOPS in October 2022. With this feature enabled, you do not need to pre-provision IOPs. The Flexible server automatically scales IO up and down depending on the workload. You can save on your costs as you do not have to pay for the resources you are not fully using. Read about the announcement here: [Announcing Autoscale IOPS \(Public Preview\) for Azure Database for MySQL - Flexible Server](https://techcommunity.microsoft.com/t5/azure-database-for-mysql-blog/announcing-autoscale-iops-public-preview-for-azure-database-for/ba-p/3649089)

WordPress on Azure App Service is taking advantage of Autoscale IOPS and Storage auto-grow features of Azure Database for MySQL to provide you with more cost-effective hosting plans. Read more about these features here: [Azure Database for MySQL - Flexible Server service tiers](https://learn.microsoft.com/azure/mysql/flexible-server/concepts-service-tiers-storage)

#### Updated Hosting Plans ####

| Hosting Plan | WebApp Server | Database Server |
|---|---|---|
|Basic|B1<br />(1 vCores, 1.75 GB RAM, 10 GB Storage)|Burstable, B1s<br />(1 vCores, 1 GiB RAM, 20 GiB storage, Auto IOPS)|
|Standard|P1V2<br />(1 vCores, 3.5 GB RAM, 250 GB Storage)|Burstable, B2s<br />(2 vCores, 4 GiB RAM, 128 GiB storage, Auto IOPS)|
|Premium|P1V3<br />(2 vCores, 8 GB RAM, 250 GB Storage)|General Purpose, D2ds_v4<br />(2 vCores, 16 GiB RAM, 256 GiB storage, Auto IOPS)|

To check the earlier Hosting plans, see [Announcing the General Availability of WordPress on Azure App Service](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/announcing-the-general-availability-of-wordpress-on-azure-app/ba-p/3593481)

Here is a table to show how much you can save with the updated Hosting Plans with the optimized Database.

|Hosting Plan|Approx. Pricing – Old<br />(per month in East US Region)|Approx. Pricing – New<br />(per month in East US region)|Potential Savings|
|---|---|---|---|
|Basic|$ 28.7|$ 21|**27%**|
|Standard|$ 215|$ 139|**35%**|
|Premium|$ 317|$ 253|**20%**|
