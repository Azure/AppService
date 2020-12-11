---
title: "CI/CD for Python Applications"
author_name: "Jason Freeberg"
toc: true
toc_sticky: true
tags: Python
---

GitHub announced [CI/CD support](https://github.blog/2019-08-08-github-actions-now-supports-ci-cd/) through GitHub Actions which became generally available at GitHub Universe in November 2019. Since then, many Azure services have released [actions](https://github.com/azure/actions) and integrations to make developers' workflows more efficient. The App Service Deployment Center guides developers through setting up GitHub Actions to deploy their web apps. Since then, our teams have received requests for guidance and best practices when setting up CI/CD (Continuous Integration and Delivery) for deploying Python apps to App Service.

> This article assumes you are familiar with CI/CD pipelines. If you are not familiar, [read this article](https://www.redhat.com/en/topics/devops/what-cicd-pipeline) for an overview.

## Building and deploying Python apps

A simple CI pipeline for a Python application might have three steps: `pip install` the packages, run tests, and send the application to the server. This seems like a sound approach... *right?* That pattern might work for simple applications, but if the application uses packages that rely on the Operating System (such as database drivers, scipy, or scikit-learn), you may run into problems once the application starts on the server. This is because Python will make absolute references to the OS libraries, and if there are any differences between the libraries installed on the CI machine and the server, then the application will not run correctly.

This may seem like an excellent opportunity to leverage Docker. With Docker, you can build a container image with the Python application's dependencies already installed. From there, you ship the image to a host with Docker installed and "just run it". However, this option is not without its drawbacks. You will need to manage a container registry and configure your network such that the CI and production servers can securely access it. The Dockerfile also becomes part of the application repository, so you or your team will be responsible for updating the base OS and configuring the container. Fun fact: Docker was publicly announced at [PyCon in 2013](https://www.youtube.com/watch?v=wW9CAH9nSLs)

Nylas wrote an [excellent article](https://www.nylas.com/blog/packaging-deploying-python/) on this topic last year. Their article covers even more deployment technologies for Python applications. Check their article to learn about your other options. Now let's learn more about deploying Python applications to App Service without managing Docker images.

## Deploying to App Service

For those not familiar with Azure App Service, it is a platform-as-a-service (PaaS) for hosting web and API applications. You can deploy your application code or a container image. The service has managed runtimes for [Python](https://docs.microsoft.com/azure/app-service/quickstart-python), [.NET](https://docs.microsoft.com/azure/app-service/quickstart-dotnetcore), [Node](https://docs.microsoft.com/azure/app-service/quickstart-nodejs), [Java](https://docs.microsoft.com/azure/app-service/quickstart-java), [PHP](https://docs.microsoft.com/azure/app-service/quickstart-php), and [Ruby](https://docs.microsoft.com/azure/app-service/quickstart-ruby). This gives developers the choice to use containers or to simply deploy their code and let the service manage the runtime for them.

If you are setting up a CI/CD pipeline for your Python apps to App Service *without* using containers, you cannot simply `pip install` and deploy your app and packages to App Service (or any server) because the OS on your build server will most likely not match the runtime on Azure. To address this, simply create an [app setting](https://docs.microsoft.com/azure/app-service/configure-common#configure-app-settings) on your App Service named `SCM_DO_BUILD_DURING_DEPLOYMENT` with a value of `true`. This app setting will trigger the Oryx build pipeline to re-install your packages during deployment. [Oryx](https://github.com/Microsoft/Oryx) is an open-source utility by Microsoft that automatically builds source code. Oryx runs in your web app's SCM (site control manager) site. By setting this app setting, Oryx will `pip install` your dependencies **on the runtime** image so that the packages can take the appropriate dependencies on the OS libraries.

## Examples

The sections below show example GitHub Actions workflows for building and deploying Python apps to App Service. Although the samples use GitHub Actions, you can use the same pattern on other CI/CD providers such as Azure DevOps or Jenkins.

### Prerequisites

Before following the examples below, make sure you have done the following.

1. Create a Python web app on Azure. [Follow this quickstart to create a site]().
2. Create an Azure Service Principal. [Follow this guide to create a Service Principal](https://github.com/Azure/login#configure-deployment-credentials). A Service Principal is an identity in Azure Active Directory that is typically used for automation and accessing secrets. You will need to create a Service Principal so the GitHub Actions workflow

### Django

See the [**example workflow for building and deploying a Django app**](https://github.com/Azure-Samples/djangoapp/blob/master/.github/workflows/build_and_deploy.yaml). Fork this repository and [create a secret](https://docs.github.com/en/free-pro-team@latest/actions/reference/encrypted-secrets) with the Service Principal. Name the secret `AZURE_SERVICE_PRINCIPAL`.

The workflow starts by checking out the repository to the build VM, setting up the desired Python version, and creating a virtual environment.

```yaml
- uses: actions/checkout@v2

- name: Setup Python version
  uses: actions/setup-python@v2
  with:
  python-version: 3.8

- name: Create and start virtual environment
  run: |
    python3 -m venv venv
    source venv/bin/activate
```

Once the virtual environment is activated, the dependencies are installed from the `requirements.txt` file. Next, we use `manage.py` to collect the static assets and run our unit tests.

```yaml
- name: Install dependencies
  run: pip install -r requirements.txt

- name: Collect static
  run: python manage.py collectstatic

- name: Run tests
  run: python manage.py test
```

Assuming all those previous steps succeed, the files are uploaded for the next job. The virtual environment is **not** uploaded since it is not compatible with the runtime OS. A nice side-effect of uploading the files at the end of the job is that you can download the files from the **Actions** tab to debug or inspect the contents if a deployment fails.

```yaml
- name: Upload artifact for deployment jobs
  uses: actions/upload-artifact@v2
  with:
    name: python-app
    path: |
      . 
      !venv/
```

The second job begins by downloading the files we uploaded in the previous job, then logs into the Azure CLI using a Service Principal that you set as a secret earlier.

{% raw %}
```yaml
- uses: actions/download-artifact@v2
  with:
    name: python-app
    path: .

- name: Log in to Azure CLI
  uses: azure/login@v1
  with:
    creds: ${{ secrets.AZURE_SERVICE_PRINCIPAL }}
```
{% endraw %}

Once the Azure CLI is authenticated, the job sets the `SCM_DO_BUILD_DURING_DEPLOYMENT` setting mentioned earlier. It also sets app settings to disable static collection (since that was done in the previous job), to run migrations on the database, and to set the Django environment to "production". The `POST_BUILD_COMMAND` is a hook where you can execute commands following the runtime build. In this case, we're running `manage.py makemigrations && python migrate`. You *could* apply database migrations as part of the CI workflow, but you would need to set the connection string as a secret, and if you have networking rules securing your database you will need to make the database accessible from the CI pipeline.

Finally, the job deploys the code using the [`webapps-deploy` action](https://github.com/azure/webapps-deploy/).

{% raw %}
```yaml
- name: Disable static collection and set migration command on App Service
  uses: Azure/appservice-settings@v1
  with:  
    app-name: ${{ env.WEBAPP_NAME }}
    app-settings-json: '[{ "name": "DISABLE_COLLECTSTATIC", "value": "true" }, { "name": "POST_BUILD_COMMAND",  "value": "python manage.py makemigrations && python manage.py migrate" }, { "name": "SCM_DO_BUILD_DURING_DEPLOYMENT", "value": "true" }, { "name": "DJANGO_ENV", "value": "production"}]'

- name: Deploy to App Service
  uses: azure/webapps-deploy@v2
  with:
    app-name: ${{ env.WEBAPP_NAME}}
```
{% endraw %}

### Flask and Vue.js

See the [**example workflow for building and deploying a Flask app with Vue.js**](https://github.com/Azure-Samples/flask-vuejs-webapp/blob/main/.github/workflows/build_and_deploy.yaml). Fork this repository and [create a secret](https://docs.github.com/en/free-pro-team@latest/actions/reference/encrypted-secrets) with the Service Principal. Name the secret `AZURE_SERVICE_PRINCIPAL`. You also need to replace the placeholder value for the `RESOURCE_GROUP` environment variable at the top of the workflow file.

This workflow begins similarly to the Django example by setting the Python version, creating a virtual environment, and installing the Python packages. Unique to this example, it also sets Node.js to the desired version since the job will need to install the Vue project's dependencies and build it. 

```yaml
- uses: actions/checkout@v2

- name: Set up Python
  uses: actions/setup-python@v2
  with:
    python-version: 3.6

- name: Set up Node.js
  uses: actions/setup-node@v1
  with:
    node-version: 12

- name: Install and build Vue.js project
  run: |
    npm install
    npm run build

- name: Create and start virtual environment
  run: |
    python3 -m venv venv
    source venv/bin/activate

- name: Install dependencies
  run: pip install -r requirements.txt

- name: test with PyTest
  run: pytest --cov=app --cov-report=xml
```

Once the Flask and Vue.js apps are built and tested the files are uploaded for the second job... except for the `node_modules/` and `venv/` directories. We want to exclude these directories and allow Oryx to install the dependencies on the runtime image like in the Django example.

```yaml
- name: Upload artifact for deployment jobs
  uses: actions/upload-artifact@v2
  with:
    name: python-app
    path: |
      . 
      !node_modules/
      !venv/
```

The second job downloads the artifact, logs into the Azure CLI, and sets the `SCM_DO_BUILD_DURING_DEPLOYMENT` flag and `FLASK_ENV` to "production". Unlike the Django example, the workflow sets the "startup-file" command to `gunicorn --bind=0.0.0.0 --timeout 600 app:app`. ([Gunicorn](https://docs.gunicorn.org/en/stable/index.html) is a WSGI HTTP Server commonly used for Python applications. Learn more about [custom startup commands on App Service](https://docs.microsoft.com/azure/app-service/configure-language-python#customize-startup-command). 

{% raw %}
```yaml
- uses: actions/download-artifact@v2
  with:
    name: python-app
    path: .

- name: Log in to Azure CLI
  uses: azure/login@v1
  with:
    creds: ${{ secrets.AZURE_SERVICE_PRINCIPAL }}

- name: Configure deployment and runtime settings on the webapp
  run: |
    az configure --defaults ${{ env.RESOURCE_GROUP }}
    az webapp config appsettings --name ${{ env.WEBAPP_NAME }} --settings \
        SCM_DO_BUILD_DURING_DEPLOYMENT=true \
        FLASK_ENV=production

    az webapp config set --name ${{ env.WEBAPP_NAME }} \
        --startup-file "gunicorn --bind=0.0.0.0 --timeout 600 app:app"
```
{% endraw %}

Finally, the application is deployed with the [`webapps-deploy`](https://github.com/azure/webapps-deploy/) action.

{% raw %}
```yaml
- name: Deploy to App Service
  uses: azure/webapps-deploy@v2
  with:
    app-name: ${{ env.WEBAPP_NAME}}
```
{% endraw %}
