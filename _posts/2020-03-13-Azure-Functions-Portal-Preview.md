---
title: "Announcing public preview for Azure Functions portal UX"
tags: 
    - Function
    - Preview
    - UX
author_name: "Byron Tardif"
---

## Access the preview

Thew new user experience for **Azure Functions** is now available for all users in the **Azure Portal**.

You can try the new experience by clicking on the "*Preview the new Azure Functions management experience*" banner in your function apps.

![Access the Functions Preview UX]({{ site.baseurl }}/media/2020/03/functions_preview.gif)

## Function App Overview

Once you are in the new experience, you will notice that the new  **Azure Functions** UX is now consistent with the rest of the **Azure Portal**.

This UX is powered by the same [**Azure Functions Runtime API**](https://docs.microsoft.com/azure/azure-functions/functions-runtime-overview) except they are now exposed through [**ARM**](https://azure.microsoft.com/features/resource-manager/). This allows for better caching through the [**Azure Resource Graph**](https://azure.microsoft.com/features/resource-graph/), as well as support for [**RBAC**](https://docs.microsoft.com/azure/role-based-access-control/overview), and enables new scenarios like being able to manage Azure Functions hosted on an [**Internal Load Balancer App Service Environment ASE**](https://docs.microsoft.com/azure/app-service/environment/create-ilb-ase).

The core **Azure Functions** features are grouped in the menu bar under the **Functions (preview)** heading:

![New Function App overview]({{ site.baseurl }}/media/2020/03/functions_app_overview.png)

### Functions

**Functions** lets you list the individual functions within your Function App. From here you can also:

- **Add** a new function.
- **Delete** an existing function
- **Enable / disable** individual functions
- **Search / filter** through your list of functions
- Drill into a specific function.

![New functions list]({{ site.baseurl }}/media/2020/03/functions_list.gif)

### App Keys

**App Keys** lets you interact with the Function App Keys at the Host and System level. from here you can:

- **View** the values for Host & System keys
- **Add / Remove** Host & System keys
- **Renew** values for Host & system keys

![New functions app keys]({{ site.baseurl }}/media/2020/03/function_app_keys.gif)

### App Files

**App Files** lets you view and modify files like `host.json` that are scoped to the Function app and not individual functions.

![New functions app files]({{ site.baseurl }}/media/2020/03/function_app_files.png)

## Function Overview

Once you drill into a specific **Function** within your **Function App** there is a new overview page scoped to this specific function.

One of the added benefits of this **overview** is that folks can now deep link to this page.

The body of the overview page is currently empty for the public preview, but we are working on adding metrics that are scoped to the execution of this specific function.

![New functions overview]({{ site.baseurl }}/media/2020/03/function_overview.gif)

### Code + Test

**Code + Test** menu item lets you view and modify the code of this specific function.

You can browse to individual files:

![New functions code editor]({{ site.baseurl }}/media/2020/03/function_code.gif)

Test your function and see the execution logs:

![New functions test and logs]({{ site.baseurl }}/media/2020/03/function_code_test.gif)

>**PRO TIP** you can collapse the menu to maximize your code editor:
>

### Integration

**Integration** menu item give you a graphical representation of your function. From here you can add / remove / edit all of your **Triggers**, **Inputs** and **Outputs** bindings.

![New functions integrate]({{ site.baseurl }}/media/2020/03/function_integration.png)

### Function Keys

**Function Keys** provides similar functionality to **Function App Keys**, except it's scoped to this specific function level.

![New functions integrate]({{ site.baseurl }}/media/2020/03/function_keys.png)

## Wrapping up

The new preview experience for **Azure functions** in the **Azure Portal** provides all the functionality of the existing UX but with better *performance*, *accessibility* and *consistency* with the rest of the **Azure Portal**. It also offers new functionality like *RBAC support* and improved code editor and integration UX.

If you want to see the UX in action you can watch a demo from [@bktv99](https://twitter.com/bktv99) during monthly February 2020 Azure Functions webcast:

[![Functions Webcast]({{ site.baseurl }}/media/2020/03/functions_webcast.png)](https://www.youtube.com/watch?v=62TwjDxQZZo)

If you find issues during the preview, you can [file a bug](https://github.com/Azure/Azure-Functions/issues/new?assignees=btardif&labels=UX_Preview&template=Preview_Functions_UX.md&title=%5BUX%5D+-+).

You can also request features using our [User Voice](https://feedback.azure.com/forums/355860-azure-functions).

The **Azure Functions** team can also be reach through twitter: [@AzureFunctions](https://twitter.com/AzureFunctions)
