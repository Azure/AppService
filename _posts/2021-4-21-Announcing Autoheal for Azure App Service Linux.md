---
title: "Announcing Auto Heal for Linux"
author_name: "Puneet Gupta"
toc: true
toc_sticky: true
---

We are happy to announce the availability of Auto Heal feature for Linux apps on Azure App Service. Auto Heal allows you to mitigate your apps when it runs into unexpected situations like HTTP server errors, resource exhaustion, etc. You can configure different triggers based on your need and choose to recycle the app to recover it from a bad state. This functionality has been a part of [Azure App Service Windows](https://azure.github.io/AppService/2018/09/10/Announcing-the-New-Auto-Healing-Experience-in-App-Service-Diagnostics.html) for quite some time and today we are happy to announce the availability for apps running on the Linux stack.

## Enabling Auto Heal in the Portal

On your Linux app, click **Diagnose and Solve problems** > **Diagnostic Tools** > **Auto-Heal**.

![Auto-Heal Azure App Service Linux]({{ site.baseurl }}/media/2021/04/AutoHeal-Linux.png)

## Supported Triggers

Auto Heal for Linux supports the following triggers:

- **Request Duration** - This trigger can help you mitigate an app that is slow to respond to requests. You can even specify the mitigation to kick in if specific URLs take longer than the expected duration.
 
    ![Auto-Heal request duration rule]({{ site.baseurl }}/media/2021/04/AutoHeal-Request Duration.png)

- **Request Count** - If you want to recycle your container after a fixed number of requests, you can configure the request count rule.

- **Status Codes** - If the app starts failing unexpectedly, this trigger can help you recover it by restarting the container. You can choose either a range of status codes or a single HTTP status code. The trigger also allows you to specify specific request paths.

    ![Auto-Heal Azure App Service Linux]({{ site.baseurl }}/media/2021/04/AutoHeal-StatusCodes.png)

> **Note**: The only supported action is to **Recycle** the container. More actions will be supported in the future.

## Finalize Configuration

Overriding the **Startup Time (optional)** - It is a good practice to specify a startup time greater than the average startup time for your app. By modifying the startup time, you can specify how much time the mitigation rule should wait after the container startup before the mitigation rule triggers again.

Once the rules are configured, review them to ensure they are configured correctly and click the **Save** button.

 ![Auto-Heal rule summary]({{ site.baseurl }}/media/2021/04/AutoHeal-Summary.png)

Get ahead of your app's issues and automatically mitigate these unexpected behaviors with Auto Heal in App Service Diagnostics.
