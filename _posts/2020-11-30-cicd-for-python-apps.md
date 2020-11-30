---
title: "CI/CD for Python Applications"
tags: Python
author_name: "Jason Freeberg"
---

GitHub announced [CI/CD support](https://github.blog/2019-08-08-github-actions-now-supports-ci-cd/) for GitHub Actions back in August of 2019. Since then, many Azure services have released [actions](https://github.com/azure/actions) and integrations to make developers' workflows more efficient. The App Service Deployment Center in  guides developers through setting up GitHub Actions to deploy their web apps. Since then, our teams have received requests for guidance and best practices when setting up CI/CD (Continuous Integration and Delivery) for App Service. This article will cover some common questions that developers have had when deploying their Python apps to App Service from a CI/CD pipeline like GitHub Actions.

> This article assumes you are familiar with CI/CD pipelines. If you are not familiar, [read this article](https://www.redhat.com/en/topics/devops/what-cicd-pipeline) for an overview. 

## Building and deploying Python apps

A simple CI pipeline for a Python application might have three steps: `pip install` the packages, run tests, and send the application to the server. This seems like a sound approach... *right?* That pattern might work for simple applications, but if the application uses packages that rely on the Operating System (such as database drivers or _____), you may run into problems once the application starts on the server. This is because Python will make absolute references to the OS libraries, and if there are any differences between the libraries installed on the CI machine and the server, then the application will not run correctly.

This may seem like an excellent opportunity to leverage Docker. With Docker, you can build a Docker image with the Python application's dependencies already installed. From there, you can ship the image to a host with Docker installed and "just run it". In fact, Docker was publicly announced at [PyCon in 2013](https://www.youtube.com/watch?v=wW9CAH9nSLs). However, this option is not without its drawbacks. You would need to manage a container registry and configure your network such that the CI and production servers can securely access it. The Dockerfile also becomes part of the application repository, so you or your team will be responsible for updating the base OS and configuring the container.

> Nylas wrote an excellent article on this topic last year. [Click here to read more](https://www.nylas.com/blog/packaging-deploying-python/).

## Deploying to App Service

With Azure App Service you can deploy your application code or a container image. The service has managed runtimes for [Python](https://docs.microsoft.com/azure/app-service/quickstart-python), [.NET](https://docs.microsoft.com/azure/app-service/quickstart-dotnetcore), [Node](https://docs.microsoft.com/azure/app-service/quickstart-nodejs), [Java](https://docs.microsoft.com/azure/app-service/quickstart-java), [PHP](https://docs.microsoft.com/azure/app-service/quickstart-php), and [Ruby](https://docs.microsoft.com/azure/app-service/quickstart-ruby). This gives developers the choice to use containers or to simply deploy their code and let the service manage the runtime for them.

If you are setting up a CI/CD pipeline for your Python apps to App Service without using containers, there are a couple best practices to keep in mind. As mentioned earlier in the article, you cannot simply `pip install` and deploy your packages to App Service because the OS on your build server will most likely not match the runtime image on Azure. To address this, simply create an app setting named `SCM_DO_BUILD_DURING_DEPLOYMENT` with a value of `true`. This app setting will trigger the Oryx build pipeline to re-install your packages during deployment. [Oryx](https://github.com/Microsoft/Oryx) is an open-source utility by Microsoft that automatically builds source code. Oryx runs in your web app's SCM (site control manager) site.

## Examples

The sections below show example GitHub Actions workflows for building and deploying Python apps to App Service. Although the samples use GitHub Actions, you can use the same pattern on other CI/CD providers such as Azure DevOps or Jenkins.

### Django

[Here is an example workflow for building and deploying a Django app.](https://github.com/Azure-Samples/djangoapp/blob/master/.github/workflows/build_and_deploy.yaml)

- https://github.com/Azure-Samples/djangoapp

### Flask