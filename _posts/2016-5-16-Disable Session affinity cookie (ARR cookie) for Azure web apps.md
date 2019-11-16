---
title: "Disable Session affinity cookie (ARR cookie) for Azure web apps"
author_name: "Sunitha Muthukrishna"
layout: single
excerpt: "How to disable the session affinity cookie on Azure App Service"
toc: true
---
      
Azure app service allows you to auto scale your web app by dynamically adding web server instances to handle the traffic to your web app. Azure app service uses [Application Request Routing](http://www.iis.net/learn/extensions/planning-for-arr) IIS Extension to distribute your connecting users between your active instances serving up the content. ARR cleverly identifies the user by assigning them a special cookie (known as an **affinity cookie**), which allows the service to choose the right instance the user was using to serve subsequent requests made by that user. This means, a client establishes a session with an instance and it will keep talking to the same instance until his session has expired. If you already have a web app on Azure app service , just browse the app and use browser debugger ( click on F12) to see the list of cookies. In the list of cookie you will see **ARRAffinity** Cookie.

![View ARR cookie in browser debugging tools]({{ site.baseurl }}/media/2016/05/viewarrcookie1-1024x610.png)

There are situations where in keeping the affinity is not desired. For example, if you are getting way too many requests from a single user and the requests going to the same web server instance can overload it. If maintaining session affinity is not important and you want better load balancing , it is recommended to disable session affinity cookie. Follow the steps for either **Azure portal** or **Azure resource Explorer** to disable the session affinity cookie: 

### Disable using the Azure Portal

1. Login to the [Azure portal](https://portal.azure.com)
1. Browse **App Services** and select your web application.
1. Click on **Settings** > **Application Settings**. You will find the ARR affinity setting under **General Settings**
  ![Disable ARR cookie in portal]({{ site.baseurl }}/media/2016/05/arrcookieportal-500x332.png)
1. Select **off**
  
### Disable using Azure Resource Explorer

1. Go to [Azure resource explorer](https://resources.azure.com/).
1. Click on **subscriptions**

    ![subscription expanded]({{ site.baseurl }}/media/2016/05/subscription-expand-300x200.png)
  
1. Click on your azure subscription in which your web app is located. Click on **resourcegroups**

    ![subname expanded]({{ site.baseurl }}/media/2016/05/subname-expand-300x113.png)

1. Click on the resource group where the web app is located. Click on **Microsoft.Web.** Click on **sites **and Select your web app . Click on **Edit** to make your changes .

    ![edit schema]({{ site.baseurl }}/media/2016/05/edit-schema-1024x379.png)  

1. Search for **clientAffinityCookie** and set it to **false**

    ![set affinitycookie]({{ site.baseurl }}/media/2016/05/set-affinitycookie-500x63.png)

1. Click on **PUT** to save your changes.

    ![put to save changes]({{ site.baseurl }}/media/2016/05/put-savechanges-1024x157.png)

That’s it! You have now disabled the session affinity cookie. You can browse your web app and click on F12 key to access the browser debugger and view the cookies. For an app without Session affinity cookie you will not see **ARRAffinity** in the list of cookies.

![Confirm the cookie is removed]({{ site.baseurl }}/media/2016/05/removedcookiearr-1024x545.png)

Without the cookie the requests for your web app, will be distributed evenly across all the instances serving your web app content. You can achieve better load balancing for your web app.
