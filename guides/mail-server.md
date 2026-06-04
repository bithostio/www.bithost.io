---
layout: guide
nav: guides
jsonld: jsonld/guide.html
title: "How to Set Up a Mail Server on Your Cloud Server | Guides | bithost"
h1: "How to Set Up a Mail Server on Your Cloud Server"
description: "Running your own mail server gives you full control over your email, no storage limits, and no dependence on Gmail or Outlook. However, it requires careful..."
canonical: "https://bithost.io/guides/mail-server"
og_title: "How to Set Up a Mail Server on Your Cloud Server - bithost Guide"
og_url: "https://bithost.io/guides/mail-server"
og_description: "Running your own mail server gives you full control over your email, no storage limits, and no dependence on Gmail or Outlook. However, it requires careful..."
og_type: article
schema_type: HowTo
category: "Use Cases"
read_time: "3 min read"
updated: "May 2026"
toc:
  - { id: "before-you-start", label: "⚠️ Before You Start" }
  - { id: "prerequisites", label: "Prerequisites" }
  - { id: "step-1-install-docker", label: "Install Docker" }
  - { id: "step-2-set-up-dns-records", label: "Set Up DNS Records" }
  - { id: "step-3-install-mailcow", label: "Install Mailcow" }
  - { id: "step-4-start-mailcow", label: "Start Mailcow" }
  - { id: "step-5-access-the-admin-panel", label: "Access the Admin Panel" }
  - { id: "step-6-add-your-domain", label: "Add Your Domain" }
sidebar_title: "Use Cases"
sidebar:
  - { url: "/guides/setup-vpn-server", label: "Set up a VPN server" }
  - { url: "/guides/game-server", label: "Run a game server" }
  - { url: "/guides/nextcloud-cloud-storage", label: "Self-host with Nextcloud" }
  - { url: "/guides/host-nodejs-python-app", label: "Host a Node.js/Python app" }
  - { url: "/guides", label: "All guides →" }
---

Running your own mail server gives you full control over your email, no
storage limits, and no dependence on Gmail or Outlook. However, it
requires careful configuration. This guide uses **Mailcow** - the
easiest modern all-in-one mail server stack.

## ⚠️ Before You Start

Running a mail server is more complex than other use cases. Be aware:

* Your server\'s IP must **not be on any spam blacklists** - check at
  [mxtoolbox.com/blacklists][1]
* **Port 25 must be open** - some cloud providers block it by default;
  contact support to request it be opened
* You need a **domain with full DNS control**
* This guide uses Docker - install it first if you haven\'t

## Prerequisites

* Ubuntu 22.04 server with at least **2 vCPUs and 4 GB RAM** (6 GB
  recommended)
* A domain name with DNS access
* Ports 25, 80, 110, 143, 443, 465, 587, 993, 995 open in your firewall
* Docker and Docker Compose installed

## Step 1: Install Docker

    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
{: .language-bash}

## Step 2: Set Up DNS Records

In your domain registrar, add the following DNS records:

| Type | Name | Value |
|----------
| A | `mail` | `YOUR_SERVER_IP` |
| MX | `@` | `mail.yourdomain.com` (priority 10) |
| TXT | `@` | `v=spf1 mx ~all` |
| CNAME | `autodiscover` | `mail.yourdomain.com` |
| CNAME | `autoconfig` | `mail.yourdomain.com` |

Also set **reverse DNS (rDNS)** in your server control panel to
`mail.yourdomain.com` - this is critical for email deliverability.

## Step 3: Install Mailcow

    cd /opt
    git clone https://github.com/mailcow/mailcow-dockerized mailcow
    cd mailcow
    ./generate_config.sh
{: .language-bash}

When prompted, enter your mail hostname: `mail.yourdomain.com`

## Step 4: Start Mailcow

    docker compose pull
    docker compose up -d
{: .language-bash}

This will download and start all required containers (Postfix, Dovecot,
Rspamd, SOGo, and more). It may take a few minutes.

## Step 5: Access the Admin Panel

Visit in your browser:

    https://mail.yourdomain.com

Default credentials:

* **Username:** `admin`
* **Password:** `moohoo`

> **Change the admin password immediately** after first login.

## Step 6: Add Your Domain

1.  Go to **Configuration → Mail Setup → Domains**
2.  Add `yourdomain.com`
3.  Follow the instructions to add **DKIM** and **DMARC** DNS records
    (shown in the panel)

## Step 7: Create a Mailbox

1.  Go to **Configuration → Mail Setup → Mailboxes**
2.  Click **Add mailbox**
3.  Set username (e.g. `you`), domain, and password
4.  Your email address will be `you@yourdomain.com`

## Step 8: Connect Your Email Client

Use any standard email client (Thunderbird, Outlook, Apple Mail, mobile
apps):

| Setting | Value |
|----------
| IMAP server | `mail.yourdomain.com` |
| IMAP port | 993 (SSL) |
| SMTP server | `mail.yourdomain.com` |
| SMTP port | 587 (STARTTLS) |
| Username | Full email address |

## Step 9: Test Email Deliverability

Send a test email from your new mailbox and check your spam score:

* [mail-tester.com][2] - aim for 9+/10
* [mxtoolbox.com][3] - verify SPF, DKIM, DMARC

## Keeping Mailcow Updated

    cd /opt/mailcow
    ./update.sh
{: .language-bash}

## Alternative: Simpler Hosted Email

If managing your own mail server sounds too complex, consider a managed
email service that works with your domain: **Fastmail**, **Migadu**, or
**Proton Mail for Business** - affordable and handles all the complexity
for you.

[1]: https://mxtoolbox.com/blacklists.aspx
[2]: https://www.mail-tester.com
[3]: https://mxtoolbox.com

