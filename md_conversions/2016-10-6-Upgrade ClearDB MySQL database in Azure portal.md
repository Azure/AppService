---
author_name: mksunitha
layout: post
hide_excerpt: true
---
      [mksunitha](https://social.msdn.microsoft.com/profile/mksunitha)  10/6/2016 10:52:42 AM  ClearDB MySQL database now supports single step upgrade in [Azure portal](https://portal.azure.com). If you using a ClearDB database you may at some point in time hit quota limitations on ClearDB such as max connections or storage limits . For more details in pricing tiers and quota limits click [here](https://azure.microsoft.com/en-us/marketplace/partners/successbricks-inc/cleardb/). ### How to upgrade your ClearDB MySQL database

  2. Login to [Azure portal](https://portal.azure.com)
 4. Click on [All resources](https://portal.azure.com/?feature.customportal=false#blade/HubsExtension/Resources/resourceType/Microsoft.Resources%2Fresources) and select your ClearDB MySQL database
 6. Click on **Settings->Scale up your database**
  [![upgrade-cleardb-portal]({{ site.baseurl }}/media/2016/10/upgrade-cleardb-portal-1024x684.png)]({{ site.baseurl }}/media/2016/10/upgrade-cleardb-portal.png) 4. Select the pricing tier. Currently on single step upgrade is supported , which means if the current pricing tier is Mercury , you can upgrade to Titan . You cannot upgrade from Mercury pricing tier to Venus pricing tier at the skipping other pricing tiers during the upgrade.  ***Key things to remember: ***  - *Currently this feature does not support downgrade from higher pricing tier to a lower pricing tier.*
 - *If you are using a database on Jupiter tier. You will not see **scale up database** setting in the Azure portal . *
   [![pricing-tier-upgrade-cleardb]({{ site.baseurl }}/media/2016/10/pricing-tier-upgrade-cleardb-1024x724.jpg)]({{ site.baseurl }}/media/2016/10/pricing-tier-upgrade-cleardb.jpg)      