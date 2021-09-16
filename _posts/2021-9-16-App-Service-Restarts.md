---
title: "Web App (Windows) Restart Operations"
author_name: "Ignacio Alvarez Arenas"
category: diagnostics
toc: true
toc_sticky: true
    
---

## Overview

This document covers some common operations that can be performed in an App Service and the effects in terms of availability and restart operations. Restarts on an App Service can be triggered either manually or by configuration changes. This document describes the effects only in App Services running on Windows operating system. 

## User-Initiated Restart Operations 

From a user perspective, a restart can be initiated by using any of the following methods: 

### App Service Restart in Portal/Powershell/Azure CLI 

This action will restart all the processes in every instance where your App Service is running. This will essentially restart your application fully, therefore expect some HTTP 503 errors during the process and a possible increase of resource consumption such as CPU during the operation. If settings such as Application Initialization are applied, the application won’t be fully available until the initialization completes as expected. 

Kudu process is also restarted, so some operations can fail until the process is restarted. 

Other App Services running on the same App Service Plan will not be restarted 

### Advanced Application Restart of instance 

When restarting using the Advanced Application Restart feature in Diagnostic tools, the process of the specific instance selected will be restarted, and all the requests will be redirected to the other active instances if there were any.  If settings such as Application Initialization are applied, the application won’t be fully available until the initialization completes as expected. 


### Soft Restart 

When applying soft restart, which you can learn about here: [Web Apps - Restart](https://docs.microsoft.com/en-us/rest/api/appservice/web-apps/restart), the process will be recycled but it won’t go through a full re-load Slowness in requests can be expected. All the instances will be restarted when this operation is applied.   

## Restart of Specific App Service Plan worker node 

Restarting a specific worker node of a specific App Service Plan is possible through API. The consequences of restarting the worker node are that all those App Services running on that instance will get their processes restarted. All the other instances will remain up and running. You can learn more about this operation here: [App Service Plans - Reboot Worker](https://docs.microsoft.com/en-us/rest/api/appservice/app-service-plans/reboot-worker)


## Deployment Slots Restarts

Restarting any deployment slot won’t affect any of the other deployment slots available for the app. 

On the other hand, restarting an application could cause a possible increase in resource consumption, and depending on the application sometimes those extra resources can be high, so be aware that even though restarting a slot should not affect the other slots, resources are still shared, so it can indirectly affect the other slots if the App Service Plan does not have enough resources. 

## Swap Operations 

Swapping between slots will trigger restarts of the source and destination slots as described here: 

[Set up staging environments - Azure App Service](https://docs.microsoft.com/en-us/azure/app-service/deploy-staging-slots)

It is important to mention the use of Swap with preview. While this won’t stop the service from restarting, it will help make sure that the service is ready before the swap executes, so the swap will not be confirmed until the user confirms it, giving the opportunity to test it before swapping slots, therefore reducing downtime too. 

## Scaling Operations

Scaling out/in operations does not trigger a start or stop operation apart from the newly added instance or the instance that is going to be removed. Some slowness can be experienced in these operations on requests directed to the specific instance that is being added or removed.  

Scaling up operations will trigger a full restart of the application as it will be fully moved to new instances. This involves all the processes expected from a cold start, so operations such as Application Initialization will be triggered. Another side effect of scaling up operations is that all the App Services hosted in the specific App Service Plan will be restarted as well. As all the apps restart at the same time, it is very common that the resource usage at that time will be higher than normal. 

## Auto-Heal

App Services provides two options to Auto-Heal your application: 

-[Proactive Auto-Heal](https://azure.github.io/AppService/2017/08/17/Introducing-Proactive-Auto-Heal.html#:~:text=Proactive%20Auto%20Heal%20looks%20for,outlined%20in%20the%20chart%20below.)
-[Custom Auto-Heal](https://azure.github.io/AppService/2018/09/10/Announcing-the-New-Auto-Healing-Experience-in-App-Service-Diagnostics.html)

These two options will restart the specific instance of your application if it matches the conditions. In the case of Custom Auto-heal, it will depend on the custom action that has been selected to be triggered, as some actions don’t really recycle the process. The restart applied will be a full restart cycle, so operations as Application Initialization will be expected. If the App Service only has one instance, 503 errors could be expected as well. 

Enabling/Disabling Auto-Heal rules (proactive or custom) will have a full restart effect, including processes such as Application Initialization. Errors such as 503 can be expected.  

## Health Check Feature
Enabling HealthCheck will restart the application, so slowness can be expected. 

HealthCheck feature also has some restart effects by design, as if a specific instance is having problems, it will try to restart the instance as explained in [Health Check Feature](https://docs.microsoft.com/en-us/azure/app-service/monitor-instances-health-check). Additionally, if an instance becomes unavailable for a long time, HealthCheck will replace the unhealthy instances, up to a maximum of 3 per day.  


## Configuration changes effects on Availability 

Most of the configuration changes trigger some sort of restart. It is important to be aware that any config changes in sections such as the ones listed below can trigger a restart, so it is recommended to plan accordingly before any change. 

-Configuration (general settings, application settings, default documents) 

-Authentication/Authorization 

-Application Insights – Any modification to the settings will cause an app restart 

-Identity 

-Backup Configuration 

-Custom Domain Operations 

-CORS Settings 

-TLS Settings 

-Networking Features 

-App Service Logs 
