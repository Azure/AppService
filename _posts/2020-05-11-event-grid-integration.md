---
title: "App Service integration with Event Grid"
toc: true
toc_sticky: true
author_name: "Jason Freeberg, Yutang Lin"
---

We are happy to announce the Public Preview of App Service's integration with Azure Event Grid. [Event Grid](https://docs.microsoft.com/azure/event-grid/overview) is a publish/subscribe messaging service that allows you to easily build event-based architectures. Event Grid is heavily integrated into Azure services, allowing you to react to events coming from your resources.

Follow [the quickstart](#get-started) below to get started!

## Integrated Events

App Service now emits 15 distinct events to Event Grid. These events span configuration changes, slot swaps, restarts, backups, and more. If you have an idea for an event type that you would like to see added, let us know on [UserVoice](https://feedback.azure.com/forums/169385-web-apps).

|    Event Type                                             |    Description                                                     |
|-----------------------------------------------------------|--------------------------------------------------------------------|
|    `Microsoft.Web/sites.BackupOperationStarted`           |    Triggered when a [backup](https://docs.microsoft.com/azure/app-service/manage-backup) has started                             |
|    `Microsoft.Web/sites.BackupOperationCompleted`         |    Triggered when a [backup](https://docs.microsoft.com/azure/app-service/manage-backup) has completed                           |
|    `Microsoft.Web/sites.BackupOperationFailed`            |    Triggered when a [backup](https://docs.microsoft.com/azure/app-service/manage-backup) has failed                              |
|    `Microsoft.Web/sites.RestoreOperationStarted`          |    Triggered when a [restoration](https://docs.microsoft.com/azure/app-service/web-sites-restore) from a backup has started          |
|    `Microsoft.Web/sites.RestoreOperationCompleted`        |    Triggered when a [restoration](https://docs.microsoft.com/azure/app-service/web-sites-restore) from a backup has completed        |
|    `Microsoft.Web/sites.RestoreOperationFailed`           |    Triggered when a [restoration](https://docs.microsoft.com/azure/app-service/web-sites-restore) from a backup has failed           |
|    `Microsoft.Web/sites.SlotSwapStarted`                  |    Triggered when a [slot swap](https://docs.microsoft.com/azure/app-service/deploy-staging-slots) has started                       |
|    `Microsoft.Web/sites.SlotSwapCompleted`                |    Triggered when a [slot swap](https://docs.microsoft.com/azure/app-service/deploy-staging-slots) has completed                     |
|    `Microsoft.Web/sites.SlotSwapFailed`                   |    Triggered when a [slot swap](https://docs.microsoft.com/azure/app-service/deploy-staging-slots) has failed                        |
|    `Microsoft.Web/sites.SlotSwapWithPreviewStarted`       |    Triggered when a [slot swap](https://docs.microsoft.com/azure/app-service/deploy-staging-slots) with preview has started          |
|    `Microsoft.Web/sites.SlotSwapWithPreviewCancelled`     |    Triggered when a [slot swap](https://docs.microsoft.com/azure/app-service/deploy-staging-slots) with preview has been cancelled   |
|    `Microsoft.Web/sites.AppUpdated.Restarted`             |    Triggered when a site has been restarted                      |
|    `Microsoft.Web/sites.AppUpdated.Stopped`               |    Triggered when a site has been stopped                        |
|    `Microsoft.Web/sites.AppUpdated.ChangedAppSettings`    |    Triggered when a site’s app settings have changed             |
|    `Microsoft.Web/serverfarms.AppServicePlanUpdated`      |    Triggered when an App Service Plan is updated                 |

> [More information about these events](https://aka.ms/event-grid-schema-app-service).

## Get started

Event Grid is a flexible service that enables developers to architect cutting-edge, event-driven patterns. For example, you can [resize images uploaded to Azure Storage](https://docs.microsoft.com/azure/event-grid/resize-images-on-storage-blob-upload-event?tabs=dotnet), or [get an email when your VM scales up](https://docs.microsoft.com/azure/event-grid/monitor-virtual-machine-changes-event-grid-logic-app).

This quickstart will walk through how to get started with a simple event handler, but we are excited to see what you can build with the newly integrated events from App Service.

### Create a Function with an Event Grid trigger

First, create a new Azure Function with an Event Grid trigger. If you do not already have a Function App in your subscription, follow [these instructions to create a new Function App](https://docs.microsoft.com/azure/azure-functions/functions-create-function-app-portal). Once you have your Function App, browse to it in the Portal.

1. In the list of Functions, select the "**+**" to add a new Function.

1. In the following screen, filter the triggers by searching for "event grid". Select "Azure Event Grid trigger" and enter a name for the Function. Finally, click "Create".

    ![Create an evet grid triggered function]({{ site.baseurl }}/media/2020/05/event-grid/create-event-grid-triggered-function.png)

### Add the Function as an endpoint

Now that the Event Grid triggered Function is created, we will add it as a handler for events from our Azure Webapp. Navigate to one of your Azure Webapps in the Portal.

1. Select the "Events" button in the toolbar on the left side of the blade.

    ![Webapps event button]({{ site.baseurl }}/media/2020/05/event-grid/webapps-events-button.png)

1. This will open a new blade where you can register event handlers. If you have used Event Grid before with other Azure services, this blade will look familiar.

    ![Events page]({{ site.baseurl }}/media/2020/05/event-grid/events-tab.png)

1. Click "+ Event Subscription" at the top of the blade. In the following screen, enter a name for the event subscription and select "Azure Function" as the Endpoint Type. Next, click "Select an endpoint" and find your Event Grid triggered Function using the filters in the context menu. Finally, click "Create".

    ![events subscription form]({{ site.baseurl }}/media/2020/05/event-grid/events-subscription-form.png)

### Summary

You have now set up an Azure Function as an event handler for your Event Grid subscription. Whenever events are emitted from your web app, this Function will execute. Click back to the "Events" tab to see a timeline of your events.

![events timeline]({{ site.baseurl }}/media/2020/05/event-grid/events-timeline.png)

## Next steps

This quickstart covered only a sliver of Event Grid's capabilities. You can also use Logic Apps, Hybrid Connections, and web hooks as your event handlers. You can use these handlers to send yourself an email if a backup fails, send information to an on-premises resource, and much more!

If you have suggestions for events that App Service should emit, let us know on [UserVoice](https://feedback.azure.com/forums/169385-web-apps).

## Helpful links

- [Event Grid terminology](https://docs.microsoft.com/azure/event-grid/concepts)
- [Compare Azure messaging services](https://docs.microsoft.com/azure/event-grid/compare-messaging-services)
- [Azure CLI for Event Grid](https://docs.microsoft.com/azure/event-grid/cli-samples)
