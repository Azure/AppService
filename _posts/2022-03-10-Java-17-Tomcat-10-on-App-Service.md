---
title: "Java 17 and Tomcat 10.0 now available on App Service"
author_name: "Jason Freeberg"
toc: true
toc_sticky: true
tags:
    - java
---

Earlier this year [we announced](https://devblogs.microsoft.com/java/microsoft-build-of-openjdk-on-azure-platform-services/) that the Microsoft Build of OpenJDK was coming to Azure App Service in an upcoming platform update. That update also included Java 17 and Tomcat 10.0, which are *brand new* on App Service! These runtimes are now available on App Service, follow the instructions below to learn more and get started.

## Java 17

Java 17 on App Service is distributed via the Microsoft Build of OpenJDK, a no-cost long-term supported distribution of the OpenJDK and Microsoft's new way to collaborate and contribute to the Java ecosystem. You can learn more about the Microsoft Build of OpenJDK from the [documentation](https://docs.microsoft.com/java/openjdk/overview), or the [DevBlog](https://devblogs.microsoft.com/java/).

### Get Started

1. [Download](https://docs.microsoft.com/java/openjdk/download) and [install](https://docs.microsoft.com/java/openjdk/install) Java 17.
1. Clone the [Spring Boot Getting Started](https://github.com/spring-guides/gs-spring-boot) sample project.

   ```bash
   git clone https://github.com/spring-guides/gs-spring-boot
   ```

 1. Change directories to the completed project

   ```bash
   cd gs-spring-boot/complete
   ```

1. Build and run the application locally.

    ```bash
    mvn package
    java -jar target/spring-boot-complete-0.0.1-SNAPSHOT.jar
    ```

1. Browse to the app at [http://127.0.0.1:8080](http://127.0.0.1:8080) and confirm the application is running
1. Now that the application is running localled, let's deploy it to Azure. First, create a new App Service Plan and Java 17 web app. Replace the variables with your preferred resource names.

    ```bash
    app=<your-app-name>  # replace this with a unique app name
    group=<your-resource-group-name>  # replace this with your resource group name
    region=eastus

    az group create -n $group -l $region
    az appservice plan create -g $group -n "$app-plan" --is-linux --sku P1v3
    az webapp create -n $app -g $group -r "JAVA|17-java17" -p "$app-plan" 
    ```

1. Deploy your `.jar` to the newly created web app.

    ```bash
    az webapp deploy --src-path target/spring-boot-complete-0.0.1-SNAPSHOT.jar -n $app -g $group --type jar
    ```

1. Browse to your web app!

    ```bash
    az webapp browse -n $app -g $group
    ```

## Tomcat 10.0

Tomcat 10.0 support Java 8 and later, and builds on Tomcat 9.0.x. However, Tomcat 10.0 is the first Tomcat release to migrate from the Java EE 8 specification to Jakarta EE 9. This means that Tomcat 9.0 or 8.5 applications will almost certainly require a refactor and rebuild to run on Tomcat 10.0. Please refer to [the official Tomcat 10.0 migration guide](https://tomcat.apache.org/migration-10.html) on the Apache Tomcat website.

> Note: Tomcat 10.**1** is [currently in alpha](https://tomcat.apache.org/tomcat-10.1-doc/index.html), and will be a separate release cadence from Tomcat 10.0. Tomcat 10.**1** will only support Java 11 and later. App Service will support Tomcat 10.1 once a stable release is published by the Apache Foundation.

- Tomcat 9 or 8.5 applications likely won't work on Tomcat 10 because it moved to Jakarta EE: https://tomcat.apache.org/download-10.cgi
- Support matrix: https://tomcat.apache.org/whichversion.html

### Get Started

1. Ensure that you're using Java 8 or greater on your local machine.
2. Use Maven to generate a sample application.

    ```bash
    mvn archetype:generate "-DgroupId=example.demo" "-DartifactId=helloworld" "-DarchetypeArtifactId=maven-archetype-webapp" "-Dversion=1.0-SNAPSHOT"
    ```

3. Move into the project folder

    ```bash
    cd helloworld
    ```

4. Build the application.

    ```bash
    mvn package
    ```

5. Create a new App Service plan. Replace the variables with your preferred resource names.

    ```bash
    app=<your-app-name>  # replace this with a unique app name
    group=<your-resource-group-name>  # replace this with your resource group name
    region=eastus

    az group create -n $group -l $region
    az appservice plan create -g $group -n "$app-plan" --is-linux --sku P1v3
    ```

6. Create a Tomcat web app. The value of the "runtime" string will depend on the version of Java that you used to build your application locally:

    - If you used Java 8, use this string: `TOMCAT|10-java8`
    - If you used Java 11, use this string: `TOMCAT|10-java11`
    - If you used Java 17, use this string: `TOMCAT|10-java17`

    Next, run this command with your string to create the Tomcat web app.

    ```bash
    runtime="<replace-with-string-above>"
    az webapp create -n $app -g $group -r $runtime -p "$app-plan" 
    ```

7. Deploy the `.war` file to your web app.

    ```bash
    az webapp deploy --src-path target/_____.war -n $app -g $group --type war
    ```

8. Browse to your web app.

## Resources

- [Apache Tomcat Versions and support states](https://tomcat.apache.org/whichversion.html)
