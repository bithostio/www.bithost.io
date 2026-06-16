---
layout: guide
nav: guides
jsonld: jsonld/guide.html
title: "How to Deploy a Cloud VPS with Bitcoin | bithost Guide"
h1: "Deploy your first VPS with bithost"
description: "Create a bithost account, top up with Bitcoin or Lightning, and deploy your first VPS in under 5 minutes. No KYC, no card."
canonical: "https://bithost.io/guides/getting-started/"
redirect_from:
  - /guides/set-up-your-first-server
  - /guides/set-up-your-first-server/
og_title: "How to Deploy a Cloud VPS with Bitcoin - bithost Guide"
og_url: "https://bithost.io/guides/getting-started/"
og_description: "Create your bithost account, top up with BTC or Lightning, and deploy a live cloud server in under 5 minutes. No ID required."
og_type: article
schema_type: Article
category: "Getting Started"
read_time: "5 min read"
updated: "June 2026"
date_published: "2026-05-01"
date_modified: "2026-06-15"
toc:
  - { id: "prerequisites", label: "Prerequisites" }
  - { id: "create-account", label: "1. Create account" }
  - { id: "top-up", label: "2. Top up balance" }
  - { id: "create-server", label: "3. Create a server" }
  - { id: "login", label: "4. Login to the server" }
---

This guide walks you through creating your first bithost account and
[buying a VPS with Bitcoin](/bitcoin-vps){: style="color: var(--rd-indigo);"}
or another coin. No ID, no credit card - just an email address and some
crypto.

## Prerequisites   {#prerequisites}

* A cryptocurrency wallet (Bitcoin, Lightning Network, ETH, LTC, DOGE,
  or any [supported coin](/pay-with-crypto){: style="color: var(--rd-indigo);"})
* An SSH key pair (we\'ll show you where to add it during server
  creation)
* About 5 minutes

## 1. Create a free account   {#create-account}

