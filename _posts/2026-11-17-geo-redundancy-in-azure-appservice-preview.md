---
title: "Public Preview of Geo-redundancy in Azure App Service"
author_name: "Andrew Westgarth"
toc: true
toc_sticky: true
---

# Announcing the public preview of Geo-redundancy in Azure App Service

*Build resilient, multi-region applications with less complexity using managed regional replicas, application synchronization, and traffic routing.*

Building resilient web applications across Azure regions has traditionally meant deploying and maintaining separate applications, coordinating releases and configuration, and implementing traffic routing and failover. That work is important, but it adds operational complexity that can distract teams from delivering application value.

Today, at Microsoft Ignite 2026, we're announcing the **public preview of Geo-redundancy in Azure App Service**. It brings managed regional application replicas, supported application content and configuration synchronization, health-based routing, and regional failover into a unified App Service experience.

## Multi-region resiliency, without managing every deployment independently

With Geo-redundancy, you start with an eligible App Service web app and configure replicas in supported Azure regions. App Service provisions and manages the corresponding regional application and plan resources, synchronizes supported application revisions, and maintains the underlying Azure Traffic Manager routing configuration.

That means fewer independent deployment and traffic-management components for your team to operate. You remain in control of where replicas run, how traffic is routed, and when application revisions are synchronized.

Key capabilities in the preview include:

- **Managed regional replicas:** Add regional copies of an application without independently maintaining each deployment.
- **Application synchronization:** Keep supported published content and configuration aligned with the primary app.
- **Active and Passive traffic modes:** Serve traffic across healthy regions or prioritize a primary region with standby failover destinations.
- **Health-based routing and failover:** Route new connections to eligible, healthy regional endpoints based on the configured policy.
- **Revision control:** Validate synchronized versions and, where supported, pin a replica to a last-known-good application revision.

## Choose the routing model that fits your application

**Active mode** lets multiple healthy regions serve application traffic. Configure traffic weights to influence distribution across regional endpoints. This can be useful for applications designed to operate in multiple regions simultaneously.

**Passive mode** prioritizes a primary serving region and uses regional routing priorities to identify failover destinations. This can be useful when you want standby regional capacity rather than distributing normal traffic across all regions.

Geo-redundancy uses DNS-based Azure Traffic Manager routing. Traffic Manager directs clients to regional endpoints; it does not proxy application requests, preserve existing connections during an outage, or guarantee instantaneous failover. Your application and clients should tolerate DNS caching, retries, and interrupted requests.

## Deploy once, validate each region

Deploy supported application updates to the primary web app and use Geo-redundancy to synchronize supported application content and configuration to replicas. You can inspect revision status and control synchronization, including retaining a validated last-known-good revision for a replica when appropriate.

Continue to test each region's application readiness. A successful deployment or synchronized revision does not by itself establish that the application and its dependencies are healthy. Direct file changes outside supported deployment workflows may also require an explicit snapshot or synchronization action.

## Design resilience across the whole application

Geo-redundancy manages **App Service application hosting**, not the complete application stack. It does **not** replicate databases, live runtime state, Azure Storage, Azure Key Vault, external APIs, or other backing services. Customers remain responsible for the regional availability, consistency, networking, secrets, and recovery plans of those dependencies.

For example, a healthy regional app replica can still be unable to serve a request if its database is unavailable. Test regional failover end to end, including data access and downstream services.

## Get started with the public preview

The initial preview targets eligible **Windows web apps on Premium v3 and Premium v4 App Service plans** in supported multitenant regions. Preview regions, supported configurations, and limitations are subject to the published support matrix; review them before enabling the feature. In particular, confirm any custom-domain requirements against the final preview documentation rather than assuming existing configurations are supported.

To evaluate Geo-redundancy:

1. Review the preview requirements and select an eligible application and regions.
2. Configure a managed regional replica.
3. Choose Active or Passive routing and configure the applicable weights or priorities.
4. Deploy and verify a supported application revision in each region.
5. Test endpoint health, regional failover, recovery, and dependent services.

**Pricing:** Geo-redundancy adds a per-enabled-application monthly charge in addition to App Service compute charges in the primary and each replica region. Check the published Azure App Service pricing page for current prices and billing details.

## Build more resilient applications with Azure App Service

Regional resilience should not require every team to build its own multi-region deployment and traffic-management system. Geo-redundancy reduces that operational burden while giving you control over application revisions and regional routing.

**[Explore Geo-redundancy in Azure App Service and get started with the public preview](https://aka.ms/georedundancyonappservice).**