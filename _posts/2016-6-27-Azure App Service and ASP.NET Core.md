---
title: "Azure App Service and ASP.NET Core"
author_name: "Daria Grigoriu"
layout: single
excerpt: "Getting started with ASP.NET Core 1.0 on Azure App Service"
toc: false
---

The release of ASP.NET Core 1.0 was announced today! ASP.NET Core 1.0 supports modern web development with its lightweight and modular design. ASP.NET Core is also cross-platform ready and open source. You can read all the details for the release in [this announcement](https://blogs.msdn.microsoft.com/webdev/2016/06/27/announcing-asp-net-core-1-0). [Visual Studio 2015 Update 3](https://blogs.msdn.microsoft.com/visualstudio/2016/06/27/visual-studio-2015-update-3-and-net-core-1-0-available-now) was also announced today with support to build .NET Core apps in Visual Studio. Azure App Service is ready to welcome your ASP.NET Core 1.0 apps. Please see the [ASP.NET Core 1.0 announcement](https://blogs.msdn.microsoft.com/webdev/2016/06/27/announcing-asp-net-core-1-0) for pointers on getting started. Great resources are also available on the [ASP.NET Core documentation page](https://docs.asp.net/en/latest/). To get started bring your own ASP.NET Core repo or select a sample from Visual Studio. To get started in Visual Studio 2015 navigate to **New** -> **Project** -> **Web** and select an ASP.NET Core sample. Request a Git repo on sample creation

![Azure App Service and ASP.NET Core RC2]({{ site.baseurl }}/media/2016/05/vs-create-500x348.png)

Create a web app in Azure App Service and configure Local Git as the deployment source as described in [documentation here](https://azure.microsoft.com/documentation/articles/app-service-deploy-local-git). Copy the Git URL from the **Settings** -> **Properties** blade of your app in the [Azure Portal](https://portal.azure.com). From your ASP.NET Core app Git repo push the content to Azure App Service using the Git URL copied.  The Kudu deployment engine running in Azure App Service is able to detect ASP.NET Core apps and generate a custom deployment script for these apps. If you would like to explore and customize the deployment script generated for Azure App Service deployment you can easily access this script. Navigate to the Kudu SCM management app running alongside the web app from the **Tools** -> **Kudu** blade of your app in the Azure Portal.

![Azure App Service and ASP.NET Core RC2 ]({{ site.baseurl }}/media/2016/05/deployment-500x342.png)

The first step in the deployment script is a NuGet restore with the home drive of the app as the restore location. Restore will be revisited for subsequent deployment only if new dependencies are detected. The next step in the deployment script detects the type of project. If the project originated from Visual Studio and a .sln file is available the deployment engine will run msbuild and then use the new dotnet.exe utility to publish with a no build flag. Otherwise use the new dotnet.exe utility to build and publish. All build actions are completed on the target Azure App Service hosting environment. An alternate Visual Studio deployment option bypassing source control is using the **Publish** action which will leverage WebDeploy to deploy to Azure App Service instead of leveraging the Kudu deployment engine. With this option build actions would be completed in the source development environment as opposed to build actions being completed in the target Azure App Service hosting environment.

![Azure App Service and ASP.NET Core RC2]({{ site.baseurl }}/media/2016/05/vs-publish-500x254.png)

If you don't have an Azure account you can still try ASP.NET Core 1.0 on Azure App Service free of charge and commitment with our [Azure App Service free trial](https://tryappservice.azure.com/?appservice=web). Looking forward to feedback and questions on the [Azure App Service forum](https://social.msdn.microsoft.com/Forums/en-US/home?forum=windowsazurewebsitespreview).
