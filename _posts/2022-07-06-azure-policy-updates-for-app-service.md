---
title: "Azure Policy Updates for App Service"
author_name: "Jordan Selig"
toc: true
---

[Regulatory Compliance in Azure Policy](https://docs.microsoft.com/azure/governance/policy/concepts/regulatory-compliance) provides Microsoft created and managed initiative definitions, known as built-ins, for the compliance domains and security controls related to different compliance standards. A subset of those initiatives contains compliance domains and security controls specifically for Azure App Service. You can assign the built-in initiatives to verify your compliance status against common standards or you can assign the built-ins for a control individually to help make your Azure resources compliant with a specific standard. To see the built-in policies for App Service, see [Azure Policy Regulatory Compliance controls for Azure App Service](https://docs.microsoft.com/azure/app-service/security-controls-policy). To learn more about applying and managing policies, see [Tutorial: Create and manage policies to enforce compliance](https://docs.microsoft.com/azure/governance/policy/tutorials/create-and-manage).

## Latest updates

The App Service team recently underwent an effort to clean-up the App Service built-in policies. This effort included the following updates:

- Deprecation of policies that no longer require dedicated policy definitions to simplify overall management of policy inventory.
- Rename of policies to follow a standard naming convention. The naming convention is as follows:
  - Lead with the affected service, resource type, or feature.
  - Include "should" to explain the unsecured element (“[A] should [B]”).
  - For example, a policy name that follows the naming convention would be "App Service apps should only be accessible over HTTPS".
- Removal of Logic Apps from the scope of all App Service policy definitions.
  - Logic Apps have their own dedicated policies.
- Re-scope of policies to clearly distinguish Function app policies from App Service policies.
  - All Function app policies now include the condition `{"field": "kind", "contains": "functionapp"}`.
  - All App Service policies now include the condition `{"field": "kind", "notContains": "functionapp"}` which scopes them to include all app types except Function apps and Logic Apps.
  - For more information on policy conditions, see [Azure Policy definition structure](https://docs.microsoft.com/azure/governance/policy/concepts/definition-structure#conditions).
- Addition of App Service slots in policy's scope where applicable.

For the full list of detailed updates, see the [release notes](https://docs.microsoft.com/azure/app-service/security-controls-policy#release-notes).

## Action needed

There's no action required if you already have the updated policies assigned to your resources. The policies updates will automatically be applied. Be sure to review your new overall compliance status as the scope of some of the policies has been modified, which means additional resources may now be in scope for policy evaluation.

Deprecated policies will no longer show up in the definitions list in the Azure portal. They'll still be available via APIs. They'll also still be evaluated if individually assigned. You won't receive a notification that these policies have been deprecated however you'll see that their display names have changed to be prefixed with "[Deprecated]". If you no longer want these policies to be evaluated, you can unassign them. If you've assigned any of the initiatives which include these policies, they'll automatically be removed from the initiative and will no longer be evaluated.

If you use the specific policy display names in any reporting, upstream metrics, or alerting mechanisms, you'll need to update these values to the latest versions. Policy display name changes can be found in the [release notes](https://docs.microsoft.com/azure/app-service/security-controls-policy#release-notes).

## What's next?

The clean-up effort is ongoing. The [release notes](https://docs.microsoft.com/azure/app-service/security-controls-policy#release-notes) will continue to be updated as changes are rolled out.

We are continuously assessing the App Service policy inventory to ensure our built-in list includes policies that meet the latest security best practices and recommendations. We'll also continue to add new policies to keep up with the latest App Service features.
