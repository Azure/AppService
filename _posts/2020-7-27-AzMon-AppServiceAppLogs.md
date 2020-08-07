---
title: "AppServiceAppLogs Now Available for ASP .NET Windows Web Apps"
author_name: "Yutang Lin"
tags:
    - monitoring
---

We have added a new log support for AppServiceAppLogs on Windows for your ASP .NET web apps.

## How to add log message in code
You can use the ``System.Diagnostics.Trace`` class to log information to the application diagnostic logs. For example

``` 
System.Diagnostics.Trace.TraceError("Error found");
```

You can use the different levels of logging such as Error, Information, and etc. in your application and this will show up in your logs in Log Analytics. You can also query in Log Analytics using the "Level" as an example below:

```
AppServiceAppLogs 
| where Level == "Error"
```