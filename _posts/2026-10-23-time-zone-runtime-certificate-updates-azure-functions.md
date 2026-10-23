---
title: "Time Zone, Node.js, Python, and Certificate Updates for Azure Functions"
author_name: "Byron Tardif"
toc: true
toc_sticky: true
---

> **Update (23 October 2026):** Updates for time-zone rules, Node.js and Python runtimes, and the eMudhra / emSign certificate issue are **rolling out** to Azure Functions. Windows apps on Consumption, App Service plans, and Elastic Premium follow the App Service Windows patching process. Linux apps on Consumption, App Service plans, Elastic Premium, and Flex Consumption are being patched separately by the Azure Functions team. Updates for **Azure Static Web Apps managed functions** are also in progress. **Rollouts are in progress, not complete.**

The patching process depends on your function app's **operating system and hosting plan**.

## Rollout by hosting plan and operating system

| Hosting plan or offering | Windows | Linux |
|---|---|---|
| Consumption | App Service Windows patching process; in progress. | Separate Azure Functions rollout; in progress. |
| App Service plan (Dedicated) | App Service Windows patching process; in progress. | Separate Azure Functions rollout; in progress. |
| Elastic Premium | App Service Windows patching process; in progress. | Separate Azure Functions rollout; in progress. |
| Flex Consumption | Not available on Windows. | Separate Azure Functions rollout; in progress. |
| Static Web Apps managed functions | Not applicable. | Managed functions update rollout; in progress. |

These statuses describe the rollout process, **not confirmation that a particular app or instance already has every applicable fix**. Python functions run on Linux; the Python runtime updates below do not apply to Windows function apps.

### Windows: Consumption, App Service plans, and Elastic Premium

Function apps on these Windows hosting plans receive the applicable platform updates through the **App Service Windows patching process**. Follow the corresponding posts for update details and rollout status:

- **Time-zone updates:** The rollout has started through accelerated Safe Deployment Practices (SDP) and is not yet complete. See [Time zone updates on App Service for Windows]({{ site.baseurl }}{% post_url 2026-10-23-time-zone-updates-app-service-windows %}).
- **Node.js runtime fixes:** See [Emergency Node.js runtime updates on App Service for Windows]({{ site.baseurl }}{% post_url 2026-10-22-node-emergency-release-app-service-windows %}).
- **Certificate trust updates:** See [eMudhra / emSign certificate security updates on App Service for Windows]({{ site.baseurl }}{% post_url 2026-10-22-emudhra-certificate-issue-app-service-windows %}).

These are separate OS and runtime updates. Receiving one does not establish that all applicable updates have reached your app.

### Linux: Consumption, App Service plans, Elastic Premium, and Flex Consumption

The **Azure Functions team is rolling out these updates separately** for Linux function apps on all four hosting plans. **This rollout is in progress, not complete.**

This work covers the applicable time-zone, Node.js, Python, and certificate fixes. Availability can differ while deployment progresses; do not assume that all apps or instances have received every update.

The App Service Linux posts provide background on the [time-zone changes]({{ site.baseurl }}{% post_url 2026-10-22-time-zone-updates-app-service-linux %}), [Node.js and Python releases]({{ site.baseurl }}{% post_url 2026-10-22-node-python-emergency-release-app-service-linux %}), and [certificate issue]({{ site.baseurl }}{% post_url 2026-10-22-emudhra-certificate-issue-app-service-linux %}). **Their App Service completion statuses, runtime-version tables, and Platform Release Channel instructions are not Azure Functions rollout or support guidance**, including for Linux functions hosted on App Service plans.

#### Azure Static Web Apps managed functions

The rollout of the applicable fixes for **Azure Static Web Apps managed functions** is also **in progress, not complete**. These managed API backends are included in this Linux update guidance; do not assume that an App Service rollout completion announcement means that your managed functions have received every applicable update.

This status applies to **managed functions**, not a separately linked Azure Functions app. For a linked function app, use its hosting plan and OS to identify the rollout that applies. We will update this post when the managed functions rollout completes.

## What the updates address

### Time-zone rules

Current time-zone data is needed to convert UTC timestamps to local time and calculate schedules correctly when governments change local timekeeping rules. **UTC itself does not change.**

Test the locations your app depends on using timestamps before and after the relevant rule change. Verify both local times and UTC offsets, and check the next execution times of recurring jobs. For timer-triggered functions, review the [Azure Functions timer trigger documentation](https://learn.microsoft.com/azure/azure-functions/functions-bindings-timer#ncrontab-time-zones) for the time-zone settings supported by your OS and hosting plan; this patch does not add support for a previously unsupported setting.

An OS update does not replace time-zone databases bundled with your application or libraries. Test through the APIs and scheduling code your function actually uses.

### Node.js runtime fixes

The updates address the recent Node.js security releases described in the linked App Service posts. Use a [Node.js version supported by Azure Functions](https://learn.microsoft.com/azure/azure-functions/functions-reference-node#supported-versions) and verify the actual runtime in your running function worker.

An upstream patched version or its availability in App Service does not, by itself, establish availability for your Functions hosting plan or configured release line.

### Python runtime and dependency fixes

The Python updates address the recent Python releases and related certificate-bundle changes described in the linked runtime post. Use a [Python version supported by Azure Functions](https://learn.microsoft.com/azure/azure-functions/functions-reference-python#python-version).

**A platform runtime update does not update packages already deployed with your app**, including packages in an existing virtual environment. Review application-managed certificate bundles and affected dependencies, update them through your trusted package source, and rebuild and redeploy as needed.

### eMudhra / emSign certificate trust issue

The certificate updates address trust associated with the eMudhra / emSign CA incident. Applications can use OS certificate stores, runtime-specific trust stores, or CA bundles supplied by dependencies.

**An updated platform trust store does not prove that every TLS client in your function app uses updated trust data.** Review custom trust stores and bundled CA data separately. Test outbound TLS connections after updating, and work with endpoint owners to resolve certificate-chain failures rather than disabling certificate validation.

## What you should do

1. **Identify your hosting plan and OS.** Use the table above to determine which rollout applies.
2. **Follow the appropriate rollout status.** Windows apps on the listed plans follow the linked App Service Windows posts. For the separately managed Linux Functions rollout and Static Web Apps managed functions, watch this post for updates.
3. **Use supported runtime versions.** Check Azure Functions support for your language version and hosting plan rather than copying the App Service runtime tables.
4. **Verify your running workers.** Use existing application logging or diagnostics to check `process.version` for Node.js or `sys.version` for Python inside the function worker. Check across instances as the rollout progresses; avoid exposing diagnostics through an unauthenticated public endpoint.
5. **Test date/time behavior and outbound TLS.** Verify the code paths your functions actually use, including timers, application-managed time-zone data, and certificate bundles.
6. **Update custom container contents yourself.** For function apps using customer-provided images, update the image's OS data, runtimes, and dependencies, then rebuild, test, and redeploy. Platform patching does not patch the contents of your custom image.

## Stay informed

We will update this post as the Azure Functions-managed rollout progresses and when it completes. Follow the linked Windows posts for the corresponding App Service-managed rollout status.
