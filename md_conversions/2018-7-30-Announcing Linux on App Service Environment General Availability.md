---
title: "Announcing Linux on App Service Environment General Availability"
author_name: Jennifer Lee 
layout: post
hide_excerpt: true
---
      [Jennifer Lee (MSFT)](https://social.msdn.microsoft.com/profile/Jennifer Lee (MSFT))  7/30/2018 10:00:16 AM  Interested in deploying your Linux or containerized web app in an Azure Virtual Network? Today, we are excited to announce the **general availability of Linux on App Service Environment**, which combines the features from App Service on Linux and App Service Environment. As we announced in our public preview, our Linux customers will be able to take advantage of **deploying Linux and containerized apps in an App Service Environment**, which is ideal for deploying applications into a VNet for secure network access or apps running at a high scale. **What can I do with Linux on ASE? **
-------------------------------------

 With Linux on ASE, you can deploy your Linux web applications into an Azure virtual network (VNet), by bringing your own custom container or just bring your code by using one of our built-in images.  - If you want bring your own custom Docker container, you can bring your image from: 
	 - DockerHub
	 - Azure Container Registry
	 - Your own private registry
	  
 - If you want to use one of our built-in images, we support many popular stacks, such as: 
	 - Node
	 - PHP
	 - Java
	 - .NET Core
	 - And more to come
	  
  Additionally, both Windows, Linux, and containerized web applications can be deployed into the same ASE, sharing the same VNet. Remember that even though **Windows and Linux web apps can be in the same App Service Environment**, Windows and Linux web apps have to be in separate App Service Plans. With Linux on ASE, you will be using the Isolated SKU with Dv2 VMs and additional scaling capabilities (up to **100 total App Service plan instances**, between Windows and Linux, in one ASE).  Depending on whether you want an internet accessible endpoint, there are two different kinds of ASEs that you can create:  - An *external ASE* with an internet accessible endpoint or,
 - An *internal ASE* with a private IP address in the VNet with an internal load balancer (ILB).
  The consideration here is what kind of IP do you want to expose your apps hosted in your ASE. Steps to get started are provided [here.](https://docs.microsoft.com/en-us/azure/app-service/environment/create-external-ase#create-an-ase-and-a-linux-web-app-using-a-custom-docker-image-together) More context about how to configure networking for your ASE can be found [here.](https://docs.microsoft.com/en-us/azure/app-service/environment/network-info) [![]({{ site.baseurl }}/media/2018/07/2018-07-27_09h55_53-1024x435.png)]({{ site.baseurl }}/media/2018/07/2018-07-27_09h55_53.png) **Pricing Changes from Preview**
--------------------------------

 Linux and containerized apps deployed in an App Service Environment will return to regular App Service on Linux and App Service Environment pricing, as the 50% discount on the Linux App Service Plan from public preview is removed for GA. **New Regions Added**
---------------------

 Since public preview, we have now expanded Linux on ASE to all App Service on Linux’s 20+ regions, which include:    - Australia East
 - Australia Southeast
 - Brazil South
 - Canada Central
 - Canada East
 - Central India
 - Central US
 - East Asia
 - East US
     - East US 2
 - Japan East
 - Japan West
 - Korea Central
 - Korea South
 - North Central US
 - North Europe
 - South Central US
 - South India
     - Southeast Asia
 - UK South
 - UK West
 - West Central US
 - West Europe
 - West India
 - West US
 - West US 2
   **How to Get Started**
----------------------

 You can create a Linux web app into a new ASE by simply creating a new web app and selecting Linux as the OS (built-in image), selecting Docker (custom container), or creating a new Web App for Containers (custom container). When creating a new App Service Plan, remember to select one of the Isolated SKUs. [![]({{ site.baseurl }}/media/2018/07/2018-07-27_09h59_33-1024x380.png)]({{ site.baseurl }}/media/2018/07/2018-07-27_09h59_33.png) If you need more detailed instructions, get started with creating your first Linux/containerized web app into an ASE by [following these instructions.](https://docs.microsoft.com/en-us/azure/app-service/environment/create-external-ase#create-an-ase-and-a-linux-web-app-using-a-custom-docker-image-together) We’d love to hear what you think! Please leave your feedback on Linux on ASE [here.](https://feedback.azure.com/forums/169385-web-apps?category_id=333220) **Frequently Asked Questions (FAQ)**
------------------------------------

 **Q:** Especially for those new to App Service Environment, how long will everything take to deploy? **A:** Because an ASE gives you a fully isolated and dedicated environment for securely running App Service apps at high scale, there are many different parts that we provision for you upon creating a web app in an ASE. Instead of sharing front ends, you will have dedicated front ends that are responsible for HTTP/HTTPS termination and automatic load balancing of app requests within the ASE. Therefore, when deploying a web app into an ASE or performing a scaling operation, the operation can take a couple of hours or more. This is not a promised SLA. We recommend that you schedule your scaling operations to account for the time it takes for any extended scaling processes. Improving scaling and deployment time for apps in an ASE is definitely a top priority item for our team to improve on. **Q:** What should I keep in mind if I want to lock down my ASE with NSG and routing rules? **A:** Using an App Service Environment is a great use case for controlling network access and locking down access to your applications. This can be done using:  - [Network Security Groups (NSGs),](https://docs.microsoft.com/en-us/azure/app-service/environment/network-info#network-security-groups) where you can set inbound and outbound security rules
 - [Routes](https://docs.microsoft.com/en-us/azure/app-service/environment/network-info#routes), where you can control the outbound traffic to not go directly to the internet (such as an ExpressRoute gateway or a virtual appliance)
  This is done at the ASE level, and not the app level, which is important to keep in mind (because in the App Service portal, there is an option on the left-hand menu named “Networking” that is grayed out for Linux and container apps. This is unrelated to controlling your network access via NSGs and routes). Additionally, for ASE management purposes, there are some domains and IPs of network resources that the ASE requires to function. For Windows-only ASEs, [these are documented here](https://docs.microsoft.com/en-us/azure/app-service/environment/network-info#ase-dependencies) and also are surfaced in the ASE Portal. In additional to these inbound and outbound access dependencies, Linux/containers has other dependencies, such as:  - docker.io
 - ubuntu.com
 - docker.com
 - treasuredata.com
 - mono-project.com
  **Q:** Can I deploy a Multi-Container app with Docker Compose/Kubernetes Config in an ASE? **A:** You can deploy a Multi-Container app in an ASE, but the Multi-Container offering on App Service on Linux is still in preview. Learn more about how to deploy a Multi-Container app [here.](https://docs.microsoft.com/en-us/azure/app-service/containers/quickstart-multi-container) **Q:** Can I deploy a Function app in a container in an ASE? **A:** You can deploy a Function app in a container in an ASE, but the Function on Linux feature is still in preview. Learn more about how to deploy a Functions on Linux app [here.](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-azure-function-azure-cli-linux)      