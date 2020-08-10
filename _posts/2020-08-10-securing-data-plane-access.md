---
title: 'Securing Data Plane Access'
author_name: "Jason Freeberg and Shubham Dhond"
category: deployment
toc: true
toc_sticky: true
---

App Service provides access for FTP and WebDeploy clients to connect using the basic auth credentials found in the site's [publish profile](https://docs.microsoft.com/visualstudio/deployment/tutorial-import-publish-settings-azure?view=vs-2019). These APIs are great for browsing your site's file system, uploading drivers and utilities, and deploying with MsBuild. However, enterprises often need to meet security requirements and would rather disable this basic auth access, so that employees can only access the organization's App Services through API's that are backed by Azure Active Directory (AAD).

This article shows how to disable basic authorization, and how to monitor any attempted or successful logins. You can also use Azure Policy to ensure any new sites have basic authentication disabled. Also, the API to disable or enable basic auth is backed by AAD and RBAC, so you can narrow which users or roles are able to re-enable basic auth.

## Disabling Access

The following sections assume you have owner-level access to the site. These instructions use ARMClient, which you can [download here](https://github.com/projectkudu/ARMClient#armclient). The corresponding CLI commandlet is under development at the time of writing. 

### FTP

To disable FTP access to the site, copy the following snippet and paste it at [resources.azure.com/raw](https://resources.azure.com/raw/). Replace the placeholders with your subscription, resource group, site name, and site's location. 

```bash
PATCH https://management.azure.com/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Web/sites/<site-name>/basicPublishingCredentialsPolicies/ftp/?api-version=2014-11-01
{
  "id": null,
  "name": "<site-name>",
  "type": "Microsoft.Web/sites",
  "location": "<location>",
  "properties": {
    "allow": false
  }
}
```

Once you have replaced the placeholders, select the text and press **Ctrl** + **S** (for **S**end). On the right side panel, you can see the response code and body. To confirm that FTP access is blocked, you can try to authenticate using an FTP client like FileZilla. To retrieve the publishing credentials, go to the overview blade of your site and click **Download Publish Profile**. Use the file's FTP hostname, username, and password to authenticate, and you will get a **401 Unauthenticted**.

### WebDeploy and SCM

To disable basic auth access to the WebDeploy port and SCM site, copy the following snippet and paste it at [resources.azure.com/raw](https://resources.azure.com/raw/). Replace the placeholders with your subscription, resource group, site name, and site's location. 

```bash
PATCH https://management.azure.com/subscriptions/<subscription>/resourceGroups/<resource-group>/providers/Microsoft.Web/sites/<site-name>/basicPublishingCredentialsPolicies/scm/?api-version=2014-11-01
{
  "id": null,
  "name": "<site-name>",
  "type": "Microsoft.Web/sites",
  "location": "<location>",
  "properties": {
    "allow": false
  }
}
```

To confirm that the publish profile credentials are blocked on WebDeploy, try [publishing a web app using Visual Studio 2019](https://docs.microsoft.com/visualstudio/deployment/quickstart-deploy-to-azure?view=vs-2019).

## Create a custom RBAC role

The API in the previous section is backed Azure Role-Based Access Control (RBAC), which means you can [create a custom role](https://docs.microsoft.com/en-us/azure/role-based-access-control/custom-roles#steps-to-create-a-custom-role) to block users from using the API and assign lower-priveldged users to the role so they cannot enable basic auth on any sites. To configure the custom role, follow the instructions below.

1.  Open the [Azure portal](https://portal.azure.com/)
2.  Open the subscription that you want to create the custom role in
3.  On the left navigation panel, click **Access Control (IAM)**
4.  Click **+ Add** and click **Add custom role** in the dropdown
5.  Provide a name and description for the role.
6.  For **Baseline permissions** you can clone one of your organization's existing roles, or one of the default roles
7.  Click the **Permissions** tab, and click **Exclude permissions**
8.  In the context blade, click the **Microsoft Web Apps**. This will open a list of all the RBAC actions for App Service
9.  Search for the `microsoft.web/sites/basicPublishingCredentialsPolicies/ftp` and `microsoft.web/sites/basicPublishingCredentialsPolicies/scm` operations. Under these, check the box for **Write**. This will add the actions as *NotActions* for the role.
  
    You can disable this for [slots](https://docs.microsoft.com/en-us/azure/app-service/deploy-staging-slots) as well. See the `microsoft.web/sites/slots/basicPublishingCredentialsPolicies/ftp` and `microsoft.web/sites/slots/basicPublishingCredentialsPolicies/scm` actions   

    ![Disable write actions in the Portal]({{site.baseurl}}/media/2020/08/rbac-ftp-list-operations-portal.png)

10. Click **Review + create** at the bottom. Under **Permissions**, you will see the `basicPublishingCredentialsPolicies` APIs listed as NotActions.
    
    ![List of NotActions]({{site.baseurl}}/media/2020/08/rbac-ftp-list-notactions.png)

11. Finally, click **Create**. You can now assign this role to your organization's users.

> More information on [setting up custom RBAC roles](https://docs.microsoft.com/en-us/azure/role-based-access-control/custom-roles-portal#step-2-choose-how-to-start).

## Audit with Azure Monitor

All successful and attempted logins are logged to the Azure Monitor **AppServiceAuditLogs** log type. This means you can use all of Azure Monitor's features to store, query, and alert based on the log contents.

> [Pricing information for Azure Monitor features and services](https://azure.microsoft.com/pricing/details/monitor/).

To audit the attempted and successful logins on FTP and WebDeploy, click the **Diagnostic Settings** tab on your web app. This will open a blade to select your desired log types, and the destination for the logs. The logs can be sent to Log Analytics, a Storage Account, or an Event Hub. 

1. Provide a name for the Diagnostic Setting
2. Select the log types you want to capture
3. Select the services you want to send the logs to. (The service(s) must already be created, you can't create them from this blade.)
4. Click **Save**.

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

## Enforce compliance with Azure Policy

[Azure Policy](https://docs.microsoft.com/azure/governance/policy/overview) can help you enforce organizational standards and to assess compliance at-scale. Using Azure Policy, you can define JSON-formatted policies to alter or deny the creation of Azure services. In this scenario, you can use Azure Policy to ensure that all newly created sites have disabled publishing profile authentication for FTP and/or WebDeploy.

Follow these steps to enforce a policy that disables publishing profile authentication on any newly created sites.

1. [Create a new Azure Policy resource](https://docs.microsoft.com/azure/governance/policy/assign-policy-portal)
2. Click **Definitions** under **Authoring**
3. Click **+ Policy Definition**
4. Choose the definition subscription, name, and provide a description
5. Under policy rule, paste the following JSON definition

    ```json
    {
      "mode": "All",
      "policyRule": {
        "if": {
          "field": "Microsoft.Web/sites/basicPublishingCredentialsPolicies.ftp.allow",
          "equals": true
        },
        "then": {
          "effect": "deny"
        }
      }
    }
    ```

1. Finally, click **Save**

## Summary

In this article you learned how to disable basic authentication to the FTP and WebDeploy ports for your sites. Additionally, you can audit any attempted logins with Azure Monitor and use an Azure Policy to esnure any new sites are compliant with your enterprise's security requirements.
