---
title: "Azure Functions now has direct integration with Application Insights"
author_name: Donna Malayeri
layout: post
hide_excerpt: true
---
      [Donna Malayeri](https://social.msdn.microsoft.com/profile/Donna Malayeri)  4/6/2017 12:56:15 PM  Today we're encouraging everyone to go give Azure Functions' Application Insights integration a try. You can find full instructions and notes on how it works at <https://aka.ms/func-ai>. Now it takes (nearly) zero effort to add Application Insights to your Azure Functions and immediately unlock a powerful tool for monitoring your applications. Application Insights is now available for all Functions users on "~1". If you're on "beta" now, please switch back to "~1" which has the latest version. If you stay on "beta", it's very likely you'll be broken by something at some point. Getting Started
---------------

 It’s fairly simple to get started – there is just two steps.  2. Create an Application Insights instance. 
	 2. Application type should be set to General
	 4. Grab the instrumentation key
	  
 4. Update your Function App’s settings 
	 2. Add App Setting – APPINSIGHTS\_INSTRUMENTATIONKEY = {Instrumentation Key}
	  
  Once you’ve done this, your App should start automatically sending information on your Function App to Application Insights, without any code changes. Using Application Insights to the fullest
-----------------------------------------

 Now that your Function Apps are hooked up to Application Insights, let's take a quick look at some of the key things you'll want to try. ### Live Stream

 If you open your Application Insights resource in the portal, you should see the option for [“Live Metrics Stream”](https://docs.microsoft.com/en-us/azure/application-insights/app-insights-live-stream) in the menu. Click on it and you’ll see a near-live view of what’s coming from your Function App. For executions, it has info on #/second, average duration, and failures/second. It also has information on resource consumption. You can pivot all of these by the “instance” your functions are on; providing you insight on whether a specific instance might be having an issue or all of your Functions. [![Live stream graphs]({{ site.baseurl }}/media/2017/04/2017-04-06_09h28_07-1024x788.png)]({{ site.baseurl }}/media/2017/04/2017-04-06_09h28_07.png) ### Analytics

 The [analytics portal](https://docs.microsoft.com/en-us/azure/application-insights/app-insights-analytics) provides you the ability to write custom queries against your data. This is one of the most powerful tools in your tool box. Currently, the following tables are full of data from the Functions runtime:  - Requests – one of these is logged for each execution
 - Exceptions – tracks any exceptions thrown by the runtime
 - Traces – any traces written to context.log or ILogger show up here
 - PerformanceMetrics – Auto collected info about the performance of the servers the functions are running on
 - CustomEvents – Custom events from your functions and anything that the host sees that may or may not be tied to a specific request
 - CustomMetrics – Custom metrics from your functions and general performance and throughput info on your Functions. This is very helpful for high throughput scenarios where you might not capture every request message to save costs, but you still want a full picture of your throughput/etc. as the host will attempt to aggregate these client side, before sending to Application Insights
  The other tables are from availability tests and client/browser telemetry, which you can also add. The only thing that’s currently missing is dependencies. There is also more metrics/events we’ll add over the course of the preview (based off your generous feedback on what you need to see). Example: This will show us the median, p95, and p99 over the last 30 minutes graphed in a timeplot.  While you can copy+paste this query, I'd recommend trying to type it out yourself to get a sense of the amazing intellisense features that the editor has. You can learn about all the language features with some amazing examples from the [Analytics reference page](https://docs.microsoft.com/en-us/azure/application-insights/app-insights-analytics-reference). You can also pin these graphs to your dashboard, which makes for a really powerful tool for having a way to know how your application is behaving at a glance. [![Highlighting the pin to dashboard]({{ site.baseurl }}/media/2017/04/2017-04-06_09h31_17-1024x518.png)]({{ site.baseurl }}/media/2017/04/2017-04-06_09h31_17.png) ### Alerts

 While it's great that I can see what's happening and what happened, what's even better is being told what's happening. That's where alerts come into play. From the main Application Insights blade, you can click on the alerts section and define alerts based on a variety of metrics. For example, you could have an alert fire when you've had more than 5 errors in 5 minutes, which sends you an email. You can then create another one which detects more than 50 errors in 5 minutes, and triggers a Logic App to send you a text message or PagerDuty alert. Next steps
----------

 Application Insights is now GA'd and ready for production workloads. We're also listening for any feedback you have. Please file it on our [GitHub](https://github.com/Azure/azure-webjobs-sdk-script/issues/new). We'll be adding some new features like better sampling controls and automatic dependency tracking soon. We hope you'll give it a try and start to gain more insight into how your Functions are behaving. You can read more about how it works at [docs.microsoft.com](https://docs.microsoft.com/en-us/azure/azure-functions/functions-monitoring)     