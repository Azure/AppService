---
title: "Announcing .NET Core 3.1 LTS General Availability on App Service"
author_name: "Jeff Martinez"
tags:
    - dotnet
---

App Service is announcing GA of .NET Core 3.1 LTS on Linux & Windows today.  If you are running .NET Core 3.0 applications, which had its end-of-life date on March 3rd, 2020 you can update to and create .NET Core 3.1 applications in the Azure App Service portal now. You can also view this [map]( https://aspnetcoreon.azurewebsites.net/#.NET%20Core%20SDK) to see available regions running .NET Core 3.1 (Windows Only).  

## .NET Core 3.1 Long-term support

.NET Core 3.1 is the Long-term support release which is supported by Microsoft for three years from it's release date ([December 2019]( https://devblogs.microsoft.com/dotnet/announcing-net-core-3-1/)). The release focuses on minor improvements to .NET Core 3.0 and is the recommended way to prepare for .NET 5.  More information about end of life dates and the new release can be found [here](https://docs.microsoft.com/dotnet/core/whats-new/dotnet-core-3-1).

## Web App Development

When creating your Web App in the portal, you can choose **.NET Core 3.1 LTS** as your runtime stack with your choice of *Linux* or *Windows* for your operating system and deploy the application as you usually would.

If using Windows, you can check your version using the **Console** under **Development Tools** in your Web App blade. Running the `dotnet --list-runtimes` command will show your app including 3.1.

![Windows Console]({{ site.baseurl }}/media/2020/04/windowsconsole.jpg)

For Linux, you will run the same command `dotnet --list-runtimes` using the **SSH** tool under **Development Tools** in your Web App blade to view 3.1 running on your app.  

![Linux SSH]({{ site.baseurl }}/media/2020/04/linuxssh.jpg)
