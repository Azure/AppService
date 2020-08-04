---
title: "Netflix Eureka on Apps Service (Windows)"
author_name: "Gregory Goldshteyn"
category: "java"
tags:
    - netflix eureka
    - microservices
toc: true
toc_sticky: true
---

[The Spring-Cloud-Netflix project](https://github.com/spring-cloud/spring-cloud-netflix) integrates Spring Boot style programming with useful Netflix components including Service Discovery (Eureka), Circuit Breaker (Hystrix), Intelligent Routing (Zuul) and Client Side Load Balancing (Ribbon). These components are useful for developing microservices.

## Sping-Cloud-Netflix on Apps Service

### Configurations

In Azure, there are several configurations that must be performed on eureka clients to get them working correctly in apps service. These settings can be included in an application.yml file, application.properties file, or as arguments to the JVM in the JAVA_OPTS app setting.

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

#### Explaination of Properties

```yml
spring.application.name=[YOUR APP NAME]
```

  Setting the application name is important for discovery by other services, which will look for the app by spring.application.name

```yml
eureka.client.serviceUrl.defaultZone=https://[YOUR SERVER HOSTNAME]:443/eureka
```

  The default server the client will broadcast to, allowing communication between the client and server and discovery of all services known by the server. In Apps Service, the server URL might look like: my-eureka-server.azurewebsites.net

```yml
eureka.instance.hostname=[YOUR CLIENT HOSTNAME]
```

  The url of the client itself. Should look like `my-eureka-client.azurewebsites.net`

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

  If using a service such as [Spring Actuator](https://spring.io/guides/gs/actuator-service/), the management server port must be defined as the same port as server.port. This is because the platform assigns a random port to server.port, which the platform then exposes as port 80 and port 443. As such, the Actuator must also communicate on the port which is chosen by the platform to be exposed to the internet

#### Server Configuration

In eureka, applications can be clients, servers, or both. In the case an application is just a server and not a client, the following configuration in application.properties is required.

```yml
eureka.client.register-with-eureka=false
eureka.client.fetch-registry=false
```

## Creating an Example Microservice

Get the example project files [here](https://github.com/GregoryGoldshteyn/spring-boot-microservices-workshop)

Building and deploying the project requires:

- Java 1.8
- Azure cli

### An Overview of the Project

The project is composed of four applications:

- 2 services which provide data (ratings-data-service, movie-info-service)
- 1 service which consumes data from the others (movie-catalog-service)
- 1 discovery server to allow the services discover each other (discovery-server)

The utility of microservices is showcased in the catalog service, which consumes the ratings data and movie info in this block:

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

Building requires Java 1.8

Run `mvn clean package -DskipTests`

### Deploying

Deploying is similar to [deploying a spring boot application using maven](https://docs.microsoft.com/en-us/azure/developer/java/spring-framework/deploy-spring-boot-java-app-with-maven-plugin). Make sure you are logged in through the Azure cli and have the correct subscription set

Then, run `mvn azure-webapp:deploy`

To build and run the project in one command, use `mvn clean package azure-webapp:deploy -DskipTests`

### The Service

After deployment, the project will be hosted on four Azure webapps.

These can be accessed at:

- http://(TIMESTAMP)-discovery-server.azurewebsites.net/
- http://(TIMESTAMP)-movie-catalog-service.azurewebsites.net/
- http://(TIMESTAMP)-movie-info-service.azurewebsites.net/
- http://(TIMESTAMP)-ratings-data-service.azurewebsites.net/

Where (TIMESTAMP) is the automatically generated timestamp to ensure the webapps have a unique identifier.

The URLS can be accessed either through the output of the maven command, or on the Azure portal under the new resource group `(TIMESTAMP)-example-springboot-microservices-rg`

**IMPORTANT**: Ensure that you visit the discovery server first. This ensures that the services are able to register with it and discover each other. Then visit the movie info and ratings data services before querying the movie catalog service. This is because the movie catalog service requires data from the movie info service and ratings data service. Querying the movie catalog service first results in a 500 error.

A powershell script which performs the requests in correct order:

```powershell
#Replace with your timestamp
$timestamp=200408173336

Invoke-Webrequest -URI https://$timestamp-discovery-server.azurewebsites.net
Invoke-Webrequest -URI https://$timestamp-movie-info-service.azurewebsites.net
Invoke-Webrequest -URI https://$timestamp-ratings-data-service.azurewebsites.net
Invoke-Webrequest -URI https://$timestamp-movie-catalog-service.azurewebsites.net
```

The same can be done on bash using curl:

```bash
$timestamp=200408173336

curl -s https://$timestamp-discovery-server.azurewebsites.net
curl -s https://$timestamp-movie-info-service.azurewebsites.net
curl -s https://$timestamp-ratings-data-service.azurewebsites.net
curl -s https://$timestamp-movie-catalog-service.azurewebsites.net
```

### Querying the Services

Data from the services can be accessed directly on each site. Data can also be retrieved as powershell objects through the Invoke-RestMethod command:

```powershell
#Replace with your timestamp
$timestamp=200408173336

Invoke-RestMethod -URI https://$timestamp-movie-info-service.azurewebsites.net/movies/12 -ContentType "application/json"
Invoke-RestMethod -URI https://$timestamp-ratings-data-service.azurewebsites.net/ratingsdata/movies/12 -ContentType "application/json"
Invoke-RestMethod -URI https://$timestamp-movie-catalog-service.azurewebsites.net/catalog/12 -ContentType "application/json"
```

Or in bash:

```bash
#Replace with your timestamp
$timestamp=200408173336

curl -s https://$timestamp-discovery-server.azurewebsites.net
curl -s https://$timestamp-movie-info-service.azurewebsites.net/movies/12
curl -s https://$timestamp-ratings-data-service.azurewebsites.net/ratingsdata/movies/12
curl -s https://$timestamp-movie-catalog-service.azurewebsites.net/catalog/12
```

### Querying the Discovery Server

The discovery server can be queried to provide information about the services registered with it.

The following command gets the applications registered with the discovery server

```powershell
$response = Invoke-RestMethod -URI https://$timestamp-discovery-server.azurewebsites.net/eureka/apps -ContentType "application/json"

$response.applications

versions__delta apps__hashcode application
--------------- -------------- -----------
1               UP_3_          {MOVIE-INFO-SERVICE, RATINGS-DATA-SERVICE, MOVIE-CATALOG-SERVICE}
```

An individual service can then be queried as a powershell object

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

This means that services and discovery servers hosted on Azure can be accessed and consumed by other Eureka servers, including those hosted on other cloud service providers and local servers.
