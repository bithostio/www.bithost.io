---
layout: guide
nav: guides
jsonld: jsonld/guide.html
title: "How to Run a Game Server on a VPS | bithost"
h1: "How to Run a Game Server on a VPS"
description: "Run your own game server on a VPS: set up a Minecraft Java Edition server with the right specs, ports, and mods - the same steps work for other games."
canonical: "https://bithost.io/guides/game-server/"
og_title: "How to Run a Game Server on a VPS - bithost Guide"
og_url: "https://bithost.io/guides/game-server/"
og_description: "Run your own game server on a VPS: set up a Minecraft Java Edition server with the right specs, ports, and mods - the same steps work for other games."
og_type: article
schema_type: Article
category: "Use Cases"
read_time: "3 min read"
updated: "June 2026"
date_published: "2026-05-01"
date_modified: "2026-06-15"
toc:
  - { id: "prerequisites", label: "Prerequisites" }
  - { id: "setting-up-a-minecraft-java-edition-server", label: "Setting Up a Minecraft Java Edition Server" }
  - { id: "tips-for-other-games", label: "Tips for Other Games" }
sidebar_title: "Use Cases"
sidebar:
  - { url: "/guides/setup-vpn-server", label: "Set up a VPN server" }
  - { url: "/guides/nextcloud-cloud-storage", label: "Self-host with Nextcloud" }
  - { url: "/guides/host-nodejs-python-app", label: "Host a Node.js/Python app" }
  - { url: "/guides", label: "All guides →" }
---

Hosting your own game server gives you full control over settings, mods,
and who can join. This guide covers running a **Minecraft server on a
VPS** (Minecraft Java Edition) - and the same principles apply to other
games like Valheim, Terraria, or CS2.

## Prerequisites

* A cloud server with at least **2 vCPUs and 4 GB RAM** (8 GB
  recommended for modded Minecraft, or a
  [dedicated server](/bitcoin-vps/){: style="color: var(--rd-indigo);"}
  for a big community) - see [how to choose a
  plan](/guides/choose-the-right-plan/){: style="color: var(--rd-indigo);"}
* Ubuntu 22.04 with [SSH access](/guides/connect-via-ssh/){: style="color: var(--rd-indigo);"}
* Port 25565 open in your firewall (for Minecraft)

## Setting Up a Minecraft Java Edition Server

### Step 1: Install Java

Minecraft Java Edition requires Java 21:

    apt update
    apt install openjdk-21-jre-headless -y
    java -version
{: .language-bash}

### Step 2: Create a Dedicated User

Run the server as a non-root user for [security](/guides/secure-your-server/){: style="color: var(--rd-indigo);"}:

    adduser minecraft
    su - minecraft
{: .language-bash}

### Step 3: Download the Minecraft Server

Visit [https://www.minecraft.net/en-us/download/server][1] and copy the
download link for the latest `.jar` file, then:

    mkdir ~/minecraft-server && cd ~/minecraft-server
    wget https://launcher.mojang.com/v1/objects/LATEST_VERSION/server.jar -O server.jar
{: .language-bash}

### Step 4: Accept the EULA

Run the server once to generate config files:

    java -Xmx2G -Xms1G -jar server.jar nogui
{: .language-bash}

Accept the Minecraft End User License Agreement:

    echo "eula=true" > eula.txt
{: .language-bash}

### Step 5: Configure the Server

Edit `server.properties` to customise your server:

    nano server.properties
{: .language-bash}

Key settings:

    server-port=25565
    max-players=10
    difficulty=normal
    gamemode=survival
    level-name=world
    online-mode=true
    view-distance=10
{: .language-properties}

### Step 6: Open the Firewall

Back as root:

    ufw allow 25565/tcp
{: .language-bash}

### Step 7: Start the Server

    java -Xmx2G -Xms1G -jar server.jar nogui
{: .language-bash}

For a server with 4 GB of RAM, use:

    java -Xmx3G -Xms2G -jar server.jar nogui
{: .language-bash}

### Step 8: Keep the Server Running (Screen or systemd)

**Using Screen** (simplest):

    apt install screen -y
    screen -S minecraft
    java -Xmx3G -Xms2G -jar server.jar nogui
    # Detach: Ctrl+A then D
    # Reattach: screen -r minecraft
{: .language-bash}

**Using systemd** (recommended for auto-start on boot):

Create a service file as root:

    nano /etc/systemd/system/minecraft.service
{: .language-bash}

    [Unit]
    Description=Minecraft Server
    After=network.target
    
    [Service]
    User=minecraft
    WorkingDirectory=/home/minecraft/minecraft-server
    ExecStart=/usr/bin/java -Xmx3G -Xms2G -jar server.jar nogui
    Restart=on-failure
    
    [Install]
    WantedBy=multi-user.target
{: .language-ini}

Enable and start:

    systemctl daemon-reload
    systemctl enable minecraft
    systemctl start minecraft
{: .language-bash}

### Step 9: Connect to Your Server

Open Minecraft, go to **Multiplayer → Add Server**, and enter your
server\'s IP address:

    YOUR_SERVER_IP:25565

## Tips for Other Games

| Game | Install Method | Default Port |
| --- | --- | --- |
| Valheim | SteamCMD | 2456–2458 |
| Terraria | TShock server | 7777 |
| CS2 | SteamCMD | 27015 |
| Factorio | Factorio headless | 34197 |

Most games follow a similar pattern: install dependencies → download
server files → configure → open firewall port → run.

[1]: https://www.minecraft.net/en-us/download/server

