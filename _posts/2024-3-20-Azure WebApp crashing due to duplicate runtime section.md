---
title: "Preventing crashes due to 'system.webServer/runtime' already defined"
author_name: "Puneet Gupta"
category: 'Diagnostics'
---

The following article addresses an issue that may arise within your application, particularly when utilizing XDT transforms or older versions of Site extensions from the App Service Site extension gallery. The symptoms include:

1.  The SCM site enters a crashing loop and fails to recover.
2.  The EventLog.xml file (present in %HOME%\LogFiles folder) records an error concerning a duplicate 'system.webServer/runtime' section:
```
<Data>~1YourSiteName</Data>
<Data>Config section 'system.webServer/runtime' already defined. Sections must only appear once per config file. See the help topic &lt;location&gt; for exceptions.
</Data>
<Data>\\?\D:\DWASFiles\Sites\#1YourSiteName\Config\applicationhost.config</Data>
<Data>1150</Data>
<Binary>B7000000</Binary>
```
This issue arises when a site extension (or [custom XDT Transform](https://github.com/projectkudu/kudu/wiki/Xdt-transform-samples)) contains an incorrect XDT Transform utilizing **Insert** (instead of **InsertIfMissing**) to add a custom environment variable within the <environmentVariables> collection in the resulting applicationHost.config file. This leads to duplicate 'system.webServer/runtime' tags, triggering the error. Notably, the following site extensions have updates available to address this issue:

1.  NewRelic
2.  Composer

It must be noted that error could surface while using custom XDT transforms or any other site extension that is using **Insert** instead of **InsertIfMissing** XDT transform.

### How to Resolve
To resolve this problem, follow these steps:

1.  Access the **Kudu Console** for your Web App (available at YourSiteName.scm.azurewebsites.net).
2.  Navigate to the **Site Extensions** tab.
3.  Locate the respective site extension and click on the **Update** button.
4.  Restart the site to ensure the site extension update takes effect.

If the app is utilizing a [custom XDT Transform](https://github.com/projectkudu/kudu/wiki/Xdt-transform-samples), ensure to use **InsertIfMissing** instead of **Insert** transform.

### Additional Information

The emergence of this issue coincided with an update to the Diagnostic as a Service (DaaS) site extension by App Service. The rollout of this update commenced in February 2024. Notably, the latest iteration of the site extension introduced a new environment variable utilized by DaaS for diagnostic purposes. It is important to highlight that while the DaaS site extension appropriately employed the InsertIfMissing transform, the insertion of the system.webServer/runtime section conflicted with other XDT Transforms utilizing the Insert transform, resulting in failures due to the preexistence of the section.