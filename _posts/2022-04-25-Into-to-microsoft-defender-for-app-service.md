---
title: "Intro to Microsoft Defender for App Service"
author_name: "Jordan Selig"
toc: true
---

If you're an Azure portal user with App Service, you've most likely seen the "Security" item in the left-hand menu.

![App Service Security blade]({{site.baseurl}}/media/2022/04/AppServiceSecurityBlade.png)

This item comes from our partners from the recently re-branded [Microsoft Defender for Cloud](https://docs.microsoft.com/azure/defender-for-cloud/defender-for-cloud-introduction). If you aren't familiar with Microsoft Defender for Cloud (formerly Azure Security Center and Azure Defender), it's a tool for security posture management and threat protection. It aggregates compliance data and continually assesses your environments to give you a summary view of your security posture and allow you to streamline security management not just for your resources in Azure, but also for your resources and environments on-premises as well as in other cloud platforms (Defender for Cloud currently supports integration with AWS and GCP). For more information about Microsoft Defender for Cloud, check out the [documentation](https://docs.microsoft.com/azure/defender-for-cloud/defender-for-cloud-introduction).

## Microsoft Defender for App Service

### Without enhanced security features (Free)

Microsoft Defender for Cloud is offered in two modes. Without enhanced security features (Free) is enabled for free on all your Azure subscriptions when you visit the workload protection dashboard in the Azure portal for the first time, or if enabled programmatically via API. Using this free mode provides the secure score and its related features: security policy, continuous security assessment, and actionable security recommendations to help you protect your Azure resources.

This mode gives you access to your compliance status based on of the [Azure Security Benchmark](https://docs.microsoft.com/security/benchmark/azure/). For example, the Azure Security Baseline states that [sensitive data should be encrypted in transit](https://docs.microsoft.com/security/benchmark/azure/security-controls-v3-data-protection#dp-3-encrypt-sensitive-data-in-transit). The below screenshot shows where this control, specifically for App Service, shows up in the Defender for Cloud compliance dashboard. The Azure Security Baseline includes standards for services other than App Service as well to give you full compliance status of your account. To track compliance with other standards, you'll need to enable the enhanced security features.

![Defender for Cloud without enhanced security features]({{site.baseurl}}/media/2022/04/DefenderFreeMode.png)

![Defender for Cloud compliance sample]({{site.baseurl}}/media/2022/04/DefenderFreeModeComplianceSample.png)

### With enhanced security features

Defender for Cloud with all enhanced security features extends the capabilities of the free mode and allows you to include workloads running in private and other public clouds, providing unified security management and threat protection across your hybrid cloud workloads. For more information on the two modes, see the [enhanced security features documentation](https://docs.microsoft.com/azure/defender-for-cloud/enhanced-security-features-overview).

If you choose to use the enhanced security features, Defender for Cloud offers specific plans dedicated to various Azure services including one for App Service called [Microsoft Defender for App Service](https://docs.microsoft.com/azure/defender-for-cloud/defender-for-app-service-introduction). In addition to the benefits you get from the enhanced security features, enabling Defender for App Service increases your security posture by assessing the resources covered by your App Service plan and generating security recommendations based on its findings. It also monitors the underlying infrastructure and logs that customers don't typically have access to since App Service is a fully managed platform. To learn more about the benefits of Defender for App Service, see [protecting your web apps and APIs](https://docs.microsoft.com/azure/defender-for-cloud/defender-for-app-service-introduction).

![App Service Security blade sample]({{site.baseurl}}/media/2022/04/AppServiceSecurityBladeFull.png)

## Things to consider

The security blade for your App Service will show items under the **Recommendations** section as in the above screenshot only if **you** apply the [App Service specific Policies](https://docs.microsoft.com/azure/app-service/security-controls-policy) or compliance initiatives to your App Service **AND** have Defender for App Service enabled. If you don't do both these actions, you can still go to Microsoft Defender for Cloud in the portal and check you compliance there against the Azure Security Benchmark, but the security blade will not show any recommendations or security alerts.

Defender for App Service costs $15/month per instance. If cost is a limiting factor for you, take this into consideration when applying Defender. Defender gives you the ability to select which resources you want to be in scope and therefore charged for.

If you choose not to pay for Defender for App Service and therefore don't get any recommendations or security alerts on the **Security** blade, that doesn't mean your App Sevice isn't secure or that you don't have options to secure your apps. App Service as well as Azure have a number of built-in features and services that you can leverage to lock down and protect your apps based on your requirements. To learn more about App Service security, start with the [security recommendations for App Service](https://docs.microsoft.com/azure/app-service/security-recommendations).
