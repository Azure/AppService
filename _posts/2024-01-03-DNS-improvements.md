---
title: "Improvements to DNS configuration and name resolution in App Service"
author_name: "Mads Damgård"
toc: true
toc_sticky: true
---

More than a year ago we started a journey to improve the DNS configuration and name resolution in App Service. The mission was and is to improve in several areas:

* Documentation improvements
* Parity between Windows and Linux
* Configuration using site properties
* Azure Portal configuration
* Logging capabilities

In this blog post I wanted to share some details of what we are building and the current progress of each area.

## Documentation improvements

DNS configuration and name resolution now has its own article in the public documentation. This documentation goes into details with how the name resolution works and what configuration options exist. If you have not yet seen this [article](https://learn.microsoft.com/azure/app-service/overview-name-resolution), I suggest you start by reading it to provide context for the rest of this post.

## Parity between Windows and Linux

When DNS servers are explicitly configured in App Service using App Settings or site properties, there were no different in behavior of how Windows and Linux handled the configured servers, but when using DNS servers configured in the virtual network, Windows apps had a behavior that would sort the list of DNS servers and only select the first two IP addresses to be used for name resolution. This could impact the name resolution behavior if you had more than two servers configured and/or the order of the servers mattered.

About a year ago we aligned the behavior with Linux allowing up to five servers to be used and remove the sorting. To prevent breaking changes to customers that intentionally or unintentionally had taken a dependency on the sorting, we only made no sorting the default behavior for new sites created and an opt in option for existing sites. For most customers this won't have an impact. The combination of using DNS servers from the virtual network, having more than two DNS servers configured and the order having an impact is very rare.

Should you however have this exact scenario, you can validate if your site is still using DNS server sorting by calling this command:

```bash
az rest --method GET --uri /subscriptions/<sub-id>/resourceGroups/<resource group>/providers/Microsoft.Web/sites/<site name>?api-version=2022-03-01 --query 'properties.dnsConfiguration'
```

and look for the following property:

```javascript
{
   "dnsLegacySortOrder": true
}
```

If the property is returned, you can opt in to the new "no sorting" behavior by calling this command:

```bash
az rest --method POST --uri /subscriptions/<sub-id>/resourceGroups/<resource group>/providers/Microsoft.Web/sites/<site name>/disableVirtualNetworkDnsSorting?api-version=2022-03-01
```

Another difference that existed between Windows and Linux was the default behavior of name resolution. You can configure retry timeout, retry count and cache timeout, but all of them have default values. You can see the current values in the documentation and we are currently rolling out a change to align the default values. Once the current update is rolled out, the defaults will be as listed in the next section.

## Configuration using site properties

Currently, the most common way of configuring DNS settings is to use App Settings. However, App Settings has some challenges that make them less appealing. They are subject to spelling mistakes and there is no API level validation. You cannot control/audit using Azure Policy. You need write permissions to read the values (because App Settings often contain secrets, they have this extra layer of security).

To meet these challenges we are introducing site properties for all DNS configurations. The App Settings will continue to work, but the site properties will take precedence if configured. The properties are grouped under the `dnsConfiguration` property.

|  **Property name** | **App Setting** | **Allowed values** | **Default value** | **Description** |
|---|---|---|---|---|
| DnsServers | WEBSITE_DNS_SERVER | IPv4 addresses | none | Overrides Azure default DNS or DNS servers inherited from virtual network. Allows up to five servers. |
| DnsAltServer | WEBSITE_ALT_DNS_SERVER | IPv4 address | none | Appends this specific DNS server to the list of DNS servers configured. This will be appended to both explicitly configured DNS servers and DNS servers inherited from the virtual network. |
| DnsMaxCacheTimeout | N/A | 0-60 | 30 | Cache timeout defined in seconds. Setting cache to zero means you've disabled caching. |
| DnsRetryAttemptTimeout | WEBSITE_DNS_TIMEOUT | 1-30 | 3 | Timeout before retrying or failing. Timeout also defines the time to wait for secondary server results if the primary doesn't respond. |
| DnsRetryAttemptCount | WEBSITE_DNS_ATTEMPTS | 1-5 | 1 | Defines the number of attempts to resolve where one means no retries. |

`DnsAltServer` and, as mentioned before, the new default values are currently rolling out. All other properties are available today.

## Azure Portal configuration

Based on the new properties, we have started to build UX to support the configuration. This will give you one place to view and configure all DNS options. The configuration page will be available from the networking hub page and we aim to have it ready in Q2 2024.

## Logging capabilities

Finally, we have been working on improved logging capabilities. We started by adding logging capabilities to our internal supporters to help you troubleshoot DNS behavior issues. Built on the learnings from our internal use, we will be adding a new logging category to Diagnostics logs to allow you to send name resolution logs to Azure Monitor. We expect this capability to land in H2 2024.
