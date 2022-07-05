---
title: "Azure Policy Updates for App Service"
author_name: "Jordan Selig"
toc: true
---

## Overview

[Regulatory Compliance in Azure Policy](https://docs.microsoft.com/azure/governance/policy/concepts/regulatory-compliance) provides Microsoft created and managed initiative definitions, known as built-ins, for the compliance domains and security controls related to different compliance standards. A subset of those initiatives contains compliance domains and security controls specifically for Azure App Service. You can assign the built-in initiatives to verify your compliance status against common standards or you can assign the built-ins for a control individually to help make your Azure resources compliant with a specific standard. To see the built-in policies for App Service, see [Azure Policy Regulatory Compliance controls for Azure App Service](https://docs.microsoft.com/azure/app-service/security-controls-policy). To learn more about applying and managing policies, see [Tutorial: Create and manage policies to enforce compliance](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage).

## Latest Updates

The App Service team recently underwent an effort to clean-up the App Service built-in policies. This effort included the following updates:

- Deprecation of policies that no longer require dedicated policy definitions to simplify overall management of policy inventory.
- Rename of policies to follow a standard naming convention. The naming convention is as follows:
  - Lead with the affected service, resource type, or feature.
  - Include “should” to explain the unsecured element (“[A] should [B]”).
  - For example, a policy name that follows the naming convention would be "App Service apps should only be accessible over HTTPS".
- Removal of Logic Apps from the scope of all App Service policy definitions.
  - Logic Apps have their own dedicated policies.
- Re-scope of policies to clearly distinguish Function app policies from App Service policies.
  - All Function app policies now include the condition `{"field": "kind", "contains": "functionapp"}`.
  - All App Service policies now include the condition `{"field": "kind", "notContains": "functionapp"}` which scopes them to include all app types except Function apps and Logic Apps.
  - For more information on policy conditions, see [Azure Policy definition structure](https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure#conditions).
- Addition of App Service slots in policies scope where applicable.

For the full list of detailed updates, see the [release notes](https://docs.microsoft.com/azure/app-service/security-controls-policy#release-notes).

## What's next?

This clean-up effort is ongoing. The [release notes](https://docs.microsoft.com/azure/app-service/security-controls-policy#release-notes) will continue to be updated as changes are rolled out.

We are continuously assessing the App Service policy inventory to ensure our built-in list includes policies that meet the latest security best practices and recommendations. We will also continue to add new policies to keep up with the latest App Service features.
