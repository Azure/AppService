---
title: "Intro to Microsoft Defender for App Service"
author_name: "Jordan Selig"
toc: true
---

If you're an Azure portal user with App Service, you've most likely seen the **Security** item in the left-hand menu. This item comes from our partners from the recently re-branded [Microsoft Defender for Cloud](https://docs.microsoft.com/azure/defender-for-cloud/defender-for-cloud-introduction). If you aren't familiar with Microsoft Defender for Cloud (formerly Azure Security Center and Azure Defender), it's a tool for security posture management and threat protection. It aggregates compliance data and continually assesses your environments to give you a summary view of your security posture and allow you to streamline security management not just for your resources in Azure, but also for your resources and environments on-premises as well as in other cloud platforms (Defender for Cloud currently supports integration with AWS and GCP). For more information about Microsoft Defender for Cloud, check out the [documentation](https://docs.microsoft.com/azure/defender-for-cloud/defender-for-cloud-introduction).

![App Service Security blade]({{site.baseurl}}/media/2022/04/AppServiceSecurityBlade.png)

## Microsoft Defender for App Service

### Without enhanced security features (Free)

Microsoft Defender for Cloud is offered in two modes. Without enhanced security features (Free) is enabled for free on all your Azure subscriptions when you visit the workload protection dashboard in the Azure portal for the first time, or if enabled programmatically via API. The free version will not be enabled until you complete one of those actions. Using the free mode provides the secure score and its related features: security policy, continuous security assessment, and actionable security recommendations to help you protect your Azure resources. The below screenshot is a sample of what the free version gives you. As you can see on the left-hand side, there are a number of features that aren't selectable since they aren't available with the free version. However, even though they are not selectable from the TOC, you can access the Regulatory Compliance and Inventor blades by clicking on the respective widgets in the dashboard.

![Defender for Cloud without enhanced security features]({{site.baseurl}}/media/2022/04/DefenderFreeMode.png)

The free mode gives you access to your compliance status based on the [Azure Security Benchmark](https://docs.microsoft.com/security/benchmark/azure/). For example, the Azure Security Baseline states that [sensitive data should be encrypted in transit](https://docs.microsoft.com/security/benchmark/azure/security-controls-v3-data-protection#dp-3-encrypt-sensitive-data-in-transit). The below screenshot shows where this control, specifically for App Service, shows up in the Defender for Cloud compliance dashboard. The Azure Security Baseline includes standards for services other than App Service as well to give you full compliance status of your account. To track compliance with other standards, you'll need to enable the enhanced security features.

![Defender for Cloud compliance sample]({{site.baseurl}}/media/2022/04/DefenderFreeModeComplianceSample.png)

From the compliance dashboard in Defender, you'll see exactly which benchmarks your environment fails to meet. Selecting one of the controls will show you which resources are failing the compliance check as well as in many cases give you a "Quick Fix" to make your resources compliant.

Heading back to the **Security** blade for your App Service, after enabling Defender, and therefore the Azure Security Benchmark, under Recommendations, you'll now see the App Service specific controls from the Azure Security Benchmark where your app fails to be compliant. If you don't see any recommendations, your app is either fully compliant with the Azure Security Benchmark or you haven't given the platform enough time to complete its assessment and update the portal (this can take potentially up to 24 hours). You'll additionally see a severity recommendation for each control based on the priority the Azure Security Benchmark, which gives you a good sense of which controls you should most likely enable. Note that if you have enabled any custom policies in Azure Policy based off of the controls associated with the Azure Security Benchmark, they won't show up in the Recommendations or in the Defender compliance dashboard. At this time, only "built-in" policies are supported. Additionally, you won't see any alerts under "Security incidents and alerts" in the Security blade since that is a not a feature of the free version.

![App Service Security blade sample]({{site.baseurl}}/media/2022/04/AppServiceSecurityBladeFull.png)  

### With enhanced security features

Defender for Cloud with all enhanced security features extends the capabilities of the free mode and allows you to include workloads running in private and other public clouds, providing unified security management and threat protection across your hybrid cloud workloads. For more information on the two modes, see the [enhanced security features documentation](https://docs.microsoft.com/azure/defender-for-cloud/enhanced-security-features-overview).

If you choose to use the enhanced security features, Defender for Cloud offers specific plans dedicated to various Azure services including one for App Service called [Microsoft Defender for App Service](https://docs.microsoft.com/azure/defender-for-cloud/defender-for-app-service-introduction). In addition to the benefits you get from the enhanced security features, enabling Defender for App Service increases your security posture by assessing the resources covered by your App Service plan and generating security recommendations based on its findings. It also monitors the underlying logs and infrastructure that customers don't typically have access to since App Service is a fully managed platform. To learn more about the benefits of Defender for App Service, see [protecting your web apps and APIs](https://docs.microsoft.com/azure/defender-for-cloud/defender-for-app-service-introduction).

## Things to consider

If the built-in policies that make up the Azure Security Benchmark and other compliance standards don't meet your compliance standards, you can [create custom policies in Azure Policy](https://docs.microsoft.com/azure/governance/policy/tutorials/create-custom-policy-definition). Custom policies however will not show up under the recommendations in the Security blade and in your Defender compliance dashboard.

Defender for App Service costs $15/month per instance. If cost is a limiting factor for you, take this into consideration when enabling the enhanced security features. Defender gives you the ability to select which resources you want to be in scope and therefore charged for, which can help you reduce costs as needed. If you don't enable Defender for App Service, you can still use the free version and have access to compliance against the Azure Security Benchmark.

If you choose to not enable the enhanced security features, that doesn't mean your App Service isn't secure or that you don't have options to secure your apps. App Service as well as Azure have a number of built-in features and services that you can leverage to lock down and protect your apps based on your requirements. To learn more about App Service security, start with the [security recommendations for App Service](https://docs.microsoft.com/azure/app-service/security-recommendations).
