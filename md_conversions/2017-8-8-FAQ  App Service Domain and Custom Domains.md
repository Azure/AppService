---
title: "FAQ  App Service Domain and Custom Domains"
author_name: mksunitha
layout: post
hide_excerpt: true
---
      [mksunitha](https://social.msdn.microsoft.com/profile/mksunitha)  8/8/2017 11:58:41 PM  Here are most frequent questions asked about App Service domains . Custom Domains
--------------

 #### How do I resolve 404 error "Web Site not found" when I browse my site ?

 You are seeing this error due to one of the reasons listed below :  - The custom domain configured is missing a CNAME and/or A record . To configure the domain to your app, see [how to map an existing domain](https://docs.microsoft.com/en-us/azure/app-service-web/app-service-web-tutorial-custom-domain) . 
	 - If you added an A record , make sure a TXT record is also added. For more details , see [here](https://docs.microsoft.com/en-us/azure/app-service/app-service-web-tutorial-custom-domain#create-the-a-record)
	  
 - The browser client might still be caching the old IP address for your domain. Clear the cache by running the command * ipconfig /flushdns . *Verify your domain is pointing to the web app IP address using [WhatsmyDNS.net](https://www.whatsmydns.net/) .
  #### I am unable to add a new sub-domain ?

 One of the following reasons might be preventing you from purchasing a domain  - Check you have permissions to modify the web app and add a sub domain hostname
 - You may have reached the max limit for subdomains . You can add max of 500 hostnames to your web app. 
	 - You may have reached max limit for sub-domains if you are using GoDaddy domain hosting. The current limitation if using GoDaddy is 100. If you need more sub-domains , you may choose to migrate to Azure DNS
	  
  #### Can I move my web app with a custom domain to another subscription or from ASE V1 to ASE V2?

 Yes you can move your web app across subscriptions . Follow the guidance in [How to move resources in Azure](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-move-resources) . There are a few limitations when moving the web app , click[ here ](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-move-resources#app-service-limitations)to view the limitations. For domains attached to your web app , if they are already added to your web app with a hostname binding then after moving the web app you should see the same host name binding within custom domains setting. No additional steps needed here. #### Unable to add custom domain to my Web app ?

 This could be due one of the following reasons:  - **You don’t have permission to add a hostname : **Check with subscription admin to make sure you have a permissions to add a hostname
 - **Your domain ownership could not be verified** : If domain ownership is failing , verify if your CNAME or A record are configured correctly . To map custom domain to web app , create either a CNAME or A Record . If you want to use root domain , you must use A and TXT records as well
 - **Your domain is not available to use** : You can use the custom domain with one web app , say for example www.mydomain.com can be added to one azure web app . In order to use the same the domain with another web app , you need to use another subdomain say xyz.mydomain.com but you CANNOT use www.mydomain.com .
  #### You see the error "The DNS record could not be located"

 One of the reasons could be causing the issue:  - TTL live has not expired. Check you DNS configuration for your domain what TTL is and wait it out.
 - DNS configuration is not right
  Try one of these solutions to resolve the issue  - Wait for 48 hours and this should automatically resolve.
 - If you can modify the TTL setting in your DNS configuration , go ahead and make the change to 5 minutes or so to see if this resolves the issue
 - Verify your domain is pointing to the web app IP address using [net](https://www.whatsmydns.net/). If not fix the A record to be configured to the right IP address of the web app
  App Service Domains
-------------------

 #### I am unable to purchase a new Domain ?

 One of the following reasons might be preventing you from purchasing a domain  - Check you credit card on the Azure subscription is still valid
 - If you are not the subscription owner , check you have permissions to purchase a new domain. (i.e Contributor or Owner roles )
 - You may have reached the limit to purchasing domains on your subscription. The current limit is 20.
  #### Do I have to configure my custom domain for my website once I buy it?

 When you purchase a domain from the Azure portal, the App Service application is automatically configured to use that custom domain. You don't have to take any additional steps. Watch [how to configure domain](https://channel9.msdn.com/blogs/Azure-App-Service-Self-Help/Add-a-Custom-Domain-Name) on Channel9. #### You domain is no longer visible in the Azure portal or Domain was accidentally deleted

 The domain may have been accidentally deleted by the owner of the subscription. If your domain was deleted less than 7 days ago , the domain has not yet started the deletion process. Hence you can buy the same domain again on Azure portal under the same subscription (make sure to type the exact domain name in search text box). You will not be charged again for this domain. If the domain was deleted more than 7 days ago , please contact [Microsoft Azure support](https://docs.microsoft.com/en-us/azure/azure-supportability/how-to-create-azure-support-request) for assistance to restore the domain. #### Can I use a domain purchased in the Azure portal to point to an Azure IaaS VM instead?

 Yes you can point the domain to an IaaS VM , Storage etc . See [How to assign domain to a Virtual machine or Azure Storage](https://blogs.msdn.microsoft.com/appserviceteam/2017/07/31/assign-app-service-domain-to-azure-vm-or-azure-storage/). #### Is my domain hosted by GoDaddy or Azure DNS?

 You domain is registered with GoDaddy service but hosted on [Azure DNS](https://azure.microsoft.com/en-us/services/dns/) #### I have auto-renew enabled but still received a renewal notice for my domain via email . What should I do ?

 You do not need to take any action in this case if you have auto -renew enabled . The notice email if to just inform you that the domain is close to expiring and to renew manually if auto-renew is not enabled. #### Will I be charged for Azure DNS hosting my domain ?

 The initial cost of domain purchase applies to domain registration only. In addition to the registration cost , there will be incurring charges for Azure DNS based on your usage. See [Azure DNS pricing](https://azure.microsoft.com/en-us/pricing/details/dns/) for more details. #### I purchased my domain earlier from the Azure portal and want to move from GoDaddy hosting to Azure DNS hosting . How can I do this ?

 It is not mandatory to migrate to Azure DNS hosting. If you do wish to migrate to Azure DNS , you will see a message in domain management experience within the Azure portal about next steps to move to Azure DNS. Migration from GoDaddy hosting to Azure DNS is a few clicks away and seamless as long as the domain was purchased from App Service. #### I would like to purchase my domain from App Service Domain but can I host my domain on GoDaddy instead of Azure DNS?

 For every new App Service domain purchased in the portal since July 24 2017 , will be hosted on Azure DNS. If you prefer to choose a different hosting provider , you need to go to their website to procure domain hosting solution. #### Do I have to pay for privacy protection for my domain?

 When you purchase a domain through the Azure portal, you can choose to add privacy at no additional cost. This is one of the benefits of purchasing your domain through Azure App Service. #### If I decide I no longer want my domain, can I get my money back?

 When you purchase a domain, you are not charged for a period of 5 days, during which time you can decide that you do not want the domain. If you do decide you don't want the domain within that 5-day period, you will not be charged. (.uk domains are an exception to this. If you purchase a .uk domain, you will be charged immediately and you cannot be refunded.) #### Can I use the domain in another Azure App Service app in my subscription?

 Yes. When you access the Custom Domains and SSL blade in the Azure portal, you will see any domains that you have purchased and you can configure your app to use any of those domains. #### Can I transfer a domain from one subscription to another subscription?

 You can move a domain to another subscription/resource group by using '[Move-AzureRmResource](https://msdn.microsoft.com/en-us/library/mt652516.aspx)' PowerShell cmdlet. #### How can I manage my custom domain if I don't currently have an Azure App Service app that is not a free app?

 You can manage your domain even if you don't have an App Service Web App. Domains can be used for Azure services like Virtual machine, Storage etc . If you intend to use the domain for App Service Web Apps , then you need to include a Web App that is not on the Free App Service plan in order to bind the domain to your web app. #### How can I transfer my domain out of Azure

 Follow the steps below to transfer out the domain  - Login to Azure portal
 - Select your App Service domain that you wish to transfer out
 - Go to Advance management for the domain
 - Click your domain -> manage
 - Under "Additional Settings" a. Unlock your domain . Click on Edit for "Domain lock" and turn it Off. b. Click on **Transfer domains away from Azure** to follow instructions to transfer out .
      