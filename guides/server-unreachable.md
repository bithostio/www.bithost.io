---
layout: guide
nav: guides
jsonld: jsonld/guide.html
title: "What to Do If Your Server Is Unreachable | Guides | bithost"
h1: "What to Do If Your Server Is Unreachable"
description: "If you can't connect to your server via SSH or your website is down, follow this step-by-step guide to diagnose and fix the issue."
canonical: "https://bithost.io/guides/server-unreachable"
og_title: "What to Do If Your Server Is Unreachable - bithost Guide"
og_url: "https://bithost.io/guides/server-unreachable"
og_description: "If you can't connect to your server via SSH or your website is down, follow this step-by-step guide to diagnose and fix the issue."
og_type: article
schema_type: HowTo
category: "Troubleshooting"
read_time: "4 min read"
updated: "May 2026"
toc:
  - { id: "step-1-check-server-status-in-the-control-panel", label: "Check Server Status in the Control Panel" }
  - { id: "step-2-ping-the-server", label: "Ping the Server" }
  - { id: "step-3-try-the-web-console", label: "Try the Web Console" }
  - { id: "step-4-check-if-ssh-is-running", label: "Check if SSH Is Running" }
  - { id: "step-5-check-if-your-websiteapp-is-running", label: "Check if Your Website/App Is Running" }
  - { id: "step-6-check-system-resources", label: "Check System Resources" }
  - { id: "step-7-reboot-the-server", label: "Reboot the Server" }
  - { id: "step-8-check-the-system-logs", label: "Check the System Logs" }
sidebar_title: "Troubleshooting"
sidebar:
  - { url: "/guides/failed-deployment", label: "Recover from failed deploy" }
  - { url: "/guides/common-errors", label: "Common error messages" }
  - { url: "/guides", label: "All guides →" }
---

If you can\'t connect to your server via SSH or your website is down,
follow this step-by-step guide to diagnose and fix the issue.

## Step 1: Check Server Status in the Control Panel

Log in to your cloud provider\'s control panel and check:

* **Is the server running?** If it shows \"stopped\" or \"offline\",
  start it.
* **Are there any provider incidents?** Check your provider\'s status
  page for outages in your region.
* **Check the monitoring graphs** - sudden CPU or RAM spikes may
  indicate the cause.

## Step 2: Ping the Server

From your local machine:

    ping YOUR_SERVER_IP
{: .language-bash}

* **If ping responds** - the server is online but a specific service
  (SSH, Nginx) may be down
* **If ping times out** - the server may be offline, crashed, or the
  firewall is blocking ICMP

## Step 3: Try the Web Console

Your control panel should offer a **browser-based console** (also called
KVM, VNC, or Web Console). This gives you direct access even if SSH is
broken.

1.  Open the web console from the control panel
2.  Log in with your root/admin credentials
3.  Check what\'s happening on the system

## Step 4: Check if SSH Is Running

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

## Step 5: Check if Your Website/App Is Running

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

## Step 6: Check System Resources

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

## Step 7: Reboot the Server

If you can\'t identify the issue, a reboot often resolves it:

**From the control panel:** Use the Reboot button (preferred over Force
Off).

**From the web console or SSH:**

    reboot
{: .language-bash}

Wait 1–2 minutes, then try connecting again.

## Step 8: Check the System Logs

After restoring access, review logs to find the root cause:

    journalctl -xe --since "1 hour ago"
    cat /var/log/syslog | tail -100
{: .language-bash}

## Common Causes and Fixes

| Symptom | Likely Cause | Fix |
|----------
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
