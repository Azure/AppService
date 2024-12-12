---
title: "Crash Monitoring for child processes"
author_name: "Puneet Gupta"
category: 'Diagnostics'
---

We are pleased to announce the extension of the crash monitoring feature to include processes other than the main worker process (w3wp.exe). This enhancement allows for the monitoring and capturing of crash dumps for any unhandled exceptions in non-w3wp.exe processes. This feature is especially useful for out-of-process stacks such as .NET Core.

### Enabling Crash Monitoring for child processes
To enable crash monitoring for processes other than w3wp.exe, follow these steps:
1. **Specify Process Name**: Under the Crash Monitoring tool in the Diagnostic Tools category, enter the name of the process you wish to monitor in the **Child Process Name** section.
> ![Crash Monitoring for child processes]({{ site.baseurl }}/media/2024/07/child-process-crash-monitoring.png)
2. **Start Monitoring**: Click on "Start Monitor" to begin monitoring the specified process.

Once enabled, all new instances of the specified process will be monitored using the debugger process. If a crash occurs, a crash dump will be collected and uploaded to the designated storage account.

### Important Considerations
1. **Exclusive Monitoring**: At any given time, only one specific process name can be monitored. When child process crash monitoring is enabled, w3wp.exe will not be monitored for crashes.
2. **Resource Limitations**: A maximum of five processes with the same name can be monitored simultaneously. Each monitored child process initiates a debugger process. This limit is set to prevent excessive resource usage by debugger processes.

By following these guidelines, you can effectively extend crash monitoring to additional processes and enhance your diagnostic capabilities.
