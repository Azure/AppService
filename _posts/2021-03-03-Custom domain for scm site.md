---
title: "Custom domain for SCM site"
author_name: "Mads Damgård"
category: networking
tags: scm
---

When enabling [private endpoint](https://docs.microsoft.com/azure/app-service/networking/private-endpoint) for a web app, both the web app and the Source Control Manager (SCM) site, also sometimes referred to as [kudu](https://github.com/projectkudu/kudu/wiki), are locked down to only receive traffic from the private IP. If you are in the internal network and have setup proper private DNS resolution, you can access both sites by browsing to https://appname[.scm].azurewebsites.net.

Externally public DNS for appname[.scm].azurewebsites.net will still resolve and route you to the public endpoint in which case you will be met with the blue Forbidden page.
To route external traffic to the site or if you prefer to use a custom domain internally, you can setup a reverse proxy like [Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/). In a reverse proxy you can override the custom domain with an internal hostname like appname[.scm].azurewebsites.net. All of this has been possible for a while and you can use the SCM APIs by providing the [deployment credentials](https://docs.microsoft.com/azure/app-service/deploy-configure-credentials?tabs=cli) in the request, but what has not been possible is to access the SCM site in the browser and using all the tools available here.

Previously when setting this up and browsing to https://[scm.mydomain.com]/basicauth the browser would challenge you for your deployment credentials, but after validating your credentials, it would redirect you to appname.scm.azurewebsites.net, which would be blocked. What you can now do, is to use https://[scm.mydomain.com]/basicauth**viaproxy**. When accessing this link, the backend will look for the originating address in X-Forwarded-Host or X-Original-Host and redirect you to the appropriate address upon successful login.

A few notes:

- It only works with deployment credentials. SSO is not possible.
- SCM site does not have an unauthenticated health endpoint, so health probes should either be disabled or accept 401 and 403.
