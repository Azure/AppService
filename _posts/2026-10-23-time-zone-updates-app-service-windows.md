---
title: "Time Zone Updates on Azure App Service for Windows"
author_name: "Byron Tardif"
toc: true
toc_sticky: true
---

> **Update (23 October 2026):** The rollout of **Windows operating-system time-zone updates** on Azure App Service for Windows **has started through accelerated Safe Deployment Practices (SDP)**. **Rollout is in progress, not complete.** We will update this post when the rollout completes.

Time-zone rules change when governments update local timekeeping policies. Apps need current time-zone data to convert UTC timestamps to local time and calculate schedules correctly. **UTC itself does not change.**

Older time-zone data can apply a clock change that no longer occurs, producing incorrect local-time displays, job schedules, deadlines, and date-based calculations. Apps using different data versions can also disagree about the same timestamp.

## What we are doing

We are rolling out an **OS-level time-zone update** across App Service for Windows through accelerated SDP. This is a platform operating-system update, not a language-specific runtime release.

**The rollout has started, but is not yet complete.** Availability varies while deployment progresses; this announcement does not establish that the update has reached every app or instance.

The platform manages this OS update. Customers do not need to install an OS patch manually on App Service workers. For more information, see [OS and runtime patching in Azure App Service](https://learn.microsoft.com/azure/app-service/overview-patch-os-runtime).

### Windows and application-managed time-zone data

Windows time-zone data and the IANA database used by Linux are separate data sources. The IANA release numbers and Linux package checks in the [related Linux time-zone post]({{ site.baseurl }}{% post_url 2026-10-22-time-zone-updates-app-service-linux %}) are not Windows OS version checks.

An app can use Windows time-zone rules, runtime-bundled data, or a database supplied by a library. **An OS time-zone update alone is not proof that every date/time API or scheduler in your application uses the updated rules.**

Review the data source used by your runtime and dependencies. Update application-managed time-zone data separately through the relevant maintainers' supported update process, then test and redeploy as needed.

## What you should do

1. **Watch this post for rollout completion.** Rollout has started through accelerated SDP, but is not complete. Do not assume that every app or instance already has the update.
2. **Check your app's actual date/time behavior.** Test conversions and schedules for the regions your app uses, including timestamps on both sides of the relevant rule change.
3. **Review application-managed time-zone data.** Update affected libraries, bundled ICU data, and custom time-zone databases separately. The Windows OS update does not replace data bundled with your app or dependencies.
4. **Update customer-provided container images and bring-your-own runtimes yourself.** This platform OS rollout does not patch time-zone data inside your custom image or runtime distribution. Follow the relevant maintainers' guidance, then rebuild, test, and redeploy.

### Verify time-zone behavior

Use your application's own date/time APIs and scheduling libraries to test the zones your workload depends on:

- Convert known UTC timestamps to local time **before and after** the relevant transition. Check both the local time and UTC offset against the expected rules for that location.
- Verify the **next scheduled execution time** for recurring jobs. A correct timestamp conversion alone does not prove that a scheduler has recalculated an already queued job.
- Use the time-zone identifiers supported by your application. Do not assume that an IANA identifier from a Linux example is interchangeable with a Windows time-zone identifier.
- For scaled-out apps, check behavior across instances as the rollout progresses.

Run these checks through the application's actual code path, not only a separate diagnostic console. A console process or OS-level check may use a different data source from the running application.

## Related updates

- [Time zone updates on App Service for Linux]({{ site.baseurl }}{% post_url 2026-10-22-time-zone-updates-app-service-linux %}) covers the separate Linux image rollout and its runtime-specific exceptions. Its IANA release numbers, package commands, and Platform Release Channel instructions do not apply to the Windows OS rollout.
- [Emergency Node.js runtime updates on App Service for Windows]({{ site.baseurl }}{% post_url 2026-10-22-node-emergency-release-app-service-windows %}) covers the separate Node.js runtime rollout.
- [eMudhra / emSign certificate security updates on App Service for Windows]({{ site.baseurl }}{% post_url 2026-10-22-emudhra-certificate-issue-app-service-windows %}) covers the separate Windows OS certificate trust update.

## Stay informed

We will update this post when the Windows OS time-zone update rollout is complete.
