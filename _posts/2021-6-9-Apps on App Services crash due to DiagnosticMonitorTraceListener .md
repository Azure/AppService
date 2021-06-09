---
title: "Apps on Azure App Services may crash due to DiagnosticMonitorTraceListener"
author_name: "Puneet Gupta"
category: 'Diagnostics'
---

Azure App Services has [proactive crash monitoring feature]({{site.baseurl}}/2021/03/01/Proactive-Crash-Monitoring-in-Azure-App-Service) that checks for process crashes and collects diagnostic data that helps you determine the root cause of the crash. After looking at this feature's telemetry, we identified a common reason that is causing a lot of apps hosted on Azure App Service to crash with this call-stack.

```c#
HelperMethodFrame
System.Diagnostics.TraceUtils.GetRuntimeObject(System.String, System.Type, System.String)
System.Diagnostics.TypedElement.BaseGetRuntimeObject()
System.Diagnostics.ListenerElement.GetRuntimeObject()
System.Diagnostics.ListenerElementsCollection.GetRuntimeObject()
System.Diagnostics.TraceInternal.get_Listeners()
System.Diagnostics.TraceInternal.WriteLine(System.String)
System.Diagnostics.Debug.WriteLine(System.String)
Microsoft.Web.Compilation.Snapshots.SnapshotHelper.TakeSnapshotTimerCallback(System.Object)
System.Threading.TimerQueueTimer.CallCallbackInContext(System.Object)
System.Threading.ExecutionContext.RunInternal(System.Threading.ExecutionContext, System.Threading.ContextCallback, System.Object, Boolean)
System.Threading.ExecutionContext.Run(System.Threading.ExecutionContext, System.Threading.ContextCallback, System.Object, Boolean)
System.Threading.TimerQueueTimer.CallCallback()
System.Threading.TimerQueueTimer.Fire()
System.Threading.TimerQueue.FireNextTimers()
System.Threading.TimerQueue.AppDomainTimerCallback(Int32)
DebuggerU2MCatchHandlerFrame
ContextTransitionFrame
DebuggerU2MCatchHandlerFrame
```

The underlying exception message is **Couldn't find type for class Microsoft.WindowsAzure.Diagnostics.DiagnosticMonitorTraceListener, Microsoft.WindowsAzure.Diagnostics, Culture=neutral, PublicKeyToken=31bf3856ad364e35**

This issue can happen if you have migrated your application from Azure Cloud Services. Azure Cloud services uses the **DiagnosticMonitorTraceListener** class and this class is designed for cloud services and is not compabtible with Azure App Services. To address this issue, please follow these steps :-

1. Remove references to **Microsoft.WindowsAzure.Diagnostics.dll** from the project.
2. Remove the following section from the application web.config file (if it exists).

```xml
<system.diagnostics>
  <trace>
    <listeners>
      <add type="Microsoft.WindowsAzure.Diagnostics.DiagnosticMonitorTraceListener, Microsoft.WindowsAzure.Diagnostics, Culture=neutral, PublicKeyToken=31bf3856ad364e35" name="AzureDiagnostics">
      <filter type="" />
      </add>
    </listeners>
  </trace>
</system.diagnostics>
```

We hope this information helps in preventing crashes within your application.

Happy Debugging !
