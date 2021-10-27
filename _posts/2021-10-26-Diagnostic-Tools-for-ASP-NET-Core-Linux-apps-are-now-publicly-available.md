---
title: "General availability of Diagnostics tools for App Service on Linux .NET core apps"
author_name: "Mark Downie, Puneet Gupta"
toc: true
toc_sticky: true
category: networking
---

If your Azure cloud service is responding slowly  it is important to establish if your code is contributing to the problem.  Is there code contributing to a CPU issue? Or a memory bottleneck?  Are there unhandled exceptions or errors that might help with root causing the problem?

We are pleased to announce the public availability of Diagnostic tools for App Services Linux for .NET Core apps. With this capability, we now offer built-in support for collecting deep diagnostic artifacts that can help you debug application code issues. These artifacts include memory dumps and traces. These tools empower developers to diagnose a variety of .NET code scenarios on Linux including:

- Slow performance
- High memory
- High CPU
- Runtime errors and exceptions.

## Collection in Diagnose and Solve

To access these new capabilities on your .NET Core apps hosted in Linux, navigate to the **Diagnose and Solve** Blade - > **Diagnostics Tools** and select either **Collect .NET Profiler Trace** or **Collect Memory Dump**.
![Linux Diagnostic Tools]({{site.baseurl}}/media/2021/10/linux-diagnostic-tools.png)

## Collection in Kudu

The [Kudu service](https://docs.microsoft.com/azure/app-service/resources-kudu) for Linux app services has been updated to include new collection options for memory dumps and profiles on the Process Explorer page.

To navigate to this new Kudu experience use the following (update &lt;**mysite**&gt with your app name): https://&lt;**mysite**&gt;.scm.azurewebsites.net/**newui** to check out the new experience.
![Process Explorer in Kudu]({{site.baseurl}}/media/2021/10/kudu-process-explorer-linux.png)

When you select the *Process Explorer* page, you can identify the process you want to debug. Use the drop downs to select the type of memory dump and click **Collect Dump**. Alternatively, can select the length of a profile from the drop down and click Start Profiling.

## Analyzing the problem

Once you have collected your artifacts you can start investigating the issue

[Notes]Visual studio Parallel Stacks, Profiler and the Diagnostics Analysis

## Conclusion

In our Azure PaaS offerings, we continue to invest in providing a comprehensive diagnostics experience that helps you maximize on your investment.
