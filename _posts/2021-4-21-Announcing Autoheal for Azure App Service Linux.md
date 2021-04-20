---
title: "Announcing Auto Heal for Azure App Service Linux apps"
author_name: "Puneet Gupta"
---

We are happy to announce the availability of Auto Heal feature for Azure **App Service Linux apps**. AutoHeal enables app developers to mitigate their apps when an app runs in to unexpected behaviors like HTTP server errors, slowness etc. You can configure different triggers based on your need and choose to recycle the app to mitigate it from a bad state. This functionality has been a part of [Azure App Service Windows](https://azure.github.io/AppService/2018/09/10/Announcing-the-New-Auto-Healing-Experience-in-App-Service-Diagnostics.html) for quite some time and today we are happy to announce the availability for apps running on the Linux stack.

For your Linux app, Click **Diagnostic Tools** from **Diagnose and Solve problems** blade for your app and choose the **Auto-Heal** tile.

 ![Auto-Heal Azure App Service Linux]({{ site.baseurl }}/media/2021/04/AutoHeal-Linux.png)

Auto Heal for Linux supports the following triggers:

+ **Request Duration** - This trigger can help you mitigate a hung app. You can even specify the mitigation to kick in if specific URLs take longer than the expected duration.
![Auto-Heal request duration rule]({{ site.baseurl }}/media/2021/04/AutoHeal-Request Duration.png)

+ **Request Count** - If you want to recycle your container after a fixed number of requests, you can configure the request count rule.

+ **Status Codes** - If the app starts failing unexpectedly, this trigger can help you recover it by restarting the container. You can choose either a range of Status Codes or a single HTTP status code. The trigger also allows to specify specific request paths.
![Auto-Heal Azure App Service Linux]({{ site.baseurl }}/media/2021/04/AutoHeal-StatusCodes.png)

> Note :- The only supported action currently is to **Recycle** the container and in future support to run more diagnostic tools will come.

Overriding the **Startup Time (optional)** - It is a good practice to speficy a startup time greater than the average startup time for your app. By modifying the startup time, you can specify how much time the mitigation rule should wait after the container startup before the mitigation rule kicks off.

Once the rules are configured, you can review them to make sure they are configured correctly and hit the **Save button**.

 ![Auto-Heal rule summary]({{ site.baseurl }}/media/2021/04/AutoHeal-Summary.png)

 Get ahead of your issues and automatically mitigate these unexpected behaviors by trying out Mitigate and Auto Heal in App Service Diagnostics.
