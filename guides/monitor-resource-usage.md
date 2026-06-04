---
layout: guide
nav: guides
jsonld: jsonld/guide.html
title: "How to Monitor CPU, RAM, and Disk Usage on Your Cloud Server | Guides | bithost"
h1: "How to Monitor CPU, RAM, and Disk Usage on Your Cloud Server"
description: "Monitoring your server's resources helps you catch performance issues early, plan for scaling, and spot unusual activity. This guide covers built-in tools ..."
canonical: "https://bithost.io/guides/monitor-resource-usage"
og_title: "How to Monitor CPU, RAM, and Disk Usage on Your Cloud Server - bithost Guide"
og_url: "https://bithost.io/guides/monitor-resource-usage"
og_description: "Monitoring your server's resources helps you catch performance issues early, plan for scaling, and spot unusual activity. This guide covers built-in tools ..."
og_type: article
schema_type: Article
category: "Performance"
read_time: "3 min read"
updated: "May 2026"
toc:
  - { id: "quick-real-time-monitoring", label: "Quick Real-Time Monitoring" }
  - { id: "cpu-monitoring", label: "CPU Monitoring" }
  - { id: "ram-monitoring", label: "RAM Monitoring" }
  - { id: "disk-monitoring", label: "Disk Monitoring" }
  - { id: "network-monitoring", label: "Network Monitoring" }
  - { id: "set-up-ongoing-monitoring-with-netdata", label: "Set Up Ongoing Monitoring with Netdata" }
  - { id: "set-up-alerts-with-uptime-monitoring", label: "Set Up Alerts with Uptime Monitoring" }
  - { id: "monitoring-checklist", label: "Monitoring Checklist" }
sidebar_title: "Performance"
sidebar:
  - { url: "/guides/scale-server-resources", label: "Scale server resources" }
  - { url: "/guides/migrate-a-website", label: "Migrate a website" }
  - { url: "/guides/setup-docker", label: "Set up Docker" }
  - { url: "/guides", label: "All guides →" }
---

Monitoring your server\'s resources helps you catch performance issues
early, plan for scaling, and spot unusual activity. This guide covers
built-in tools and how to set up ongoing monitoring.

## Quick Real-Time Monitoring

### htop - Interactive Process Viewer

    apt install htop -y
    htop
{: .language-bash}

**What you see:**

* CPU bars at the top (one per core)
* RAM and swap usage
* List of all running processes sorted by resource usage
* Press `F6` to sort by CPU or memory, `q` to quit

### top - Built-in Alternative

    top
{: .language-bash}

Similar to htop, but less visual. Press `q` to quit.

## CPU Monitoring

### Current CPU Usage

    # Average CPU load over 1, 5, and 15 minutes
    uptime
    
    # Detailed per-core stats
    mpstat -P ALL 1
{: .language-bash}

Install if needed: `apt install sysstat -y`

### Historical CPU Data

    sar -u 1 10   # CPU usage every 1 second, 10 times
{: .language-bash}

### What \"Load Average\" Means

    load average: 0.52, 0.67, 0.71

* Three numbers = last 1 min, 5 min, 15 min
* A value of `1.0` on a single-core server = 100% utilised
* On a 4-core server, load average of `4.0` = 100%
* **Rule of thumb:** load average should stay below your number of CPU
  cores

## RAM Monitoring

### Current Memory Usage

    free -h
{: .language-bash}

Example output:

                  total   used   free   shared  buff/cache  available
    Mem:          3.8Gi  1.2Gi  0.9Gi   85Mi     1.6Gi       2.3Gi

* **available** = how much RAM processes can actually use (more useful
  than \"free\")
* **buff/cache** = Linux uses spare RAM for caching - this is normal and
  healthy

### Top Memory Consumers

    ps aux --sort=-%mem | head -15
{: .language-bash}

## Disk Monitoring

### Disk Space Usage

    df -h
{: .language-bash}

Shows usage per partition. Pay attention to the partition where your
data lives (usually `/`).

### Directory-Level Usage

    du -sh /var/www/*     # How much space each website uses
    du -sh /var/log/*     # Log files (often unexpectedly large)
    du -sh /*             # Top-level breakdown
{: .language-bash}

### Find Large Files

    find / -type f -size +100M 2>/dev/null | sort -rh | head -20
{: .language-bash}

### Disk I/O

    iostat -x 1 5
{: .language-bash}

Shows read/write activity per disk. High `%util` means the disk is a
bottleneck.

## Network Monitoring

### Current Bandwidth Usage

    apt install nload -y
    nload
{: .language-bash}

Or use `iftop`:

    apt install iftop -y
    iftop
{: .language-bash}

### Total Data Transfer

    vnstat
{: .language-bash}

Install: `apt install vnstat -y` - shows daily/monthly traffic
summaries.

## Set Up Ongoing Monitoring with Netdata

Netdata provides beautiful real-time dashboards accessible from your
browser:

    bash <(curl -Ss https://my-netdata.io/kickstart.sh)
{: .language-bash}

Access at: `http://YOUR_SERVER_IP:19999`

It monitors CPU, RAM, disk, network, applications, and more - all in
real time with no configuration needed.

## Set Up Alerts with Uptime Monitoring

External monitoring pings your server and alerts you when it goes down:

* [UptimeRobot][1] - free, checks every 5 minutes
* [Freshping][2] - free tier available

## Monitoring Checklist

* ✅ `htop` installed for quick real-time checks
* ✅ `df -h` checked regularly to avoid full disks
* ✅ Log files reviewed or rotated to prevent them filling disk
* ✅ External uptime monitoring configured
* ✅ Load average understood relative to server CPU count

[1]: https://uptimerobot.com
[2]: https://freshping.io

