---
title: "Root CA on App Service"
author_name: "Amol Mehrotra"
toc: true
toc_sticky: true
category: certsdomains
---

App Service has a list of Trusted Root Certificates which you cannot modify in the multi-tenant Windows variant version of App Service, but you can load your own Certificate Authority (CA) certificate in the Trusted Root Store in an App Service Environment (ASE), which is a single-tenant environment in App Service. (The Free, Basic, Standard, and Premium App Service Plans are all multi-tenant, and the Isolated Plans are single-tenant.)

When an Windows app hosted on Azure App Service tries to connect to a remote endpoint over SSL, it is important that the certificate on the remote endpoint service is issued by a Trusted Root CA. If the certificate on the remote service is a self-signed certificate or a private CA certificate, then it will not be trusted by the instance hosting your app and the SSL handshake will fail with this error:

``` 
"Could not establish trust relationship for the SSL/TLS secure channel". 
```

In this situation, there are two solutions:

1. Use a certificate that is issued by one of the Trusted Root Certificate Authorities in App Service on the remote server. 
    - [How to get a list of Trusted Root CA on App Service using Kudu](#how-to-get-a-list-of-trusted-root-ca-on-app-service-using-kudu)
1. If the remote service endpoint certificate could not be changed or there is a need to use a private CA certificate, host your app on an App Service Environment (ASE) and load your own CA certificate in the Trusted Root Store
    - [How to load your own CA certificate to the Trusted Root Store in ASE](https://docs.microsoft.com/en-us/azure/app-service/environment/certificates#private-client-certificate)

In the multi-tenant Linux and Windows Container variant version of App Service you can [load certificates](https://learn.microsoft.com/en-us/azure/app-service/configure-ssl-certificate-in-code?tabs=linux#load-certificate-in-linuxwindows-containers) and leverage them following a typical approach depending on the image used to update the Trusted Root Store.

## How to get a list of Trusted Root CA on App Service using Kudu

### How to get to Kudu

Go to your web app on the Azure portal and look for ***Development Tools > Advanced Tools*** and click on "Go ->". A new tab will open for the Kudu tool. The next steps will depend on if you have a [Linux](#linux) or [Windows](#windows) app.

### Windows

Go to **Debug console > Powershell** and a Powershell window will appear. Issue the following command in the console:

``` PS
dir cert:\localmachine\root
```
![How to buy Reserved Instances 1]({{site.baseurl}}/media/2021/06/Windows-Kudu-RootCA.png){: .align-center}

### Linux
Go to **SSH** and issue the following commands:

```
cd /etc/ssl/certs
ls | find *.pem
```

![How to buy Reserved Instances 1]({{site.baseurl}}/media/2021/06/Linux-Kudu-RootCA.png){: .align-center}
