---
title: "A/B Testing with App Service, Part 2: Backend configuration"
author_name: "Jason Freeberg, Shubham Dhond"
category: deployment
tags: 
  - A/B Testing
toc: true
toc_sticky: true
comments: true
---

This is the second article in our guide for A/B testing with App Service. See [the first article]() for more information about A/B testing and how to set up your client-side project Share your thoughts in the [comments section](#disqus_thread)).

## Add the slot name

First, you will need to add the name of the slot as an app setting. For example, if you have a slot named staging, create an app setting named `SLOT_NAME` and set its value to `staging`. If you have a slot named dev, create an app setting named `SLOT_NAME` with a value of `dev`. In the next section, the telemetry initializer will use this app setting to tag the outgoing telemetry. 

For example, here is an Azure CLI command to set the app setting and value for a slot named "staging" on a webapp named "my-webapp" in a resource group called "my-resource-group".

```bash
az webapp config --name my-webapp -g my-resource-group -slot staging --settings SLOT_NAME=staging
```

## Add the Telemetry Initializer

Like in the first article, you will need to add a telemetry initializer to your project and register it with the Application Insights SDK. The Telemetry Initializer will  tag all outgoing events and metrics with the slot's name, so you can split and filter the data during analysis later. Instructions are below for common backend languages, please jump to your language's section.

### .NET

#### .NET Core

Follow the [instructions shown here](https://docs.microsoft.com/azure/azure-monitor/app/asp-net-core) to add App Insights to your project. Once it's added to your project, add 

#### ASP.NET

```c#
using System;
using Microsoft.ApplicationInsights.Channel;
using Microsoft.ApplicationInsights.DataContracts;
using Microsoft.ApplicationInsights.Extensibility;

public class MyTelemetryInitializer : ITelemetryInitializer
{
  public void Initialize(ITelemetry telemetry)
  {
      String SLOT_ENV_VAR = "SLOT_NAME";
      var requestTelemetry = telemetry as RequestTelemetry;
      slot = Environment.GetEnvironmentVariable(SLOT_ENV_VAR);

      requestTelemetry.Properties[SLOT_ENV_VAR] = slot;
  }
}
```

### Java

#### Spring

1. Add the Spring Starter for Application Insights to your Maven pom.xml.

  ```xml
  <dependency>
    <groupId>com.microsoft.azure</groupId>
    <artifactId>applicationinsights-spring-boot-starter</artifactId>
    <version>1.1.1</version>
  </dependency>
  ```

2. Create a new class and paste the following definition. The `initialize()` method will retrieve the name of the current slot from the app setting and attach it to the outgoing telemetry. If you are not using Lombok, you can remove the import and log statement.

  ```java
  import com.microsoft.applicationinsights.extensibility.TelemetryInitializer;
  import com.microsoft.applicationinsights.telemetry.Telemetry;
  import lombok.extern.slf4j.Slf4j;
  import org.springframework.stereotype.Component;

  @Component
  @Slf4j
  public class CustomTelemetryInitializer implements TelemetryInitializer {

      /**
      * Get the slot name from the env var and attach it to the outgoing telemetry.
      * @param telemetry Outgoing telemetry
      */
      @Override
      public void initialize(Telemetry telemetry) {
          final String SLOT_ENV_VAR = "SLOT_NAME";
          final String slot = System.getenv(SLOT_ENV_VAR);
          if (slot != null) {
              log.info("Tagging telemetry with slot name: "+slot);
              telemetry.getProperties().put(SLOT_ENV_VAR, slot);
          }
      }
  }
  ```

### Other frameworks 

For other Java frameworks you can install the core SDK, coordinates shown below. Once the SDK is added to your dependency list, create an `ApplicationInsights.xml` file in your app's classpath. Copy the file contents from [here](https://docs.microsoft.com/en-us/azure-monitor/app/java-get-started?tabs=maven#add-an-applicationinsightsxml-file).

```xml
<dependency>
  <groupId>com.microsoft.azure</groupId>
  <artifactId>applicationinsights-web-auto</artifactId>
  <version>2.5.0</version>
</dependency>
```

### Node

TODO: npm install

```bash
npm install what?
```

Like in the other language examples, create a telemetry initializer and register it with the Application Insights SDK.

```js
var tagSlotName = (envelope) => {
  const SLOT_ENV_VAR = "SLOT_NAME";
  let slot = process.env[SLOT_ENV_VAR];
  if (slot != null) {
    envelope.data[SLOT_ENV_VAR] = slot;
  }
};
```

Then register the telemetry initializer as shown below.

```js
appInsights.addTelemetryInitializer(tagSlotName);
```

### Other languages

## Summary

- Summary of what we did
- how to check the telemetry
- Reminder about routing traffic
- Allude to the next article about analysis 