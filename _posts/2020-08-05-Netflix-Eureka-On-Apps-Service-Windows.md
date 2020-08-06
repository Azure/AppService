---
title: "Netflix Eureka on App Service (Windows)"
author_name: "Gregory Goldshteyn"
category: "java"
tags:
    - netflix eureka
    - spring boot
    - java
toc: true
toc_sticky: true
---

Netflix Eurkea is a REST based middleware designed for discovery and load balancing of web applications. This article includes the [configurations](#configurations) required to get a Netflix Eureka based app running correctly in App Service (for those who already have a Netflix Eureka app), and a [demo project](#get-started-with-example-netflix-eureka-project) showing a working example of Netflix Eureka based services working together on Azure App Service (for those starting from scratch).

## Netflix Eureka on App Service

### Configurations

In Azure, there are several configurations that must be performed on eureka clients to get them working correctly in App Service. These settings can be included in an application.yml file, application.properties file, or as arguments to the JVM in the JAVA_OPTS app setting.

#### Example application.properties file

```yml
spring.application.name=exmaple-client
eureka.client.serviceUrl.defaultZone=https://example-server.azurewebsites.com:443/eureka
eureka.instance.hostname=example-client.azurewebsites.com
eureka.instance.secure-port-enabled=true
eureka.instance.nonsecure-port-enabled=false
eureka.instance.nonSecurePort=80
eureka.instance.securePort=443
management.server.port=${server.port}
eureka.instance.instanceId=${eureka.instance.hostname}:${spring.application.name}:443
eureka.instance.statusPageUrl=https://${eureka.hostname}:443/actuator/info
eureka.instance.healthCheckUrl=https://${eureka.hostname}:443/actuator/health
eureka.instance.secureHealthCheckUrl=https://${eureka.hostname}:443/actuator/health
```

#### Example application.yml file

```yml
spring:
  application:
    name: exmaple-server
management:
  server:
    port: ${server.port}
eureka:
  client:
    serviceUrl:
      defaultZone: https://exmaple-server.azurewebsites.com:443/eureka
eureka:
  instance:
    hostname: exmaple-client.azurewebsites.com
    secure-port-enabled: true
    nonsecure-port-enabled: false
    nonSecurePort: 80
    securePort: 443
    instanceId: ${eureka.instance.hostname}:${spring.application.name}:443
    statusPageUrl: https://${eureka.hostname}:443/actuator/info
    healthCheckUrl: https://${eureka.hostname}:443/actuator/health
    secureHealthCheckUrl: https://${eureka.hostname}:443/actuator/health
```

#### Configure Web App to Only Accept HTTPS Traffic

1. Go to the app on Azure Portal
2. Under settings
3. Under TLS/SSL settings
4. Toggle HTTPS only to "On"

![Configure App to Only Accept HTTPS Traffic]({{site.baseurl}}/media/2020/08/EnableHTTPSOnly.png){: .align-center}

#### Explanation of Properties

```yml
spring.application.name=[YOUR APP NAME]
```

  Setting the application name is important for discovery by other services, which will look for the app by spring.application.name. For a Spring Boot based Netflix Eureka app, this is `spring.application.name`

```yml
eureka.client.serviceUrl.defaultZone=https://[YOUR SERVER HOSTNAME]:443/eureka
```

  The default server the client will broadcast to, allowing communication between the client and server and discovery of all services known by the server. In App Service, the server URL might look like: my-eureka-server.azurewebsites.net

```yml
eureka.instance.hostname=[YOUR CLIENT HOSTNAME]
```

  The url of the client itself should look like `my-eureka-client.azurewebsites.net`

```yml
eureka.instance.secure-port-enabled=true
eureka.instance.nonsecure-port-enabled=false
eureka.instance.nonSecurePort=80
eureka.instance.securePort=443
```

  It is recommended to use secure communication. In the case you do not want to use secure communication, set this to `false` and `eureka.instance.nonsecure-port-enabled=true`. Ensure that HTTPS Only setting in TLS/SSL settings is set to Off

```yml
management.server.port=${server.port}
eureka.instance.instanceId=${eureka.instance.hostname}:${spring.application.name}:443
eureka.instance.statusPageUrl=https://${eureka.hostname}:443/actuator/info
eureka.instance.healthCheckUrl=https://${eureka.hostname}:443/actuator/health
eureka.instance.secureHealthCheckUrl=https://${eureka.hostname}:443/actuator/health
```

  If using a service such as [Spring Actuator](https://spring.io/guides/gs/actuator-service/), the management server port must be defined as the same port as server.port. This is because the platform assigns a random port to server.port, which the platform then exposes as port 80 and port 443. As such, the Actuator must also communicate on the port which is chosen by the platform to be exposed to the internet.

#### Server Configuration

In eureka, applications can be clients, servers, or both. In the case an application is just a server and not a client, the following configuration in application.properties is required.

```yml
eureka.client.register-with-eureka=false
eureka.client.fetch-registry=false
```

## Get Started with Example Netflix Eureka Project

[Get the example project files here](https://github.com/Azure-Samples/app-service-netflix-eureka-windows)

Building and deploying the project requires:

- Java JDK 1.8
- Maven
- Azure cli

### An Overview of the Project

The project is composed of four web apps:

- 2 services which provide data (ratings-data-service, movie-info-service)
- 1 service which consumes data from the others (movie-catalog-service)
- 1 discovery server to allow the services discover each other (discovery-server)

The utility of Netflix Eureka for discovery is showcased in the catalog service, which consumes the ratings data and movie info in this block:

```java
@RequestMapping("/catalog/{userId}")
public List<CatalogItem> getCatalog(@PathVariable("userId") String userId) {

    UserRating userRating = restTemplate.getForObject("http://ratings-data-service/ratingsdata/user/" + userId, UserRating.class);

    return userRating.getRatings().stream()
      .map(rating -> {
        Movie movie = restTemplate.getForObject("http://movie-info-service/movies/" + rating.getMovieId(), Movie.class);
        return new CatalogItem(movie.getName(), movie.getDescription(), rating.getRating());
      })
      .collect(Collectors.toList());

}
```

The discovery server handles registering the movie info service and ratings data service such that they can be hosted on many machines at many URLS and be consumed by name.

### Building

Building requires Java JDK 1.8

Run

  ```bash
  mvn clean prepare-package package -DskipTests
  ```

### Deploying

Deploying is similar to [deploying a spring boot application using maven](https://docs.microsoft.com/en-us/azure/developer/java/spring-framework/deploy-spring-boot-java-app-with-maven-plugin). Make sure you are logged in through the Azure cli and have the correct subscription set

Then, run

  ```bash
  mvn azure-webapp:deploy -Dprefix=yourPrefix
  ```

**Note:** you should specify a prefix using -Dprefix=yourPrefix. This is to prevent name collision with another user running this demo. Pick a prefix that is unique to you or your organization. If a prefix is not set this way, a timestamp prefix will be generated based on the current time.

**Note:** the application.properties file of each of the services is generated based on client.application.properties.template. The application.properties file of the discovery server is generated from server.application.properties.template. This is to apply the prefix and ensure each application has the same properties. This happens in the prepare-package step of the build process.

To build and run the project in one command, use:

  ```bash
  mvn clean prepare-package package azure-webapp:deploy -Dprefix=yourPrefix -DskipTests
  ```

### The Service

After deployment, the project will be hosted on four Azure Webapps.

These can be accessed at:

```powershell
#Replace with your prefix
$prefix=microsoft-example

http://$prefix-discovery-server.azurewebsites.net/
http://$prefix-movie-catalog-service.azurewebsites.net/
http://$prefix-movie-info-service.azurewebsites.net/
http://$prefix-ratings-data-service.azurewebsites.net/
```

Where $prefix is the automatically generated prefix to ensure the web apps have a unique identifier.

The URLS can be accessed either through the output of the maven command, or on the Azure portal under the new resource group `$prefix-example-netflix-eureka-rg`

**IMPORTANT:** By default, this project is configured to use a free tier app service plan. These app service plans are not "always on" by default, which means they must be visited after deployment to start up. Additionally, they will stop after 20 minutes of inactivity.

Ensure that you visit the discovery server first. This allows the services register with it and discover each other. Then visit the movie info and ratings data services before the movie catalog service. This is because the movie catalog service requires data from the movie info service and ratings data service. Querying the movie catalog service before the movie info and ratings data services results in a 500 error.

A powershell script which performs the requests in correct order:

```powershell
#Replace with your prefix
$prefix=microsoft-example

Invoke-Webrequest -URI https://$prefix-discovery-server.azurewebsites.net
Invoke-Webrequest -URI https://$prefix-movie-info-service.azurewebsites.net
Invoke-Webrequest -URI https://$prefix-ratings-data-service.azurewebsites.net
Invoke-Webrequest -URI https://$prefix-movie-catalog-service.azurewebsites.net
```

The same can be done on bash using curl:

```bash
#Replace with your prefix
$prefix=microsoft-example

curl -s https://$prefix-discovery-server.azurewebsites.net
curl -s https://$prefix-movie-info-service.azurewebsites.net
curl -s https://$prefix-ratings-data-service.azurewebsites.net
curl -s https://$prefix-movie-catalog-service.azurewebsites.net
```

### Querying the Services

Data from the services can be accessed directly on each site. Data can also be retrieved as powershell objects through the Invoke-RestMethod command:

```powershell
#Replace with your prefix
$prefix=microsoft-example

Invoke-RestMethod -URI https://$prefix-movie-info-service.azurewebsites.net/movies/12 -ContentType "application/json"
Invoke-RestMethod -URI https://$prefix-ratings-data-service.azurewebsites.net/ratingsdata/movies/12 -ContentType "application/json"
Invoke-RestMethod -URI https://$prefix-movie-catalog-service.azurewebsites.net/catalog/12 -ContentType "application/json"
```

Or in bash:

```bash
#Replace with your prefix
$prefix=microsoft-example

curl -s https://$prefix-discovery-server.azurewebsites.net
curl -s https://$prefix-movie-info-service.azurewebsites.net/movies/12
curl -s https://$prefix-ratings-data-service.azurewebsites.net/ratingsdata/movies/12
curl -s https://$prefix-movie-catalog-service.azurewebsites.net/catalog/12
```

### Querying the Discovery Server

The discovery server can be queried to provide information about the services registered with it.

The following command gets the applications registered with the discovery server:

```powershell
$response = Invoke-RestMethod -URI https://$prefix-discovery-server.azurewebsites.net/eureka/apps -ContentType "application/json"

$response.applications

versions__delta apps__hashcode application
--------------- -------------- -----------
1               UP_3_          {MOVIE-INFO-SERVICE, RATINGS-DATA-SERVICE, MOVIE-CATALOG-SERVICE}
```

An individual service can then be queried as a powershell object:

```powershell
$catalogService = $response.applications.application | Where-Object {$_.name -eq "MOVIE-CATALOG-SERVICE"}

$catalogService.instance

instanceId                    : example-moive-catalog-service.azurewebsites.net:movie-catalog-service:443
hostName                      : example-moive-catalog-service.azurewebsites.net
app                           : MOVIE-CATALOG-SERVICE
ipAddr                        : 10.0.5.129
status                        : UP
overriddenstatus              : UNKNOWN
port                          : port
securePort                    : securePort
countryId                     : 1
dataCenterInfo                : dataCenterInfo
leaseInfo                     : leaseInfo
metadata                      : metadata
homePageUrl                   : http://example-moive-catalog-service.azurewebsites.net:80/
statusPageUrl                 : https://example-moive-catalog-service.azurewebsites.net:443/actuator/info
healthCheckUrl                : http://example-moive-catalog-service.azurewebsites.net:443/actuator/health
secureHealthCheckUrl          : https://example-moive-catalog-service.azurewebsites.net:443/actuator/health
vipAddress                    : movie-catalog-service
secureVipAddress              : movie-catalog-service
isCoordinatingDiscoveryServer : false
lastUpdatedTimestamp          : 1596156385669
lastDirtyTimestamp            : 1596156385326
actionType                    : ADDED
```

This means that services and discovery servers hosted on Azure can be accessed and consumed by other Eureka servers, including those hosted on other cloud service providers and local servers. While Netflix Eureka is designed for Java, it is possible to use this data to implement a Netflix Eureka client in any language.

## Securing Eureka

Without requiring authorization, any user can access the discovery server. This means that a malicious user has all of the information about every service and server registered, and can register their own malicious applications to your discovery server, potentially accessing sensative information.

### Basic Auth

Since our example application is based on Spring Boot, it can use Spring Boot's security to require credentials from clients before registering them.

1. In the pom.xml of the discovery server project, add this dependency:

    ```xml
    <dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    ```

2. In the application.properties of the discovery server, add the following:

    ```java
    spring.security.user.name=your-eureka-user
    spring.security.user.password=your-eureka-password
    ```

    **Note:** if adding to the example project, add the above properties to `server.application.properties.template`

3. Define a class in the discovery server project that extends WebSecurityConfigurerAdapter and overrides the configure() method

    ```java
    package io.javabrains.discoveryserver; //Package of the example project, replace with yours

    import org.springframework.context.annotation.Configuration;
    import org.springframework.security.config.annotation.web.builders.HttpSecurity;
    import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

    @Configuration
    public class SecurityConfig extends WebSecurityConfigurerAdapter {

      @Override
      protected void configure(HttpSecurity http) throws Exception {
          http.csrf().disable().authorizeRequests().anyRequest().authenticated().and().httpBasic();
      }

    }
    ```

    When you run the discovery server and navigate to it, there should now be a pop-up requesting a username and password

4. Modify the application.properties file of the client to include the username and password in the discovery server URL

    ```html
    eureka.client.serviceUrl.defaultZone=https://discovery-server.azurewebsites.net:443/eureka
    ```

    Should now be:

    ```html
    eureka.client.serviceUrl.defaultZone=https://username:password@discovery-server.azurewebsites.net:443/eureka
    ```

    **Note:**: if adding to the example project, add the username and password to `client.application.properties.template`

The client should now be able to successfully register with the eureka server.

### Security through Network Configuration

Using Azure's network security, it is possible to block traffic to your discovery server except for your services. This is possible by setting a Network Security Group which only allows communication to the discovery server from a select list or range of IP address.

[You can learn more about Network Security Groups here](https://docs.microsoft.com/en-us/azure/virtual-network/security-overview)

[You can read more about Azure Network Security here](https://docs.microsoft.com/en-us/azure/security/fundamentals/network-overview)