---
title: "Scala on App Service"
toc: true
toc_sticky: true
author_name: Denver Brittain
excerpt: "Build and run a Scala App on Azure App Service"
category: java
---

Scala is an object-oriented programming language that can be compiled to run on the Java Virtual Machine (JVM). Using the Java runtime allows you to integrate with the enormous Java ecosystem and execute Scala programs anywhere the JVM is available. This includes Azure App Service with the Java SE runtime. The [Play Framework](https://www.playframework.com/) is a lightweight web application framework for Java and Scala that integrates all components and APIs needed for modern web application development.

Follow the tutorial below to deploy a Play framework Scala app onto Azure App Service.

## Prerequisites

This sample is based off of the [Play Framework Hello World Tutorial](https://github.com/playframework/play-samples/tree/2.8.x/play-scala-hello-world-tutorial). 

To follow the steps in this tutorial you will need the following tools installed locally: 

* [Java 11](https://docs.microsoft.com/en-us/java/openjdk/download#openjdk-11)
* [sbt v1.3.4 or greater](http://www.scala-sbt.org/download.html)
* [Maven](https://maven.apache.org/install.html) (Or install the Azure CLI)
* [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) (Or use Maven)

To check your sbt version, enter the following in a command window:

```bash
sbt sbtVersion
```

## Build and Run the Project

This example Play project was created from a seed template. It includes all Play components and an Akka HTTP server. The project is also configured with filters for Cross-Site Request Forgery (CSRF) protection and security headers.

To build and run the project:

1. First clone the [Scala on App Service](https://github.com/Azure-Samples/scala-on-app-service) repository with the following command: `git clone https://github.com/Azure-Samples/scala-on-app-service` 

2. Change directory into the example project directory: `cd scala-on-app-service`

2. Build the project by running `sbt run`. The command builds and starts the embedded HTTP server. Since this downloads libraries and dependencies, the amount of time required depends partly on your internet connection speed.

3. After the message `Server started, ...` displays, enter the following URL in a browser: <http://localhost:9000>. The Play application will respond with: `Welcome to the Hello World Scala POC Tutorial!`.

Now that the application is working locally, let's package the application into an executable .jar file that we can deploy onto Azure App Service.

## Assemble and Test JAR Locally

Follow these steps to build a .jar file executable for a Java 11 runtime using sbt assembly.

1. From the project root, run: 

    ```bash
    sbt assembly
    ```

    This command produces an executable .jar file in the `scala-on-app-service/target/scala-2.14/` directory.

2. To test the app locally, run the previously created .jar file:  

    ```bash
    java -jar target/scala-2.13/scala-play-example-assembly-1.0.jar
    ```

    The application should now be running at <http://localhost:80>. (Note that the port is now 80, as this is the default HTTP port expected on App Service when we deploy it in the next section.)

3. Open the application in your browser to ensure it works locally as an executable .jar.

Something interesting to note about creating an executable .jar using `sbt assembly` is that it will inject all necessary Scala dependencies according to the `assemblyMergeStrategy` defined in `build.sbt`. This allows a native Scala app like this one to be executed in a Java-only environment. This also means that your production environment only needs to be running Java 11 and doesn't need any Scala runtime dependencies since they've all been injected into the .jar file.

## Deploy to Azure App Service

You can deploy the .jar using either the Azure CLI or the Maven plugin. Follow the instructions below for your preferred tool.

### Deploy as JAR using Azure CLI

To deploy with the Azure CLI, run the following command from the project root:

```bash
az webapp deploy --type jar --src-path target/scala-2.13/<project-name>-assembly-<version>.jar --name <app-name> --resource-group <resource-group>
```

Once complete, you should be able to access your Play Framework app at `https://<app-name>.azurewebsites.net`

### Deploy as JAR using Maven

1. To use Maven, you'll need a pom file. The last line of `scala-on-app-service/build.sbt` handles maven repo creation for publishing. After assembling your .jar file with `sbt assembly`, run the following command from the project root to generate a pom file: 

    ```bash
    sbt publish
    ```

2. Copy the newly created pom file to the project root: 

    ```bash
    cp maven-repo/com/example/scala-play-example_2.13/1.0/scala-play-example_2.13-1.0.pom pom.xml
    ```

3. Configure the webapp using the appropriate azure plugin for maven:

    ```bash
    mvn com.microsoft.azure:azure-webapp-maven-plugin:2.5.0:config
    ```

4. Update the app name and .jar file location in the newly modified pom.xml, for example: 

    ```xml
    <appName>Scala-App-Name</appName>
    ```

    ```xml
    <deployment>
        <resources>
            <resource>
                <directory>${project.basedir}/target/scala-2.13</directory>
                <includes>
                <include><app-name>-assembly-1.0.jar</include>
                </includes>
            </resource>
        </resources>
    </deployment>
    ```

5. Deploy to App Service with the following command:

    ```bash
    mvn azure-webapp:deploy
    ```

6. Update the application by running `sbt assembly` followed by `mvn azure-webapp:deploy` after making & testing changes locally.


## Resources

- [Config Guide for Java on Azure App Service](https://docs.microsoft.com/azure/app-service/configure-language-java)
- [Akka Server Settings](https://www.playframework.com/documentation/2.8.x/SettingsAkkaHttp)
