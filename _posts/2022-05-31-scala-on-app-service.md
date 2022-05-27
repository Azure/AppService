---
title: "Scala on App Service"
toc: true
toc_sticky: true
author_name: Denver Brittain
excerpt: "Run a Scala App using Java SE on App Service"
category: java
---

## Prerequisites

This sample is based off of the [Play Framework Hello World Tutorial](https://github.com/playframework/play-samples/tree/2.8.x/play-scala-hello-world-tutorial). 

To follow the steps in this tutorial, you will need the correct version of Java, sbt, and (optionally) Maven or the Azure CLI.

* Java 11
* sbt 1.3.4 or higher. Note: if you downloaded this project as a zip file from <https://developer.lightbend.com>, the file includes an sbt distribution for your convenience.
* Maven (Optional)
* Azure CLI (Optional)

To check your Java version, enter the following in a command window:

```bash
java -version
```

To check your sbt version, enter the following in a command window:

```bash
sbt sbtVersion
```

If you do not have the required versions, follow these links to obtain them:

* [Java SE](http://www.oracle.com/technetwork/java/javase/downloads/index.html)
* [sbt](http://www.scala-sbt.org/download.html)
* [maven](https://maven.apache.org/install.html) (Optional)
* [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) (Optional)

## Build and Run the Project

This example Play project was created from a seed template. It includes all Play components and an Akka HTTP server. The project is also configured with filters for Cross-Site Request Forgery (CSRF) protection and security headers.

To build and run the project:

1. First clone the [Scala on App Service](https://github.com/Azure-Samples/scala-on-app-service) repository with the following command: `git clone https://github.com/Azure-Samples/scala-on-app-service` 

2. Change directory into the example project directory, for example: `cd scala-on-app-service`

2. Build the project. Enter: `sbt run`. The project builds and starts the embedded HTTP server. Since this downloads libraries and dependencies, the amount of time required depends partly on your connection's speed.

3. After the message `Server started, ...` displays, enter the following URL in a browser: <http://localhost:80>

The Play application responds: `Welcome to the Hello World Scala POC Tutorial!`


## Assemble and Test JAR Locally

To build a .jar file executable for a Java 11 runtime using sbt assembly: 

1. From the project root, run: 

    ```bash
    sbt assembly
    ```

    This command produces an executable .jar file in the scala-on-app-service/target/scala-2.14 directory.

2. To test the app locally, run the previously created .jar file:  

    ```bash
    java -jar target/scala-2.13/<project-name>-assembly-<version>.jar
    ```


## Deploy as JAR using Azure CLI

To deploy with the Azure CLI, run the following command from the project root:

```bash
az webapp deploy --type jar --src-path target/scala-2.13/<project-name>-assembly-<version>.jar --name <app-name> --resource-group <resource-group>
```

Once complete, you should be able to access your Play Framework app at `https://<app-name>.azurewebsites.net`

## Deploy as JAR using Maven

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