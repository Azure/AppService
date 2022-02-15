---
title: "Java 17 and Tomcat 10 now available on App Service"
author_name: "Jason Freeberg"
toc: true
toc_sticky: true
tags:
    - dotnet
---

Earlier this year [we shared](https://devblogs.microsoft.com/java/microsoft-build-of-openjdk-on-azure-platform-services/) that the Microsoft Build of OpenJDK is coming to Azure App Service. That update also included Java 17 and Tomcat 10.0, which are brand new on App Service! You can try these runtimes now by following the instructions below.

- [Download Tomcat 10]()

## Java 17

Java 17 on App Service is distributed via the Microsoft Build of OpenJDK, a new no-cost long-term supported distribution and Microsoft's new way to collaborate and contribute to the Java ecosystem. You can learn more about the Microsoft Build of OpenJDK from the [documentation](https://docs.microsoft.com/java/openjdk/overview), or the [DevBlog](https://devblogs.microsoft.com/java/).

### Get Started

1. [Download](https://docs.microsoft.com/java/openjdk/download) and [install](https://docs.microsoft.com/java/openjdk/install) Java 17.
2. Clone the [Spring Boot Getting Started](https://github.com/spring-guides/gs-spring-boot) sample project.

   ```bash
   git clone https://github.com/spring-guides/gs-spring-boot
   ```

   Change directories to the completed project

   ```bash
   cd gs-spring-boot/complete
   ```

3. Build and run the application locally.

    ```bash
    mvn package
    ```

    ```bash
    java -jar target/___________.jar
    ```

4. Browse to the app at `127.0.0.1:8080` and confirm the application is running
5. Create a new App Service and App Service plan. Replace the variables with your preferred resource names.

    ```bash
    app=<your-app-name>  # replace this with a unique app name
    group=<your-resource-group-name>  # replace this with your resource group name
    region=eastus

    az group create -n $group -l $region
    az appservice plan create -g $group -n "$app-plan" --is-linux --sku P1v3
    az webapp create -n $app -g $group -r 'JAVA|17-java17' -p "$app-plan" 
    ```

6. Deploy your `.jar` to the newly created web app.

    ```bash
    az webapp deploy --src-path target/_____.jar -n $app -g $group --type jar
    ```

7. Browse to your web app!

## Tomcat 10

- Tomcat 9 or 8.5 applications likely won't work on Tomcat 10 because it moved to Jakarta EE: https://tomcat.apache.org/download-10.cgi
- Support matrix: https://tomcat.apache.org/whichversion.html

### Get Started