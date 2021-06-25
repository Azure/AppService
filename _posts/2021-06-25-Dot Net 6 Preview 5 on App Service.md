---
title: ".NET 6 Preview 5 on App Service"
author_name: "Byron Tardif"
toc: true
toc_sticky: false
tags:
    - dotnet
---
In case you missed it, we released support for [.NET 6 Preview 4](https://azure.github.io/AppService/2021/06/09/Dot-Net-6-Preview-on-App-Service.html) about 2 weeks ago.

Now we have rolled out support for [.NET 6 Preview 5](https://devblogs.microsoft.com/dotnet/announcing-net-6-preview-5/) across all public regions and scenarios on both Windows and Linux App Service plans through ([App Service Early Access](https://aka.ms/app-service-early-access)) as well as [Azure Functions](https://techcommunity.microsoft.com/t5/apps-on-azure/what-s-new-with-net-on-azure-functions-june-2021/ba-p/2428669)

Any app targeting the .NET 6 Early Access on App Service will be automatically updated to the latest .NET 6 Preview releases as they become available all the way up to RC and GA.

What this means for you is that if you are creating a new .NET 6 app on App Service today, you will have Preview 5 available on the platform. If your app was created earlier this week, it will be automatically updated to Preview 5 the next time it cold starts. If you want to trigger the update, you just start/stop the app.
