---
permalink: "/sidecars/"
layout: home
title: "Sidecars for App Service"
sidebar:
    nav: "default"
pagination: 
  enabled: true
  tag: 'sidecars'
  sort_reverse: true
  trail: 
    before: 2
    after: 2
---

App Service supports Sidecars! Deploying your application in a Sidecar enables you to bring along dependencies such as custom fonts, cultures and GAC deployed assemblies. When deploying a containerized application, the Sidecar is an isolation and security boundary. As a result, calls to libraries that would normally be blocked by the Azure App Service will instead succeed when running inside of a Sidecar. For example, many PDF generation libraries make calls to graphics device interface (GDI) APIs. With Sidecars, these calls will succeed.

## Helpful resources

- [LINK GOES HERE]()
