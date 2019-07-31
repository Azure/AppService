---
title: "Azure Key Vault References with Spring Apps"
toc: true
toc_sticky: true
author_name: Jason Freeberg
excerpt: "Securely store and access your connection strings with minimal code changes."
header:
    teaser: "media/2019/07/locks-header.jpg"
    og_image: "media/2019/07/locks-header.jpg"
    overlay_image: "media/2019/07/locks-header.jpg"
    overlay_filter: 0.4
tags:
    - Java
---

[Azure Key Vault](https://docs.microsoft.com/en-us/azure/key-vault/) provides a centralized service for managing secrets and certificates with full control over access policies and auditing capabilities. This article will show how to wire up a Spring Boot application on App Service to read a database username, password, and URL from Key Vault. Using Key Vault references requires **no** code changes, but we will need to do some configuration acrobatics.

> See [the previous article](https://jasonfreeberg.com/Data-Sources-with-Spring/) for instructions on setting up the Postgres server and deploying the starter app to App Service.

## Set up a Managed Identity

A managed identity acts as a user in your Active Directory for automation purposes. It is inherently tied to your web app and will be deleted if the web app is deleted. For this scenario, the identity will be used to retrieve the secrets from Key Vault when the app starts. Run the following command to create a manged identity:

```bash
az webapp identity assign --name <app_from_last_article> --resource-group <resource_group_of_app>
```

In the console output, save the `principalId` for later.

## Provision the Key Vault

1. Let's spin up a Key Vault named `java-app-key-vault`. For information about the parameters specified below, run `az keyvault create --help`.

    ```bash
    az keyvault create --name java-app-key-vault              \
                       --resource-group <your_resource_group> \
                       --location <location>                  \
                       --enabled-for-deployment true          \
                       --enabled-for-disk-encryption true     \
                       --enabled-for-template-deployment true \
                       --sku standard
    ```

1. Now we will grant the managed identity `get` and `list` access to the Key Vault.

    ```bash
    az keyvault set-policy --name java-app-key-vault     \
                           --secret-permission get list  \
                           --object-id <the principal ID from earlier>
    ```

1. Finally, we will add the Postgres username, password, and URL to the Key Vault. If you followed the tutorial on data sources, you should still have the secrets saved as environment variables on your machine. (If you are using Powershell, use the `$env:ENV_VAR` syntax to inject the environment variables into the following command).

    ```bash
    az keyvault secret set --name POSTGRES-USERNAME      \
                       --value $POSTGRES_USERNAME        \
                       --vault-name java-app-key-vault
    az keyvault secret set --name POSTGRES-PASSWORD      \
                       --value $POSTGRES_PASSWORD        \
                       --vault-name java-app-key-vault
    az keyvault secret set --name POSTGRES-URL           \
                       --value $POSTGRES_URL             \
                       --vault-name java-app-key-vault
    ```

## Configuring our App

The following instructions assume you have completed the [previous tutorial](https://jasonfreeberg.com/Data-Sources-with-Spring/).

### Key Vault References

When our Spring app is running on App Service, the secrets will be exposed as environment variables or "[Application Settings](https://docs.microsoft.com/en-us/azure/app-service/web-sites-configure#app-settings)". We will now create these app settings using the Azure CLI.

1. First, we need the URI's of our three secrets. Run the commands below and copy the `id` value in the console output.

    ```bash
    az keyvault secret show --vault-name java-app-key-vault --name POSTGRES-URL
    az keyvault secret show --vault-name java-app-key-vault --name POSTGRES-USERNAME
    az keyvault secret show --vault-name java-app-key-vault --name POSTGRES-PASSWORD
    ```

1. Now we will create the app settings with the Key Vault references. For each setting, replace "YOUR_SECRET_URI" with the corresponding id's from the previous step.

    ```bash
    az webapp config appsettings set -n <your_app_name> -g <resource_group> --settings \
        SPRING_DATASOURCE_URL=@Microsoft.KeyVault(SecretUri=YOUR_SECRET_URI)\
        SPRING_DATASOURCE_USERNAME=@Microsoft.KeyVault(SecretUri=YOUR_SECRET_URI)\
        SPRING_DATASOURCE_PASSWORD=@Microsoft.KeyVault(SecretUri=YOUR_SECRET_URI)
    ```

A Key Vault reference is of the form `@Microsoft.KeyVault(SecretUri=<SecretURI>)`, where `<SecretURI>` is data-plane URI of a secret in Key Vault, including a version. There is an alternate syntax [documented here](https://docs.microsoft.com/en-us/azure/app-service/app-service-key-vault-references#reference-syntax).

### Environment Configuration

The Key Vault references will be replaced with the actual secrets when our App Service boots up. This means our Spring application needs to resolve the connection strings at *runtime*. (It currently resolves these strings at build time.) We also want to be able to use our H2 database for development, and optionally connect to the production DB from our local machine to run tests. To fill all these requirements, we will create two new configuration files: `application-dev.properties`, and `application-prod.properties`.

1. Create a file under `src/main/resources` named `application-dev.properties`. Copy/paste the following into the file:

    ```yml
    # ===============================
    # = DATA SOURCE
    # ===============================
    # Set here configurations for the database connection
    spring.datasource.url=jdbc:h2:mem:testdb
    spring.datasource.username=sa
    spring.datasource.password=
    spring.datasource.driver-class-name=org.h2.Driver

    # ===============================
    # = JPA / HIBERNATE
    # ===============================

    # Allows Hibernate to generate SQL optimized for a particular DBMS
    spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.H2Dialect

    # App Service
    server.port=8080
    ```

1. Create a file under `src/main/resources` named `application-dev.properties`. Copy/paste the following into the file. Notice that we do not set the connection strings here. Instead, Spring will resolve them at runtime by looking for the uppercase and underscored versions of `spring.datasource.url`, `spring.datasource.username`, and `spring.datasource.password`.

    ```yml
    # ===============================
    # = DATA SOURCE
    # ===============================

    # The connection URL, username, and password will be sourced from environment variables
    # on App Service

    # Set here configurations for the database connection
    spring.datasource.driver-class-name=org.postgresql.Driver

    # ===============================
    # = JPA / HIBERNATE
    # ===============================

    # Allows Hibernate to generate SQL optimized for a particular DBMS
    spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

    # App Service
    server.port=80
    ```

1. Now we can slim-down our original `application.properties` file. Replace the contents of `application.properties` with the following:

    ```yml
    # Active profile is set by Maven
    spring.profiles.active=@spring.profiles.active@

    # ===============================
    # = DATA SOURCE
    # ===============================

    # Keep the connection alive if idle for a long time (needed in production)
    spring.datasource.testWhileIdle=true
    spring.datasource.validationQuery=SELECT 1

    # ===============================
    # = JPA / HIBERNATE
    # ===============================
    # Show or not log for each sql query
    spring.jpa.show-sql=true

    # Hibernate ddl auto (create, create-drop, update): with "create-drop" the database
    # schema will be automatically created afresh for every start of application
    spring.jpa.hibernate.ddl-auto=create

    # Naming strategy
    spring.jpa.hibernate.naming.implicit-strategy=org.hibernate.boot.model.naming.ImplicitNamingStrategyLegacyHbmImpl
    spring.jpa.hibernate.naming.physical-strategy=org.springframework.boot.orm.jpa.hibernate.SpringPhysicalNamingStrategy
    ```

1. Finally, we can also slim down our Maven profiles because we have moved th information to the new properties files. The profile section of your `pom.xml` should now be the following:

    ```xml
    <profiles>
      <profile>
        <!-- This profile will configure Spring to use an in-memory database for local development and testing. -->  
        <id>dev</id>  
        <activation>
          <activeByDefault>true</activeByDefault>
        </activation>  
        <properties>
          <spring.profiles.active>dev</spring.profiles.active>
        </properties>
      </profile>  
      <profile>
        <!-- This profile will configure the application to use our Azure PostgreSQL server. -->  
        <id>prod</id>  
        <properties>  
          <spring.profiles.active>prod</spring.profiles.active>
        </properties>
      </profile>
    </profiles>
    ```

See [this article](https://docs.spring.io/spring-boot/docs/current/reference/html/boot-features-external-config.html) for more information on Spring configurations and precedence.

## Deploy and Test

Check that the development profile works as expected by running the following commands and opening a browser to `http://localhost:8080/`.

```bash
mvn clean package -Pdev
java -jar target/app.jar
```

Before deploying to App Service, build your application with the production profile and test against your PostgreSQL DB from your local machine. To do so, rename the three environment variables beginning with `POSTGRES_` to `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD` respectively. Run the following commands to build and start your app. Thanks to our new configuration, Spring will resolve the connection strings in the environment variables *at runtime*.

```bash
mvn clean package -Pprod
java -jar target/app.jar
```

Finally, deploy the production app to App Service with `mvn azure-webapp:deploy`. Browse to the application and test that it works properly.

## Next Steps

See the [Java Developer Guide](https://docs.microsoft.com/en-us/azure/app-service/containers/configure-language-java) for more documentation and best practices for Java on App Service. Check back in the future for more articles. Thanks for reading!
