---
title: "App Service Integration with Azure Monitor"
author_name: "Jason Freeberg and Yutang Lin"
published: true
tags:
    - example
    - multiple words
    - no more than 3 tags
---

> App Service integration with Azure Monitor is currently in preview.

We are happy to announce that App Service has new and improved integration with Azure Monitor. You can now send your logs from Windows or Linux App Service to Storage Accounts, Event Hubs, or Log Analytics.

The table below shows the current availability for the log categories.  

| Log Name                          | Windows | Linux | 
|-----------------------------------|---------|-------|
| AppServiceConsoleLogs             | TBA     | ✔️    | 
| AppServiceHTTPLogs                | ✔️      | ✔️   | 
| AppServiceEnvironmentPlatformLogs | ✔️ ️     | ✔️   | 
| AppServiceAuditLogs               | ✔️      | ✔️   | 
| AppServiceFileAuditLogs           | TBA     | TBA   |  
| AppServiceAppLogs                 | TBA     | ✔️*   |  
*Supported on Java SE and Tomcat 

## Prerequisites
1. [Create an App Service app](https://docs.microsoft.com/en-us/azure/app-service/)
1. Create a Storage Account, Event Hubs, or Log Analytics 

## How to enable diagnostics
To enable diagnostics in the Azure portal, from the left navigation of your app, select **Diagnostic settings>  Add diagnostic setting**.

![Diagnostic-Settings-Page]({{site.baseurl}}/media/2019/11/Diagnostic-Settings-Page.png)

Make sure you have created the resources you want to store your logs to first before creating a diagnostic setting. 
1. Select where you want to send your logs from the current app
   - Storage Account
      - Needs to be in the same region as your web app
      - Configure the rention days for the storage account
   - Event Hub
   - Log Analytics
1. Select the kind of logs that you want to store
   - AppServiceHTTPLogs
      - Any logs or output written to the console (also known as standard output or standard error) 
      - Currently only supported on Linux
   - AppServiceConsoleLogs
      - Access logs from the web server (IIS for Windows web apps, Nginx for Linux)
      - Supported on both Linux and Windows
   - AppServiceAppLogs
      - Any logs or exceptions written to the stack’s logging utility. Supports multi-line logs and exceptions
      - Currently only supported on Java SE and Tomcat on Linux
   - AppServiceFileAuditLogs
      - Currently not supported
   - AppServiceAuditLogs
      - Logs for any user login via FTP or Kudu
      - Supported on both Linux and Windows

![Creating-Diagnostic-Settings]({{site.baseurl}}/media/2019/11/Creating-Diagnostic-Settings.png)
