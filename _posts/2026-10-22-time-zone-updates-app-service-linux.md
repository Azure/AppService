---
title: "Time Zone Updates on Azure App Service for Linux"
author_name: "Byron Tardif"
toc: true
toc_sticky: true
---

> **Update (25 October 2026):** The Java rollout is now complete on **Standard**. Rollout of updated built-in Linux images for the time-zone rule changes in **IANA time zone database 2026e** is **complete on Latest and Standard** for all supported runtimes covered below, including **Java**. **No channel change is needed.** The PHP 8.2, PHP 8.3, and EOL exclusions described below remain unchanged.

Time-zone rules change when governments update local timekeeping policies. Apps need current time-zone data to convert UTC timestamps to local time and calculate schedules correctly.

The [upstream time zone database release notes](https://github.com/eggert/tz/blob/main/NEWS) describe changes affecting several Canadian regions around the **1 November 2026** clock transition, as well as an earlier change affecting Morocco and Western Sahara. **UTC itself does not change.**

## What changes in the time-zone data

The updates are cumulative. **2026e** includes the following rule changes from releases 2026b through 2026e:

| Region | Updated behavior | First included |
|---|---|---|
| British Columbia (including `America/Vancouver`) | Remains on UTC-07 instead of falling back on 1 November. | 2026b |
| Alberta (including `America/Edmonton`) | Remains on UTC-06 instead of falling back on 1 November. | 2026c |
| Morocco and Western Sahara | Move to permanent UTC+00 on 20 September 2026. | 2026c |
| Northwest Territories | Remains on UTC-06 instead of falling back on 1 November. | 2026d |
| Manitoba (including `America/Winnipeg`) | Remains on UTC-05 instead of falling back on 1 November. | 2026e |

See the upstream release notes for exact zone coverage and transition details. These changes do not mean that every location in Canada follows the same rules.

Older data can apply a clock change that no longer occurs, producing incorrect local-time displays, job schedules, deadlines, and date-based calculations. Apps on different data versions can also disagree about the same timestamp.

## What we are doing

Updated built-in Linux images are available on **Latest and Standard** for **non-EOL runtimes**, with the [PHP 8.2 and 8.3 exceptions](#php-82-and-83-exceptions) described below. The updates address the time-zone data needed for these rule changes, including OS data and runtime-bundled data where applicable.
**Java is available on both Latest and Standard; its rollout is complete.**

The following runtime versions are included in the completed rollout to **Latest and Standard**. For Java, the table summarizes Java SE versions rather than listing individual application-server combinations.

| Runtime | Versions included in the image updates |
|---|---|
| .NET | 8, 9, 10, 11 |
| Node.js | 22, 24 |
| Python | 3.10, 3.11, 3.12, 3.13, 3.14 |
| PHP | 8.4, 8.5 |
| Java SE | 8, 11, 17, 21, 25 |

**EOL runtimes do not receive these image updates.** Updating an image does not automatically replace time-zone databases bundled in your app or its dependencies.

### PHP 8.2 and 8.3 exceptions

**PHP 8.2 and PHP 8.3 are not included in this initial time-zone update payload.** These stacks use a custom PHP time-zone database that is not current. We are investigating an update plan for these two stacks; no availability date is confirmed.

Moving an app on either stack to Latest alone does not address this exception. If your app depends on the changed rules, update and test it on a supported PHP stack included in this rollout, such as **PHP 8.4 or 8.5**, and verify its date/time behavior before switching production traffic.

### Rollout by Platform Release Channel

| Channel | Availability of the updates |
|---|---|
| **Latest** | Rollout **complete** for the included runtimes. |
| **Standard** (default) | Rollout **complete** for the included runtimes, including Java. |

Both channels include these updates for all covered runtimes, **including Java**. Changing your channel does not upgrade your app to a different runtime version or make an EOL runtime supported.

## What you should do

1. **Use Standard or Latest to receive the updated rules.** For eligible runtimes, including Java, apps on either channel do not need a channel change.
2. **Check your app's actual date/time behavior.** Test conversions and schedules for the regions your app uses, including timestamps on both sides of the relevant transition. Do not rely on the selected channel or OS package version alone.
3. **Review application-managed time-zone data.** Libraries, bundled ICU data, and custom time-zone databases can differ from the OS database. Update affected dependencies and rebuild and redeploy your app as needed.
4. **Review PHP 8.2, PHP 8.3, and EOL workloads.** The two PHP stacks are excluded from this initial payload, and EOL runtimes do not receive these updates. Move to an included supported stack where possible and test before production deployment.
5. **Update custom containers and bring-your-own runtimes yourself.** App Service does not patch their contents. Pull an updated supported base image, update OS and runtime-specific time-zone data, then rebuild, test, and redeploy. Selecting Latest does not update your custom image.

### Change your Platform Release Channel

**Azure portal**

1. In the Azure portal, go to your App Service app.
2. In the left menu, select **Stack settings**.
3. Under **Platform Release Channel**, select **Standard**.
4. Select **Save**.

**Azure CLI**

Use [az webapp update](https://learn.microsoft.com/cli/azure/webapp#az-webapp-update) to move your app to Standard:

```bash
az webapp update \
  --resource-group <resource-group> \
  --name <app-name> \
  --platform-release-channel Standard
```

Replace the placeholders with your app's resource group and name. For a deployment slot, add `--slot <slot-name>`.

Eligible apps, including Java apps, already on **Standard** or **Latest** do not need a channel change.

For more information, see [OS and runtime patching in Azure App Service](https://learn.microsoft.com/azure/app-service/overview-patch-os-runtime#control-runtime-patch-update-timing-with-platform-release-channel).

### Verify time-zone behavior

Use [az webapp exec](https://learn.microsoft.com/cli/azure/webapp#az-webapp-exec) (currently in preview) with Azure CLI **2.90.0 or later** to open an interactive shell in the running app:

```bash
az webapp exec --resource-group <resource-group> --name <app-name>
```

For a deployment slot, add `--slot <slot-name>`. Use `--instance <instance-id>` to check other instances as needed.

Inside an Ubuntu- or Debian-based container, inspect the OS and installed time-zone package:

```bash
cat /etc/os-release
dpkg-query -W -f='${Package} ${Version}\n' tzdata
```

For a quick OS-level behavior check, convert a timestamp after the November transition:

```bash
TZ=America/Winnipeg date -d '2026-11-01 12:00:00 UTC' '+%Y-%m-%d %H:%M:%S %z'
```

With the updated Manitoba rules, the expected result is:

```text
2026-11-01 07:00:00 -0500
```

**This checks the OS time-zone data on one instance, not the database used by every runtime or library.** Repeat relevant conversions through your app's own date/time APIs and scheduling libraries. An OS package update alone is not proof that application-bundled ICU or other time-zone data is current.

## Related updates

- [Critical PHP security release guidance for App Service]({{ site.baseurl }}{% post_url 2026-10-21-php-critical-security-release-app-service-linux %}) covers the separate PHP runtime vulnerabilities and security-patch rollout.
- [Node.js and Python emergency runtime updates on App Service for Linux]({{ site.baseurl }}{% post_url 2026-10-22-node-python-emergency-release-app-service-linux %}) covers the related runtime releases.
- [eMudhra / emSign certificate security updates on App Service for Linux]({{ site.baseurl }}{% post_url 2026-10-22-emudhra-certificate-issue-app-service-linux %}) covers the separate certificate trust-store updates. Its PHP exclusions differ from the time-zone update exclusions described here.

## Stay informed

We share further updates here as the PHP 8.2 and 8.3 update plan becomes available.

Thank you for keeping your apps' time-zone data current on Azure App Service.
