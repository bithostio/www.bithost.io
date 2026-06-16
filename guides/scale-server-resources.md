---
layout: guide
nav: guides
jsonld: jsonld/guide.html
title: "How to Scale Your VPS Resources | Guides | bithost"
h1: "How to Scale Your VPS Resources"
description: "Scale your VPS as you grow: when to add CPU, RAM, or storage, how vertical resizing works, and how to resize safely without losing data."
canonical: "https://bithost.io/guides/scale-server-resources/"
og_title: "How to Scale Your VPS Resources - bithost Guide"
og_url: "https://bithost.io/guides/scale-server-resources/"
og_description: "Scale your VPS as you grow: when to add CPU, RAM, or storage, how vertical resizing works, and how to resize safely without losing data."
og_type: article
schema_type: Article
category: "Performance"
read_time: "3 min read"
updated: "June 2026"
date_published: "2026-05-01"
date_modified: "2026-06-15"
toc:
  - { id: "vertical-scaling-upgrading-your-server-plan", label: "Vertical Scaling (Upgrading Your Server Plan)" }
  - { id: "horizontal-scaling-adding-more-servers", label: "Horizontal Scaling (Adding More Servers)" }
  - { id: "monitoring-resource-usage", label: "Monitoring Resource Usage" }
  - { id: "resource-usage-reference", label: "Resource Usage Reference" }
sidebar_title: "Performance"
sidebar:
  - { url: "/guides/monitor-resource-usage", label: "Monitor resource usage" }
  - { url: "/guides/migrate-a-website", label: "Migrate a website" }
  - { url: "/guides/setup-docker", label: "Set up Docker" }
  - { url: "/guides", label: "All guides →" }
---

As your website or application grows, you may need more CPU, RAM, or
storage. Cloud servers make it easy to scale - this guide explains when
and how to do it.

## Vertical Scaling (Upgrading Your Server Plan)

Vertical scaling means upgrading your existing server to a larger plan -
more CPU cores, more RAM, more storage - up to a
[dedicated-CPU or bare-metal server](/prices/){: style="color: var(--rd-indigo);"}
for heavy, sustained workloads.

### When to Scale Up

Watch for these signs:

* **CPU consistently above 80%** - your server is underpowered for
  current load
* **RAM usage consistently above 85%** - risk of slowdowns and OOM (out
  of memory) crashes
* **Disk nearly full** - time to upgrade storage or add a volume
* **Response times increasing** - even though traffic hasn\'t changed
  dramatically

### How to Scale Up

1.  Log in to your [control panel](/guides/understanding-your-dashboard/#resize){: style="color: var(--rd-indigo);"}
2.  Navigate to your server\'s **Resize**, **Upgrade**, or **Scale**
    section
3.  Choose a larger plan
4.  Confirm - the server will typically reboot briefly

> **Note:** Most providers can scale up with a simple plan change.
> Scaling **down** may require a reinstall or manual migration,
> depending on the provider.

## Horizontal Scaling (Adding More Servers)

Horizontal scaling means running **multiple servers** rather than one
large one. This is for high-availability, large-scale applications.

### Common Architecture

    [Load Balancer]
         /    \
    [Server 1] [Server 2]
         \    /
      [Database Server]

* A **load balancer** distributes traffic across servers
* Each server runs the same application
* The database runs separately and is accessed by all app servers

This is more complex but provides redundancy - if one server fails, the
others keep running.

## Monitoring Resource Usage

Before scaling, [confirm what\'s actually consuming
resources](/guides/monitor-resource-usage/){: style="color: var(--rd-indigo);"}:

    # CPU and RAM usage
    htop
    
    # Disk usage
    df -h
    
    # Top memory consumers
    ps aux --sort=-%mem | head -10
    
    # Top CPU consumers
    ps aux --sort=-%cpu | head -10
{: .language-bash}

## Resource Usage Reference

| Metric | Healthy | Warning | Critical |
| --- | --- | --- | --- |
| CPU | &lt; 60% avg | 60–80% | &gt; 80% sustained |
| RAM | &lt; 75% | 75–90% | &gt; 90% |
| Disk | &lt; 70% | 70–85% | &gt; 85% |
| Load avg | &lt; # of CPUs | = # of CPUs | &gt; # of CPUs |
