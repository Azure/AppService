---
title: Updates to WebJobs Portal experience
author_name: Chris Anderson (Azure)
layout: post
hide_excerpt: true
---
      [Chris Anderson (Azure)](https://social.msdn.microsoft.com/profile/Chris Anderson (Azure))  6/6/2016 11:00:26 AM  We've recently made updates to the WebJobs Portal experience in the Azure Portal designed to make it easier to set up a scheduled triggered WebJob, access the trigger URL for triggered WebJobs, and other operations like viewing your logs. Creating a scheduled WebJob
---------------------------

 [![2016-06-03_15h55_47]({{ site.baseurl }}/media/2016/06/2016-06-03_15h55_47-134x300.png)]({{ site.baseurl }}/media/2016/06/2016-06-03_15h55_47.png) As you can see in the screenshot, to create a scheduled WebJob requires 3 steps, in addition to the usual steps of naming and uploading your code.  2. Select "triggered" as the WebJob type option
 4. Select "Scheduled" as the WebJob triggers option
 6. Add a cron tab expression
  To create a scheduled WebJob in the new experience, you just provide a [cron tab expression](https://github.com/atifaziz/NCrontab/blob/master/NCrontab/CrontabSchedule.cs#L77-L92) as part of the creation of your triggered WebJob. This will add a schedule property to your setting.job file which Kudu will then use to call your WebJob. Importantly, this requires "always on" to be enabled. If you wish to have a triggered WebJob called on a schedule without "always on" being required or if the schedule you require is too complicated to be expressed as a cron tab expression, you can continue to use Azure Scheduler by choosing the "WebHook" option for "Triggers", and then providing the trigger URL to an Azure Scheduler job. This is a departure from how we previously did scheduled jobs, where we'd automatically create a Azure Scheduler job for you. We had a lot of feedback that this wasn't optimal for all scenarios, so we've moved to this new model. Updates to browse WebJobs experience
------------------------------------

 In addition to the triggered WebJobs updates, we've redone the browse experience to both bring it in line with the other browse experiences in the portal, as well as expose the trigger URL for triggered WebJobs in an easier to access way. One major experience change is that the logs, delete, and run buttons at the top of the blade correspond with the selected row. You can see this experience in the picture below. [![2016-06-03 17h11_41]({{ site.baseurl }}/media/2016/06/2016-06-03-17h11_41-300x145.gif)]({{ site.baseurl }}/media/2016/06/2016-06-03-17h11_41.gif) We're always looking for more feedback on the WebJobs experience. You can leave feedback on the WebJobs UX experience at our [feedback site](https://feedback.azure.com/forums/169385-web-apps-formerly-websites) or in the comments section down below.     