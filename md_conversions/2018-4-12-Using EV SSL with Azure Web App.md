---
title: "Using EV SSL with Azure Web App"
author_name: mksunitha
layout: post
hide_excerpt: true
---
      [mksunitha](https://social.msdn.microsoft.com/profile/mksunitha)  4/12/2018 12:33:21 PM  You can use EV SSL with Azure web apps. There are many CA that provide EV SSL for your web applications and the two options you have to use EV SSL with azure web app :  ### Option 1 : Bring your own certificate and upload to web app

 Contact your CA to get instructions on how to export your EV SSL into PFX format . Then follow the[ instructions](https://docs.microsoft.com/en-us/azure/app-service/app-service-web-tutorial-custom-ssl#upload-your-ssl-certificate) to upload this certificate into your web app . Once the certificate is uploaded , [add an SSL binding to your web app ](https://docs.microsoft.com/en-us/azure/app-service/app-service-web-tutorial-custom-ssl#bind-your-ssl-certificate-1). ### Option 2 : Buy a certificate via Key Vault and import to Web App

 Azure Key Vault supports both DigiCert and GlobalSign CA providers to purchase ORG SSL and EV SSL. You can purchase a EV SSL from either of these providers . Follow instructons on how to purchase and configure a EV SSL from these providers into Key Vault  - [Purchase and configure DigiCert with Azure Key Vault ](https://www.digicert.com/azure-key-vault/)
 - [Purchase and configure GlobalSign with Azure Key Vault](https://www.globalsign.com/en/lp/certificates-for-azure-key-vault/)
  Place the certificate (PFX format ) in Key Vault and then follow the [instructions here](https://blogs.msdn.microsoft.com/appserviceteam/2016/05/24/deploying-azure-web-app-certificate-through-key-vault/) to import the Key Vault as an App Service Certificate . ### Troubleshooting Issues

 In the [Azure portal](https://portal.azure.com) , go to your App Service Certificate using this Key Vault resource for your EV SSL certificate . Follow the steps below to troubleshoot issues :  - ** Key Vault may have moved to another subscription or deleted or in a suspended state** : In the portal , when you open your App Service certificate you will see the status "Key Vault out of Sync " . In this case , click on the status tile which will prompt you to reconfigure your Key Vault to App Service certificate to a valid Key Vault . Note the Key Vault must be in the same subscription as the App Service certificate
 - **Key Vault secret was updated but I still see the old secret in App Service certificate : **Web App service runs a background job that periodically (once a day ) that syncs all App Service certificate. Hence when you rotate or update a certificate, sometimes the application is still retrieving the old certificate and not the newly updated certificate. This is because the job has not run to sync the certificate resource. To force a sync of the certificate , you can click on **Rekey and Sync **setting and then click on **Sync **button .
  ### ![]({{ site.baseurl }}/media/2018/02/sync-asc-1024x508.png)

  - **Documentation Support :** Checkout our FAQs for more details if you run into any issues managing your App Service Certificate ![]({{ site.baseurl }}/media/2018/02/faq-asc-1024x649.png)
      