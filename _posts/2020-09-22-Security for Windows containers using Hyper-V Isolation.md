---
title: "Security for Windows containers using Hyper-V Isolation"
author_name: "Jeff Martinez"
toc: true
toc_sticky: true
tags:
    - Windows containers
---

Windows containers on App Service enableyou to modernize your Windows applications so you can bring along dependencies or lift-and-shift your current application. To make sure that your container applications are safe and secure in App Service's multi-tenant architecture, we use Hyper-V isolation to provide a security boundary around your Windows container apps.

## What is Hyper-V?

Hyper-V is an isolation mode for Windows containers featuring hardware-level isolation.  This virtual isolation mode allows for multiple container instances to concurrently run in a secure manner on a single host. Hyper-V isolation effectively gives each container its own kernel while providing hardware isolation and a security boundary around the containers, as opposed to process isolation which shares the kernel with other containers. 

![Hyper-V]({{ site.baseurl }}/media/2020/09/hyperv.png)

## Why App Service uses Hyper-V Isolation

App Service runs on a multi-tenant architecture and uses Hyper-V isolation for running Windows Containers.  Hyper-V runs your containers within independent security boundaries, where your container's resources are isolated from other containers as well as the underlying VM.  When creating an App Service Plan for Windows containers, the underlying VM is also dedicated to a single customer providing another level of security between applications.  With Windows containers on App Service you can also install and run custom software and dependencies inside of your container.  
 
The other benefit obtained from using Hyper-V isolation includes broader [compatibility](https://docs.microsoft.com/virtualization/windowscontainers/deploy-containers/version-compatibility?tabs=windows-server-2004%2Cwindows-10-2004#windows-server-host-os-compatibility) between the underlying VM host and the container versions so you can run your choice of base images across Windows Server 2016 and Windows Server 2019.   

### Resources

1. [Windows container Isolation Modes](https://docs.microsoft.com/virtualization/windowscontainers/manage-containers/hyperv-container#:~:text=With%2520Hyper-V%2520isolation%252C%2520multiple%2520container%2520instances%2520run%2520concurrently%2Ceach%2520container%2520as%2520well%2520as%2520the%2520container%2520host.)
2. [Windows Server compatible versions](https://docs.microsoft.com/virtualization/windowscontainers/deploy-containers/version-compatibility?tabs=windows-server-2004%2Cwindows-10-2004#windows-server-host-os-compatibility)
