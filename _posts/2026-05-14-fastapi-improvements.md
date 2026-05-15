---
title: "Simplifying FastAPI Deployments on Azure App Service for Linux"
author_name: "Tulika Chaudharie"
toc: true
toc_sticky: true
---

Deploying FastAPI apps to Azure App Service for Linux is now simpler.

Previously, when you deployed a FastAPI application, you needed to configure a custom startup command so the app could run correctly with an ASGI server. This added an extra step to the deployment flow and could create friction, especially when getting started with FastAPI on App Service.

We have now added built-in detection logic that identifies FastAPI applications automatically and configures the appropriate startup behavior for you.

## What changed

When you deploy a Python app, App Service now scans common entry point files such as:

`main.py`, `app.py`, `application.py`, `server.py`, `asgi.py`, `api.py`, `index.py`, and `run.py`

If one of these files imports FastAPI using `from fastapi` or `import fastapi`, App Service detects the app as a FastAPI application.

To avoid false positives, files that also import Flask are skipped during FastAPI detection.

## How your app is started

When a FastAPI app is detected, App Service automatically starts the application using Gunicorn with the Uvicorn worker class:

```bash
gunicorn -k uvicorn_worker.UvicornWorker
```

This provides the ASGI support required by FastAPI applications.

## Framework detection priority

If multiple framework indicators are present, App Service uses the following priority order:

```text
Django > FastAPI > Flask
```

Django continues to take precedence when a `wsgi.py` file is found in a subdirectory.

## What this means for you

When you deploy a FastAPI app to Azure App Service for Linux, you no longer need to configure a custom startup command in the supported runtime flow. Oryx detects the FastAPI app and configures the startup behavior automatically.

This removes an extra setup step and makes it easier to get your FastAPI app running on App Service.

## Availability

This improvement is currently enabled for Python 3.14 and later. Support for additional Python versions will be enabled in an upcoming rollout.

For more details on deploying Python apps to App Service, see the Azure App Service [Python quickstart documentation](ttps://learn.microsoft.com/azure/app-service/quickstart-python).

