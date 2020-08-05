---
title: "Crash Monitoring feature in Azure App Service"
author_name: "Yun Jung Choi, Puneet Gupta"
category: 'Diagnostics'
tags:
    - process crash
    - unhandled exception
toc: true
toc_sticky: true
comments: true
---

A crash happens when an exception in your application code goes un-handled and ends up terminating the process. These exceptions are known as _second chance exceptions_ as they end up terminating the application process. The ill effect of a crash is that your app process is terminated and all the in-flight requests (request that are currently processed by the app) are aborted. An end user may experience a HTTP 502 error for such requests that get aborted. Also, when the process restarts, performance of the app is also impacted due to the Cold Start which makes things worse.

When you are running production workloads on an App Service, it’s important to quickly identify the root cause of crashes to troubleshoot and minimize the business impact. Having the right set of logs is the key to quick resolution when your application is crashing or behaving unexpectedly. However, it could be difficult capture memory dumps at the time of the crash.

**With App Service Diagnostics's Crash Monitoring**, you can collect memory dumps and call stack information at the time of the crash to identify the root cause of the crashes. Crash Monitoring works by enabling an agent on your application hosted on App Service. The agent attaches a debugger (procdump.exe in this case) when process starts and as soon as the process crashes with an unhandled exception, it captures a memory dump. Because Crash Monitoring uses app settings to enable the agent, any changes in the configuration of the crash monitoring session, starting, and stopping the tool will restart your application.

> Note – Enabling crash monitoring might incur slight performance impact on your app because a debugger is always attached to your process. The delay would vary depending upon the number of exceptions that your application code is throwing.

To access Crash Monitoring, browse to your App Service web app in [Azure portal](https://portal.azure.com) and click **Diagnose and Solve problems** in the left navigation panel. Then, click on the home page tile named **Diagnostic Tools**. Once you are inside Diagnostic Tools, click **Crash Monitoring**.

![Crash Monitoring]({{site.baseurl}}/media/2020/08/crash-monitoring-ui.png)

## Configuring Crash Monitoring

Crash Monitoring operates based on 4 conditions that you can configure to tailor your needs. [Note: Configuration will be saved in your app’s app setting, hence, each time a new configuration is saved, your app will restart.]

- **Storage account** - The selected storage account will store the memory
   dumps captured via Crash Monitoring. **It is strongly advised that
   you use one storage account per app**. Selecting a storage account
   already in use for another app may cause Crash Monitoring to fail.
   Also, do not change the storage account for your app if there is a
   crash monitoring session in progress.
- **Start time** – Crash Monitoring
   session will begin at the selected time.
- **Stop time** – Crash Monitoring  session will end at the selected time regardless of the maximum  of memory dumps captured. To completely disable the agent
   after the Crash Monitoring session, click on the **Disable Agent** link.
- **Max No. of memory dump** – Crash Monitoring session will end after the maximum number of dumps are collected. To completely disable the agent after the Crash Monitoring session, click on the **Disable Agent** link.

Once you click **Start Monitor**, you should see that monitoring is enabled and in progress
> ![Crash Monitoring Enabled]({{site.baseurl}}/media/2020/08/crash-monitoring-enabled.png)

**Note**: Deleting a memory dump from a storage account while the tool is still running may cause the tool to collect additional data than desired. Please ensure the session is completed before you delete the memory dumps from the storage account.

## Analyzing the Data

Once you configure and start the Crash Monitoring session, the tool will automatically collect memory dumps and stack trace as your application crashes. You can view the memory dumps and stack trace information grouped by the exit code in the Analyze section. Memory dumps and stack trace information become available as your application crashes though you may experience 15 minutes of delay for complete logs to show.
> ![Crash Monitoring Insight]({{site.baseurl}}/media/2020/08/crash-monitoring-insight.png)

You can click on the **View Details** link to expand the details of the crash
> ![Crash Monitoring Details]({{site.baseurl}}/media/2020/08/crash-monitoring-details.png)

And then you can click on the **View** link under **Callstack** to view the callstack for the crash.
> ![Crash Monitoring CallStack]({{site.baseurl}}/media/2020/08/crash-monitoring-callstack.png)

There is an option to download the dump file directly too. Click on the **Download File** link next to the crash and download the dump file. Once downloaded, open it in Visual Studio.

![Open dump file in Visual Studio]({{site.baseurl}}/media/2020/08/crash-monitoring-visual-studio.png)

Not only this, you can launch the CallStack window by going to **Debug** menu and then selecting **Windows** and then choosing **Call Stack**.

![View Callstack in Visual Studio]({{site.baseurl}}/media/2020/08/crash-monitoring-visual-studio-stack.png)

Clicking on **Debug with Managed Only** will attempt to load the PDB files and open the exact source code of the function if Visual Studio and symbols are lined up propery. Even if they are not, the Visual Studio Debugger will show exception details like below. In this way, you can identify the callstack and exception message directly from the memory dump file.

![View Exception in Visual Studio]({{site.baseurl}}/media/2020/08/crash-monitoring-visual-studio-exception.png)

## View Historical Data

You can view up to past 15 days of data in the "View History" section. If you delete the memory dumps from your storage accounts, they will no longer show in this section.
> ![Crash Monitoring Historical Data]({{site.baseurl}}/media/2020/08/crash-monitoring-history.png)

## Completely Disable Crash Monitoring

To completely disable Crash Monitoring, you need to disable the app setting for the tool. You can do this by clicking on **Disable agent** in the Analyze section. This will remove the app setting for Crash Monitoring and restart your app.
> ![Crash Monitoring disable agent]({{site.baseurl}}/media/2020/08/crash-monitoring-disable-agent.png)