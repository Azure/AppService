---
title: 'Zero to Hero with App Service, Part 3: Releasing to Production'
author_name: "Jason Freeberg"
tags: 
    - zero to hero
toc: true
toc_sticky: true
---

> This is the third article in the Zero to Hero with App Service series. This article assumes you have already completed the [previous two articles](https://azure.github.io/AppService/tags/#zero-to-hero).

At this point, you have a CI/CD pipeline built on GitHub Actions that deploys
your code into a staging slot whenever a commit is pushed to the main branch. In
this article, you will learn how to release your new build to your production
traffic by *swapping* the production and staging slots. You will also learn how
to route a percentage of your production traffic to the staging environment to
test the next build before it is fully released.

## Swap the slots

Open the Azure Portal to your web app. On the left side menu, select
**Deployment slots**. This will open a new blade showing a list of your site’s
slots. You will see a **production** and **staging** slot. Click the **Swap**
button at the top.

![The slots overview blade]({{site.baseurl}}/media/2020/07/slots-blade.png){: .align-center}

The **Swap** button will open a context menu with a table to preview any changes
configuration changes that will occur after the swap. [App
settings](https://docs.microsoft.com/en-us/azure/app-service/configure-common#configure-app-settings)
are key-value configurations that are exposed to your app as environment
variables. A future article will cover app settings in more detail. Click
**swap** at the bottom of the menu to swap the slots.

![Swap the slots]({{site.baseurl}}/media/2020/07/slots-swap-menu.png){: .align-center}

When the operation completes, browse to the production site and you should see
the sample application! The staging slot should now have the sample application,
and the staging slot will have the placeholder HTML page with help text.

> You can also [use slots with custom containers](https://docs.microsoft.com/azure/app-service/deploy-best-practices#continuously-deploy-containers).

## Checkpoint

Up to now, you have a GitHub repository that will trigger a GitHub Action
workflow whenever there is a push to the main branch. The workflow builds and
deploys the application to the staging slot of the site. You can use the staging
site to validate your latest changes. When you’re ready, use the swap button (or
[CLI
command](https://docs.microsoft.com/en-us/cli/azure/webapp/deployment/slot?view=azure-cli-latest#az-webapp-deployment-slot-swap))
to swap the slots.

![A bird's eye view of the CI/CD process]({{site.baseurl}}/media/2020/07/CICD_overview.png){: .align-center}

If you work in a large team, you can create slots for testing, quality
assurance, canary testing, A/B testing, and more. Here is an example use case
for multiple slots:

1. Continuously deploy the master branch into a “testing” slot for developers
    to easily validate changes without pulling the branch and run it locally.
1. Swap the build into a QA slot where the configuration more closely resembles
    the production slot. The new build is thoroughly tested by a QA or
    acceptance team.
1. Swap into a staging slot where the build is tested against a fraction of the
    production traffic. The configuration here should match the production slot.
1. Fully release the new build by swapping into the production slot.

> There is an implicit distinction between deploying and releasing. For more
information on this distinction, see [this article](https://blog.turbinelabs.io/deploy-not-equal-release-part-one-4724bc1e726b).

## Testing in Production

Testing in Production is the general practice of utilizing production traffic to
test a new deployment before fully releasing it. This is an umbrella term for
activities such as traffic shadowing, mirroring, or canarying. Traffic [shadowing](https://www.getambassador.io/docs/latest/topics/using/shadowing/)
and mirroring are interesting topics, but they are outside the scope of this
article. The remaining sections will explain how to *canary* your new
deployments with App Service before releasing them to production.

### Configuration

In the Azure Portal, go to the **Deployment Slots** menu. In the table of your
slots, you will see a column for **Traffic %**. By default, all your traffic is
routed to the production slot. Try setting the traffic percentage to **10%** on
the staging slot. Then click **Save.** With that simple change, a tenth of your
production traffic will now go to the new build! This practice is known as a
“canary deployment” or “canarying a build”.

<div class="responsive-video-container">
    <iframe src="https://channel9.msdn.com/Shows/Azure-Friday/Testing-in-production-with-Azure-App-Service/player"
        allowFullScreen
        frameBorder="0"
        title="Testing in production with Azure App Service - Microsoft Channel 9 Video">
    </iframe>
</div>

> The term “canary deployment” originates from [the “canary in a coal mine” idiom](https://en.wiktionary.org/wiki/canary_in_a_coal_mine).

### Tagging telemetry

Now that some of your production traffic is routed to the new build, it is
prudent to monitor the success of your deployment to catch errors, slow code
paths, or other unforeseen issues. If you are using an application monitoring
tool like [Application Insights](https://docs.microsoft.com/azure/azure-monitor/app/app-insights-overview),
Splunk, or Dynatrace, you will want to tag the metrics and logs coming from your
staging slot so you can appropriately split the data in your reports and
dashboards.

For your client-side code, the slot will expose a cookie, `x-ms-routing-name`,
with the slot’s name. You can retrieve this cookie and tag any outgoing metrics
or logs. In your monitoring service’s dashboard, you can filter or split the
data on this tag.

For server-side code, the slot will expose an environment variable,
`WEBSITE_HOSTNAME`, which contains the hostname and slot name. Much like the
client-side cookie, you can grab the value of the environment variable and tag
your logs or metrics.

> You can manually route clients to a slot using the [x-ms-routing-name query parameter](https://docs.microsoft.com/azure/app-service/deploy-staging-slots#route-production-traffic-manually).

## Summary

*Congratulations!* Now you know how to release your latest deployments. You can
also route a percentage of your production traffic to canary test the new build
before **fully** releasing it. The next articles will cover certificates,
domains, network security, and advanced configuration… *so stay tuned for more!*

### Helpful Links

- [Testing in Production, the safe way](https://medium.com/@copyconstruct/testing-in-production-the-safe-way-18ca102d0ef1)
- [Best Practices for App Service deployment slots](https://docs.microsoft.com/azure/app-service/deploy-best-practices#use-deployment-slots)
