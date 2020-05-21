---
title: "Run Wildfly on App Service"
category: java
author_name: "Jason Freeberg"
---

Wildfly is an open-source application runtime for Java applications, and the upstream project of JBoss EAP. We recently added [a new Azure Sample](https://github.com/Azure-Samples/app-service-wildfly) that shows how to deploy Wildfly as a custom container onto Webapps for Containers.

The container image in the sample is already configured to support [web-SSH](https://docs.microsoft.com/azure/app-service/containers/app-service-linux-ssh-support#open-ssh-session-in-browser) and [wardeploy](https://docs.microsoft.com/azure/app-service/deploy-zip#deploy-war-file). The image also uses the Azul Zulu Enterprise build of the OpenJDK, which receives free support on Azure. (This support does not extend to the Wildfly runtime.)

If your Java application only requires the servlet and JSP APIs, you can deploy your application onto [Tomcat for App Service](https://docs.microsoft.com/azure/app-service/containers/quickstart-java), which is supported on both Windows and Linux.

## Helpful Links

- [Java long-term support for Azure and Azure Stack](https://docs.microsoft.com/java/azure/jdk/)
- [Java Docker images for Azure](https://docs.microsoft.com/java/azure/jdk/java-jdk-docker-images)
- [Wildfly](https://wildfly.org/)
