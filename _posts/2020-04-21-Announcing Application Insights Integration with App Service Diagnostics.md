---
title: "Announcing Application Insights Integration with App Service Diagnostics"
author_name: "Puneet Gupta"
tags:
    - diagnostics
    - troubleshooting
    - self-help
---

App Services Diagnostics is a powerful tool that allows you to troubleshoot and mitigate issues within your application. The rich set of tools under the App Services Diagnostics carefully analyze all the telemetry emitted by App Services platform and suggests recommendations and troubleshooting steps that help in keeping your apps up and healthy. We are happy to announce that **App Services Diagnostics has now deeper and better integration with Application Insights**. With the click of a button, you can connect an Application Insights resource with App Service diagnostics and bring the best of both worlds in one place, allowing you to troubleshoot and debug your applications easily and more effectively. With the rich information about the platform and application telemetry combined together, you a presented with a streamlined view of the issues encountered and this enables you to identify problems easily.  Shall you open a support case with Microsoft and consent to share diagnostics, this will also enable Microsoft support engineers to review the information from both the platform & App Insights to help you swiftly resolve your incident.

## How to Enable Application Insights Integration with App Service Diagnostics

Enabling Application insights integration is as easy as clicking a button in App Services Diagnostics. To enable this feature, visit the **Diagnose and Solve** blade for your app and choose **Availability and Performance**.

![Landing Page]({{site.baseurl}}/media/2020/04/AppServiceDiagnostics-LandingPage.png)

If Application Insights is not integrated for your app already, you will see an option to Enable Application Insights right from this view.

![Enable Application Insights]({{site.baseurl}}/media/2020/04/AppServiceDiagnostics-EnableAIIntegration.png)

And if Application Insights is already enabled, then you will get an option to Connect it with App Services Diagnostics.

![Connect with Application Insights]({{site.baseurl}}/media/2020/04/AppServiceDiagnostics-ConnectAIwithASD.png)

Clicking Connect, connects the Application Insights resource for the App to App Service Diagnostics and allows you to view the Exceptions and dependency information for the app within App Service Diagnostics. At the same time, any engineers engaged with you from Microsoft Support are enabled to leverage this information, provided you have given consent to share diagnostics information while creating a Support case.

![Application Insights Connected]({{site.baseurl}}/media/2020/04/AppServiceDiagnostics-AfterAIIntegration.png)

## What to expect after enabling Application Insights Integration

After enabling App Insights Integration feature, App Service Diagnostics starts leveraging App Insights telemetry and points you to exceptions and dependency slowness information in different views that you typically use to diagnose issues. Here is an example of the HTTP Server Errors view changes with Application Insights information.

![Application Insights Detector View]({{site.baseurl}}/media/2020/04/AppServiceDiagnostics-DetectorView.png)

And drilling down into the HTTP Server Errors view, you can find all details about the failed requests corresponding to the Exceptions in the same view.  As you can see below, the table shows you the exception information, exception message and even the Method in the code that was responsible for causing the exception. With the help of this integration, you can not only view the platform issues but also correlate any application issues that caused availability drops to the app.

![Exceptions from Application Insights]({{site.baseurl}}/media/2020/04/AppServiceDiagnostics-ExceptionsView.png)

## What happens after you Integrate Application Insights with App Service Diagnostics

When you click Connect, an *API* key for your Application Insights is generated with ReadOnly access to the telemetry and this *API key* along with the *AppId* for the Application Insights resource get stored as a hidden tag in ARM at the Azure App Service app level. At the App Insights Resource level, you may see something like this.

![Application Insights API Access]({{site.baseurl}}/media/2020/04/AppServiceDiagnostics-APIKey.png)

On the App Services side, you should see a new tag created at the app level with the name **hidden-related:diagnostics/applicationInsightsSettings**. You can view this tag by going to Azure Resource Explorer ([https://resources.azure.com](https://resources.azure.com)). The *AppId* is stored as is, but the API Key is encrypted using an internal key, so it is kept protected and not left as clear text.

Using this information, App Services Diagnostics can query the Application Insights resource and is able to merge both the experiences together. For Microsoft support and engineering teams, an equivalent internal tool is available and engineers and engineering teams assisting you on your incidents opened with Microsoft can access this information in similar unified troubleshooting experience.

## How to disable App Insights Integration

We are working on a user interface that allows you to disable this feature easily under **Diagnose and Solve problems**. Till then, you can use a PowerShell Script example like this to simple disable the AppInsights integration feature.

```powershell
Login-AzureRmAccount
$subId = "<Azure_Subscription_ID>"
$rg ="<ResourceGroupName>"
$appName = "AppName"
$resourceId = "/subscriptions/$subId/resourceGroups/$rg/providers/Microsoft.Web/sites/$appName"
$webApp = Get-AzureRmResource -ResourceId $resourceId
$updatedTags = @{}

foreach($t in $webApp.Tags.GetEnumerator())
{
    if ($t.Key -ne "hidden-related:diagnostics/applicationInsightsSettings")
    {
        $updatedTags.Add($t.Key, $t.Value)
    }
}

Set-AzureRmResource -ResourceId $resourceId -Tag $updatedTags
```

## What's Next

So, what are you waiting for ! Integrate your application with Application Insights and leverage Application Insights integration feature in our diagnostics to get the unified experience that brings the best of both worlds. We just want to close by sharing some articles around Application Insights.

+ [What is Application Insights?](https://docs.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)
+ [Monitor Azure App Service performance](https://docs.microsoft.com/en-us/azure/azure-monitor/app/azure-web-apps?tabs=net)

For more information on App Service Diagnostics, please visit [Azure App Service diagnostics overview](https://docs.microsoft.com/azure/app-service/overview-diagnostics).

Feel free to share your feedback or questions about **App Service Diagnostics** by emailing [diagnostics@microsoft.com](mailto:diagnostics@microsoft.com) or posting on [UserVoice](https://feedback.azure.com/forums/169385-web-apps​​​​​​​​​​​​​​) with "[Diag]" in the title.
