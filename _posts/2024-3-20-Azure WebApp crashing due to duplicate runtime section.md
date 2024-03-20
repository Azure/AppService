---
title: "Preventing crashes due to 'system.webServer/runtime' already defined"
author_name: "Puneet Gupta"
category: 'Diagnostics'
---

The below articles describes an issue that your app may encounter if you are using old Azure Web App Site extensions. The symptoms are
1. The SCM site goes in to a crashing loop and never recovers.
2. In the EventLog.xml file, the below error is logged about a duplicate 'system.webServer/runtime' section.

```
<Data>~1YourSiteName</Data>
<Data>Config section 'system.webServer/runtime' already defined. Sections must only appear once per config file. See the help topic &lt;location&gt; for exceptions
</Data>
<Data>\\?\D:\DWASFiles\Sites\#1YourSiteName\Config\applicationhost.config</Data>
<Data>1150</Data>
<Binary>B7000000</Binary>
```

You app may encounter this problem if the app is using a site extension (available from the App Services Site extensions gallery) and if the site extension has incorrect XDT Tranform that uses **Insert** (instead of **InsertIfMissing**) transform to add a custom environment variable inside the <environmentVariables> collection in the resulting applicationHost.config file. The issue is noticed on the following site extensions so far and both of these site extensions have updates availble that address this issue.
1. NewRelic
2. Composer

The following steps should be followed to address this issue

1. Visit the Kudu Console for your Web App (available at YourSiteName.scm.azurewebsites.net)
2. Click the Site Extensions tab.
3. Click on the Update site extension button next to the Site extension in question.


Once the above steps are followed, please restart the site and that should force the new site extension to be picked up.


