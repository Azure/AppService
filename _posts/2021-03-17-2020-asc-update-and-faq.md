---
title: "App Service Certificate Updates and FAQ"
author_name: "Yutang Lin"
toc: true
toc_sticky: true
category: certsdomains
---

There have been a few updates to the App Service Certificate offering in recent months. In order to keep you updated with these changes, this article will cover:

- New portal changes for App Service Certificate create
- New auto-renew policy changes

You will find a FAQ section for App Service Certificates at the end of the article which will go beyond these updates.

## New portal changes for App Service Certificate create

App Service Certificate recently released a [new create experience on Azure Portal](https://portal.azure.com/#create/Microsoft.SSL) that is currently in public preview. 

### Marketplace offerings

When you do a search of "App Service Certificate" on the Azure Marketplace, you will notice two different resources listed: one with "(Preview)" and the other with "(Classic)".

![ASC Marketplace Search]({{site.baseurl}}/media/2021/03/asc-marketplace-search.png){: .align-center}

![ASC Marketplace Offerings]({{site.baseurl}}/media/2021/03/asc-marketplace-offerings.png){: .align-center}

**Both of these offerings will create the same App Service Certificate resource. However, the offering marked with "(Preview)" is the new create experience which we recommend you to use**. We will eventually be deprecating the "(Classic)" create experience.

### What's new

Below is a screenshot of what the new experience looks like:

![ASC Create Basics Tab]({{site.baseurl}}/media/2021/03/asc-preview-basics.png){: .align-center}

Here are a few reasons why you should take advantage of the new create experience:

1. Consistent with other Azure resource create blades
1. Allows you to set your auto-renewal policy during resource creation -- auto-renew is set to on by default to avoid unexpected certificate expiration
1. Allows you to create tags during resource creation which is not supported in "(Classic)"
1. Provides better pre-validation and error messages

## New auto-renew policy changes

**App Service Certificate auto-renew policy is now changed to kick-in 30 days before expiration instead of 60 days before expiration.** 

As of September 1st 2020, SSL/TLS certificates cannot be issued for longer than 13 months (397 days). This is an industry wide change that affects all Certificate Authorities, so all App Service Certificates are also affected by this change.

### How is my certificate affected? <a name="how-is-my-cert-affected"></a>

The new 397 day limit will affect the expiration date of your newly issued certificate if it is renewed more than a month before the expiration date. App Service Certificates previously auto-renewed 60 days before expiration, but to avoid confusion with changing expiration dates due to this new policy certificates will now auto-renew 30 days before expiration. To better explain the outcome, refer to the chart below:

| Renewed Certificate Validity | |  Time Before Expiration for Renewal | | Total Time Validity for Renewed Certificate | Meets New 13 Month Validity Policy? | Result |
| --- | :--: | --- | :---: | --- | --- | --- |
| 1 year (12 months) of validity | + | 2 months before expiration | = | 14 months | No | Renewed certificate expiration will appear ~1 month shorter (refer to [getting a certificate with "shorter" expiration]()) |
| 1 year (12 months) of validity | + | 1 month before expiration | = | 13 months | Yes | Renewed certificate expiration will be the same (might expect ~1 day off) |

You can still manually renew your certificate up to 60 days before expiration. We are keeping this option open in case you need to renew your certificate earlier, but be aware that the 13-month validity policy will still apply. Refer to [getting a certificate with "shorter" expiration]() section of the article for more information.

### Getting a certificate with "shorter" expiration

If your certificate is affected by the 13-month validity policy change and have been issued a certificate with a "shorter" expiration, we will not forego the remaining time on the certificate.

There will be a "subscription" policy put in place for your certificate should your renewed certificate have an "shorter" expiration date. Meaning, we will keep a record of the "original" expiration of your certificate and will issue another certificate 30 days before the new "shorter" expiration that will expire until your "orginal" expiration date. If you have auto-renew on, we will just extend the "original" expiration by another year. Refer to the chart below:

### Why change auto-renew from 60 days to 30 days before expiration?

We are changing auto-renew policy to start 30 days before expiration to avoid any confusion with a "shorter" expiration date of your renewed certificate if auto-renew happens 60 days before the expiration. Refer to [how is my certificate affected](#how-is-my-cert-affected) section in this article.
