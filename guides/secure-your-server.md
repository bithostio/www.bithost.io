---
layout: guide
nav: guides
jsonld: jsonld/guide.html
title: "How to Secure Your VPS | Guides | bithost"
h1: "How to Secure Your VPS"
description: "Secure your VPS step by step: create a non-root user, disable root SSH login, set up a UFW firewall, and install Fail2Ban."
canonical: "https://bithost.io/guides/secure-your-server/"
og_title: "How to Secure Your VPS - bithost Guide"
og_url: "https://bithost.io/guides/secure-your-server/"
og_description: "Secure your VPS step by step: create a non-root user, disable root SSH login, set up a UFW firewall, and install Fail2Ban."
og_type: article
schema_type: Article
category: "Security"
read_time: "3 min read"
updated: "June 2026"
date_published: "2026-05-01"
date_modified: "2026-06-15"
toc:
  - { id: "step-1-keep-the-system-updated", label: "Keep the System Updated" }
  - { id: "step-2-create-a-non-root-user", label: "Create a Non-Root User" }
  - { id: "step-3-disable-root-ssh-login", label: "Disable Root SSH Login" }
  - { id: "step-4-set-up-a-firewall-ufw", label: "Set Up a Firewall (UFW)" }
  - { id: "step-5-install-fail2ban", label: "Install Fail2Ban" }
  - { id: "step-6-use-ssh-keys-not-passwords", label: "Use SSH Keys (Not Passwords)" }
  - { id: "step-7-change-the-default-ssh-port-optional", label: "Change the Default SSH Port (Optional)" }
  - { id: "step-8-enable-automatic-security-patches", label: "Enable Automatic Security Patches" }
sidebar_title: "Security"
sidebar:
  - { url: "/guides/automated-backups", label: "Set up automated backups" }
  - { url: "/guides/monitor-suspicious-activity", label: "Monitor for threats" }
  - { url: "/guides/disable-ssh-keys", label: "Disable SSH key auth" }
  - { url: "/guides", label: "All guides →" }
---

A freshly deployed server is exposed to the internet and needs to be
hardened before it\'s production-ready - especially an [anonymous
VPS](/anonymous-vps/){: style="color: var(--rd-indigo);"} you run for
privacy. This guide covers the essential steps to harden a Linux server -
the security checklist every server owner should follow.

## Step 1: Keep the System Updated

Always run updates immediately after provisioning and regularly
thereafter:

    apt update && apt upgrade -y
{: .language-bash}

Enable automatic security updates:

    apt install unattended-upgrades -y
    dpkg-reconfigure --priority=low unattended-upgrades
{: .language-bash}

## Step 2: Create a Non-Root User

Running everything as `root` is dangerous. Create a regular user with
`sudo` privileges:

    adduser yourname
    usermod -aG sudo yourname
{: .language-bash}

Copy your SSH key to the new user:

    rsync --archive --chown=yourname:yourname ~/.ssh /home/yourname
{: .language-bash}

Test logging in as the new user in a **new terminal window** before
closing your root session.

## Step 3: Disable Root SSH Login

Edit the SSH configuration:

    nano /etc/ssh/sshd_config
{: .language-bash}

Find and update these lines:

    PermitRootLogin no
    PasswordAuthentication no

Restart SSH:

    systemctl restart sshd
{: .language-bash}

> ⚠️ Make sure you can log in as your new user via SSH key **before**
> disabling root login.

## Step 4: Set Up a Firewall (UFW)

UFW (Uncomplicated Firewall) is the easiest way to manage firewall rules
on Ubuntu.

    apt install ufw -y
    
    # Allow SSH (don't skip this or you'll lock yourself out)
    ufw allow OpenSSH
    
    # Allow web traffic if hosting a website
    ufw allow 'Nginx Full'
    
    # Enable the firewall
    ufw enable
    
    # Check status
    ufw status verbose
{: .language-bash}

Only allow ports that your server actually needs. Common ports:

| Port | Service |
| --- | --- |
| 22 | SSH |
| 80 | HTTP |
| 443 | HTTPS |
| 3306 | MySQL (only if needed externally) |
| 25565 | Minecraft |

## Step 5: Install Fail2Ban

Fail2Ban automatically bans IP addresses that make too many failed login
attempts.

    apt install fail2ban -y
    systemctl start fail2ban
    systemctl enable fail2ban
{: .language-bash}

Create a local config:

    cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
    nano /etc/fail2ban/jail.local
{: .language-bash}

Ensure the SSH jail is enabled:

    [sshd]
    enabled = true
    maxretry = 5
    bantime = 3600
{: .language-ini}

Restart Fail2Ban:

    systemctl restart fail2ban
{: .language-bash}

Check banned IPs:

    fail2ban-client status sshd
{: .language-bash}

## Step 6: Use SSH Keys (Not Passwords)

If you haven\'t already, disable password authentication for SSH (done
in Step 3) and use only SSH keys. This eliminates brute-force password
attacks entirely.

See: [How to Connect via SSH](/guides/connect-via-ssh/){: style="color:
var(--rd-indigo);"}

## Step 7: Change the Default SSH Port (Optional)

Changing the SSH port from 22 to a non-standard port reduces automated
scanning:

    nano /etc/ssh/sshd_config
{: .language-bash}

Change:

    Port 2222

Update your firewall:

    ufw allow 2222/tcp
    ufw delete allow OpenSSH
{: .language-bash}

Restart SSH:

    systemctl restart sshd
{: .language-bash}

Connect with: `ssh -p 2222 yourname@YOUR_SERVER_IP`

## Step 8: Enable Automatic Security Patches

Already covered in Step 1, but worth emphasising - `unattended-upgrades`
ensures critical patches are applied without manual intervention.

## Security Checklist

* ✅ System is up to date
* ✅ Non-root user created with sudo access
* ✅ Root SSH login disabled
* ✅ Password authentication disabled - SSH keys only
* ✅ UFW firewall enabled, only necessary ports open
* ✅ Fail2Ban installed and running
* ✅ Automatic security updates enabled

With your VPS hardened, set up [monitoring for suspicious
activity](/guides/monitor-suspicious-activity/){: style="color: var(--rd-indigo);"}
and [automated backups](/guides/automated-backups/){: style="color: var(--rd-indigo);"}
so you can detect and recover from incidents.
