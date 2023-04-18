---
title: "Updates to App Service Azure Policies that monitor language versions"
author_name: "Jordan Selig"
toc: true
---

[Azure Policy](https://learn.microsoft.com/azure/governance/policy/overview) for App Service has the following built-in policies that ensure you are using the latest versions of certain languages that are available on the platform.

1. **App Service apps that use Java should use the latest 'Java version'**
1. **App Service apps that use Python should use the latest 'Python version'**
1. **App Service apps that use PHP should use the latest 'PHP version'**
1. **Function apps that use Java should use the latest 'Java version'**
1. **Function apps that use Python should use the latest 'Python version'**

## Updates

We know that for certain customers, using the latest version of a language or runtime isn't always possible. Additionally, with the variations and possible language versions available, we want to provide a way for our customers to have more flexibility when monitoring the compliance of languages used by their apps. For these reasons, the above policies have been modified. The following changes have been implemented and will be visible in the Azure portal in the next few weeks.

1. The policies no longer have a hard-coded value for the language version they're monitoring. Instead, the user must specify a version that aligns with their requirements when assigning these policies.
  1. When assigning these policies, users will be prompted to specify a language version.
1. The policies have been renamed to align with this updated scope. Below are the new names.
  1. **App Service apps that use Java should use a specified 'Java version'**
  1. **App Service apps that use Python should use a specified 'Python version'**
  1. **App Service apps that use PHP should use a specified 'PHP version'**
  1. **Function apps that use Java should use a specified 'Java version'**
  1. **Function apps that use Python should use a specified 'Python version'**
1. The policies have been removed from the Azure Security Baseline and Microsoft Defender for Cloud initiatives.
  1. The policies can still be assigned and even added to a Microsoft Defender for Cloud initiative, however they won't be automatically assigned as they previously were.
1. Equivalent policies have been created to monitor compliance for slots. These must be assigned in addition to the policies that monitor the main site in order to ensure monitoring is in place for all App Service resources.
  1. **App Service app slots that use Python should use a specified 'Python version'**
  1. **Function app slots that use Python should use a specified 'Python version'**
  1. **App Service app slots that use PHP should use a specified 'PHP version'**
  1. **App Service app slots that use Java should use a specified 'Java version'**
  1. **Function app slots that use Java should use a specified 'Java version'**

There are also a couple limitations to be aware of when using these policies.

1. They're scoped to apps on Linux App Service only.
  1. If you require monitoring for Windows apps, you can use the existing policies as a reference to create Windows specific custom policies. For more information on building and assigning custom policies, see [Tutorial: Create a custom policy definition](https://learn.microsoft.com/azure/governance/policy/tutorials/create-custom-policy-definition).
1. These policies use text based matching on a "free-text" field to monitor compliance. Ensure you have proper controls in place to prevent unexpected changes to language versions.

## Required actions

These policy updates will have no impact on existing policy assignments. If you have the old version of these policies assigned, they will continue to function without interruption. In order to use the new versions of these policies, you must create new policy assignments. We encourage you to take this action as soon as possible as the old versions of these policies are prone to false negatives.
