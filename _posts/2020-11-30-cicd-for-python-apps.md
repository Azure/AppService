---
title: "CI/CD for Python Applications"
author_name: "Jason Freeberg"
toc: true
toc_sticky: true
tags: Python
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

[**Example workflow for building and deploying a Django app.**](https://github.com/Azure-Samples/djangoapp/blob/master/.github/workflows/build_and_deploy.yaml)

The workflow starts by setting up the desired Python version and creating a virtual environment. Once the virtual environment is activated, the dependencies are installed from the `requirements.txt` file. The first job ends by collecting the static assets and running tests. Assuming all those jobs succeed, the files are uploaded for the next job. The virtual environment is **not** uploaded since it is not compatible with the runtime OS. A nice side-effect of uploading the files at the end of the job is that you can download the uploaded files from the **Actions** tab to debug or inspect the contents.

The second job begins by logging into the Azure CLI using a Service Principal. For more information on creating a Service Principal for GitHub Actions, see [these instructions](https://github.com/Azure/login#configure-deployment-credentials). Once the Azure CLI is authenticated, the job sets the `SCM_DO_BUILD_DURING_DEPLOYMENT` setting mentioned earlier. It also sets settings to disable static collection (since that was done in the previous job), to run migrations on the database, and to set the Django environment to "production". Finally, the job deploys the code using the [`webapps-deploy` action](https://github.com/azure/webapps-deploy/).

### Flask and Vue.js

[**Example workflow for building and deploying a Flask app with Vue.js**](https://github.com/Azure-Samples/flask-vuejs-webapp/blob/main/.github/workflows/build_and_deploy.yaml)

This workflow begins similarly to the Django example by setting the Python version, creating a virtual environment, and installing the Python packages. Unique to this example, it also sets Node.js to the desired version since the job will need to install the Vue project's dependencies and build it. Once the Flask and Vue.js apps are built and tested, the files are uploaded for the second job, except for the `node_modules/` and `venv/` directories. We want to exclude these directories and allow Oryx to install the dependencies like in the Django example above.

The second job logs into the Azure CLI and sets the `SCM_DO_BUILD_DURING_DEPLOYMENT` flag. Unlike the Django example, the workflow sets the "startup-file" command to `gunicorn --bind=0.0.0.0 --timeout 600 app:app`. ([Gunicorn](https://docs.gunicorn.org/en/stable/index.html) is a WSGI HTTP Server commonly used for Python applications. Learn more about [custom startup commands on App Service](https://docs.microsoft.com/azure/app-service/configure-language-python#customize-startup-command).) Finally, the application is deployed with the [`webapps-deploy` action](https://github.com/azure/webapps-deploy/).
