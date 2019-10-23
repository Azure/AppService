---
title: "Introducing Failure History (appLens) for Azure App Service Web App"
author_name: Apurva Joshi 
layout: post
hide_excerpt: true
---
      [Apurva Joshi (AJ)](https://social.msdn.microsoft.com/profile/Apurva Joshi (AJ))  6/2/2016 2:36:18 PM  **Why was my Web App down?”** is the million-dollar question that usually follows with more questions than answer, for example: **“Was it cloud provider issue?”** **“Was it a deployment I rolled out?”** “**Was it just abnormal increase in traffic?” **etc. Getting to the bottom of the issue requires tedious activities like pulling off few logs, aligning them with correct times or even calling Support for help, and this is just first layer of investigation a.k.a “Isolation” or “Peeling the onion”. This process should not take hours and we agree! **Introducing Failure History (appLens) for Azure App Service Web App: A tool to visualize various data points in few seconds! ** ### What is Failure History (appLens)?

 Let me start with little background on the project. Project’s code name is MDH (**M**ake **D**avid **H**appy). [David is our rock star engineer](https://twitter.com/LamboIn) (@Lamboin) who spends his day working on customer reported issues. He is the one who tries to answer the million-dollar question for our customers (**“Why was my Web App down?”**). We watched him pull variety of logs, overlay them and then align the time frames to get the 1st level of isolation. This process was MDS (**M**aking **D**avid **S**ad), and that was one of the inspirations to kick start this project. Failure History (appLens) is an attempt to solve problem described above. It is self-service RCA tool that helps you visualize variety of data points in your web app life cycle in matter of seconds. This visualization helps answer the questions that usually follow our million-dollar question. #### **Let’s see how it works**

 Failure History (appLens) can be accessed from “Settings” blade for your Web App. [![failurehistory]({{ site.baseurl }}/media/2016/06/failurehistory.png)]({{ site.baseurl }}/media/2016/06/failurehistory.png)[](https://azurecomcdn.azureedge.net/mediahandler/acomblog/media/Default/blog/ac60573b-a3b6-4507-b348-735939bcdb5d.png) With current release Failure History (appLens) focus on 3 core data points, which are,  - **Availability**
 - **Requests/Failures**
 - **Deployments**
  Let’s drill down on each of them with a real life examples,

 ### Availability

 This an overlay chart of 2 distinct data points, **Organic availability** and **Container Health (Canary Web App).**

 **Organic availability** is an aggregated data points of successful HTTP requests vs. Failed HTTP requests to your web app. On the other hand **Container Health (Canary Web App) **is an aggregated data points of successful HTTP requests vs. Failed HTTP requests to a static page that resides inside same VM (container) as your web app. Both of them are weighted number in percentage. To learn more about the Canary Web App, please read [“Resource Health Check” section of my previous blog.](https://blogs.msdn.microsoft.com/appserviceteam/2016/05/18/web-app-troubleshooting-blade/)

 I call this chart “**Is it me? vs. Is it you?”** chart. This literally is best way to isolate application issues vs. platform issues. This chart tries to answer **“Was it cloud provider issue?” **question.  2. If you see Organic availability chart taking a dip while Container Health chart is at 100% then it surely is an application issue.
 4. If you see Organic availability chart taking a dip as well as Container Health chart taking a dip then it is most likely platform issue (App Service issue). The reason I say “most likely” is because, a bad web app in app service plan can potentially freeze the container and cause Container health chart to take a dive.
  **NOTE**: To see individual charts at appropriate scale I recommend you filter out an individual graphs by selecting them using radio buttons. Canary Web App concept is NOT applicable to FREE and SHARED web apps and hence that data will be missing for them. ##### Example Scenario 1: Organic availability and Canary Health taking dip due to platform issue

 [![PlatformIssue_thumb](https://azurecomcdn.azureedge.net/mediahandler/acomblog/media/Default/blog/0fc9f8bb-9f83-4d0f-85f7-29dc78412ace.png "PlatformIssue_thumb")](https://azurecomcdn.azureedge.net/mediahandler/acomblog/media/Default/blog/633f4e32-4723-4e13-ad6e-c25895e39ca7.png) ##### Example Scenario 2: Organic availability and Canary Health taking dip due to high load freezing VM

 [![ContainerHealthVMFreeze_thumb](https://azurecomcdn.azureedge.net/mediahandler/acomblog/media/Default/blog/92606568-debd-4aa4-9142-1a4db3bc3bba.jpg "ContainerHealthVMFreeze_thumb")](https://azurecomcdn.azureedge.net/mediahandler/acomblog/media/Default/blog/9da55a01-b434-44c5-b913-985f39877691.jpg) ### Requests/Failures

 This is an aggregated data points of total incoming HTTP requests vs. Failed HTTP requests to your web app. This chart can be used to answer “**Was it just abnormal increase in traffic?” **question. If you see drop in **Organic availability **chart (right above this chart) following large increase in Total incoming HTTP requests (HTTP Requests counter) then you can conclude that downtime could be related to increase in traffic and maybe I should consider turning on Auto Scale. You can also use this chart to answer **“What % of my traffic was failing?”** question. **NOTE**: To see individual charts at appropriate scale I recommend you filter out an individual graphs by selecting them using radio buttons ##### Example Scenario 3: Organic availability taking dip due to increased traffic (need to scale out)

 ### [![traffic_Increase_thumb[1]](https://azurecomcdn.azureedge.net/mediahandler/acomblog/media/Default/blog/a14249d7-a391-4be3-9ba3-33b51b45f348.jpg "traffic_Increase_thumb[1]")](https://azurecomcdn.azureedge.net/mediahandler/acomblog/media/Default/blog/a85cccc2-c58a-4bd4-bc8a-2c40b175f47d.jpg)

 ### Deployments

 This is simple data point indicating time frames when you or someone in your organization did deployment to your web app. This chart tries to answer **“Was it a deployment I rolled out?” **question. **NOTE**: This only shows deployments done via web deploy or Kudu endpoint. It does not cover deployments done using FTP. This is a great data point to co-relate with availability charts and see if Organic availability tanked right after the deployment? This way you can be sure if availability drop is related to your deployment or not. ##### Example Scenario 4: Organic availability taking dip due to bad deployment

 [![deployment_thumb](https://azurecomcdn.azureedge.net/mediahandler/acomblog/media/Default/blog/948c0f21-108a-4a54-949a-21038f7c41b0.jpg "deployment_thumb")](https://azurecomcdn.azureedge.net/mediahandler/acomblog/media/Default/blog/e3bb84d2-c161-443d-8ba5-2c4e11d52be4.jpg) Finally, few disclaimers for this version of Failure History (appLens)  2. Failure History (appLens) data is at least 15 minutes behind. For issues that are currently happening and you need help then please use our [**troubleshoot blade**](https://blogs.msdn.microsoft.com/appserviceteam/2016/05/18/web-app-troubleshooting-blade/).
 4. Failure History (appLens) data can go back 7 days to RCA (root cause analysis) issues that happened in past
 6. Failure History (appLens) defaults to UTC time
      