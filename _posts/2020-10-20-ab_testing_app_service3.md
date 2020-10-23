---
title: "A/B Testing with App Service, Part 3: Analyzing the telemetry"
author_name: "Jason Freeberg and Shubham Dhond"
category: deployment
tags: 
  - A/B Testing
toc: true
toc_sticky: true
comments: true
---

This is the third article in our guide for A/B testing with App Service. [The first article](https://azure.github.io/AppService/2020/08/03/ab_testing_app_service.html) shows how to set up your client-side project. [The second article](https://azure.github.io/AppService/2020/08/24/ab_testing_app_service2.html) shows how to configure your backend. Share your thoughts in the [comments section](#disqus_thread)).

Now that our client-side and backend projects are configured, we can analyze the data and compare results using Application Insights. Open the [Azure Portal](https://portal.azure.com/) and open your Application Insights resource that you created in the first article. On the left side, open **Logs** under **Monitoring**.

![Open the Logs tab on Application Insights]({{ site.baseurl }}/media/2020/10/ab-testing-logs-button-portal.png)

## Example 1: Comparing request duration

In this example we created three slots. The **staging** slot is where our main branch is deployed to every time there is a push to the main branch. The other two slots, **219** and **230**, are both pull requests targeting the main branch. We are using App Service's deployment slots as a staging environment for pull requests so we can test them in production before merging.

> A diagram of the GitHub Repo, slots, and where swaps happen would be helpful here.

Our goal in this example is to compare the average request durations for an important API call in the application. If we identify that one of the pull requests regresses the performance of that API, then we can investigate the PR's changes more closely so we don't regress performance in production.

### The query

Let's walk through the query step-by-step. We will use 

```kusto
dependencies
| extend
    time_bin = bin(timestamp, 5m),
    slot = tostring(parse_json(customDimensions).slot)
| where timestamp > ago(24h)
    and name == "POST /api/schedules/generate/"
| project slot, time_bin, duration
| evaluate pivot(slot, avg(duration))
| render timechart with ( title="Request duration by slot")
```

![Graph of request duration by slot]({{ site.baseurl }}/media/2020/10/ab-testing-request-duration-by-slot-graph.png)

### Example 2: Comparing custom metrics



### Example 3: Set up alerts for experiments



## Resources

- [Kusto Query tutorial](https://docs.microsoft.com/azure/data-explorer/kusto/query/tutorial?pivots=azuredataexplorer)
- [Parse JSON method](https://docs.microsoft.com/azure/data-explorer/kusto/query/parsejsonfunction)
