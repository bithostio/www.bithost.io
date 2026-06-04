---
layout: guide
nav: guides
jsonld: jsonld/guide.html
title: "Understanding Your Server Dashboard and Control Panel | Guides | bithost"
h1: "Understanding Your Server Dashboard and Control Panel"
description: "A walkthrough of every tab in your bithost server dashboard - connection details, OS rebuild, plan resize, backups, snapshots, event log, and power controls."
canonical: "https://bithost.io/guides/understanding-your-dashboard"
og_title: "Understanding Your Server Dashboard and Control Panel - bithost Guide"
og_url: "https://bithost.io/guides/understanding-your-dashboard"
og_description: "A walkthrough of every tab in your bithost server dashboard - connection details, OS rebuild, plan resize, backups, snapshots, event log, and power controls."
og_type: article
schema_type: Article
category: "Getting Started"
read_time: "4 min read"
updated: "May 2026"
toc:
  - { id: "details", label: "Details tab" }
  - { id: "rebuild", label: "Rebuild tab" }
  - { id: "resize", label: "Resize tab" }
  - { id: "backups", label: "Backups tab" }
  - { id: "events", label: "Events tab" }
  - { id: "power", label: "Stop, Restart & Delete" }
sidebar_title: "Getting Started"
sidebar:
  - { url: "/guides/getting-started", label: "Deploy your first server" }
  - { url: "/guides/choose-the-right-plan", label: "Choose the right plan" }
  - { url: "/guides/connect-via-ssh", label: "Connect via SSH" }
  - { url: "/guides", label: "All guides →" }
---

Every server on bithost has its own control panel page. This is where
you manage everything - connection details, OS reinstalls, plan
upgrades, backups, and more. Here\'s a walkthrough of each tab.

<figure style="margin: 24px auto 32px; width: 100%; max-width: 640px;" markdown="1">
![bithost server dashboard - Details
tab](/assets/screenshots/bithost_server_management_dashboard_1.webp){:
width="1176" height="656" style="width: 100%; height: auto; display:
block; border-radius: 8px; border: 1px solid var(--rd-line);" loading="lazy"
fetchpriority="high"}
</figure>

At the top you\'ll see your server\'s name, provider, hourly and monthly
price, and the power toggle. The tabs below give access to everything
else.

## Details tab   {#details}

The default tab. It shows everything you need to connect to and identify
your server:

* **Connect** - the ready-to-use SSH command for your server
* **IPv4 / IPv6** - your server\'s public IP addresses
* **Private IPv4 / IPv6** - internal network addresses (within the
  provider\'s network)
* **Processor, Memory, Disk** - the resources your current plan includes
* **Image** - the OS installed on the server
* **Region** - the data centre location
* **Monthly cost / Current cost / Monthly traffic** - billing overview
  for the current period

## Rebuild tab   {#rebuild}

Wipes the server and installs a fresh OS. Use this if you want to start
over with a clean slate or switch to a different operating system.

<figure style="margin: 24px auto 32px; width: 100%; max-width: 640px;" markdown="1">
![bithost server - Rebuild tab, choosing a
distribution](/assets/screenshots/bithost_server_management_rebuild_2.webp){:
width="1188" height="692" style="width: 100%; height: auto; display:
block; border-radius: 8px; border: 1px solid var(--rd-line);"
loading="lazy"}
</figure>

The **Distribution** sub-tab lets you pick a fresh OS image - AlmaLinux,
CentOS, Debian, Fedora, Rocky Linux, or Ubuntu. The **Snapshot** sub-tab
lets you rebuild from one of your own saved snapshots instead.

<figure style="margin: 24px auto 32px; width: 100%; max-width: 640px;" markdown="1">
![bithost server - Rebuild from snapshot
sub-tab](/assets/screenshots/bithost_server_management_rebuild_from_snapshot_3.webp){:
width="1172" height="673" style="width: 100%; height: auto; display:
block; border-radius: 8px; border: 1px solid var(--rd-line);"
loading="lazy"}
</figure>

**Warning:** Rebuilding permanently deletes all data on the server. Take
a snapshot first if you need to preserve anything.
{: style="background: rgba(220,53,69,0.08); border-left: 3px solid #dc3545; border-radius: 0 6px 6px 0; padding: 12px 16px; margin: 0 0 24px; font-size: 15px;"}

## Resize tab   {#resize}

Upgrade your server\'s plan - more CPU, RAM, disk, or traffic. Plans are
grouped by type: General Purpose, CPU-Optimized, Memory-Optimized, and
Storage-Optimized.

<figure style="margin: 24px auto 32px; width: 100%; max-width: 640px;" markdown="1">
![bithost server - Resize tab showing plan
options](/assets/screenshots/bithost_server_management_resize_4.webp){:
width="1196" height="615" style="width: 100%; height: auto; display:
block; border-radius: 8px; border: 1px solid var(--rd-line);"
loading="lazy"}
</figure>

Note the **Permanent resize** toggle on the right. When off, only CPU
and RAM are increased and the resize can be reversed. When on, disk size
is also increased - this cannot be undone.

## Backups tab   {#backups}

Two options for protecting your data:

* **Automatic backups** - scheduled backups taken by the provider,
  charged at 20% of your server price. Toggle them on to enable.
* **Snapshots** - manual, on-demand copies of your entire disk. Enter a
  name and click **Create snapshot**. Snapshots cost $0.06/GB per month.

<figure style="margin: 24px auto 32px; width: 100%; max-width: 640px;" markdown="1">
![bithost server - Backups tab with automatic backups and snapshot
controls](/assets/screenshots/bithost_server_management_backups_and_snapshots_5.webp){:
width="1180" height="644" style="width: 100%; height: auto; display:
block; border-radius: 8px; border: 1px solid var(--rd-line);"
loading="lazy"}
</figure>

**Tip:** Take a snapshot before any major change - OS update, new
software install, or configuration change. It only takes a moment and
gives you a safe rollback point.
{: style="background: var(--rd-indigo-tint, rgba(79,100,225,0.08)); border-left: 3px solid var(--rd-indigo); border-radius: 0 6px 6px 0; padding: 12px 16px; margin: 0 0 24px; font-size: 15px;"}

## Events tab   {#events}

A full log of every action taken on the server - creation, renames,
restarts, rebuilds, and more - with UTC timestamps. Useful for
troubleshooting or auditing changes.

<figure style="margin: 24px auto 32px; width: 100%; max-width: 640px;" markdown="1">
![bithost server - Events tab showing action log with
timestamps](/assets/screenshots/bithost_server_management_view_events_6.webp){:
width="1162" height="610" style="width: 100%; height: auto; display:
block; border-radius: 8px; border: 1px solid var(--rd-line);"
loading="lazy"}
</figure>

## Stop, Restart &amp; Delete   {#power}

The power toggle and action buttons are always visible at the top right
of the server page, regardless of which tab you\'re on.

<figure style="margin: 24px auto 32px; width: 100%; max-width: 640px;" markdown="1">
![bithost server - power toggle, Restart button, and Delete button
highlighted](/assets/screenshots/bithost_server_management_stop_restart_delete_7.webp){:
width="1232" height="632" style="width: 100%; height: auto; display:
block; border-radius: 8px; border: 1px solid var(--rd-line);"
loading="lazy"}
</figure>

* **Toggle (ON/OFF)** - turns the server on or off. Stopping a server
  halts billing for compute time but disk storage continues to be
  charged.
* **Restart** - reboots the server. Use this after system updates or if
  the server becomes unresponsive.
* **Delete** (in the tab bar, in red) - permanently destroys the server
  and all its data. This cannot be undone.
