---
title: "New Log Types for Azure Monitor Integration"
author_name: "Yutang Lin"
tags:
    - monitoring
---

We have recently added two new log types to our [preview of App Service's Integration with Azure Monitor](https://azure.github.io/AppService/2019/11/01/App-Service-Integration-with-Azure-Monitor.html). The two new log types are:

1. AppServiceIPSecAuditLogs
1. AppServicePlatformLogs

To learn more about how to set up your Diagnostic Settings, refer to our [previous announcement blog post](https://azure.github.io/AppService/2019/11/01/App-Service-Integration-with-Azure-Monitor.html#create-a-diagnostic-setting).

## What are these new logs?

### AppServiceIPSecAuditLogs (Linux and Windows)

This log will show requests made to an web app if there were any [IP access restriction rules](https://docs.microsoft.com/en-us/azure/app-service/app-service-ip-restrictions) created. It will provide information such as the host, client IP, result, and the matching rule. This is available for both Linux and Windows web apps.

As an example, if a user created an IP rule to only allow access from a certain IP range, and there was a request made to the app from an IP outside of the allowed IP range, the log will show the IP of the request and which rule denied the request. Similar results will show for requests made from allowed IP ranges.

> At the time of writing, this log type can only be sent to a Storage Account. Future updates will be made to allow this log type to go to Log Analytics.

### AppServicePlatformLogs (Linux only)

This log type shows the output of the Docker commands used to manage your container. If you look at your Linux web app's file system, the `LogFiles` directory contains two kinds of log files with the following formats:

- `YYYY_MM_DD_RDXXXXXXXXX_default_docker.log`: This is the equivalent of *AppServiceConsoleLogs* on the file system
- `YYYY_MM_DD_RDXXXXXXXX_docker.log`: This is the equivalent of *AppServicePlatformLogs* on the file system

This log will have the contents of the `YYYY_MM_DD_RDXXXXXXXX_docker.log`. It will contain logs such as `starting container for site...`, `docker run...`, output from the `docker pull` command, etc.

## Current State of All Logs Types

The table below shows the latest availability for the log categories on Windows and Linux.

| Log type | Windows | Windows Container | Linux | Linux Container | Description |
|-|-|-|-|-|-|
| AppServiceConsoleLogs | Java SE & Tomcat | Yes | Yes | Yes | Standard output and standard error |
| AppServiceHTTPLogs | Yes | Yes | Yes | Yes | Web server logs |
| AppServiceEnvironmentPlatformLogs | Yes | N/A | Yes | Yes | App Service Environment: scaling, configuration changes, and status logs|
| AppServiceAuditLogs | Yes | Yes | Yes | Yes | Login activity via FTP and Kudu |
| AppServiceFileAuditLogs | Yes | Yes | TBA | TBA | File changes made to the site content; only available for Premium tier and above |
| AppServiceAppLogs | ASP .NET | ASP .NET | Java SE & Tomcat Blessed Images | Java SE & Tomcat Blessed Images | Application logs |
| AppServiceIPSecAuditLogs  | Yes | Yes | Yes | Yes | Requests from IP Rules |
| AppServicePlatformLogs  | TBA | Yes | Yes | Yes | Container operation logs |

