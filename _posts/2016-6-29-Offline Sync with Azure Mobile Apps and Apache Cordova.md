---
title: "Offline Sync with Azure Mobile Apps and Apache Cordova"
author_name: "Adrian Hall"
layout: single
excerpt: ""
toc: true
toc_sticky: true
---

In the past, I've introduced you to [a TodoList application](http://shellmonger.com/2016/04/04/30-days-of-zumo-v2-azure-mobile-apps-day-3-azure-ad-authentication/) built in Apache Cordova so that it is available for iOS, Android or any other platform that Apache Cordova supports. You can find the QuickStart for Apache Cordova from within the Azure Portal, and read about it within [our documentation](https://azure.microsoft.com/documentation/articles/app-service-mobile-cordova-get-started/). Recently, we released a new beta for the Azure Mobile Apps Cordova SDK that supports offline sync, which is a feature we didn't have. Underneath, the Cordova offline sync functionality uses SQLite - this means it isn't an option at this point for HTML/JS applications. We'll have to work out how to do this with IndexDB or something similar, but for now that isn't an option without a lot of custom work. Let's take a look at the differences.

## Step 1: New variables

Just like other clients, I need a local store reference and a sync context that is used to keep track of the operational aspects for synchronization:

```js
var client,        // Connection to the Azure Mobile App backend
      store,         // Sqlite store to use for offline data sync
      syncContext,   // Offline data sync context
      todoItemTable; // Reference to a table endpoint on backend
```

## Step 2: Initialization

All the initialization is done in the onDeviceReady() method. I have to set up a model so that the SQLite database is set up to match what is on the server:

```js
function onDeviceReady() {

    // Create the connection to the backend
    client = new WindowsAzure.MobileServiceClient('https://yoursite.azurewebsites.net');

    // Set up the SQLite database
    store = new WindowsAzure.MobileServiceSqliteStore();

    // Define the table schema
    store.defineTable({
        name: 'todoitem',
        columnDefinitions: {
            // sync interface
            id: 'string',
            deleted: 'boolean',
            version: 'string',
            // Now for the model
            text: 'string',
            complete: 'boolean'
        }
    }).then(function () {
        // Initialize the sync context
        syncContext = client.getSyncContext();
        syncContext.pushHandler = {
            onConflict: function (serverRecord, clientRecord, pushError) {
                window.alert('TODO: onConflict');
            },
            onError: function(pushError) {
                window.alert('TODO: onError');
            }
        };
        return syncContext.initialize(store);
    }).then(function () {
        // I can now get a reference to the table
        todoItemTable = client.getSyncTable('todoitem');

        refreshData();

        $('#add-item').submit(addItemHandler);
        $('#refresh').on('click', refreshData);
    });
}
```

There are three distinct areas here, separated by promises. The first promise defines the tables. If you are using multiple tables, you must ensure that all promises are complete before progressing to the next section. You can do this with `Promise.all()` as an example. The second section initializes the sync context. You need to define two sections for the push handler - the conflict handler and the error handler. I'll go into the details of a conflict handler at a later date, but this is definitely something you will want to spend some time thinking about. Do you want the last one in to be the winner, or the current client edition to be the winner, or do you want to prompt the user on conflicts? It's all possible. Once I have created a sync context, I can get a reference to the local SQLite database table, which is used instead of the `getTable()` call that it replaces. The rest of the code is identical - I refresh the data and add the event handlers.

## Step 3: Adjusting the Refresh

In the past, refresh was just a query to the backend. Now I need to do something a bit different. When refresh is clicked, I want to do the push/pull cycle for synchronizing the data.

```js
function refreshData() {
    updateSummaryMessage('Loading data from Azure');
    syncContext.push().then(function () {
        return syncContext.pull(new WindowsAzure.Query('todoitem'));
    }).then(function () {
        todoItemtable
            .where({ complete: false })
            .read()
            .then(createTodoItemList, handleError);
    });
}
```

Just like the initialization, the SDK uses promises to proceed asynchronously. First push (which resolves as a promise), then pull (which also resolves as a promise) and finally you do EXACTLY THE SAME THING AS BEFORE - you query the table, read the results and then build the todo list. Seriously - this bit really didn't change. That means you can add offline to your app without changing your existing code - just add the initialization and something to trigger the push/pull.

## Wrap Up

This is still a beta, which means a work-in-progress. Feel free to try it out and give us feedback. You can file issues and ideas at [our GitHub repository](https://github.com/azure/azure-mobile-apps-js-client/issues).

*Cross-posted to [my personal blog](http://wp.me/p6gQt8-2oB)*
