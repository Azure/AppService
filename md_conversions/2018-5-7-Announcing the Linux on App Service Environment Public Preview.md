---
title: Announcing the Linux on App Service Environment Public Preview
author_name: Jennifer Lee (MSFT)
layout: post
hide_excerpt: true
---
      [Jennifer Lee (MSFT)](https://social.msdn.microsoft.com/profile/Jennifer Lee (MSFT))  5/7/2018 8:26:10 AM  Today, we are excited to announce the public preview of Linux on App Service Environment (ASE). Finally, our Linux customers will be able to take advantage of deploying Linux web apps into an App Service Environment, which is perfect for deploying applications into a VNet for secure network access or apps running at a high scale. What can you do with Linux on ASE?
----------------------------------

 With Linux on ASE, you can deploy your** Linux web applications into an Azure virtual network (VNet)**, by **bringing your own custom container or just bring your code** by using one of our built-in images. Additionally, both Windows and Linux/containerized web applications can be deployed into the same ASE, sharing the same VNet. You will be using the Isolated SKU with Dv2 VMs and additional scaling capabilities (**up to 100 total App Service plan instances**, between Windows and Linux, in one ASE), previously not offered in Linux.   [![]({{ site.baseurl }}/media/2018/05/2018-05-06_10h11_32-1024x517.png)]({{ site.baseurl }}/media/2018/05/2018-05-06_10h11_32.png) There are two different kinds of ASEs that you can create: an external ASE with an internet accessible endpoint or an internal ASE with a private IP address in the VNet with an internal load balancer (ILB). Steps to get started are provided [here.](https://docs.microsoft.com/azure/app-service/environment/create-external-ase#create-an-ase-and-a-linux-web-app-using-a-custom-docker-image-together) Currently, Linux on ASE is available in these 6 regions: **West US, East US, West Europe, North Europe, Australia East, Southeast Asia**** ** **Public Preview Pricing**  - During the public preview, you will receive a 50% discount on the Isolated SKU prices on the pricing card that applies to your App Service Plan (ASP). There is **no discount on the ASE itself** (it will still cost ~$1000/month USD for the ASE, regardless the size of the ASE). 
  Things You Should Know
----------------------

  - **Please create a new ASE to try out this feature.** Because deploying Linux apps in an ASE is a preview feature, deploying a Linux app in an ASE that you previously made before this preview may have some performance impacts. 
 -  You will be able to **deploy both Windows and Linux web apps into the same ASE**. Remember that even though Windows and Linux web apps can be in the same App Service Environment, Windows and Linux web apps have to be in **separate App Service Plans. **
 - Because this feature is in **public preview, please do NOT deploy a Linux app or container into an ASE you want fully supported.** Adding a Linux app to an ASE means that the ASE will be in preview mode. 
 -  **Especially for those new to App Service Environment, how long will everything take to deploy?** 
	 -  Because an ASE gives you a fully isolated and dedicated environment for securely running App Service apps at high scale, there are many different parts that we provision for you upon creating a web app in an ASE. Instead of sharing front ends, you will have dedicated front ends that are responsible for HTTP/HTTPS termination and automatic load balancing of app requests within the ASE. 
	 -  Therefore, when deploying a web app into an ASE or performing a scaling operation, the operation can take a couple of hours or more. This is not a promised SLA.
	 -  We recommend that you scheduling your scaling operations to account for the time it takes for any extended scaling processes. 
	  
  How to Get Started
------------------

 You can create a Linux web app into a new ASE by simply **creating a new web app and selecting Linux as the OS (built-in image) or Docker (custom container) or creating a new Web App for Containers (custom container).** When creating a new App Service Plan, remember to select one of the 6 supported regions and select one of the Isolated SKUs. [![]({{ site.baseurl }}/media/2018/05/2018-05-06_10h14_401-1024x514.png)]({{ site.baseurl }}/media/2018/05/2018-05-06_10h14_401.png) Because Linux on ASE is now in public preview, we would love to [hear all of your feedback and questions about the product here](https://feedback.azure.com/forums/169385-web-apps?category_id=333220). Start creating your first Linux/containerized web app into an ASE by [following these instructions.](https://docs.microsoft.com/azure/app-service/environment/create-external-ase#create-an-ase-and-a-linux-web-app-using-a-custom-docker-image-together)      