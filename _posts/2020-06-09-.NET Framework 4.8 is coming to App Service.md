---
title: ".NET Framework 4.8 is coming to App Service"
author_name: "Jeff Martinez"
toc: true
toc_sticky: true
tags:
    - dotnet
---

An update is coming for App Service to support .NET Framework 4.8. You will soon be able to take advantage of the updated .NET Framework toolset, bug fixes, and key improvements in accessibility and runtime. For the full list of updates and changes see the [announcement](https://devblogs.microsoft.com/dotnet/announcing-the-net-framework-4-8/) and [release notes](https://github.com/microsoft/dotnet/blob/master/releases/net48/README.md). The update will come to App Service starting in *July 14, 2020* and completing by *September 15, 2020*. In preparation for your application update to .NET Framework 4.8, we recommend that you test your applications locally in advance.

To track progress during the deployment, we will be posting periodic updates [on this GitHub Issue](https://github.com/Azure/app-service-announcements/issues/249).

## Testing your applications locally

Test your application locally by reviewing the [Migration Guide](https://docs.microsoft.com/dotnet/framework/migration-guide/) and completing the following steps:

1. Download & install .NET Framework 4.8 for your appropriate scenario [here](https://devblogs.microsoft.com/dotnet/announcing-the-net-framework-4-8/).
2. See the [Runtime changes](https://docs.microsoft.com/dotnet/framework/migration-guide/runtime/4.7.2-4.8) and [Retargeting Guide](https://docs.microsoft.com/dotnet/framework/migration-guide/retargeting/4.7.2-4.8) to check for application compatibility issues that may affect your application.
3. Run the application in your local browser and verify the application features.

If you have issues with your application, feedback can be given on [GitHub](https://github.com/Microsoft/dotnet/issues/).

## Confirming the update on App Service

You can confirm your webapp's current .NET Framework version by following these quick steps.

To see if your apps have been updated after we begin the platform update, check which .NET Framework version is in use by using the 

1. Open the **Console** feature under **Development Tools** in the App Service blade of your Azure Portal.

    ![console]({{ site.baseurl }}/media/2020/06/console.png)

1. Run the following command: `cd "\Program Files (x86)\Reference Assemblies\Microsoft\Framework\.NETFramework"`.

1. Run the `dir` command to list out the installed versions of .NET Framework.  

    ![console]({{ site.baseurl }}/media/2020/06/console2.png)

1. If .NET Framework 4.8 is installed, it will be located at `D:\Program Files (x86)\Reference Assemblies\Microsoft\Framework\.NETFramework\v4.8`
