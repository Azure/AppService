---
title: "Announcing new Networking Troubleshooter preview"
author_name: "Mads Damgård"
toc: true
toc_sticky: true
---

Networking in general and networking in App Service can be complex. There are many ways to configure the networking components and features to create the secure environment that matches the requirements of each specific customer. We are trying hard to create really good documentation and Azure portal experiences that guides you along the way, but something it goes wrong.

Troubleshooting networking is complex, and you often find yourself working with our support engineers to try and find the cause. It can be an NSG rule blocking access. A missing record in DNS. A subnet configured with service endpoints where this was not intended or a firewall not allowing access. The options are almost endless.

To help you resolve issues faster, our engineers have collected a large set of commonly seen issues and built them into a troubleshooting detector that can run a live test of your runtime set up and scan connections in real time.

I can detect issues such as:

* Network security groups blocking access
* Public network access blocked on dependent resource or private endpoint (DNS) misconfigured.
* Virtual network integration and routing options not configured properly.
* Connectivity failures due to SNAT issues.

The new troubleshooter is currently in preview behing a feature flag. You can try it now by opening the [Azure portal using this link](https://portal.azure.com/?websitesextension_ext=asd.NetworkTroubleshooterV2%3Dtrue#home).

If you go to the Networking page, you can get to the troubleshooter directly by clicking **Troubleshoot** in the top bar.

![Azure portal networking hub]({{site.baseurl}}/media/2025/02/open-network-troubleshooter.png)

When you open the troubleshooter, it will run a number of initial checks and give you the results. For each finding there is a description of the potential problem and usually also each access to correct the issue without leaving the page.

![Troubleshooter opening page]({{site.baseurl}}/media/2025/02/nwt-configure-settings.png)

The troubleshooter has some predefined targets that you can test against. Common endpoints like Storage, SQL and other App Service apps. You can also manually type in your endpoint. With the type in mind, it will look for specific known issues and misconfigurations know for this resource type.

In this scenarios, I am testing against a storage endpoint where public network access has been disabled, but a private endpoint has not been created.

![Troubleshooter storage test]({{site.baseurl}}/media/2025/02/nwt-storage-test.png)

Another example is my app calling a backend App Service app. I have added access restrictions to limit traffic to other resources in that region. The troubleshooter however detects that there is still something blocking access.

![Troubleshooter block app access]({{site.baseurl}}/media/2025/02/nwt-block-app-access.png)

I can easily open the restrictions page and can see that I granted access to East US instead of East Asia where my apps are deployed.

![Troubleshooter wrong region]({{site.baseurl}}/media/2025/02/nwt-block-app-access.png)

After updating the region and running the test again, the test completes successful and my app works again.

There are many other scenarios that are covered, and likely also scenarios that we are not covering yet. If you find a specific scenario that is not covered or you think that some scenario could be handled better, please provide the feedback to us by using the feedback option at the top of the page.

![Troubleshooter feedback]({{site.baseurl}}/media/2025/02/nwt-feedback.png)