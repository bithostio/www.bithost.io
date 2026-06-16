---
layout: guide
nav: guides
jsonld: jsonld/guide.html
title: "How to Set Up a WireGuard VPN on a VPS | Guides | bithost"
h1: "How to Set Up a WireGuard VPN on a VPS"
description: "Set up your own WireGuard VPN on a VPS: install WireGuard, configure the server and client, and route traffic privately - no third-party VPN needed."
canonical: "https://bithost.io/guides/setup-vpn-server"
og_title: "How to Set Up a WireGuard VPN on a VPS - bithost Guide"
og_url: "https://bithost.io/guides/setup-vpn-server"
og_description: "Set up your own WireGuard VPN on a VPS: install WireGuard, configure the server and client, and route traffic privately - no third-party VPN needed."
og_type: article
schema_type: Article
category: "Use Cases"
read_time: "3 min read"
updated: "June 2026"
date_published: "2026-05-01"
date_modified: "2026-06-15"
toc:
  - { id: "why-use-your-own-vpn", label: "Why Use Your Own VPN?" }
  - { id: "prerequisites", label: "Prerequisites" }
  - { id: "step-1-install-wireguard", label: "Install WireGuard" }
  - { id: "step-2-generate-server-keys", label: "Generate Server Keys" }
  - { id: "step-3-generate-client-keys", label: "Generate Client Keys" }
  - { id: "step-4-create-the-server-config", label: "Create the Server Config" }
  - { id: "step-5-enable-ip-forwarding", label: "Enable IP Forwarding" }
  - { id: "step-6-open-the-firewall-port", label: "Open the Firewall Port" }
  - { id: "step-7-start-wireguard", label: "Start WireGuard" }
  - { id: "step-8-configure-the-client", label: "Configure the Client" }
  - { id: "verify-its-working", label: "Verify It's Working" }
sidebar_title: "Use Cases"
sidebar:
  - { url: "/guides/game-server", label: "Run a game server" }
  - { url: "/guides/nextcloud-cloud-storage", label: "Self-host with Nextcloud" }
  - { url: "/guides/host-nodejs-python-app", label: "Host a Node.js/Python app" }
  - { url: "/guides", label: "All guides →" }
---

Running your own VPN server gives you full privacy control, lets you
bypass geo-restrictions, and secures your traffic on public Wi-Fi -
without trusting a third-party VPN provider. This guide uses
**WireGuard**, the fastest and easiest modern VPN protocol. For an exit
node that isn\'t tied to your identity, run it on an [anonymous VPS](/anonymous-vps/){: style="color: var(--rd-indigo);"}
paid in crypto.

<img src="/assets/guides/wireguard-vpn-flow.svg" alt="How a self-hosted WireGuard VPN routes your traffic through your VPS" width="1000" height="300" loading="lazy" style="width: 100%; height: auto; display: block; margin: 8px 0 28px;">

## Why Use Your Own VPN?

A **WireGuard VPS** is simply a VPS running the WireGuard protocol - a
private, self-hosted VPN endpoint you fully control. The upside:

* No logs - you control all data
* No monthly VPN subscription fees
* Pick any server location worldwide
* Secure all your devices (phone, laptop, tablet)

## Prerequisites

* A VPS running Ubuntu 22.04 ([see vps prices](/prices/){: style="color: var(--rd-indigo);"}). Deploy your first [VPS with bithost](/guides/getting-started/){: style="color: var(--rd-indigo);"}.
* [SSH access to the server](/guides/connect-via-ssh/){: style="color: var(--rd-indigo);"}
* A client device (phone, laptop) to connect from

## Step 1: Install WireGuard

    apt update
    apt install wireguard -y
{: .language-bash}

## Step 2: Generate Server Keys

    wg genkey | tee /etc/wireguard/server_private.key | wg pubkey > /etc/wireguard/server_public.key
    chmod 600 /etc/wireguard/server_private.key
{: .language-bash}

View your keys:

    cat /etc/wireguard/server_private.key
    cat /etc/wireguard/server_public.key
{: .language-bash}

## Step 3: Generate Client Keys

    wg genkey | tee /etc/wireguard/client_private.key | wg pubkey > /etc/wireguard/client_public.key
{: .language-bash}

## Step 4: Create the Server Config

Find your network interface name:

    ip route | grep default
    # Look for something like: default via x.x.x.x dev eth0
{: .language-bash}

Create the config file (replace `eth0` with your interface name, and
paste your actual keys):

    nano /etc/wireguard/wg0.conf
{: .language-bash}

    [Interface]
    PrivateKey = YOUR_SERVER_PRIVATE_KEY
    Address = 10.0.0.1/24
    ListenPort = 51820
    PostUp = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
    PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
    
    [Peer]
    PublicKey = YOUR_CLIENT_PUBLIC_KEY
    AllowedIPs = 10.0.0.2/32
{: .language-ini}

## Step 5: Enable IP Forwarding

    echo "net.ipv4.ip_forward=1" >> /etc/sysctl.conf
    sysctl -p
{: .language-bash}

## Step 6: Open the Firewall Port

    ufw allow 51820/udp
{: .language-bash}

## Step 7: Start WireGuard

    systemctl enable wg-quick@wg0
    systemctl start wg-quick@wg0
    wg show
{: .language-bash}

## Step 8: Configure the Client

### On Linux / macOS

Install WireGuard, then create a config file at
`~/.config/wireguard/wg0.conf` or `/etc/wireguard/wg0.conf`:

    [Interface]
    PrivateKey = YOUR_CLIENT_PRIVATE_KEY
    Address = 10.0.0.2/24
    DNS = 1.1.1.1
    
    [Peer]
    PublicKey = YOUR_SERVER_PUBLIC_KEY
    Endpoint = YOUR_SERVER_IP:51820
    AllowedIPs = 0.0.0.0/0
    PersistentKeepalive = 25
{: .language-ini}

Connect:

    wg-quick up wg0
{: .language-bash}

### On Windows / Android / iOS

1.  Install the [WireGuard app][1]
2.  Create a new tunnel and paste the client config above
3.  Tap/click **Activate**

## Verify It\'s Working

Visit [https://whatismyip.com][2] - it should now show your **server\'s
IP address**, not your local one.

[1]: https://www.wireguard.com/install/
[2]: https://whatismyip.com

