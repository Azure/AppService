---
title: "Public Preview: Disabling Weaker TLS Cipher Suites for Web Apps on Mutli-tenant Premium App Service Plans"
author_name: "Yutang Lin"
category: security
toc: true
toc_sticky: true
excerpt: "Public preview of the minimum TLS cipher suite feature that allows customers to disable weaker TLS cipher suites for their App Service web apps"
---

For a few years, the only way to disable weaker TLS Cipher Suites for web apps is to host these web apps in an App Service Environment (ASE). The recent update to the App Service front-ends [mentioned earlier](https://aka.ms/appservicekestrelyarp) has allowed the capability to bring this type of TLS cipher suite customization to customers running on the public multi-tenant footprint. **We are excited to announce a public preview of the minimum TLS cipher suite feature that allows web apps in multi-tenant premium App Service Plans to disable weaker cipher suites!** This feature enables our security conscious customers to trim off older cipher suites that the App Service platform supports for client compatibility. 

## What are cipher suites and how do they work on App Service? 

A cipher suite is a set of instructions that contains algorithms and protocols to help secure network connections between clients and servers. By default, the front-end's OS would pick the most secure cipher suite that is supported by both the front-end and the client. However, if the client only supports weak cipher suites, then the front-end's OS would end up picking a weak cipher suite that is supported by them both.  

If a customer's organization has restrictions on what cipher suites are not be allowed, they may update their web app’s minimum TLS cipher suite property to ensure that the weaker cipher suites would be disabled for their web app. The next part of the article will go through the new minimum TLS cipher suite feature that is currently in public preview. 

## Minimum TLS Cipher Suite Feature 

The minimum TLS cipher suite feature comes with a pre-determined list of cipher suites that cannot be reordered nor reprioritized. Since the service is already using the ideal priority order, it is not recommended for customers to reprioritize the the cipher suite order. Customers can potentially leave their web apps exposed if weaker cipher suites are prioritized over the stronger ones. Customers also cannot add newer or different cipher suites to the list of supported cipher suites. When a minimum cipher suite is selected, all the cipher suites that are less secure than the selected minimum one would be disabled for the web app. There is no support to make exceptions and to disable only some of the cipher suites that are weaker than the selected minimum cipher suite. 

### What cipher suites are supported and how are they prioritized? <a name="supported-cipher-suites"></a>

Refer to below for the list of supported cipher suites. These cipher suites are listed in order from most secure to the least secure. The service may update the list of supported cipher suite later on, though not very frequently. 

```
TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384, 
TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256, 
TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256, 
TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384, 
TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256, 
TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA384, 
TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256, 
TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA, 
TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA, 
TLS_RSA_WITH_AES_256_GCM_SHA384, 
TLS_RSA_WITH_AES_128_GCM_SHA256, 
TLS_RSA_WITH_AES_256_CBC_SHA256, 
TLS_RSA_WITH_AES_128_CBC_SHA256, 
TLS_RSA_WITH_AES_256_CBC_SHA, 
TLS_RSA_WITH_AES_128_CBC_SHA 
```
 
### How to disable weaker cipher suites? 

Minimum TLS cipher suite is a property that resides in the site’s config and customers can make changes to disable weaker cipher suites by updating the site config through API calls. The minimum TLS cipher suite feature is currently not yet supported on the Azure Portal. 

#### Sample API call 

This part of the article will show an example on how to select a minimum TLS cipher suite in order to disable weaker cipher suites. 

Let's say, based from the [list of supported TLS cipher suites](#supported-cipher-suites), we would like to disable all the cipher suites that are weaker than `TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA`. In order to do this, we can call the [Update Config API](https://learn.microsoft.com/rest/api/appservice/web-apps/update-configuration) to set the property `minTlsCipherSuite` to `TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA`. Refer to the sample API call below.

Take note that the API parameter for `minTlsCipherSuite` is **case sensitive**. 

```
PATCH https://management.azure.com/subscriptions/<subscriptionId>/resourceGroups/<resourceGroup>/providers/Microsoft.Web/sites/<siteName>/config/web?api-version=2022-03-01 
```

``` json
{ 
  "properties": { 
    "minTlsCipherSuite": "TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA" 
  } 
} 
```

After successfully updating the site config, we will see the value of the property `minTlsCipherSuite` change to the selected cipher suite, `TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA` from the example above. 

We will also see the value of the property `supportedTlsCipherSuites` show a list of all the cipher suites that are enabled for the web app. In this case, the cipher suites that are weaker than the selected minimum cipher suite, `TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA`,  will not show up in the `supportedTlsCipherSuites` property because they have been disabled for the web app.

### What is the default behavior? 

By default, without making any changes to the minimum TLS cipher suite property, the web app will support all the cipher suites the front-end supports. The `minTlsCipherSuite` property would be `null` and the `supportedTlsCipherSuites` property would also be `null`; this just means that the web app will allow all [the supported cipher suites](#supported-cipher-suites) as the default behavior. 

 
