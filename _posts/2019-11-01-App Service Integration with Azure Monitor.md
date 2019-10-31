---
title: "App Service Integration with Azure Monitor"
author_name: "Jason Freeberg and Yutang Lin"
tags:
    - example
    - multiple words
    - no more than 3 tags
---

> App Service integration with Azure Monitor is currently in preview.

We are happy to announce that App Service has new and improved integration with Azure Monitor. You can now send your logs from Windows or Linux App Service to Storage Accounts, Event Hubs, or Log Analytics.

## Increased visibility into your web apps 

Azure Monitor is the central observability service to collect, analyze, and act on telemetry from your other Azure resources. You can use Azure Monitor to set up rule-based alerts, create dashboards, export to third-party services with Event Hubs, or archive logs and metrics for compliance needs. 

App Service’s improved integration with Monitor enables new observability scenarios for development and operations teams. Developers can set up automatic emails with full stack traces when an exception is thrown. Operations teams can create dashboards to view the overall performance and stability of their applications. Compliance teams can monitor login attempts and file changes.  

# Getting Started

## Prerequisites
1. [Create an App Service app](https://docs.microsoft.com/en-us/azure/app-service/)
1. Create a Storage Account, Event Hubs, or Log Analytics 

## How to enable diagnostics
To enable diagnostics in the Azure portal, from the left navigation of your app, select **Diagnostic settings>  Add diagnostic setting**.

![Diagnostic-Settings-Page]({{site.baseurl}}/media/2019/11/Diagnostic-Settings-Page.png)

Make sure you have created the resources you want to store your logs to first before creating a diagnostic setting. 
1. Select where you want to send your logs from the current app.
   - Storage Account
      - Needs to be in the same region as your web app
      - Configure the rention days for the storage account
   - Event Hub
   - Log Analytics
1. There are a few log types available. The table below lists the various log types with its description and availability per OS. In order to enable logs, select the logs that you want to store.

   ![Log-Availability]({{site.baseurl}}/media/2019/11/Log-Availability.png)

   <!-- | Log Name                          | Description | Windows | Linux | 
   |-----------------------------------|-------------|---------|-------|
   | AppServiceConsoleLogs             | Any logs or output written to the console (also known as standard output or standard error) | TBA | ✔️ | 
   | AppServiceHTTPLogs                | Access logs from the web server (IIS for Windows web apps, Nginx for Linux) | ✔️ | ✔️ | 
   | AppServiceEnvironmentPlatformLogs | Logs for visibility into ASE operations such as scaling, configuration changes, and status | ✔️ ️| ✔️ | 
   | AppServiceAuditLogs               | Logs for any user login via FTP or Kudu | ✔️ | ✔️ | 
   | AppServiceFileAuditLogs           | Logs for file changes (add, delete, or update) via FTP or Kudu | TBA | TBA |  
   | AppServiceAppLogs                 | Any logs or exceptions written to the stack’s logging utility. Supports multi-line logs and exceptions | TBA | ✔️* |  
   *Supported on Java SE and Tomcat  -->

   ![Creating-Diagnostic-Settings]({{site.baseurl}}/media/2019/11/Creating-Diagnostic-Settings.png)

## How to view logs from Storage account
   Open the Storage account you've enabled your logs to send to and go to **Containers**. 

   ![Storage-Account-1]({{site.baseurl}}/media/2019/11/Storage-Account-1.png)

   You will see a list of containers that have been automatically created for the logs you have enabled.

   ![Storage-Account-2]({{site.baseurl}}/media/2019/11/Storage-Account-2.png)

## How to view logs from Log Analytics
   Open the Log Analytics workspace you've enabled your logs to send to and go to **Logs**. Click on **LogManagement** to see the list of logs available.

   ![Log-Anayltics-1]({{site.baseurl}}/media/2019/11/Log-Analytics-1.png)

   Scroll through the list of logs until you see "AppService..." logs. You will see the various log names on the list even if you didn't enable them. Select the logs you want to see and hit "Run". Here is a guide for [Azure Monitor log query examples](https://docs.microsoft.com/en-us/azure/azure-monitor/log-query/examples).

   ![Log-Anayltics-2]({{site.baseurl}}/media/2019/11/Log-Analytics-2.png)