Go to [dashboard.bithost.io/registration][1]{: style="color:
var(--rd-indigo);"} and enter your email address and a password.

<figure style="margin: 24px auto 32px; max-width: 640px;" markdown="1">
![bithost registration form with email and password
fields](/assets/screenshots/bithost_registration_form.webp){:
width="497" height="478" style="max-width: 100%; height: auto;
border-radius: 8px; border: 1px solid var(--rd-line);"
fetchpriority="high" srcset="/assets/screenshots/bithost_registration_form_740w.webp 740w, /assets/screenshots/bithost_registration_form.webp 994w" sizes="(max-width: 680px) 100vw, 640px"}
</figure>

Before completing registration, read the [Terms of Service](/terms){: style="color: var(--rd-indigo);"}.

<figure style="margin: 24px auto 32px; max-width: 640px;" markdown="1">
![bithost registration - accepting the terms of
service](/assets/screenshots/bithost_registration_form_terms.webp){:
width="970" height="660" style="max-width: 100%; height: auto;
border-radius: 8px; border: 1px solid var(--rd-line);" loading="lazy" srcset="/assets/screenshots/bithost_registration_form_terms_740w.webp 740w, /assets/screenshots/bithost_registration_form_terms_1480w.webp 1480w" sizes="(max-width: 680px) 100vw, 640px"}
</figure>

<figure style="margin: 24px auto 32px; max-width: 640px;" markdown="1">
![bithost registration complete
screen](/assets/screenshots/bithost_complete_registration.webp){:
width="708" height="719" style="max-width: 100%; height: auto;
border-radius: 8px; border: 1px solid var(--rd-line);" loading="lazy" srcset="/assets/screenshots/bithost_complete_registration_740w.webp 740w, /assets/screenshots/bithost_complete_registration.webp 1416w" sizes="(max-width: 680px) 100vw, 640px"}
</figure>

That\'s the entire signup flow - no phone number, no ID, no credit card.
bithost does not require any address or KYC verification.

You will receive a confirmation email. Click the link to verify your
address (required to receive low-balance alerts).

## 2. Top up your balance   {#top-up}

Click the **Top up** button in the dashboard.

<figure style="margin: 24px auto 32px; max-width: 640px;" markdown="1">
![bithost dashboard with the Top up button
highlighted](/assets/screenshots/bithost_profile_view_top_up.webp){:
width="1209" height="439" style="max-width: 100%; height: auto;
border-radius: 8px; border: 1px solid var(--rd-line);" loading="lazy" srcset="/assets/screenshots/bithost_profile_view_top_up_740w.webp 740w, /assets/screenshots/bithost_profile_view_top_up_1480w.webp 1480w" sizes="(max-width: 680px) 100vw, 640px"}
</figure>

Choose your preferred cryptocurrency and send the amount to the
generated address.

<figure style="margin: 24px auto 32px; max-width: 640px;" markdown="1">
![bithost top up balance screen with cryptocurrency
options](/assets/screenshots/bithost_top_up_balance.webp){: width="406"
height="239" style="max-width: 100%; height: auto; border-radius: 8px;
border: 1px solid var(--rd-line);" loading="lazy" srcset="/assets/screenshots/bithost_top_up_balance_740w.webp 740w, /assets/screenshots/bithost_top_up_balance.webp 812w" sizes="(max-width: 680px) 100vw, 640px"}
</figure>

* **Bitcoin (BTC)** - On-chain. Credits once the transaction has 1
  confirmation (typically 10-20 min).
* **Lightning Network** - Instant. Credits in under a second.
  Recommended for fast, low-fee top-ups.
* **ETH, LTC, DOGE, [USDC](/usdc-vps){: style="color: var(--rd-indigo);"}, XRP, ZEC, BCH and more** - Credits after
  network confirmation. [Full list of supported coins
  →](/pay-with-crypto){: style="color: var(--rd-indigo);"}

Your balance is denominated in USD and converted at the exchange rate at
the time of deposit. A fresh deposit address is generated for each
top-up.

## 3. Create a server   {#create-server}

Go to [dashboard.bithost.io/servers][2]{: style="color:
var(--rd-indigo);"} and click **Launch server**.

<figure style="margin: 24px auto 32px; max-width: 640px;" markdown="1">
![bithost servers dashboard with Launch server
button](/assets/screenshots/bithost_launch_server_screen.webp){:
width="889" height="477" style="max-width: 100%; height: auto;
border-radius: 8px; border: 1px solid var(--rd-line);" loading="lazy" srcset="/assets/screenshots/bithost_launch_server_screen_740w.webp 740w, /assets/screenshots/bithost_launch_server_screen_1480w.webp 1480w" sizes="(max-width: 680px) 100vw, 640px"}
</figure>

**Pick a provider and region.** bithost runs on DigitalOcean, Linode,
and Vultr across 30+ locations worldwide. Not sure which to choose? See
the [choose the right plan guide](/guides/choose-the-right-plan){:
style="color: var(--rd-indigo);"}.

<figure style="margin: 24px auto 32px; max-width: 640px;" markdown="1">
![server creation - selecting a provider and
region](/assets/screenshots/bithost_create_server_provider_region_select.webp){:
width="1209" height="799" style="max-width: 100%; height: auto;
border-radius: 8px; border: 1px solid var(--rd-line);" loading="lazy" srcset="/assets/screenshots/bithost_create_server_provider_region_select_740w.webp 740w, /assets/screenshots/bithost_create_server_provider_region_select_1480w.webp 1480w" sizes="(max-width: 680px) 100vw, 640px"}
</figure>

**Select a size.** Plans start from $0.015/hr. Choose the CPU, RAM, and
disk that fits your workload. [See the prices](/prices){: style="color:
var(--rd-indigo);"}.

<figure style="margin: 24px auto 32px; max-width: 640px;" markdown="1">
![server creation - selecting a plan
size](/assets/screenshots/bithost_create_server_size_select.webp){:
width="1234" height="830" style="max-width: 100%; height: auto;
border-radius: 8px; border: 1px solid var(--rd-line);" loading="lazy" srcset="/assets/screenshots/bithost_create_server_size_select_740w.webp 740w, /assets/screenshots/bithost_create_server_size_select_1480w.webp 1480w" sizes="(max-width: 680px) 100vw, 640px"}
</figure>

**Select an image.** Ubuntu, Debian, CentOS, Fedora, Windows, and more
are available. The most common choices are:

<table style="width: 100%; border-collapse: collapse; margin: 16px 0 12px; font-size: 15px;">
        <thead>
          <tr style="border-bottom: 2px solid var(--rd-line);">
            <th style="text-align: left; padding: 10px 14px 10px 0; font-weight: 600; color: var(--rd-ink);">OS</th>
            <th style="text-align: left; padding: 10px 14px; font-weight: 600; color: var(--rd-ink);">Best For</th>
          </tr>
        </thead>
        <tbody>
          <tr style="border-bottom: 1px solid var(--rd-line);">
            <td style="padding: 10px 14px 10px 0; white-space: nowrap; font-family: 'JetBrains Mono', monospace; font-size: 13px;">Ubuntu 22.04 LTS</td>
            <td style="padding: 10px 14px;">Beginners - most tutorials online use this</td>
          </tr>
          <tr style="border-bottom: 1px solid var(--rd-line);">
            <td style="padding: 10px 14px 10px 0; white-space: nowrap; font-family: 'JetBrains Mono', monospace; font-size: 13px;">Debian 12</td>
            <td style="padding: 10px 14px;">Lightweight, stable, great for servers</td>
          </tr>
          <tr style="border-bottom: 1px solid var(--rd-line);">
            <td style="padding: 10px 14px 10px 0; white-space: nowrap; font-family: 'JetBrains Mono', monospace; font-size: 13px;">CentOS Stream / AlmaLinux</td>
            <td style="padding: 10px 14px;">Enterprise environments</td>
          </tr>
          <tr>
            <td style="padding: 10px 14px 10px 0; white-space: nowrap; font-family: 'JetBrains Mono', monospace; font-size: 13px;">Windows Server</td>
            <td style="padding: 10px 14px;"><a href="/windows-vps-bitcoin" style="color: var(--rd-indigo);">Windows-specific apps</a> (usually costs extra)</td>
          </tr>
        </tbody>
      </table>

**Recommendation:** If you\'re just getting started, choose **Ubuntu
22.04 LTS**. It has the largest community and the most guides available
online.
{: style="background: var(--rd-indigo-tint, rgba(79,100,225,0.08)); border-left: 3px solid var(--rd-indigo); border-radius: 0 6px 6px 0; padding: 12px 16px; margin: 0 0 24px; font-size: 15px;"}

<figure style="margin: 24px auto 32px; max-width: 640px;" markdown="1">
![server creation - selecting an OS
image](/assets/screenshots/bithost_create_server_image_select.webp){:
width="1210" height="458" style="max-width: 100%; height: auto;
border-radius: 8px; border: 1px solid var(--rd-line);" loading="lazy" srcset="/assets/screenshots/bithost_create_server_image_select_740w.webp 740w, /assets/screenshots/bithost_create_server_image_select_1480w.webp 1480w" sizes="(max-width: 680px) 100vw, 640px"}
</figure>

**Add your SSH key.** bithost uses SSH key authentication - there are no
passwords emailed to you. Paste your public key and give it a name. If
you don\'t have a key pair yet, [generate one
first](/guides/ssh-keys/){: style="color: var(--rd-indigo);"}:

    ssh-keygen -t ed25519 -C "your@email.com"

Then copy your public key: `cat ~/.ssh/id_ed25519.pub`

<figure style="margin: 24px auto 32px; max-width: 640px;" markdown="1">
![server creation - Add SSH key
section](/assets/screenshots/bithost_create_server_add_ssh.webp){:
width="996" height="352" style="max-width: 100%; height: auto;
border-radius: 8px; border: 1px solid var(--rd-line);" loading="lazy" srcset="/assets/screenshots/bithost_create_server_add_ssh_740w.webp 740w, /assets/screenshots/bithost_create_server_add_ssh_1480w.webp 1480w" sizes="(max-width: 680px) 100vw, 640px"}
</figure>

<figure style="margin: 24px auto 32px; max-width: 640px;" markdown="1">
![server creation - SSH key added
successfully](/assets/screenshots/bithost_create_server_add_ssh_2.webp){:
width="1032" height="710" style="max-width: 100%; height: auto;
border-radius: 8px; border: 1px solid var(--rd-line);" loading="lazy" srcset="/assets/screenshots/bithost_create_server_add_ssh_2_740w.webp 740w, /assets/screenshots/bithost_create_server_add_ssh_2_1480w.webp 1480w" sizes="(max-width: 680px) 100vw, 640px"}
</figure>

**Enter a name** for your server, then click **Create server**. Your
server setup will begin and it will take a moment to be completely
ready.

<figure style="margin: 24px auto 32px; max-width: 640px;" markdown="1">
![bithost servers list showing the newly created
server](/assets/screenshots/bithost_dashboard_servers_list.webp){:
width="1203" height="514" style="max-width: 100%; height: auto;
border-radius: 8px; border: 1px solid var(--rd-line);" loading="lazy" srcset="/assets/screenshots/bithost_dashboard_servers_list_740w.webp 740w, /assets/screenshots/bithost_dashboard_servers_list_1480w.webp 1480w" sizes="(max-width: 680px) 100vw, 640px"}
</figure>

## 4. Login to the server   {#login}

Once the server status shows **Active**, copy the IP address from the
dashboard and [connect via SSH](/guides/connect-via-ssh/){: style="color: var(--rd-indigo);"}.

If you added an SSH key during setup:

    ssh -i ~/.ssh/id_ed25519 root@YOUR_SERVER_IP

If you\'re using the default key location and it\'s already in your
`~/.ssh/authorized_keys`, the shorter form works too:

    ssh root@YOUR_SERVER_IP

On Windows, use [PuTTY](https://www.putty.org/){: target="_blank"
rel="noopener" style="color: var(--rd-indigo);"} or the built-in
terminal in Windows 11. On macOS and Linux, the `ssh` command is
available out of the box.

You\'re in. Your server is live, billed per hour, and paid entirely in
crypto.

[1]: https://dashboard.bithost.io/registration
[2]: https://dashboard.bithost.io/servers
