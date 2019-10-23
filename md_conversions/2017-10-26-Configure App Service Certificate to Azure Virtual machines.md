---
title: Configure App Service Certificate to Azure Virtual machines
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
<time>    10/26/2017 2:34:38 PM</time>
<hr/>
<div id="content"><p class="lf-text-block lf-block">App Service Certificate can be used for other Azure service and not just App Service Web App. This tutorial shows you how to secure your web app by purchasing an SSL certificate using App Service Certificates ,  securely storing it in<span> </span><a href="https://docs.microsoft.com/en-us/azure/key-vault/key-vault-whatis">Azure Key Vault</a>  , domain verification and configuring it your virtual machine . Before your begin log in to the Azure portal at<span> </span><a href="http://portal.azure.com/">https://portal.azure.com</a><span class="lf-thread-btn"></span></p>
<h2>Step 1 : Create an Azure Virtual machine with IIS web server</h2>
Create an Azure virtual machine with IIS from <a href="https://docs.microsoft.com/en-us/azure/virtual-machines/windows/tutorial-secure-web-server#create-a-virtual-machine">Azure marketplace</a> or <a href="https://docs.microsoft.com/en-us/azure/virtual-machines/windows/tutorial-secure-web-server#create-a-virtual-machine">with Azure CLI </a> .
<h2>Step 2 : Add a Custom domain to your virtual machine</h2>
Purchase a new domain and assign it your Azure virtual machine. For more details , click <a href="https://blogs.msdn.microsoft.com/appserviceteam/2017/07/31/assign-app-service-domain-to-azure-vm-or-azure-storage/">here</a> .
<h2 id="step-2---place-an-ssl-certificate-order">Step 3 : Place an SSL Certificate order</h2>
<p class="lf-text-block lf-block">You can place an SSL Certificate order by creating a new<span> </span><a href="https://portal.azure.com/#create/Microsoft.SSL">App Service Certificate</a><span> </span>In the Azure portal. Enter a friendly Name for your SSL certificate and enter the Domain Name in Step 1 . <strong>DO NOT </strong><span>append the Host name with WWW.</span></p>
<img alt="Certificate Creation" src="https://docs.microsoft.com/en-us/azure/app-service/media/app-service-web-purchase-ssl-web-site/createssl.png"/>
<h2 id="step-3---
store-the-certificate-in-azure-key-vault">Step 4 - Store the certificate in Azure Key Vault