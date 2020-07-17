---
title: 'Securing Data-plane Access'
author_name: "Jason Freeberg and Shubham Dhond"
category: deployment
toc: true
toc_sticky: true
---

App Service provides ports for FTP and WebDeploy clients to connect and upload files. These APIs are great for browsing your site's file system, uploading drivers and utilities, and deploying with MsBuild. However, large enterprises often need to meet security requirements, and these APIs allow developers to authenticate using the publish profile. <\Add line about enterprises want to use AAD-backed APIs>.

This article shows how to disable access from the FTP and WebDeploy credentials, and how to monitor any attempted or successful logins. The switch to disable access is backed by RBAC, so only the roles you specify will be able to re-enable the credentials. After completing this guide, developers will only be able to access your site via AAD-backed entrypoints.

## Disabling Access

The following sections assume you have owner-level access to the site.

### FTP

To disable FTP access to the site, run the following CLI command.

```bash
az webapp ....
```

To confirm that FTP access is blocked, you can try to authenticate using an FTP client like FileZilla. To retrieve the publishing credentials, go to the Overview blade of your site and click **Download Publish Profile**. Try to use the file's hostname, username, and password to authenticate, and you will get a **401 Unauthenticted**.

### WebDeploy

To disable FTP access to the site, run the following CLI command.

```bash
az webapp ....
```

To confirm that the publish profile credentials are blocked on WebDeploy, <\link to VS example with publish profile>.

## RBAC

- How to make sure the on/off switch is owner-only on RBAC
- Set it at the subscription level

## Auditing

All successful and attempted logins are logged to the Azure Monitor **AppServiceAuditLogs** log type. This means you can use all of Azure Monitor's features to store, query, and alert based on the log contents.

> [Pricing information for Azure Monitor features and services](https://azure.microsoft.com/pricing/details/monitor/)

### Setup

To audit the attempted and successful logins on FTP and WebDeploy, click the **Diagnostic Settings** tab on your web app. This will open a blade to select your desired log types, and the destination for the logs. The logs can be sent to Log Analytics, a Storage Account, or an Event Hub. 

1. Provide a name for the Diagnostic Setting
1. Select the log types you want to capture
1. Select the services you want to send the logs to. (The service(s) must already be created, you can't create them from this blade.)
1. Click **Save**.

To confirm that the logs are sent to your selected service(s), try logging in via FTP or WebDeploy. An example Storage Account log is shown below.

```json
{
  "time": "2020-07-16T17:42:32.9322528Z",
  "ResourceId": "/SUBSCRIPTIONS/EF90E930-9D7F-4A60-8A99-748E0EEA69DE/RESOURCEGROUPS/FREEBERGDEMO/PROVIDERS/MICROSOFT.WEB/SITES/FREEBERG-WINDOWS",
  "Category": "AppServiceAuditLogs",
  "OperationName": "Authorization",
  "Properties": {
    "User": "$freeberg-windows",
    "UserDisplayName": "$freeberg-windows",
    "UserAddress": "24.19.191.170",
    "Protocol": "FTP"
  }
}
```

## Azure Policy

[Azure Policy](https://docs.microsoft.com/azure/governance/policy/overview) can help you enforce organizational standards and to assess compliance at-scale. Using Azure Policy, you can define JSON-formatted policies to alter or deny the creation of Azure services. In this scenario, you can use Azure Policy to ensure that all newly created sites have disabled publishing profile authentication for FTP and/or WebDeploy.

### Setup

Follow these steps to enforce a policy that disables publishing profile authentication on any newly created sites.

1. [Create a new Azure Policy resource](https://docs.microsoft.com/azure/governance/policy/assign-policy-portal)
1. Click **Definitions** under **Authoring**
1. Click **+ Policy Definition**
1. Under policy rule, paste the following JSON.

  ```json
  {
    "mode": "All",
    "policyRule": {
      "if": {
        "not": {
          "field": "Microsoft.Web/sites/basicPublishingCredentialsPolicies/scm.properties.allow",
          "notEquals": "false"
        }
      },
      "then": {
        "effect": "audit"
      }
    }
  }
  ```

1. 

## Summary

In this article you learned how to disable basic authentication to the FTP and WebDeploy ports for your sites. Additionally, you can audit any attempted logins with Azure Monitor and enforce an Azure Policy to make any new sites compliant with your enterprise's security requirements.
