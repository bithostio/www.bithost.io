---
layout: guide
nav: guides
jsonld: jsonld/guide.html
title: "What to Do If Your Server Is Unreachable | Guides | bithost"
h1: "What to Do If Your Server Is Unreachable"
description: "If you can't connect to your server via SSH or your website is down, follow this step-by-step guide to diagnose and fix the issue."
canonical: "https://bithost.io/guides/server-unreachable/"
og_title: "What to Do If Your Server Is Unreachable - bithost Guide"
og_url: "https://bithost.io/guides/server-unreachable/"
og_description: "If you can't connect to your server via SSH or your website is down, follow this step-by-step guide to diagnose and fix the issue."
og_type: article
schema_type: Article
category: "Troubleshooting"
read_time: "4 min read"
updated: "June 2026"
date_published: "2026-05-01"
date_modified: "2026-06-15"
toc:
  - { id: "step-1-check-server-status-in-your-dashboard", label: "Check Server Status in your dashboard" }
  - { id: "step-2-ping-the-server", label: "Ping the Server" }
  - { id: "step-3-check-if-ssh-is-running", label: "Check if SSH Is Running" }
  - { id: "step-4-check-if-your-websiteapp-is-running", label: "Check if Your Website/App Is Running" }
  - { id: "step-5-check-system-resources", label: "Check System Resources" }
  - { id: "step-6-reboot-the-server", label: "Reboot the Server" }
  - { id: "step-7-check-the-system-logs", label: "Check the System Logs" }
sidebar_title: "Troubleshooting"
sidebar:
  - { url: "/guides/failed-deployment", label: "Recover from failed deploy" }
  - { url: "/guides/common-errors", label: "Common error messages" }
  - { url: "/guides", label: "All guides →" }
---

If you can\'t connect to your server via SSH or your website is down,
follow this step-by-step guide to diagnose and fix the issue.

## Step 1: Check Server Status in your dashboard

Log in to your [bithost server dashboard](/guides/understanding-your-dashboard/){: style="color: var(--rd-indigo);"} and check:

* **Is the server running?** If it shows \"stopped\" or \"offline\",
  start it.

## Step 2: Ping the Server

From your local machine:

    ping YOUR_SERVER_IP
{: .language-bash}

* **If ping responds** - the server is online but a specific service
  (SSH, Nginx) may be down
* **If ping times out** - the server may be offline, crashed, or the
  firewall is blocking ICMP

## Step 3: Check if SSH Is Running

From the web console:

    systemctl status sshd
{: .language-bash}

If it\'s stopped:

    systemctl start sshd
{: .language-bash}

If SSH is running but you still can\'t connect from outside, check the
firewall:

    ufw status
{: .language-bash}

Make sure port 22 (or your custom SSH port) is allowed.

## Step 4: Check if Your Website/App Is Running

For Nginx:

    systemctl status nginx
{: .language-bash}

If stopped:

    systemctl start nginx
{: .language-bash}

Check for config errors:

    nginx -t
{: .language-bash}

For other services (MySQL, your app, etc.):

    systemctl status mysql
    systemctl status your-app-name
{: .language-bash}

## Step 5: Check System Resources

A server often becomes unresponsive when it runs out of RAM or disk
space:

    # RAM and swap
    free -h
    
    # Disk space
    df -h
    
    # CPU load
    uptime
{: .language-bash}

### Out of Disk Space

If disk is 100% full, the server may be unresponsive. Free up space:

    # Find and clear large log files
    du -sh /var/log/*
    truncate -s 0 /var/log/syslog
    
    # Remove old packages
    apt autoremove -y
    apt clean
{: .language-bash}

### Out of Memory

Check for OOM (out of memory) kills in the logs:

    dmesg | grep -i "oom"
    journalctl -k | grep -i "killed process"
{: .language-bash}

If a process was killed, restart it and consider upgrading your RAM.

## Step 6: Reboot the Server

If you can\'t identify the issue, a reboot often resolves it:

**From your [bithost server dashboard](/guides/understanding-your-dashboard/){: style="color: var(--rd-indigo);"}:** Use the Restart button.

Wait 1–2 minutes, then try connecting again.

## Step 7: Check the System Logs

After restoring access, review logs to find the root cause:

    journalctl -xe --since "1 hour ago"
    cat /var/log/syslog | tail -100
{: .language-bash}

## Common Causes and Fixes

| Symptom | Likely Cause | Fix |
| --- | --- | --- |
| Ping fails, console works | Firewall blocking traffic | Open required ports in UFW |
| SSH refuses connection | SSHD stopped or port blocked | Restart SSHD, check firewall |
| Website down but SSH works | Nginx/app crashed | Restart Nginx, check error logs |
| Server unresponsive entirely | OOM, disk full, kernel panic | Reboot via control panel, check logs |
| \"Too many authentication failures\" | Too many SSH key attempts | Add `IdentitiesOnly yes` to SSH config |

## Prevention

* Enable **automated backups** - restore quickly if all else fails
* Set up **uptime monitoring** (e.g. UptimeRobot) to be alerted
  immediately
* Configure **log rotation** to prevent logs from filling your disk
* Keep server software up to date to avoid crashes from known bugs
