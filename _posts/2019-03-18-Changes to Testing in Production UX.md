---
title:  "Changes to Routing Rules UX"
tags:
    - Azure Portal
    - deployment slots
permalink: "/update/2019/03/18/Changes-to-Testing-in-Production-UX.html"
author_name: "Jason Freeberg"
author_profile: true
---

We will soon be rolling out a series of UX and ARM API changes that will alter the behavior of routing rules for testing in production. After May 22nd, you will no longer be able to create routing rules in staging slots from the Portal, and <u>on August 21st we will remove routing rules from all non-production slots</u>. You will still be able to route traffic from your *production* slot to your staging slots to do [testing in production](https://www.neotys.com/blog/tips-for-testing-in-production/). Please follow the instructions below to remove the routing rules from your staging slots.

<!-- Add link to new docs after the changes are rolled out -->

## The change

We originally allowed traffic routing from staging slots to enable advanced testing scenarios. However, we later learned that our customers were often routing traffic incorrectly and running into circular routing loops and other problems. Testing in production quickly gets complicated when routing rules are applied to non-production slots.  

On August 21st we will remove all routing rules from staging slots. **Rules on your production slot will not be changed.**

## How to remove rules on staging sites

### Using the Portal

Until May 22nd, you can remove your staging slot rules through the Azure portal.

1. Go to your Web App in the portal. Under **Deployment Slots** you can select your staging slot(s).
    ![Deployment slots section of the Portal UX]({{site.baseurl}}/media/2019/03/remove-staging-rules1.PNG)
1. In your staging slot, go to the **Deployment Slots** panel and set the traffic percentages to `0`.
1. Click **Save**.

### Using ARM

Until August 21st, you can remove your staging slot rules through the Resource Explorer. On August 21st we will remove all routing rules from staging slots.

1. Go to your staging slot in the Portal and click **Resource Explorer**
    In the panel, click **Go**. This should open a new tab in your browser. The navigation menu will open to your staging slot.
1. Go to staging slot > **config** > **web**

    ![Resource explorer navigation]({{site.baseurl}}/media/2019/03/remove-staging-rules2.PNG)
1. Click **Edit**

    ![Click edit]({{site.baseurl}}/media/2019/03/remove-staging-rules3.PNG)
1. Scroll down to the `routingRules` attribute and set the child `reroutePercentage`'s to `0` for any other slots
    ![Set to zero]({{site.baseurl}}/media/2019/03/remove-staging-rules4.png)
1. Set the `reroutePercentage` to `100` for the slot current slot
1. Scroll back up and click "Put".
