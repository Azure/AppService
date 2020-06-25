---
title: "New Logs Available for Azure Monitor Integration"
category: logs
author_name: "Yutang Lin"
tags:
    - logs
    - monitoring
---

In addition to the logs that we launched for the [preview of App Service Integration with Azure Monitor](https://azure.github.io/AppService/2019/11/01/App-Service-Integration-with-Azure-Monitor.html#create-a-diagnostic-setting), we have recently released two new log types:
1. AppServiceIPSecAuditLogs
1. AppServicePlatformLogs

To learn more about how to set up your Diagnostic Settings, refer to our [previous announcement blog post](https://azure.github.io/AppService/2019/11/01/App-Service-Integration-with-Azure-Monitor.html#create-a-diagnostic-setting).

## What are these new logs?
### AppServiceIPSecAuditLogs (Linux and Windows)
This log will show requests made to an web app if there were any [IP access restriction rules](https://docs.microsoft.com/en-us/azure/app-service/app-service-ip-restrictions) created. It will provide information such as the host, client IP, result, and the matching rule. This is available for both Linux and Windows.

For example, if a user created an IP rule to only allow access from a certain IP range, and there was a request made to the app from an IP outside of the allowed IP range, the log will show the IP of the request and what rule denied the request. Similar results will show for requests made from allowed IP ranges.

***Note:*** As of current writing, this log is only available in the Storage Account endpoint. Updates will be made once this is available in Log Analytics.

### AppServicePlatformLogs (Linux only)
This log will show the container logs of your web app. If you look at your Linux web app's file system, you'll see the "LogFiles" folder which contains two kinds of log files with the following formats:
- `YYYY_MM_DD_RDXXXXXXXXX_default_docker.log` (equivalent of *AppServiceConsoleLogs*)
- `YYYY_MM_DD_RDXXXXXXXX_docker.log` (container logs aka *AppServicePlatformLogs*)

This log will have the contents of the `YYYY_MM_DD_RDXXXXXXXX_docker.log`, which will be the container logs. It will contain logs such as "starting container for site...", "docker run...", and etc.

## Current State of All Logs Types
The table below shows the current availability for the log categories.

|    Log Name                          |    Windows         |    Linux |
|--------------------------------------|--------------------|----------|
|    AppServiceConsoleLogs             |    TBA             |    ✔️   |
|    AppServiceHTTPLogs                |    ✔️              |    ✔️   |
|    AppServiceEnvironmentPlatformLogs |    ✔️              |    ✔️   |
|    AppServiceAuditLogs               |    ✔️              |    ✔️   |
|    AppServiceFileAuditLogs           |    ✔️ <sup>1</sup> |   TBA   |
|    AppServiceAppLogs                 |    TBA             |    ✔️ <sup>2</sup> |
|    AppServiceIPSecLogs               |    ✔️              |    ✔️  |
|    AppServicePlatformLogs            |    TBA             |    ✔️   |

<sup>1</sup> Supported only on Premium, PremiumV2 and Isolated App Service Plans
<sup>2</sup> Supported on Java SE and Tomcat
