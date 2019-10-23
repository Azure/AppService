---
title: FAQ  SSL certificates for Web Apps and  App Service Certificates
author_name: 
layout: post
hide_excerpt: true
---
<html><head>
<meta charset="utf-8"/>
</head>
<body>
<div id="page">

<a class="url fn n profile-usercard-hover" href="https://social.msdn.microsoft.com/profile/mksunitha" target="_blank">mksunitha</a>
<time>    7/24/2017 11:06:00 PM</time>
<hr/>
<div id="content">Here is a list of commonly asked questions for App Service Certificates.
<h4 id="how-do-i-purchase-and-configure-a-new-ssl-certificate-in-azure-for-my-web-app"><strong>How do I purchase and configure a new SSL certificate in Azure for my web app?</strong></h4>
<p class="lf-text-block lf-block">To learn how to purchase and set up an SSL certificate for your App Service web app, see<span> </span><a href="https://docs.microsoft.com/en-us/azure/app-service-web/web-sites-purchase-ssl-web-site">Add an SSL certificate to your App Service app</a>.</p>
<h4><strong>I am unable to purchase an SSL certificate or App Service certificate ?</strong></h4>
This could be caused due to one of the following reasons:
<ul>
<li>App Service plan is Free or Shared pricing plans. We do not support SSL for these pricing tiers.</li>
<li>Subscription does not have a valid credit card</li>
<li>Subscription offer does not support purchase an App Service certificate such as Microsoft Student offer</li>
<li>Subscription has hit the maximum limit of purchases allowed on a subscription</li>
<li>App Service certificate was marked as fraud. You will see this error “<em>Your certificate has been flagged for possible fraud. The request is currently under review. If the certificate does not become usable within 24 hours”</em></li>
</ul>
<div id="purchase-issue-resolve"></div>
Try any of these solutions based on the cause
<ul>
<li>Upgrade App Service plan to Standard Pricing tier for Web App</li>
<li>Add a valid credit card to your subscription if you don’t have one</li>
<li>If you are using Microsoft Student subscription or other Azure subscriptions where App Service certificate is not supported, please upgrade your subscription</li>
<li>App Service Certificates has a limit of 10 certificate purchases for Pay-As-Go and EA subscriptions types and for other subscription types the limit is 3. To increase the limit Kindly share the following details with us if you want to increase the purchase limit on your subscription for certificates:
<ul>
<li>Please articulate the business reason for increasing the purchase limit on your subscription.</li>
<li>Monthly spending cap on this subscription if any</li>
<li>Does the subscription have a valid credit card associated with the subscription</li>
</ul>
</li>
</ul>
We shall review and evaluate your business needs internally to either approve or reject your request provided there are no other constraints to meet these needs for you.
<ul>
<li>If the certificate is marked as Fraud and has not been resolved after 24 hours , then follow the steps below :
<ul>
<li>Go to App Service certificate in Azure portal</li>
<li>Click on Certificate Configuration -&gt; Step 2 : Verify -&gt; Domain Verification</li>
<li>Click on <strong>Email Instructions</strong> which will send an email to GoDaddy to resolve the issue</li>
</ul>
</li>
</ul>
<h4 id="renew">When does my certificate get renewed?</h4>
App Service certificates are valid for one year. If Auto Renew is on for an ASC then it will be renewed automatically before it expires and just like ReKey operation, the linked App Service Apps will be moved to the new certificate. You can change this setting by clicking on ‘Auto Renew Settings’ which is on by default. You can also manually renew a certificate by clicking on Manual Renew irrespective of the current Auto Renew setting if the certificate expiration is within 90 days.
<h4 id="rekeyandsync">How can I Rekey and/or ReSync my app service certificate?</h4>
In order to stay compliant, many web companies need to rotate their certificates periodically. Also if a customer believes that his certificate has been compromised then he should rotate the certificate as soon as possible to minimize likelihood of the stolen certificate being used for malicious purposes. Traditionally, this requires obtaining a new certificate from the CA which is as complicated as buying a new one. Once a new certificate is created, you need to update all App Service Apps one by one manually. With ASC, we support one click ReKey. ASC allows you to ReKey a certificate unlimited number of times during its lifetime for free.

<strong> Using Rekey and Sync option in the portal :</strong> This blade displays the current sync state. You can see the thumbprint of ASC along with the thumbprints of all App Service linked certificates. When these certificates are in sync, all thumbprints will match and when they are out of sync, one or more linked certificate thumbprints will be different from the ASC thumbprint. <span>In order to rotate the certificate, click <strong>ReKey</strong> at the top. The ASC status will move to Rekey Certificate which may take 5-10 minutes. You dont have to click on Sync since a background task runs every 8 hours to sync the changes in the certificate. To force a sync , you can click on the <strong>Sync </strong> button . </span>
<img alt="App Service Certificate ReKey and Sync" src="https://azurecomcdn.azureedge.net/mediahandler/acomblog/media/Default/blog/fcccd343-1b0e-4e9e-8a3b-25073cf79e3b.png"/>
<h4 id="https-fails"><strong>I see certificate errors shown when enforcing HTTPS?</strong></h4>
<p class="lf-text-block lf-block">If your web app gives you certificate validation errors, it could be due to :</p>
<ul>
<li class="lf-text-block lf-block"><strong>Using a self-signed certificate</strong> :  In this case avoid using Self signed certificate since we cannot verify the domain ownership . This is not supported with Azure web apps</li>
<li><strong>Missing intermediate certificates when you export your certificate to the PFX file : </strong>In this case , recreate the PFX file and follow guidance <a href="https://technet.microsoft.com/en-us/library/dd261744.aspx">here</a> to make sure intermediate certiificates are also included when exporting it in PFX format.</li>
<li><strong>Domain host name is not added to the Web app: </strong> Please add the domain hostname to your web app as per instructions <a href="https://docs.microsoft.com/en-us/azure/app-service/app-service-web-tutorial-custom-domain">here</a></li>
<li><strong>If using App Service certificate domain verification is not completed : </strong> In this case , your certificate is not ready to be used. Please complete domain verification step as described <a href="https://docs.microsoft.com/en-us/azure/app-service/web-sites-purchase-ssl-web-site#step-4---
verify-the-domain-ownership">here