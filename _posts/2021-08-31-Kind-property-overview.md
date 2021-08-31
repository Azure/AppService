---
title: "Overview of the 'kind' property for App Service"
author_name: "Jordan Selig"
toc: false
---

We get a lot of questions on the App Service `kind` property, so we are sharing some information to help you understand what it is, what it does, and how to use it.

In general, `kind` is an ARM envelop property so almost every resource in Azure has one. See [Resources - Get](https://docs.microsoft.com/rest/api/resources/resources/get) for more information on Azure resource properties. The way in which resources use this property varies service by service.

There are several different offerings in the Azure portal that use the same underlying [`Microsoft.Web\Sites`](https://docs.microsoft.com/en-us/azure/templates/microsoft.web/sites?tabs=json) resource. App Service at this time only uses the value of the `kind` property to specialize the UX of a `Microsoft.Web\Sites` resource in the Azure Portal. The value isn't used for anything in the management plane.

The `kind` property of an app is set during the create flow and can't be modified thereafter. The portal does this based on the create flow of your choice and/or the configuration you enter. This is also true of the [App Service CLI](https://docs.microsoft.com/cli/azure/appservice?view=azure-cli-latest) and other clients like [Visual Studio Code](https://code.visualstudio.com/). You will need to manually set the `kind` property if you are creating resources through [ARM templates](https://docs.microsoft.com/azure/azure-resource-manager/templates/), or using the [ARM API directly](https://docs.microsoft.com/rest/api/resources/).

Note that the `kind` property also shows up in App Service Plans (ASP). At this time, the value of this property for the ASP is meaningless and has no impact on your resource. For example, you can set `kind` to "Linux" for the ASP, but that won't make your ASP a Linux ASP; the `reserved` property is what makes this distinction (if `reserved` = true, it's a Linux ASP, otherwise it's a Windows ASP).

For more information on how App Service uses the `kind` property as well as the current list of recommended values, visit the [App Service Linux docs repo](https://github.com/Azure/app-service-linux-docs/blob/master/Things_You_Should_Know/kind_property.md).
