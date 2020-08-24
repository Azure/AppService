---
title: "A/B Testing with App Service, Part 2: Server-side configuration"
author_name: "Jason Freeberg and Shubham Dhond"
category: deployment
tags: 
  - A/B Testing
toc: true
toc_sticky: true
comments: true
---

This is the second article in our guide for A/B testing with App Service. See [the first article](https://azure.github.io/AppService/2020/08/03/ab_testing_app_service.html) for more information about A/B testing and how to set up your client-side project Share your thoughts in the [comments section](#disqus_thread)).

## Add the slot name

First, you will need to add the name of the slot as an app setting. For example, if you have a slot named staging, create an app setting named `SLOT_NAME` and set its value to `staging`. If you have a slot named dev, create an app setting named `SLOT_NAME` with a value of `dev`. In the next section, the telemetry initializer will use this app setting to tag the outgoing telemetry. 

For example, here is an Azure CLI command to set the app setting and value for a slot named "staging" on a webapp named "my-webapp" in a resource group called "my-resource-group".

```bash
az webapp config --name my-webapp -g my-resource-group -slot staging --settings SLOT_NAME=staging
```

## Configure your project

Like in the first article, you will need to add a telemetry initializer to your project and register it with the Application Insights SDK. The telemetry initializer will tag all outgoing events and metrics with the slot's name, so you can split and filter the data during analysis later. In some cases, you will need to register the initializer with the App Insights SDK. Instructions are below for common backend languages; please jump to the section for your language.

### .NET

For **.NET Core** apps, follow the [instructions shown here](https://docs.microsoft.com/azure/azure-monitor/app/asp-net-core) to add App Insights to your project. if you are using ASP.NET, follow these [instructions instead](https://docs.microsoft.com/azure/azure-monitor/app/asp-net). Once you have added the SDK, copy and paste the custom telemetry initializer below.

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


> For more information, see the Application Insights documentation for [.NET Core](https://docs.microsoft.com/azure/azure-monitor/app/asp-net-core) and [ASP.NET](https://docs.microsoft.com/azure/azure-monitor/app/asp-net)

### Java

#### Spring

1. Add the Spring Starter for Application Insights to the dependencies of your pom.xml.

    ```xml
    <dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>applicationinsights-spring-boot-starter</artifactId>
        <version>1.1.1</version>
    </dependency>
    ```

2. Create a new class and paste the following definition. The `initialize()` method will retrieve the name of the current slot from the app setting and attach it to the outgoing telemetry. If you are not using Lombok, you can remove the import and log statement for Lombok.

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

#### Other frameworks 

For other Java frameworks you can install the core SDK, coordinates shown below. Once the SDK is added to your dependency list, create an `ApplicationInsights.xml` file in your app's classpath. Copy the file contents from [here](https://docs.microsoft.com/azure-monitor/app/java-get-started?tabs=maven#add-an-applicationinsightsxml-file).

1. Add the Application Insights SDK to the dependencies of your pom.xml.

    ```xml
    <dependency>
        <groupId>com.microsoft.azure</groupId>
        <artifactId>applicationinsights-web-auto</artifactId>
        <version>2.5.0</version>
    </dependency>
    ```

1. Create an `ApplicationInsights.xml` file in your app's classpath. Copy the file contents from [here](https://docs.microsoft.com/azure-monitor/app/java-get-started?tabs=maven#add-an-applicationinsightsxml-file).

1. Create a new class and paste the following definition. The `initialize()` method will retrieve the name of the current slot from the app setting and attach it to the outgoing telemetry. If you are not using Lombok, you can remove the import and log statement for Lombok.

    ```java
    import com.microsoft.applicationinsights.extensibility.TelemetryInitializer;
    import com.microsoft.applicationinsights.telemetry.Telemetry;
    import lombok.extern.slf4j.Slf4j;

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

1. Register the telemetry initializer with the App Insights SDK by adding the following line to your ApplicationInsights.xml file. Replace the example package name with your project's package name.

    ```xml
    <TelemetryInitializers>
      ...
      <Add type="org.example.package.CustomTelemetryInitializer"/>
    </TelemetryInitializers>
    ```

> For more information, see the Application Insights documentation for [Java](https://docs.microsoft.com/azure/azure-monitor/app/java-get-started) and [Spring](https://docs.microsoft.com/azure/developer/java/spring-framework/configure-spring-boot-java-applicationinsights).

### Node

1. Install the App Insights package.

    ```bash
    npm install applicationinsights --save
    ```

1. Create a telemetry initializer, just like in the other examples.

    ```js
    var tagSlotName = (envelope) => {
      const SLOT_ENV_VAR = "SLOT_NAME";
      let slot = process.env[SLOT_ENV_VAR];
      if (slot != null) {
        envelope.data[SLOT_ENV_VAR] = slot;
      }
    };
    ```

1. Import the package, then register the telemetry initializer as shown below.

    ```js
    let appInsights = require('applicationinsights');
    appInsights.addTelemetryInitializer(tagSlotName);
    ```

> For more information, see the [App Insights documentation for Node.js](https://docs.microsoft.com/azure/azure-monitor/app/nodejs)

### Python

Please refer to the [Python documentation for Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/opencensus-python) for instructions on installation and configuration. Once App Insights is added to your Python app, you can tag the outgoing telemetry with the slot name using the [OpenCensus Python telemetry processors](https://docs.microsoft.com/azure/azure-monitor/app/api-filtering-sampling#opencensus-python-telemetry-processors).

## Summary

In this article you added Application Insights and a custom telemetry initializer to your backend project. The custom initializer reads the slot name from the app setting and tags all outgoing telemetry with it. This process is similar to the process in the [first article](https://azure.github.io/AppService/2020/08/03/ab_testing_app_service.html), but applied to the server-side code. The next article will show how to split and analyze the data.
