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
