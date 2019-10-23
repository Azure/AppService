---
title: "FAQ  Azure marketplace for Web Apps"
author_name: mksunitha
layout: post
hide_excerpt: true
---
      [mksunitha](https://social.msdn.microsoft.com/profile/mksunitha)  6/29/2017 6:36:46 PM  Here is a list of frequently asked questions designed to provide a better understanding of the Azure marketplace for Web  2. ** How do I submit my Web Application to Windows Web Application Gallery?** A. You can submit your application [here](http://azuregallery.azurewebsites.net). Before you submit the application please read through the guidelines and process for submission in this [article](https://blogs.msdn.microsoft.com/appserviceteam/2016/08/26/onboarding-to-azure-web-marketplace/).
 4. **Why is Deployment option connected to a github repository when I deploy an application like WordPress from the marketplace?** A. The deployment process for application from the marketplace uses a GIT deployment method. This makes it easier for app owners to push updates to the application as quickly as possible and have it available to Azure users. Hence we use a github repository configured by the app owner with the application code that is deployed during provisioning of the application.
 6. **How long does it take for the Web Application Gallery Team to validate the application?** A. Once the application is submitted, it will take 3-5 business days for us to validate the application and send you the status.
 8. **How do I build a package for Web Application Gallery?** A. Please refer to [this article](https://blogs.msdn.microsoft.com/appserviceteam/2016/08/26/onboarding-to-azure-web-marketplace#azurepackage) on how to to build a package for Azure marketplace.
 10. **How do I test my application for Windows App Gallery?** A. Find the process to test your application in the following [article](https://blogs.msdn.microsoft.com/appserviceteam/2016/08/26/onboarding-to-azure-web-marketplace/#testyourapp).
 12. **Can I on-board a commercial application to the Azure marketplace?** A. Yes. Commercial application are supported with *Bring your own License model (BOYL)*. Here are two approaches on how to allow an azure user to acquire a license: 
	 - Approach 1 : 
		 - Ask customer to purchase an license from solution partner website directly.
		 - Provision the application solution from the Azure Marketplace
		 - When user views the app in the browser ask user to enter the license information
		 - Solution partner API are called to validate the license key and allow the user to use the application solution as documented by the solution partner
		  
	 - Approach 2 : 
		 - Provision the application solution from the Azure Marketplace
		 - When user views the app in the browser the app ask the user to provide the information needed to procure a license key from the run time experience using solution partners APIs.
		  
	  
 14. **An application was removed from the marketplace and how do I deploy the same solution?** A. If an application is removed from the marketplace , this means it is no longer supported by the application owner in the marketplace. In such cases we remove the application if it does have support from the application owner to maintain fixes or issues. If you want to deploy the same application , you can. Follow these steps to do so : 
	 - Create an empty Web App and any additional resources such as MySQL , SQL DB etc that the application may need.
	 - Access the web application file storage and deploy the code via FTP or GIT.
	 - Browse the application and complete the installation of the application based on the documentation provided in the application framework documentation.
	 - If you run into issues , please report these issues in the community forums for the application being used .
	  
      