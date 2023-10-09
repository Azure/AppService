---
title: "Recently Announced: Advanced Clustering Features for JBoss EAP on Azure App Service"
author_name: "Denver Brittain"
toc: true
---

## A new era of high availability and scalability 

If you're running distributed applications on [JBoss EAP](https://learn.microsoft.com/en-us/azure/developer/java/ee/jboss-on-azure), you know that clustering is essential for data consistency and fault tolerance. We've taken this a step further on [Azure App Service](https://azure.microsoft.com/en-us/products/app-service/). Now, when you integrate JBoss EAP with an [Azure Virtual Network (VNet)](https://learn.microsoft.com/en-us/azure/virtual-network/), clustering isn't just an option; it's a built-in feature that kicks in automatically. 

What does this mean for your apps? For starters, it improves fault tolerance and enables more efficient data sharing across multiple instances. Your application can now handle traffic spikes and server failures better. The service scales based on your configured settings in Azure App Service, providing both vertical and horizontal options. 

One key update in this release is the automatic enablement of clustering when you activate VNet Integration for your web application. This results in a high-availability setup right from the get-go. We'll delve into the technical specifics below. 

![JBOSS Clustering on App Service Architecture]({{site.baseurl}}/media/2023/09/jboss-clustering.png)

Enabling VNet integration is required for communication between servers that form the cluster. Clustering is enabled automatically but can be disabled using an Application Setting (WEBSITE_DISABLE_CLUSTERING). 

## What’s Included 

* Clustering of web applications, including HTTP session replication, HA (high availability), and Singleton Service. For more information, see [Chapter 6. Clustering in Web Applications Red Hat JBoss Enterprise Application Platform 7.4 | Red Hat Customer Portal](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.4/html/development_guide/clustering_in_web_applications) 
* High-availability support 
* Transaction recovery support 

## Configuration 
You can configure the behavior of the clustering-related features using these Application Settings: 

* WEBSITE_JBOSS_SERVER_DIR defines the parent location of the JBoss state and transaction files. If customers use a location mounted from Azure Storage, this setting improves the availability of the application by avoiding using the /home directory, which becomes read-only during platform upgrades. 

* WEBSITE_JBOSS_CLUSTER_DIR defines the location of the cluster definition files. Similar to the previous setting, if you use a location mounted from Azure Storage, this setting improves the availability of the application by avoiding using the /home directory which becomes read-only during platform upgrades. 

* JBOSS_LAUNCHER_OPTS passes options directly to the JBoss launcher script (standalone.sh) to allow changes such as enabling the JBoss web administration interface. 

* WEBSITE_DISABLE_CLUSTERING prevents the clustering behavior from starting, even if the application is used with VNet integration enabled. 

* WEBSITES_CONTAINER_STOP_TIME_LIMIT sets how long to wait for pending transactions before stopping the server forcefully (in seconds). Its default value is 120 seconds. 

## How to Get Started 

Get started with Clustering Support on App Service for JBOSS EAP today! It is now generally available. To get your hands on it, go through our detailed guide: [Clustered JBoss EAP on Azure App Service Quickstart](https://github.com/Azure-Samples/clustered-jboss-demo). This guide walks you through the deployment of a basic distributed application to JBoss EAP, demonstrating how clustering operates seamlessly on Azure App Service. 

## Additional Information 

### Auto-scale rules 

When configuring auto-scale rules for horizontal scaling it is important to remove instances one at a time to ensure each removed instance transfers its activity (for example, handling a database transaction) to another member of the cluster. When configuring your auto-scale rules in the Portal to scale down, use the following options: 

* Operation: "Decrease count by" 

* Cool down: "5 minutes" or greater 

* Instance count: 1 

When scaling out though, you can add multiple instances to the cluster simultaneously. 

### Limitations on Clustering 

* The App Service platform waits up to 120 seconds before stopping a server, not indefinitely for transactions to complete. Any pending transactions remaining after stopping the server are recovered when a new server is added, according to the number of instances defined in the Scale Out configuration. 

* If a customer manually resizes down a cluster, there’s a potential for nodes to be stopped before they complete their transactions. In that case a warning is emitted, and manual intervention is needed to commit the transactions from that node. The process is documented in section 5.2. “Migrating Logs to a New JBoss EAP Server” of the guide [Managing Transactions on JBoss EAP Red Hat JBoss Enterprise Application Platform 7.4 | Red Hat Customer Portal](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.4/html-single/managing_transactions_on_jboss_eap/index#migrating_logs_to_new_server). 

* In the case of a movement to different hardware (for example, scaling up or hardware faults), when a cluster node cannot complete its transactions, a warning will be emitted, and manual intervention is needed to commit any transactions that were not committed.  
 
### Learn more 

* [Red Hat Expands Capabilities of JBoss Enterprise Application Platform Offerings on Microsoft Azure](https://www.redhat.com/en/about/press-releases/red-hat-expands-capabilities-jboss-enterprise-application-platform-offerings-microsoft-azure)  

* [Clustered JBoss EAP on Azure App Service Quickstart](https://github.com/Azure-Samples/clustered-jboss-demo)

* [JBoss EAP on Azure App Service](https://learn.microsoft.com/en-us/azure/developer/java/ee/jboss-on-azure#jboss-eap-on-azure-app-service)

* [Clustering in Web Applications - Red Hat Customer Portal](https://access.redhat.com/documentation/en-us/red_hat_jboss_enterprise_application_platform/7.4/html/development_guide/clustering_in_web_applications)

* [Recently Announced: Advanced Clustering Features for JBoss EAP on Azure App Service](https://techcommunity.microsoft.com/t5/apps-on-azure-blog/recently-announced-advanced-clustering-features-for-jboss-eap-on/ba-p/3939672)