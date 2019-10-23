---
title: "App Service and Functions hosted apps can now update TLS versions!"
author_name: Oded Dvoskin
layout: post
hide_excerpt: true
---
      [Oded Dvoskin](https://social.msdn.microsoft.com/profile/Oded Dvoskin)  4/17/2018 10:47:40 AM  Following our communication earlier in the year, the App Service team is happy to announce that the ability to explicitly configure the TLS version for individual applications, is now available. What is TLS?
------------

 Transport Layer Security (TLS) is a protocol that provides privacy and data integrity between two communicating applications. It's the most widely deployed security protocol used today, and is used for web browsers and other applications that require data to be securely exchanged over a network, such as file transfers, VPN connections, [instant messaging](http://searchunifiedcommunications.techtarget.com/definition/instant-messaging) and voice over IP. Multiple versions of TLS are available, with each being released at a different time and mitigating different vulnerabilities. TLS 1.2 is the most current version available for apps running on Azure App Service. Why should I update my TLS version?
-----------------------------------

 The [PCI Security Standards Council](https://www.pcisecuritystandards.org/) has stated that June 30th, 2018, is the compliance deadline for disabling early TLS/SSL versions and implementing more secure protocols for your applications’ traffic. Customers requiring PCI compliance should move away from TLS 1.0, and onto TLS 1.1, though it is highly recommended to instead move directly to TLS 1.2. How can I test my connection and assess my risk?
------------------------------------------------

 Most traffic going to apps hosted on Azure App Service is originating from modern Web Browsers updated to recent versions. SSL traffic originating from out-of-date browsers may not support newer TLS versions like TLS 1.2. In order to test your app’s compatibility with updated TLS versions, we suggest testing with one of the various 3rd party solutions to test traffic to your apps like [SSLLabs](https://www.ssllabs.com/ssltest/viewMyClient.html). After updating the TLS setting for your app, you may use SSLLabs to test and see if lower versions of TLS are not accepted any more. What’s next for App Service hosted apps?
----------------------------------------

 At the time of releasing this blog, all applications running on public multi-tenant App Service hosted platform, including Azure Functions, apps hosted on the Azure National Clouds and App Service Environments (ASE), can update settings to select the TLS version that is required. From June 30th, 2018, all newly created App Service apps will automatically have TLS 1.2 selected as the default configuration. Though not recommended, we are allowing users to downgrade the TLS version if desired. How can I update the setting to select my required TLS version?
---------------------------------------------------------------

 In the Azure Portal, go to your App Service app’s menu, select SSL Setting and select the toggle to the version you require. Auto-save of the selection is enabled. Please allow a few minutes for the setting to be reflected in the monitoring tools. [![]({{ site.baseurl }}/media/2018/04/tlsportal2-300x177.png)]({{ site.baseurl }}/media/2018/04/tlsportal2.png)  - TLS configuration through CLI and PoweShell will be coming soon.
  What if I have questions about this change?
-------------------------------------------

  - Open a forum post on the [App Service forum](https://social.msdn.microsoft.com/forums/azure/en-us/home?forum=windowsazurewebsitespreview) or on [Stack Overflow](https://stackoverflow.com/questions/tagged/azure-web-app-service).
 - Open a [support ticket](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview).
 - Refer to the [document](https://docs.microsoft.com/azure/app-service/app-service-web-tutorial-custom-ssl#enforce-tls-1112) covering the feature and changes to the configurations.
      