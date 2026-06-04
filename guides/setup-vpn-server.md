---
layout: guide
nav: guides
jsonld: jsonld/guide.html
title: "How to Set Up a VPN on Your Cloud Server | Guides | bithost"
h1: "How to Set Up a VPN on Your Cloud Server"
description: "Running your own VPN server gives you full privacy control, lets you bypass geo-restrictions, and secures your traffic on public Wi-Fi - without trusting a..."
canonical: "https://bithost.io/guides/setup-vpn-server"
og_title: "How to Set Up a VPN on Your Cloud Server - bithost Guide"
og_url: "https://bithost.io/guides/setup-vpn-server"
og_description: "Running your own VPN server gives you full privacy control, lets you bypass geo-restrictions, and secures your traffic on public Wi-Fi - without trusting a..."
og_type: article
schema_type: HowTo
category: "Use Cases"
read_time: "3 min read"
updated: "May 2026"
toc:
  - { id: "why-use-your-own-vpn", label: "Why Use Your Own VPN?" }
  - { id: "prerequisites", label: "Prerequisites" }
  - { id: "step-1-install-wireguard", label: "Install WireGuard" }
  - { id: "step-2-generate-server-keys", label: "Generate Server Keys" }
  - { id: "step-3-generate-client-keys", label: "Generate Client Keys" }
  - { id: "step-4-create-the-server-config", label: "Create the Server Config" }
  - { id: "step-5-enable-ip-forwarding", label: "Enable IP Forwarding" }
  - { id: "step-6-open-the-firewall-port", label: "Open the Firewall Port" }
sidebar_title: "Use Cases"
sidebar:
  - { url: "/guides/game-server", label: "Run a game server" }
  - { url: "/guides/nextcloud-cloud-storage", label: "Self-host with Nextcloud" }
  - { url: "/guides/host-nodejs-python-app", label: "Host a Node.js/Python app" }
  - { url: "/guides/mail-server", label: "Set up a mail server" }
  - { url: "/guides", label: "All guides →" }
---

Running your own VPN server gives you full privacy control, lets you
bypass geo-restrictions, and secures your traffic on public Wi-Fi -
without trusting a third-party VPN provider. This guide uses
**WireGuard**, the fastest and easiest modern VPN protocol.

## Why Use Your Own VPN?

* No logs - you control all data
* No monthly VPN subscription fees
* Pick any server location worldwide
* Secure all your devices (phone, laptop, tablet)

## Prerequisites

* A cloud server running Ubuntu 22.04
* SSH access to the server
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

