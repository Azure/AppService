---
title: "Docker Hub authenticated pulls on App Service"
author_name: "Jeff Martinez"
toc: true
toc_sticky: true
tags:
    - Docker
---

Starting November 1st, 2020. Docker will be introducing rate limits on unauthenticated pull requests from Docker Hub.  These limits are based on the account type of your personal or organizations Docker Hub account.  In preparation of the incoming rate limits, App Service recommends that you authenticate your Docker Hub pull requests by updating your Public Repository Access containers on App Service to Private to mitigate any potential impact or move your container images to Azure Container Registry (ACR) as the source of your pulls.

>To learn more about Docker Hubs rate limits, see the Docker [announcement](https://docs.docker.com/docker-hub/download-rate-limit/). 


## Authenticate Docker Hub pull requests

To make sure your pull requests from Docker Hub are authenticated first, [set your Docker Hub repository to Private](https://docs.docker.com/docker-hub/repos/#private-repositories) to require your username and password for pulls from the registry.  Then, follow the instructions below to authenticate your pulls from Azure:

![Docker Hub Private Access]({{ site.baseurl }}/media/2020/10/dockerhub_auth_setting.png)

1.	Go to **Container Settings**
2.	Under Repository Access, set your access level to **Private**
3.	Enter your Docker Hub **Login** and **Password**
4.	Click **Save** at the bottom of the screen.
5.	Go to the Overview page of your resource and **Restart** your container

Now you should be able to successfully pull from your Private Docker Hub repository with an authenticated pull.

## Azure Container Registry

Another option available is to import your images from Docker Hub to Azure Container Registry (ACR) as the source of your container pulls. ACR enables you to build, store, and manage your Docker containers on Azure. To create a new ACR resource, follow the instructions in this [doc](https://docs.microsoft.com/azure/container-registry/container-registry-get-started-portal).  

Once you have created your ACR resource, you can import your Docker Hub containers to ACR using the following Azure CLI commands in *Powershell*:

1.	Use **az login** to connect to Azure
2.	Run **az acr import --name** *my-registry* **--source** *docker.io/registryname/image-name:tag* **--image** *image-name:tag*

Once this runs, you can validate that your image has been imported to ACR by going to your Azure Container Registry resource and viewing your Repositories.  To learn more, please see the ACR documentation to [import from docker hub](https://docs.microsoft.com/azure/container-registry/container-registry-import-images#import-from-docker-hub). – – –— — —00—000—
————0—0—0—0 — - — - — —- 