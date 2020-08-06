---
title: "Health check is Generally Available"
author_name: "Jason Freeberg, Suwat Bodin"
toc: true
toc_sticky: true
comments: true
---

With App Service you can atuomatically scale your applications to multiple instances so that they can handle increased load. This improves your application's throughput, but problems can happen on individual instances of your app, causing them to no longer respond to requests. To address this situation we released Health Checks last year (in preview). The Health Check feature allows you to specify a path on your application for App Service to ping. If an instance of your app fails to respond to the requests, we determine it is *unhealthy* and remove it from the load balancer's rotation. This increases your application's average availability and resiliency. 

Health Check is now Generally Available and ready for production applications. Set up Health Check on your applications today in the Azure Portal. Go to your web app and find **Health Check (Preview)** under **Monitoring** in the left-side navigation menu.

- Add image of the Portal blade

> Health Check is Generally Available, but the Portal blade uses new Azure libraries. The UI will move out of preview in the coming weeks.

## Behavior

Once you specify a path on your site, App Service will ping it every two minutes. If the path responds with a status code outside of 200 to 299 (or does not respond at all) for 5 pings, then the instance is determined to be unhealthy, and it is removed from the load balancer rotation. This stops the load balancer from routing requests to the unhealthy instances. 

When the instance is unhealthy and removed from the load balancer, the service continues to ping it. If it begins responding with successful response codes (200 to 299), the instance is returned to the load balancer. If it continues to respond unseccessfully, App Service will restart the underlying VM in an effort to return the instance to a healthy status.

> For more details, please refer to the [health check documentation]()

## The health check path

The health check path should 

![App Service Domain]({{site.baseurl}}/media/2020/08/health_check_path_diagram.png){: .align-center}

- Ping external resources
    - Have the response ready before the request comes

## Alerts

- Get email/SMS alerts

## More resources

- Link to //Build video @ timestamp
- Let us know your thoughts in the comments below
