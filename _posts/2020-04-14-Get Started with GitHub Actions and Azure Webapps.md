---
title: "Get started with GitHub Actions and App Service"
author_name: "Jason Freeberg"
---

Last year we [shared an article]({{site.baseurl}}{% post_url 2019-08-10-Github actions for webapps%}) that demonstrated how to deploy your application to App Service using [GitHub Actions](https://github.com/features/actions). I am excited to share that we have added GitHub Actions as a build provider in the Deployment Center. This means it is even easier for developers to set up a continuous delivery pipeline with GitHub Actions. Follow the video or instructions below to get started.

{% include video id="b2oyxbSbLPA" provider="youtube" %}

## Getting started

1. First, create an Azure Webapp if you do not already have one. Follow one of [these quick start guides](https://docs.microsoft.com/azure/app-service/containers/quickstart-dotnetcore).

1. Once the Webapp is created, open the Azure Portal and navigate to your Webapp. On the left side, click **Deployment Center**.

1. In the Deployment Center, Select **GitHub**. You will be prompted to authenticate with GitHub if this is your first time using the Deployment Center. Click **Continue** at the bottom.

    ![Navigate to the Deployment Center]({{site.baseurl}}/media/2020/04/deploy-center.PNG)

1. On the next screen, choose **GitHub Actions (Preview)** as your build provider.  Click **Continue** at the bottom.

    ![Select GitHub Actions]({{site.baseurl}}/media/2020/04/select-gh-actions.PNG)

1. On the following panel, use the dropdowns to select your repository and branch. The branch you choose will be deployed to the Webapp. Next, choose your language and version. When you are done, click **Continue** at the bottom.

    ![Select your repo, branch, and runtime]({{site.baseurl}}/media/2020/04/select-repo-branch-runtime.PNG)

1. The final screen shows a preview of the workflow file that will be committed into your repository under `.github/workflows/`. The workflow file will check out your branch, set your language and version, build your application, and deploy it to your Webapp. The workflow will run any time there is a commit on your specified branch.

    ![Select GitHub Actions]({{site.baseurl}}/media/2020/04/summary.PNG)

    Click **Finish** after reviewing your selections. The Portal will commit this to the repository, which will trigger the the workflow to run.

1. You will be forwarded to the Deployment Center Dashboard, where you can see a list of your recent deployments. You can use the buttons at the top to disconnect the dashboard.

    ![Deployment Center Dashboard]({{site.baseurl}}/media/2020/04/dashboard.PNG)

## Next steps

Congratulations! You now have an automated workflow that will build and deploy your app whenever new commits are pushed to the branch. As your application grows in complexity, so too can your workflows. There are plenty of [other GitHub Actions](https://github.com/azure/actions#github-actions-for-azure) to interact with the rest of your Azure Services as well.

As always, don't forget to [use UserVoice](https://feedback.azure.com/forums/169385-web-apps) to suggest enhancements and vote for other suggestions.

## More information

- Documentation:
  - [GitHub Actions and App Service](https://docs.microsoft.com/azure/app-service/deploy-github-actions)
  - [Webapps deploy action](https://github.com/azure/webapps-deploy)
- The workflow for Python uses the [App Service Build Action](https://github.com/azure/appservice-build) to ensure the app is built correctly for App Service.
