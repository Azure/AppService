---
author_name: mksunitha
layout: post
hide_excerpt: true
---
      [mksunitha](https://social.msdn.microsoft.com/profile/mksunitha)  8/26/2016 2:28:03 PM  Azure Marketplace is a hub of solutions for users to create different types of resources. Each category of resource such as Data services, Virtual machines, Web have different on-boarding processes for ISVs to publish their solutions in Azure marketplace. In this article we will discuss the process to on-board Web Apps to Web Marketplace in Azure. To showcase your application in Web Azure marketplace , you need to get your application certified. The certification process is a 5 Step process. ![](https://azuregallery.azurewebsites.net/images/process.png)     **APPLICATION**   - Step 1: Apply by providing basic information about your business and solution
 - Step 2: Share solution-specific information and wait for approval
     **ONBOARDING** Build your Azure package and provide the marketing content for your application . See details below.   **CERTIFICATION** We’ll run tests to verify compatibility with our platform or service   **PUBLISHING**   - Step 1: Showcase the Azure certified logo for your application
 - Step 2: Publish your application on Azure Marketplace/Azure pages
     **MARKETING** Promote and market your application taking advantage of Microsoft go-to-marketing resources     #### On-boarding New applications to the Web Azure Marketplace

 #### For new applications:

 The on-boarding process is a gated approach and the application will be reviewed by our team. Click [here](https://azuregallery.azurewebsites.net/certification/request) to request for certification. Leverage the [benefits](https://azuregallery.azurewebsites.net/benefits) of this program from being showcased in the Azure Marketplace but also advantages of being part of Microsoft partner network. Follow the guidelines mentioned below to build your template and test your application on App service. If accepted we will enable it in the Azure portal. #### Existing Applications:

 We will continue to maintain existing applications in the Azure Web Marketplace. Please reach out[ appgal@microsoft.com ]({{ site.baseurl }}/mailto:appgal@microsoft.com)if you haven't already to get details on updated process for managing updates to your application. ### Azure Web Marketplace Principles

 Users can browse and view applications for different types of Web sites, ranging from photo galleries to blogs to e-commerce sites. To be part of the Azure Web Marketplace, developers should follow these principles, which establish a consistent, quality user experience:  - **Be Current**: The application you provide a link to must be the latest, stable final release version available, hosted on a publicly available Web URL.
 - **Application License**: The application Azure Web Marketplace may provide an entry point **free of charge** or use **Bring your own license model (BOYL) ** where users can purchase a license from the application publisher's website.
 - **Be Compatible**: The generated and configured application deployed from Azure Web Marketplace must also run on any Windows OS.The application should support running on cloud infrastructure by providing an option to make the application stateless.
 - **Be Hostable**: The application to which you provide a link must run well in a shared hosted environment as well as when the user has administrative rights for the computer.
 - **Be Deployable**: Your application code must be available on a public repository on Github.com . Azure users should be able to fork the repository and deploy to Azure web app.
 - **Be Supported**: You must provide a publicly available Web site where end users can download your application, find documentation and/or get free on a best effort basis support through a forum.
 - **Be Platform Independent**: The application to which you provide a link must be able to run on all Windows platforms x86, and x64.
 - **Be Inclusive**: If your application is included in the Gallery, you should include a statement of availability in the Azure App Gallery on the application community’s Web site.
 - **Be Safe**: The application to which you provide a link must not harm customers or be malicious, dishonest, destructive, invasive, or act in any manner restricted by the [Web Gallery Application Submission agreement.](http://www.microsoft.com/web/gallery/submissionagreement.aspx)
 - **Be a Web App**: The application to which you provide a link must be a Web application that can be used to generate a working, usable Web site after deployment *without* requiring code or customization.
 - **Support Database Dependencies:** Currently our create experience supports Web App with Database ( MySQL and/or SQL DB). If your application has other dependencies , Web Marketplace may not be an option.You may want to look into [Azure solution templates.](https://azure.microsoft.com/en-us/documentation/articles/marketplace-publishing-solution-template-creation/)
  ### Package your application code

 **Using Git Deploy:** Create a public Github repository with your application code as it would be deployed under *wwwroot* in the Azure web app. You may include custom post deployment scripts with a *deploy.cmd* file in the root of your repository, see details on [how to add custom scripts](https://github.com/projectkudu/kudu/wiki/Custom-Deployment-Script). This packaging method makes managing updates to your application easier without having to go through the entire certification process. For future updates to your application , you need to update the code in the repository with appropriate commit message for users to pull in to latest bits of your application. When code changes are committed to your repo , the code is not automatically pulled in for users using your application to prevent breaking their application. Users using your application must perform a manual sync to pull in the latest committed changes from your repository. *Note: We are no longer supporting Web deploy method of application packaging for NEW applications in the Web marketplace.* #### Building an Azure Package for Marketplace

 Azure Package has a special folder structure to be consumed by Azure Marketplace service. Each folder at the root level approximately represents a publisher. A folder contains one or more .json files, called package manifests, each of which contains the metadata for an Azure Gallery package. Every folder also includes a set of deployment templates, strings , icons and screenshots which can be referenced by the package manifests. See the folder structure shown below : /MyPackage/ /MyPackage/Manifest.json /MyPackage/UIDefinition.json /MyPackage/Icons/ /MyPackage/Screenshots/ /MyPackage/Strings/ /MyPackage/DeploymentTemplates/  You can find sample packages on [GitHub ](https://github.com/SunBuild/web-app-marketplace).  - ****Manifest.json: ****The manifest file contains all of the metadata for your gallery item. For a visual representation of where each metadata value is used , view the schema for [Manifest.json](https://github.com/SunBuild/web-app-marketplace/blob/master/Schema_Manifest.json). Add the paths to the Icons , Screenshots and links to articles that can help customers get more information about your application.
   - **UIDefinition.json :**Use the [UIDefintion.json schema](https://github.com/SunBuild/web-app-marketplace/blob/master/schema_UIDefinition.json) to build appropriate UIDefinition.json for your application. You can use "parameters" properties which is optional , if your application needs to ask the user for information for the deployment of your app. These parameters become AppSettings for your web app and can be consumed within your app as environment variables.To hide a parameter from the portal UI , set *"hidden":true* as show [here ](https://github.com/SunBuild/web-app-marketplace/blob/master/WebApp-CustomAppSettings-NoDatabase/UIDefinition.json#L35) . To mark a parameter as required for the create experience , set *"required":true* as shown [here](https://github.com/SunBuild/web-app-marketplace/blob/master/WebApp-CustomAppSettings-NoDatabase/UIDefinition.json#L40).
 - **Icons : **The relative path specified by iconPath in a package manifest must point to a folder that includes the following four images with these dimensions mentioned below: 
	 - Small.png (40x40 px)
	 - Medium.png (90x90 px)
	 - Large.png (115x115 px)
	 - Wide.png (255x115 px)
	  You can group icons under sub-folders if you have different ones per product. Just be sure to include the sub-folder in the iconPath for the package manifest that uses them.
 - **Screenshots : **Images must be exactly 533px by 324px and in PNG format. Specifying a screenshot for a gallery package is completely optional, so do not feel compelled to include one unless it makes sense for your offering.
 - **Deployment Templates :** Include an ARM template that allows Azure users to deploy the application via PowerShell. To learn how to build an ARM template , read the guidelines stated [here](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-authoring-templates) .
 - **Strings: **Include resources.resjson and description.md files to include the description about your application. Here is a [sample description.md](https://github.com/SunBuild/web-app-marketplace/blob/master/WebApp-CustomAppSettings-NoDatabase/Strings/description.md) and [sample resources.resjson](https://github.com/SunBuild/web-app-marketplace/blob/master/WebApp-CustomAppSettings-NoDatabase/Strings/resources.resjson).
  ### Update your application version

 When there is a new version of your existing application, update the following :  - Change the packageURL property in UIdefinition.json file to point to HTTP URL for your application.
 - Change the packageURL in Deployments/Website\_NewHostingPlan\_SQL\_NewDB-Default.json file with the HTTP url for your application.
 - [Optional] Update icons or screenshots , strings if needed
  Build a new azure package in ZIP format and submit a [ request to certify](https://azuregallery.azurewebsites.net/certification/request).  ### Test your application

 Follow the criteria below  - Build an ARM (Azure resource manager) template as per guidelines stated [here](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-authoring-templates) . You can find a sample [here](https://github.com/SunBuild/web-app-marketplace/blob/master/WebApp-NoDatabase/DeploymentTemplates/Website_NewHostingPlan-Default.json)
 - Use the Azure resource manager templates and [deploy using PowerShell.](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-template-deploy)
 - Run these tests in at least 3 different Azure regions.
 - Save the results of these deployment in an Excel or Word document. The excel document should have the following columns: 
	 - Resource group
	 - Web app name
	 - Region
	 - Subscription ID
	 - Time of deployment
	 - Web app Pricing Tier or Sku
	 - Tested with Auto-scale feature[ Values : Pass/Fail] 
		 -  *Test your application with auto-scaling feature turned on and under a heavy load . For example you can choose to run a 5 min load test of 50 users on Web App Standard Small (S1) Pricing tier *
		  
	 - Tested with Continuous Integration[ Values : Pass/Fail] 
		 - *In this test , publish changes to your application and see if you changes are being picked up by your application linked to the Github repository . ** *
		  
	 - Tested with Deployment slots [ Values : Pass/Fail] 
		 - *In this test , create a deployment slot. Connect to the application Github repository to the deployment slot. *
		 - *Push changes to the github repository and then complete to **Swap your application slot with production slot. *
		  
	 - Tested with Backup and restore [ Values : Pass/Fail] 
		 - *In this test configure and setup [Backup](https://docs.microsoft.com/en-us/azure/app-service-web/web-sites-backup) for your application code and database (optional) to be backed up. *
		 - *[restore](https://docs.microsoft.com/en-us/azure/app-service-web/web-sites-restore) from the backup ZIP file to an existing site *
		  
	  
  There are some limitations with the Azure create in the portal and power shell . If your application requires these configurations mentioned below , we will not be able to on board the application.  -  
	 -  
		 -  
			 - You web app need Virtual application setting to be configured for web app
			 - Your web app need a dependency that is not supported by App Service create scenario. We currently support ONLY SQL DB , MySQL and Azure Storage dependencies.
			  
		  
	  
  ### Submit your application

 Submit a certification request [here](https://azuregallery.azurewebsites.net/certification/request) . Please do provide information about your application during submission . Here is the kind of information we are looking for to learn about your application  2. What is current Usage statistics of your application
 4. Do you have customers using your application on the Cloud ( Azure or other hosting providers). If yes share at least 2 customer stories.
 6. How active is the community engaged , primarily for Free applications this information is required
  You will receive a response in 3-5 business days with a request for more information or with next steps to move forward. ### Post publishing

 We recommend to maintain documentation and support for your application on your website. This is key to help get new users started with using your application and follow best practices based on your guidance. ### Marketing

 Once approved your application will be visible in the [Azure portal](https://portal.azure.com) under "Web + Mobile" category. Users can view your application on [Azure website](http://azure.microsoft.com) in the [Marketplace page](https://azure.microsoft.com/en-us/marketplace/web-applications/). ### FAQ

 Check out the frequently asked questions [here](https://blogs.msdn.microsoft.com/appserviceteam/2017/06/29/faq-azure-marketplace-for-web-apps/) . If you don't see the answer to your question , contact us at [appgal@microsoft.com]({{ site.baseurl }}/mailto:appgal@microsoft.com)     