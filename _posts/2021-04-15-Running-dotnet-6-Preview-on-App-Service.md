---
title: "Running .NET 6 (Preview) on App Service"
author_name: "Jeff Martinez"
toc: true
toc_sticky: true
---

.NET 6 is the latest release version that will include the final pieces bringing the best of Core, Framework, Xamarin, and Mono to a unified platform that started with .NET 5. This version is currently available as a preview version for use in new or existing applications with a planned GA date of November 2021. The final release of .NET 6 will be the Long-Term Support (LTS) version of the new .NET to be supported for 3-years. Find more information on the release [here](https://devblogs.microsoft.com/dotnet/announcing-net-6-preview-1/).

To get started with .NET 6 (Preview) on App Service you can use one of two deployment methods. A Self-Contained deployment will allow you to deploy your app on machines that don't have the runtime installed. You can also deploy your application with a more portable solution using a Container which will package your app and dependencies to run on App Service.

> Migrating your .NET 3.1 apps to .NET 6? We recommend going to .NET 5 before jumping to 6, see [our previous article](https://azure.github.io/AppService/2021/04/14/Migrating-your-dotnet-31-applications-to-dotnet-5.html).

## Local Setup

In order to setup .NET 6 in your application you need to first install the .NET 6 SDK. For our examples below we will be using the latest [.NET SDK 6 Preview 2](https://dotnet.microsoft.com/download/dotnet/6.0). If you're on Windows using Visual Studio, you will also need to download the latest Visual Studio Preview version [here](https://visualstudio.microsoft.com/vs/preview/).

## Self-Contained Deployment

A Self-Contained deployment enables you to run .NET 6 because it doesn't rely on the presence of shared components on the target system and all components including Core libraries and runtime are with the application and isolated from other apps. This way you have sole control of which version your application is running. Self-contained deployments are supported for both Windows and Linux apps. Note that with self-contained applications you should be aware of large deployments and managing updates as this will take up more hard drive space and cause you to be responsible for supplying updated versions of your app with new security patches.

1. To complete a self-contained deployment in .NET you would first create your project as usual then choose **.NET 6 (Preview)** for your apps version after selecting your application template. Select **Create** and modify your application as needed.

    ![Dotnet 6]({{ site.baseurl }}/media/2021/04/dotnet_6_1.png)

2. To publish, **Right-Click** your project and select **publish**. In the latest version of Visual Studio you can choose where your target publish is from a new menu.  Select **Azure**.

    ![Dotnet 6]({{ site.baseurl }}/media/2021/04/dotnet_6_2.png)

3. Then select **Azure App Service (Windows)** or **Azure App Service (Linux)** depending on your preference on the following screen.

    ![Dotnet 6]({{ site.baseurl }}/media/2021/04/dotnet_6_3.png)

4. Next, choose a previously created App Service or create one from Visual Studio and fill out the required information as you normally would when publishing. When you reach the publish screen click the pencil icon to edit your **Deployment Mode** for publishing your application.

5. Then, Choose the Deployment Mode option and make sure **Self-Contained** is chosen.

    ![Dotnet 6]({{ site.baseurl }}/media/2021/04/dotnet_6_4.png)

After you select the Self-Contained option your *Target* Runtime will auto-populate to linux-x64 or win-x86 depending on your operating system selection. **Save** your new settings and click **Publish** on the preceding screen to publish to App Service and launch your application using .NET 6. More information on self-contained deployment can be found [here](https://docs.microsoft.com/dotnet/core/deploying/).

## Container Deployment

The other option for running your .NET 6 (Preview) application is to deploy a Docker container to App Service on Linux or Windows. When deploying a container, you are packaging the application and its dependencies into a Linux or Windows based image to run on the App Service platform. This enables your application to be more portable in nature as it is not reliant on the host operating system and has the runtime and SDK added into the image.

Once you have your application setup for .NET 6, the steps to deploy a containerized application would be the same as any other container deployment. **Right-click** your project, **Add -> Docker Support**, then choose Linux or Windows. Your .NET 6 project will have a new Dockerfile added with the .NET 6.0 base image and SDK ready for you to publish.

![Dotnet 6]({{ site.baseurl }}/media/2021/04/dotnet_6_5.png)

After you have added Docker support, you will publish it to a registry, and create your App Service as usual. See our documentation for more detail on [deploying a containerized application](https://docs.microsoft.com/azure/app-service/quickstart-custom-container?pivots=container-windows).
