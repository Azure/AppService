---
permalink: "/windows-containers/"
layout: home
title: "Windows Containers"
sidebar:
    nav: "default"
pagination: 
  enabled: true
  tag: 'windows containers'
  sort_reverse: true
  trail: 
    before: 2
    after: 2
---

App Service supports Windows Containers! Deploying your application in a Windows Container enables you to bring along dependencies such as custom fonts, cultures and GAC deployed assemblies. When deploying a containerized application, the Windows Container is an isolation and security boundary. As a result, calls to libraries that would normally be blocked by the Azure App Service will instead succeed when running inside of a Windows Container. For example, many PDF generation libraries make calls to graphics device interface (GDI) APIs. With Windows Containers, these calls will succeed.

## Helpful resources

- [Quickstart for Windows Containers on App Service](https://docs.microsoft.com/azure/app-service/quickstart-custom-container?tabs=dotnet&pivots=container-windows)
- [Reference documentation for Windows Containers on App Service](https://docs.microsoft.com/azure/app-service/configure-custom-container?pivots=container-windows)
- [Reference documentation on Windows Containers](https://docs.microsoft.com/virtualization/windowscontainers/about/)