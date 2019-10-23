---
title: Patching Swagger-UI Vulnerabilities in Azure Mobile Apps
author_name: Adrian Hall (MSFT)
layout: post
hide_excerpt: true
---
      [Adrian Hall (MSFT)](https://social.msdn.microsoft.com/profile/Adrian Hall (MSFT))  8/11/2016 3:00:58 PM  **ALERT:** Some Mobile Apps (a feature of Azure App Service) deployments may be vulnerable to phishing attacks because of how current and older versions of swagger-ui are installed. Please take steps to determine if your deployments are at risk, and then mitigate, if necessary. Our Microsoft Azure Security team is following reports of multiple high risk vulnerabilities present in current and older versions of swagger-ui. These are third-party vulnerabilities and not related to the Azure platform. However, some Mobile Apps deployments may have swagger-ui installed in a manner that makes those deployments vulnerable to phishing attacks. ### How the vulnerability is exploited

 The [swagger-ui](http://swagger.io/swagger-ui/?WT.mc_id=azurebg_email_Trans_1181_Swagger) component allows loading of arbitrary swagger definition files by passing the URL of the swagger definition as a querystring parameter. Malicious swagger definitions can be constructed that execute arbitrary code within the browser. An attacker can then send a URL containing a reference to the malicious swagger definition that is then executed by simply opening the URL in a browser (for example, clicking on the link in an email). ### How the vulnerability is mitigated

 The Mobile Apps server SDKs now validate the URL of the swagger definition that is passed as a querystring parameter. Additionally, a Content Security Policy (CSP) header is sent which prevents the browser from communicating with servers that may host malicious swagger definitions. ### How to determine if your deployment is at risk

 First determine whether your Mobile Apps deployment is based on Node.js (this includes all Easy Tables users) or .NET.  - **For Node.js**, you can determine if your deployment is vulnerable by looking at the code in your app.js file (if you are using Easy Tables, you can do this by using the Edit Script option in the [Azure portal](https://portal.azure.com/?WT.mc_id=azurebg_email_Trans_1181_Swagger); this will open App Service Editor and allow you to browse the files). If you see the line "swagger: true" then swagger-ui is enabled and your deployment is potentially vulnerable.
 - **For .NET**, your deployment is potentially vulnerable if the application you publish includes the Azure Mobile .NET Server Swagger package (the vulnerabilities aren‘t in this package itself but one of its dependencies).
  ### Steps to perform mitigation actions

 For Node.js, updated packages are available. We recommend that Node.js users complete one of the following actions:  - Edit your application code (for example, app.js) to disable the configuration setting that enables our swagger UI functionality (use swagger: false).
 - Or update to swagger-ui 2.1.5, and then update to the latest version of the Azure Mobile Apps Node.js SDK. Here are a couple of ways to do this: 
	 - Sign in to the kudu debug console by opening https://.scm.azurewebsites.net/DebugConsole (update to your mobile app name), change directory to D:\home\site\wwwroot, and then run npm update -save azure-mobile-apps swagger-ui. When this completes, go to the [Azure portal](https://portal.azure.com/?WT.mc_id=azurebg_email_Trans_1181_Swagger), open your mobile app, and then select the Restart option. 
	 - Update package version numbers in package.json (azure-mobile-apps should be version 2.2.3; swagger-ui should be 2.1.5) and deploy using git. 
	  
  We strongly recommend the following steps for .NET customers:  2. Uninstall the [Azure Mobile .NET Server Swagger](https://www.nuget.org/packages/Microsoft.Azure.Mobile.Server.Swagger/?WT.mc_id=azurebg_email_Trans_1181_Swagger) package as a mitigation. 
 4. Confirm that your application code no longer includes a reference to the [Swashbuckle.Core](https://www.nuget.org/packages/Swashbuckle.Core/?WT.mc_id=azurebg_email_Trans_1181_Swagger) package. 
 6. Republish your application. 
  For more information on the open source component swagger-ui vulnerabilities, please visit the following webpages on the Node Security Platform website:  - [XSS in Consumes/Produces Parameter](https://nodesecurity.io/advisories/123?WT.mc_id=azurebg_email_Trans_1181_Swagger) 
 - [XSS in key names](https://nodesecurity.io/advisories/126?WT.mc_id=azurebg_email_Trans_1181_Swagger) 
 - [XSS via Content-type header](https://nodesecurity.io/advisories/131?WT.mc_id=azurebg_email_Trans_1181_Swagger) 
  As always, if you run into problems, please contact us. We listen on the [Azure Forums](https://social.msdn.microsoft.com/forums/azure/en-US/home?forum=azuremobile&filter=alltypes&sort=lastpostdesc) and [Stack Overflow](http://stackoverflow.com/).      