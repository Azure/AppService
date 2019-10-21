---
author_name: mksunitha
layout: post
hide_excerpt: true
---
      [mksunitha](https://social.msdn.microsoft.com/profile/mksunitha)  7/31/2017 10:16:06 AM  [App Service domains (preview)](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/Microsoft.Domain?tab=Overview) simplifies to create and manage domains for various Azure services. App Service domains leverages Azure DNS for hosting the domain and GoDaddy as the domain registrar.In addition to the domain registration fee, usage charges for Azure DNS apply. For information, see [Azure DNS Pricing](https://azure.microsoft.com/pricing/details/dns/).

 This tutorial shows you how to buy an App Service domain and assign DNS names a Virtual machine and Azure Storage 

 ### Sign in to Azure

 Open the [Azure portal](https://portal.azure.com/) and sign in with your Azure account.

 ### Navigate to the app in the Azure portal

 From the left menu, select **New -> Everything -> App Service Domain (preview)**

 [![]({{ site.baseurl }}/media/2017/07/domain-marketplace-1024x267.png)]({{ site.baseurl }}/media/2017/07/domain-marketplace.png)

 ### Purchase a domain

 In the **App Service Domain** page, in the **Search for domain** box, type the domain name you want to buy and type Enter. The suggested available domains are shown just below the text box. Select one or more domains you want to buy.

 [![]({{ site.baseurl }}/media/2017/07/create-domain-370x1024.png)]({{ site.baseurl }}/media/2017/07/create-domain.png) Click the **Contact Information** and fill out the domain's contact information form. When finished, click **OK** to return to the App Service Domain page. Next, select the desired options for your domain. See the following table for explanations:

    Setting Suggested Value Description     Subscription Pay-As-You-Go Select a **Subscription**. If you have multiple subscriptions, choose the appropriate subscription.   Contact Information Enter your contact information such as address, phone number etc .. Fill out the domain's contact information form. When finished, click OK to return to the App Service Domain page.   Resource Group myprojectgroup Enter a **resource group**. A resource group is a logical container into which Azure resources like web apps, databases that is deployed and managed. You can create a resource group or use an existing one   Auto renew Enable Renews your App Service Domain automatically every year. Your credit card is charged the same purchase price at the time of renewal.   Privacy protection Enable Opt in to "Privacy protection", which is included in the purchase price *for free*(except for top-level domains whose registry do not support privacy protection, such as *.co.in*, *.co.uk*, and so on).   Accept terms and purchase Accept Click Legal Terms to review the terms and the charges, then click Buy.    ### Assign domain to Azure Virtual machine

 Resource Manager VMs can have a Public IP. A VM with a Public IP address may also be behind a load balancer. You can create a DNS A or CNAME record for the Public address. This custom name can be used to bypass the VIP on the load balancer. To verify if you VM has a public IP , go the resource group used by the VM to see if you have a resource "Public IP address" . [![]({{ site.baseurl }}/media/2017/07/ip-address-vm-1024x844.png)]({{ site.baseurl }}/media/2017/07/ip-address-vm.png) You can get the IP address by selecting the Public IP address resource or select your Virtual machine to get the IP address [![]({{ site.baseurl }}/media/2017/07/get-ip-vm-1024x387.png)]({{ site.baseurl }}/media/2017/07/get-ip-vm.png) Select your domain and choose DNS Zone setting [![]({{ site.baseurl }}/media/2017/07/dns-zone-501x1024.png)]({{ site.baseurl }}/media/2017/07/dns-zone.png) Click on **Add a Record Set **. Add an A record for your Public IP configured to a subdomain alias such as **www **or **blog **as** **shown below. Configure your TTL setting on when your domain should resolve to the new domain hosting service. ### [![]({{ site.baseurl }}/media/2017/07/add-record-set-1024x365.png)]({{ site.baseurl }}/media/2017/07/add-record-set.png)

 Enter your domain in a browser address bar based on your TTL configuration. ### [![]({{ site.baseurl }}/media/2017/07/resolve-domain-1024x376.png)]({{ site.baseurl }}/media/2017/07/resolve-domain.png)Add Custom domain for Azure storage

 Create an App Service Domain . Once provisioned , select **DNS Zone** setting and **Add a record set .** Create a new **CNAME** record and provide a subdomain alias such as **www** or **images**. Then provide a host name, which is your Blob service endpoint, in the format **my-storage-account-name****.blob.core.windows.net** (where *my-storage-account-name* is the name of your storage account). [![]({{ site.baseurl }}/media/2017/07/add-storage-record-set-986x1024.png)]({{ site.baseurl }}/media/2017/07/add-storage-record-set.png) Go to your storage resource in the [Azure portal](https://portal.azure.com/) and select Custom Domain setting. In the text box on the *Custom domain* blade in the [Azure portal](https://portal.azure.com/), enter the name of your custom domain, including the subdomain. For example, if your domain is **example.****com** and your subdomain alias is **www**, enter **www.example.com**. If your subdomain is **images**, enter **images.contoso.com**. The subdomain is *required*. [![]({{ site.baseurl }}/media/2017/07/map-storage-domain-1024x745.png)]({{ site.baseurl }}/media/2017/07/map-storage-domain.png) Click on **Save. **Access your files on Azure storage using the custom domain. ### Auto Renew your Domain

 You can change your billing setup for your domain registration anytime to either enable or disable auto-renew by selecting **Domain Renewal **setting [![]({{ site.baseurl }}/media/2017/07/domain-renewal-1024x493.png)]({{ site.baseurl }}/media/2017/07/domain-renewal.png) App Service domains can be used to setup domain for other Azure services as stated in this [article](https://docs.microsoft.com/en-us/azure/dns/dns-for-azure-services). *Note : The hostname bindings setting only shows Web Apps and Traffic Manager if confugred to your domain for now. Your VM or Storage or any other Azure service using this domain will not show up in hostname binding setting. We will continue to work on improving this experience to display other services assigned to the domain. *  Submit your ideas/feedback in [UserVoice](https://aka.ms/webapps-uservoice). Please add [Domain] at the beginning of the title.       