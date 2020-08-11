---
title: "AppServiceAppLogs Now Available for ASP .NET Windows Web Apps"
author_name: "Yutang Lin"
tags:
    - monitoring
---

We have added a new log support for AppServiceAppLogs on Windows for your ASP .NET web apps (ASP .NET Core support isn't currently supported).

## How to add log message in code
You can use the [System.Diagnostics.Trace](https://docs.microsoft.com/dotnet/api/system.diagnostics.trace?view=netcore-3.1) class to log information to the application diagnostic logs. For example:

``` 
System.Diagnostics.Trace.TraceError("Error found");
```

## How to filter log levels sent to Log Analytics/Storage account/Event hub
If you have various levels of loggings in your web app but are only interested in having certain levels of logs sent to the logging endpoint, you can set a filter for the minimum level in your **application settings** under **Configuration**.

The application setting name will be ```APPSERVICEAPPLOGS_TRACE_LEVEL``` and the value will be the minimum level (ie. Error, Warning, Verbose, etc.).

For example, if you are only interested in seeing logs that are of level Warning and higher, you will set your application setting ```APPSERVICEAPPLOGS_TRACE_LEVEL``` to **Warning**.

![App Settings]({{site.baseurl}}/media/2020/08/app-settings.png){: .align-center}

## How logs show up in Log Analytics
The texts of your logs will generally show up in the "Message" field in Log Analytics, but if you have an Error log, you will find the text in the "StackTrace" field. Look at the samples below and note the difference in the fields.

Below is a sample result from an Error log:
![App Settings]({{site.baseurl}}/media/2020/08/error-logs-la-sample.png){: .align-center}

Below is a sample result from an Information log:
![App Settings]({{site.baseurl}}/media/2020/08/information-logs-la-sample.png){: .align-center}


## Sample queries in Log Analytics

You can use the different levels of logging such as Error, Information, and etc. in your application and this will show up in your logs in Log Analytics under the "Level" field. You are able to filter out logs based on the level. The example below shows how you can filter only for Error logs:

```
AppServiceAppLogs 
| where Level == "Error"
```