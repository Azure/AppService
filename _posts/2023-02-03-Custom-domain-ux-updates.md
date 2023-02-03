---
title: "Updates to App Service Overview Blade for Custom Domains"
author_name: "Jordan Selig"
---

You may have noticed that we recently rolled out a change in the "Essentials" section of the App Service "Overview" blade in the Azure portal where the URL that is displayed is the default URL for your app. Previously, under certain conditions, there was logic that would display the custom domain you added to your app. For example, if you added the custom domain "app.contoso.com" to your app, the URL displayed on the "Overview" blade would show "https://app.contoso.com" instead of the default URL. If your app was hosted on an App Service Environment, and you added a custom domain suffix to your App Service Environment, the "Overview" blade would show the corresponding URL with that custom domain suffix.

We decided to change that behavior to only show the default URL because we were finding that the logic for deciding which URL to show was not meeting the needs of all customers. For example, if a customer added more than one custom domain to an app, which one should be displayed? Showing the default domain ensures consistency for all customers. Additionally, we can't ensure that when adding a custom domain that that domain will immediately function as intended - there may be additional DNS changes required. We have more confidence that providing a link to the default domain on the "Overview" blade will lead to more successful attempts to reach an app.

![]({{ site.baseurl }}/media/2023/02/app-service-overview.png)

We were also made aware that some customers have created alerts based on the URL that is displayed in the "Essentials" section of the "Overview" blade - they use the value that is given to determine whether the custom domain they have added to their app has been applied. If this alert/check is a requirement for customers, the recommendation is to use the "Custom domains" blade to validate the domains added to their apps. That blade will show all domains added to the app and should be considered the source of truth. It also gives additional information that will help validate the security of the custom domains. In the following screenshot, the app shown is hosted in an App Service Environment with the custom domain suffix "antares-test.net". You can see the default domain for this app as well as the domain using the custom domain suffix. If we were to add a custom domain at the app level, for example "app.contoso.com", that would also be displayed in this blade.

![]({{ site.baseurl }}/media/2023/02/app-service-custom-domains-blade.png)

## Upcoming changes

We have an update to the "Overview" blade rolling out in the next few weeks that should help customers quickly identify the custom domains they've added to their apps directly from the "Overview" blade. The following is a UX mock of the "Overview" blade showing the upcoming changes that we are implementing.

![]({{ site.baseurl }}/media/2023/02/app-service-overview-mock.png)

* "URL" in the "Essentials" section will be renamed "Default domain" and the default domain will be displayed.
* A new section under the "Properties" tab will be added called "Domains", which will list the default domain, the App Service Environment domain if the app is hosted in an App Service Environment with a custom domain suffix, and the custom domain if one is added at the app level. If more than one custom domain is added at the app level, the number of custom domains will be given with a link to the "Custom domains" blade.

We hope these changes will provide more clarity for customers. Feedback is welcome as we are always looking to improve our user experience.
