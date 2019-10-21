---
author_name: Chris Anderson (Azure)
layout: post
hide_excerpt: true
---
      [Chris Anderson (Azure)](https://social.msdn.microsoft.com/profile/Chris Anderson (Azure))  5/10/2017 8:00:44 AM  Azure Functions support for Application Insights has moved out of limited beta and into a wider public preview. We’ve also added support to add Application Insights on create, as well as, a direct link from Azure Functions’ portal to the Application Insights blade. We’ve also added additional settings to help control what data get sent and how much to send, helping you to control the volume of data that is sent. Getting Started
===============

 To get started with Azure Functions and Azure Application Insights, you can create a new Function App and set the Application Insights toggle to “On”, which will create an Application Insights resource for you, automatically. [![create-function-app]({{ site.baseurl }}/media/2017/05/create-Function-App.png)]({{ site.baseurl }}/media/2017/05/create-Function-App.png) If you want to use add an existing Application Insights resource or you have an existing Azure Function App, you can add Application Insights by adding an App Setting with your instrumentation key.  2. Create an Application Insights instance. 
	 2. Application type should be set to General
	 4. Grab the instrumentation key
	  
 4. Update your Function App’s settings 
	 2. Add App Setting – APPINSIGHTS\_INSTRUMENTATIONKEY = {Instrumentation Key}
	  
  [![grabikey]({{ site.baseurl }}/media/2017/05/grabIKey-1024x452.png)]({{ site.baseurl }}/media/2017/05/grabIKey.png) Once you’ve done this, you can navigate to your Application Insights resource from the “Configured Features” page of your Function App. [![configuredfeatures]({{ site.baseurl }}/media/2017/05/configuredfeatures.png)]({{ site.baseurl }}/media/2017/05/configuredfeatures.png) Using Application Insights
==========================

 Live Stream
-----------

 If you open your Application Insights resource in the portal, you should see the option for “Live Metrics Stream” in the menu. Click on it and you’ll see a near-live view of what’s coming from your Function App. For executions, it has info on #/second, average duration, and failures/second. It also has information on resource consumption. You can pivot all of these by the “instance” your functions are on; providing you insight on whether a specific instance might be having an issue or all of your Functions. Known issues: there are no dependencies being tracked right now, so the middle section is mostly useless for now. If you send your own custom dependencies, it’s not likely to show up here since they won’t be going through the Live Stream API since you’re normally using a different client, today. [![livestream]({{ site.baseurl }}/media/2017/05/livestream-1024x429.png)]({{ site.baseurl }}/media/2017/05/livestream.png) Metrics Explorer
----------------

 This view gives you insights on your metrics coming from your Function App. You can add new charts for your Dashboards and set up new Alert rules from this page. Failures
--------

 This view gives you insights on which things are failing. It has pivots on “Operation” which are your Functions, Dependencies, and exception messages. Known issues: Dependencies will be blank unless you add custom dependency metrics. Performance
-----------

 Shows information on the count, latency, and more of Function executions. You can customize this pretty aggressively to make it more useful. Servers
-------

 Shows resource utilization and throughput per server. Useful for debugging Functions that might be bogging down your underlying resources. Putting the servers back in Serverless. J Analytics
---------

 The analytics portal provides you the ability to write custom queries against your data. This is one of the most powerful tools in your tool box. Currently, the following tables are full of data from the Functions runtime:  - Requests – one of these is logged for each execution
 - Exceptions – tracks any exceptions thrown by the runtime
 - Traces – any traces written to context.log or ILogger show up here
 - PerformanceMetrics – Auto collected info about the performance of the servers the functions are running on
 - CustomEvents – Custom events from your functions and anything that the host sees that may or may not be tied to a specific request
 - CustomMetrics – Custom metrics from your functions and general performance and throughput info on your Functions. This is very helpful for high throughput scenarios where you might not capture every request message to save costs, but you still want a full picture of your throughput/etc. as the host will attempt to aggregate these client side, before sending to Application Insights
  The other tables are from availability tests and client/browser telemetry, which you can also add. The only thing that’s currently missing is dependencies. There is also more metrics/events we’ll add over the course of the preview (based off your generous feedback on what you need to see). Example: This will show us the distribution of requests/worker over the last 30 minutes.  [ ![analytics]({{ site.baseurl }}/media/2017/05/analytics-1024x525.png)]({{ site.baseurl }}/media/2017/05/analytics.png) Configuring the telemetry pipeline
==================================

 We wanted to be sure you can still control what data and how much gets sent, so we’ve exposed a handful of configuration settings for your host.json which allows you to finely control how we send data. We our latest updates to the configuration, you can now control the verbosity levels of the various telemetry pieces, as well as enable and configure aggregation and sampling.  Limitations during preview
==========================

 Now that we’ve moved out of beta, we don’t have any planned breaking changes, but we’ll still consider the feature in preview from a supportability point of view. Once we’ve had a wider set of users using Application Insights and we complete some missing features like automatic dependency tracking, we’ll remove the preview flag. This means if you should avoid using our Application Insights integration for business critical applications, and instead continuing to instrument your code yourself with Application Insights.      