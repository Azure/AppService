---
author_name: mksunitha
layout: post
hide_excerpt: true
---
      [mksunitha](https://social.msdn.microsoft.com/profile/mksunitha)  3/27/2018 1:53:59 PM  You can now find community driven docker images to try out on Web App for Containers on [Github](https://github.com/Azure/app-service-quickstart-docker-images). These images follow best practices for Web app for containers , contain SSH for debugging purposes. How to deploy
-------------

 These docker images can be found on Docker hub on [hub.docker.com/r/appsvcorg](https://hub.docker.com/r/appsvcorg). Use the latest tag for the most recent version of the image when deploying it to Web app on Azure. To deploy your application using these community images , follow the steps below  - Login to [Azure portal](https://portal.azure.com)
 - Create a new web app from [Web app for Containers template ](http://portal.azure.com/#create/microsoft.appsvclinux)
 - Under **configure container** , select 
	 - Image source as Docker Hub
	 - Repository access as public
	 - Enter docker image name in this format : **appsvcorg/django-python:0.1 **or ** appsvcorg/django-python:latest **
	  
  ![](https://azurecomcdn.azureedge.net/mediahandler/acomblog/media/Default/blog/24138933-6808-411e-a482-f3ae209eb82e.png)  - Click on **Create **to start the deployment
 - View the **Readme.md** for the docker image you have selected on [github](https://github.com/Azure/app-service-quickstart-docker-images) if there are additional configurations to be made after the web app is created.
  How to contribute
-----------------

 To make sure your docker image is included , please follow these guidelines. Any docker image that are out of compliance will be added to the **blacklist** and be removed from Docker hub repository [https://hub.docker.com/r/appsvcorg ](https://hub.docker.com/r/appsvcorg). Here is the end to end process flow for contributing to this docker hub repository . [![]({{ site.baseurl }}/media/2018/03/contribution-process-1024x165.png)]({{ site.baseurl }}/media/2018/03/contribution-process.png) When you contribute a new docker image , as the owner of that docker image your responsibilities include:  - review issues reported on the docker image on Github
 - fix and resolve bugs or compliance issues with the docker image
 - keep the docker image up to date
  Get started on [how to contribute to the Github repository](https://github.com/Azure/app-service-quickstart-docker-images/blob/master/README.md). How to remove a docker image from Docker hub
--------------------------------------------

 Docker images can be removed from Docker hub and Github repository when either if the two cases below is applicable :  - If the owner/primary maintainer of the docker image does not wish to maintain the docker image and remove it since they no longer support it. Please report it to [appgal@microsoft.com]({{ site.baseurl }}/mailto:appgal@microsoft.com) to remove the docker image from Docker hub and Github repositories .
 - If docker image is outdated , or is has bugs unresolved for more than 3 months the docker image will be removed .
  How to report issues
--------------------

 If you want to report issues , please report an issue [here](https://github.com/Azure/app-service-quickstart-docker-images/issues). Provide all the necessary information as shown in [this template](https://github.com/Azure/app-service-quickstart-docker-images/blob/master/.github/ISSUE_TEMPLATE.md) to report an issue in order for us to help with resolving the issue.      