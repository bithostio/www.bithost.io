---
layout: guide
nav: guides
jsonld: jsonld/guide.html
title: "How to Scale Your Cloud Server Resources | Guides | bithost"
h1: "How to Scale Your Cloud Server Resources"
description: "As your website or application grows, you may need more CPU, RAM, or storage. Cloud servers make it easy to scale - this guide explains when and how to do ..."
canonical: "https://bithost.io/guides/scale-server-resources"
og_title: "How to Scale Your Cloud Server Resources - bithost Guide"
og_url: "https://bithost.io/guides/scale-server-resources"
og_description: "As your website or application grows, you may need more CPU, RAM, or storage. Cloud servers make it easy to scale - this guide explains when and how to do ..."
og_type: article
schema_type: Article
category: "Performance"
read_time: "3 min read"
updated: "May 2026"
toc:
  - { id: "vertical-scaling-upgrading-your-server-plan", label: "Vertical Scaling (Upgrading Your Server Plan)" }
  - { id: "horizontal-scaling-adding-more-servers", label: "Horizontal Scaling (Adding More Servers)" }
  - { id: "adding-block-storage-volumes", label: "Adding Block Storage Volumes" }
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
more CPU cores, more RAM, more storage.

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

1.  Log in to your control panel
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

## Adding Block Storage Volumes

If your server\'s disk is full but you don\'t want to upgrade the whole
plan, attach additional block storage:

1.  Go to your control panel → **Volumes** or **Block Storage**
2.  Create a new volume (e.g. 100 GB)
3.  Attach it to your server
4.  Mount it on the server:
^

    # Find the new disk (usually /dev/sdb or /dev/vdb)
    lsblk
    
    # Format it (only do this once on a new volume!)
    mkfs.ext4 /dev/sdb
    
    # Create a mount point
    mkdir /mnt/extra-storage
    
    # Mount it
    mount /dev/sdb /mnt/extra-storage
    
    # Make it persistent across reboots
    echo '/dev/sdb /mnt/extra-storage ext4 defaults 0 0' >> /etc/fstab
{: .language-bash}

## Monitoring Resource Usage

Before scaling, confirm what\'s actually consuming resources:

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
|----------
| CPU | &lt; 60% avg | 60–80% | &gt; 80% sustained |
| RAM | &lt; 75% | 75–90% | &gt; 90% |
| Disk | &lt; 70% | 70–85% | &gt; 85% |
| Load avg | &lt; # of CPUs | = # of CPUs | &gt; # of CPUs |
