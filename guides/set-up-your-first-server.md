---
layout: guide
nav: guides
jsonld: jsonld/guide.html
title: "How to Set Up Your First Cloud Server | Guides | bithost"
h1: "How to Set Up Your First Cloud Server"
description: "This guide walks you through spinning up your first cloud server from scratch - from ordering to a fully running Linux instance ready for use."
canonical: "https://bithost.io/guides/set-up-your-first-server"
og_title: "How to Set Up Your First Cloud Server - bithost Guide"
og_url: "https://bithost.io/guides/set-up-your-first-server"
og_description: "This guide walks you through spinning up your first cloud server from scratch - from ordering to a fully running Linux instance ready for use."
og_type: article
schema_type: HowTo
category: "Getting Started"
read_time: "3 min read"
updated: "May 2026"
toc:
  - { id: "prerequisites", label: "Prerequisites" }
  - { id: "step-1-log-in-to-your-control-panel", label: "Log In to Your Control Panel" }
  - { id: "step-2-choose-your-operating-system-os", label: "Choose Your Operating System (OS)" }
  - { id: "step-3-choose-your-server-location", label: "Choose Your Server Location" }
  - { id: "step-4-set-up-authentication", label: "Set Up Authentication" }
  - { id: "step-5-name-your-server", label: "Name Your Server" }
  - { id: "step-6-deploy", label: "Deploy" }
  - { id: "step-7-note-your-servers-ip-address", label: "Note Your Server's IP Address" }
sidebar_title: "Getting Started"
sidebar:
  - { url: "/guides/getting-started", label: "Deploy your first server" }
  - { url: "/guides/choose-the-right-plan", label: "Choose the right plan" }
  - { url: "/guides/connect-via-ssh", label: "Connect via SSH" }
  - { url: "/guides/understanding-your-dashboard", label: "Understanding your dashboard" }
  - { url: "/guides", label: "All guides →" }
---

This guide walks you through spinning up your first cloud server from
scratch - from ordering to a fully running Linux instance ready for use.

## Prerequisites

* An account with your cloud provider
* A chosen server plan ([How to Choose the Right
  Plan](/guides/choose-the-right-plan){: style="color:
  var(--rd-indigo);"})
* Basic familiarity with your email and a web browser

## Step 1: Log In to Your Control Panel

Go to your provider\'s dashboard and log in with your credentials. Once
inside, look for a **\"Create Server\"**, **\"Deploy\"**, or **\"New
Instance\"** button.

## Step 2: Choose Your Operating System (OS)

You\'ll be asked to select an OS image. The most common choices are:

| OS | Best For |
|----------
| **Ubuntu 22.04 LTS** | Beginners, most tutorials online use this |
| **Debian 12** | Lightweight, stable, great for servers |
| **CentOS Stream / AlmaLinux** | Enterprise environments |
| **Windows Server** | Windows-specific apps (usually costs extra) |

> **Recommendation:** If you\'re just getting started, choose **Ubuntu
> 22.04 LTS**. It has the largest community and the most guides
> available online.

## Step 3: Choose Your Server Location

Pick a data centre location that is **closest to your users** or to
yourself. Closer = lower latency = faster load times.

## Step 4: Set Up Authentication

You\'ll need a way to log in to your server securely. You have two
options:

### Option A: SSH Key (Recommended)

An SSH key is more secure than a password. If you already have one,
paste your public key during setup. If not, follow our [SSH
guide](/guides/connect-via-ssh){: style="color: var(--rd-indigo);"} to
generate one.

### Option B: Password

Set a strong root password. Make it at least 16 characters with a mix of
letters, numbers, and symbols. Store it in a password manager.

## Step 5: Name Your Server

Give your server a recognisable name (called a \"hostname\"), like
`my-website-server` or `vpn-server`. This is just a label for your own
reference.

## Step 6: Deploy

Click **Create** / **Deploy** / **Launch** - the button label varies by
provider. Your server will be provisioned in seconds to a few minutes.

## Step 7: Note Your Server\'s IP Address

Once the server is running, you\'ll see an **IPv4 address** in your
dashboard (e.g. `123.45.67.89`). This is how you\'ll connect to and
identify your server. Copy it somewhere handy.

## Step 8: Connect to Your Server

Now that it\'s running, connect via SSH:

    ssh root@YOUR_SERVER_IP
{: .language-bash}

Replace `YOUR_SERVER_IP` with the IP address from Step 7.

> For a full guide on connecting, see [How to Connect via
> SSH](/guides/connect-via-ssh){: style="color: var(--rd-indigo);"}.

## Step 9: Run Initial Updates

Once logged in, update all packages to make sure your server is current
and secure:

    apt update && apt upgrade -y
{: .language-bash}

## You\'re Live!

Your server is now up and running. Here are some common next steps:

* [How to Connect via SSH](/guides/connect-via-ssh){: style="color:
  var(--rd-indigo);"}
* [How to Secure Your Server](/guides/secure-your-server){:
  style="color: var(--rd-indigo);"}
* [How to Host a Website with
  Nginx](/guides/host-a-website-with-nginx){: style="color:
  var(--rd-indigo);"}


