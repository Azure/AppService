---
author_name: Chris Anderson (Azure)
layout: post
hide_excerpt: true
---
      [Chris Anderson (Azure)](https://social.msdn.microsoft.com/profile/Chris Anderson (Azure))  1/3/2017 11:45:39 AM  Azure Functions deprecating preview versions
============================================

 With Azure Functions [recently becoming generally available](https://azure.microsoft.com/en-us/blog/announcing-general-availability-of-azure-functions/) and [making the 1.0 Azure Functions host available](https://github.com/Azure/azure-webjobs-sdk-script/releases/tag/v1.0.10604), we are now announcing that preview versions of the Azure Functions host (0.x) are deprecated and we're preparing to begin removal of these versions beginning February 1st, 2017. *All Azure Functions users should upgrade their version setting to ~1.* If you are using preview features, such as PowerShell or F# support, there are additional things to consider around how we will manage versions in 1.x versions.

 Deprecation of preview (0.x) versions of Azure Functions host
-------------------------------------------------------------

 All preview (0.x) versions of the Azure Functions host are now deprecated. We will be begin removing those versions from the available feed of versions starting February 1st, 2017. Since we've released 1.0, we've been monitoring which versions users are actively using and are happy with the adoption rate of our latest version. We will start by removing the earliest versions, which have the fewest users still active. If you still haven't upgraded to ~1, we strongly recommend that you upgrade as soon as possible.

 Any non-security related issues related to these versions, including the runtime, portal, templates, or docs, will generally be closed. Support cases for users still using preview versions of the host will be directed to first upgrade to the latest version of the host. We encourage you to ask any questions you might have about any issues you experience while upgrading, either via Azure Support or via the [forums](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=AzureFunctions) and [Stack Overflow](http://stackoverflow.com/questions/tagged/azure-functions). If you have any critical need to keep a preview version around past February 1st, 2017, please reach out to chrande@microsoft.com. 

 Versioning for preview features in 1.x
--------------------------------------

 Previously, before 1.0, we would introduce breaking changes every minor version. Now that we've introduced 1.0, all "released" features, such as JavaScript and C# language support, will not have any breaking changes for all ~1 versions. If you don't plan on using preview features, you don't need to worry about any version updates until we have another major version update. Preview features, such as PowerShell and F# language support, will continue to potentially incur breaking changes between minor versions. We recommend that if you're using preview features, you continue to set your minor version explicitly (i.e. ~1.0), rather than just the major version(~1). 

 Additionally, we will not be supporting every 1.x version for the lifetime of 1.x. We will deprecate some ~1 minor versions over time. Later this month, we will provide a tentative schedule for how that will work, as well as some additional means for folks using preview features to provide us feedback. We'll also be building some special portal experiences which will make version management even easier for those of you using preview features.

 We also really want to thank each and every one of you who gave us a try during our preview and those of you who will continue to use preview features now that we've released 1.0. It means a lot to us and we wouldn't be successful without it. We hope you have as much fun using our preview features as we do making them.

 FAQ
---

 ### When will version "0.x" (0.5, 0.6, etc.) be removed?

 It will be removed sometime after February 1st, 2017.

 ### What if the preview version I'm using is removed before I perform the upgrade?

 Azure Functions will use a newer version automatically. If your Functions are impacted by any breaking changes between host versions, you may experience issues, including downtime that does not count against your SLA, since it is user controlled.

 ### How do I know if I need to upgrade?

 If your FUNCTIONS\_EXTENSION\_VERSION application setting is set not set to a ~1 version (i.e. it is set to 0.9), you need to upgrade. Our portal will provide warning on the top of the screen if it detects you're behind the latest version.

 ### How do I upgrade?

 The easiest way to upgrade is to open the Azure Functions portal and click on the upgrade notice. You can also go to your Function App Settings menu and click on the upgrade version next to where it displays your current version. You can also directly set your Application Setting via the portal, any Azure CLI, or the Azure Resource Management APIs.

 ### If I'm using ~1 today, do I need to worry?

 As long as you're not using any preview features (like PowerShell or F# language support), you can rest easy. If you're using preview features, you'll want to manage your minor versions directly. Keep an eye out for some more information on this early next year.

 ### What's the difference between ~1 and ~1.0 for the FUNCTIONS\_EXTENSION\_VERSION application setting?

 When we resolve which Functions host to start up for you, we use the FUNCTIONS\_EXTENSION\_VERSION application setting to choose the best version for you. If you set your setting to ~1, you'll use the latest version of the host with major version of 1. If you set your setting to ~1.0, you'll only receive patch updates to 1.1. We'll update the minor version every time we have a new version of the host which has breaking changes for preview features.

 ### If I desperately need to stay on a preview version, is there an option for me?

 We believe that upgrading to ~1 is the best thing for everyone, but we can work with you to help you upgrade, if you reach out to us. If you're committed to staying on a preview version, we don't offer any official support for this, but you can [deploy your own functions extension](https://github.com/Azure/azure-webjobs-sdk-script/wiki/Deploying-the-Functions-runtime-as-a-private-site-extension) on App Service plans (not supported on Consumption plans).

 ### Is there a way for me to know if I'll be impacted by a change?

 The best way to get an idea of the impact is to read the [release notes](https://github.com/Azure/azure-webjobs-sdk-script/releases) for any versions between your current version and the targeted upgrade version.

 ### How do I revert to another version (just in case)?

 In your app settings in the Functions portal, you'll find a setting for the runtime FUNCTIONS\_EXTENSION\_VERSION. You can change this to any version, including a previous version. You can learn more about this [here](https://github.com/Azure/azure-webjobs-sdk-script/wiki/Function-Runtime-Versioning).

      