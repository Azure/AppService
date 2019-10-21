---
author_name: mksunitha
layout: post
hide_excerpt: true
---
      [mksunitha](https://social.msdn.microsoft.com/profile/mksunitha)  11/1/2017 3:11:17 PM  App Service certificates now enables you to upload public certificate . Previously you had to use [Azure resource manage template](https://github.com/Azure/azure-quickstart-templates/tree/master/201-web-app-public-certificate) to upload a public certificate or use ARM client to do the same as described in [this article](https://blogs.msdn.microsoft.com/appserviceteam/2017/06/27/installing-public-certificates-in-app-service/). Today , we have made this experience more user friendly to allows user to install their public certificates in the personal certificate store. You can easily add a public Certificate for your App service web app using the Azure Portal. Follow the steps below to upload a public certificate :   - Login to the [Azure portal ](https://portal.azure.com)and select your web app
 - Click on **SSL Certificates** setting -> **Upload Certificate.** Select **Public** and upload your public certificate . The .CER file contains information about the certificate ownership and public key.
  [![]({{ site.baseurl }}/media/2017/11/public-cert-img5-975x1024.png)]({{ site.baseurl }}/media/2017/11/public-cert-img5.png) If you are using an App Service Environment you will be given the option to store either in Current User or Local Machine Store .  - Once upload you can see your public certificate installed on your app as shown below [![]({{ site.baseurl }}/media/2017/11/public-cert-img4-1024x725.png)]({{ site.baseurl }}/media/2017/11/public-cert-img4.png)
  Note SSL certificates is supported only on dedicated App Service Plans and App Service Environments. Things to remember
------------------

  - If your App Service is hosted on a public scale unit then you can only install certificates in **CurrentUser Personal Store **certificate.
 - If your web app is hosted on an App Service Environments, **CurrentUser or LocalMachine-Personal certificate** store is only supported. 
 - When using Deployment slots with your application , keep in mind that the certificates are not sticky and will also get swapped when you perform a slot swap operation. Either user your application code to check for multiple public certificates or make sure the correct certificate is upload for slot as well before you swap a slot with production app.
      