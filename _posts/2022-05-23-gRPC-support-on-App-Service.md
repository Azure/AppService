---
title: "gRPC support on Azure App Service"
author_name: "Jeff Martinez"
toc: true
toc_sticky: true
category:
    - gRPC
---

We are pleased to announce that gRPC is now available and supported on Azure App Service for Linux workloads.  This was made possible by recent platform upgrades to the HTTP reverse proxy layer to leverage [YARP](https://microsoft.github.io/reverse-proxy/articles/grpc.html) and [Kestrel](https://docs.microsoft.com/aspnet/core/fundamentals/servers/kestrel?view=aspnetcore-6.0).  

Using gRPC, you can utilize the remote procedure call framework to streamline messages between your client and server over HTTP/2. Using gRPC protocol over HTTP/2 enables the use of features like multiplexing to send multiple parallel requests over the same connection.

gRPC is currently available for use with .NET Core 3.1 and .NET 6 (Node and Python coming).   

Please visit this tutorial [How-To deploy a .NET 6 gRPC app on App Service](https://github.com/Azure/app-service-linux-docs/blob/master/HowTo/gRPC/use_gRPC_with_dotnet.md) to try out gRPC on App Service today.