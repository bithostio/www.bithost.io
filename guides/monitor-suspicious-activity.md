---
layout: guide
nav: guides
jsonld: jsonld/guide.html
title: "How to Monitor a VPS for Suspicious Activity | bithost"
h1: "How to Monitor a VPS for Suspicious Activity"
description: "Monitor your VPS for suspicious activity: check logins and auth logs, watch processes and network connections, and review system logs."
canonical: "https://bithost.io/guides/monitor-suspicious-activity/"
og_title: "How to Monitor a VPS for Suspicious Activity - bithost Guide"
og_url: "https://bithost.io/guides/monitor-suspicious-activity/"
og_description: "Monitor your VPS for suspicious activity: check logins and auth logs, watch processes and network connections, and review system logs."
og_type: article
schema_type: Article
category: "Security"
read_time: "3 min read"
updated: "June 2026"
date_published: "2026-05-01"
date_modified: "2026-06-15"
toc:
  - { id: "1-check-who-is-logged-in", label: "Check Who Is Logged In" }
  - { id: "2-monitor-authentication-logs", label: "Monitor Authentication Logs" }
  - { id: "3-check-running-processes", label: "Check Running Processes" }
  - { id: "4-check-for-unusual-network-connections", label: "Check for Unusual Network Connections" }
  - { id: "5-check-disk-usage", label: "Check Disk Usage" }
  - { id: "6-review-system-logs", label: "Review System Logs" }
  - { id: "7-set-up-logwatch-for-daily-reports", label: "Set Up Logwatch for Daily Reports" }
  - { id: "8-check-fail2ban-status", label: "Check Fail2Ban Status" }
  - { id: "9-set-up-uptime-monitoring", label: "Set Up Uptime Monitoring" }
  - { id: "red-flags-to-watch-for", label: "Red Flags to Watch For" }
  - { id: "quick-security-audit-commands", label: "Quick Security Audit Commands" }
sidebar_title: "Security"
sidebar:
  - { url: "/guides/secure-your-server", label: "Secure your server" }
  - { url: "/guides/automated-backups", label: "Set up automated backups" }
  - { url: "/guides/disable-ssh-keys", label: "Disable SSH key auth" }
  - { url: "/guides", label: "All guides →" }
---

Monitoring helps you catch security incidents, performance issues, and
unusual behaviour before they become serious problems. This guide covers
essential monitoring tools and techniques. Pair it with proper [VPS
hardening](/guides/secure-your-server/){: style="color: var(--rd-indigo);"}
and regular [backups](/guides/automated-backups/){: style="color: var(--rd-indigo);"}.

## 1. Check Who Is Logged In

See currently logged-in users:

    who
    w
{: .language-bash}

View recent login history:

    last
{: .language-bash}

View failed login attempts:

    lastb
{: .language-bash}

## 2. Monitor Authentication Logs

Failed SSH login attempts are logged in:

    # Ubuntu/Debian
    cat /var/log/auth.log | grep "Failed password"
    
    # Live monitoring
    tail -f /var/log/auth.log
{: .language-bash}

Signs of a brute-force attack: dozens of failed login attempts from the
same IP or many IPs in quick succession.

## 3. Check Running Processes

See what\'s currently running:

    top
    # or the better alternative:
    htop
{: .language-bash}

Install htop if not available:

    apt install htop -y
{: .language-bash}

Look for: unfamiliar processes consuming high CPU or memory.

List all running processes:

    ps aux
{: .language-bash}

## 4. Check for Unusual Network Connections

See all active network connections:

    ss -tulnp
    # or
    netstat -tulnp
{: .language-bash}

Look for: open ports you didn\'t intentionally configure, or connections
to unknown external IPs.

## 5. Check Disk Usage

Unexplained disk usage can indicate log flooding, crypto mining, or
malware:

    df -h          # Overall disk usage by partition
    du -sh /*      # Usage by top-level directory
    du -sh /var/*  # Often where logs accumulate
{: .language-bash}

## 6. Review System Logs

Key log files:

| Log File | What It Contains |
| --- | --- |
| `/var/log/auth.log` | SSH logins, sudo usage, authentication |
| `/var/log/syslog` | General system messages |
| `/var/log/nginx/access.log` | HTTP requests to your site |
| `/var/log/nginx/error.log` | Nginx errors |
| `/var/log/mysql/error.log` | MySQL errors |

Use `grep` to search for specific patterns:

    grep "Invalid user" /var/log/auth.log
    grep "404" /var/log/nginx/access.log
{: .language-bash}

## 7. Set Up Logwatch for Daily Reports

Logwatch sends a daily email summary of system activity:

    apt install logwatch -y
    logwatch --output mail --mailto you@example.com --detail high
{: .language-bash}

Automate daily reports by adding to `/etc/cron.daily/00logwatch`:

    /usr/sbin/logwatch --output mail --mailto you@example.com --detail medium
{: .language-bash}

## 8. Check Fail2Ban Status

If you have Fail2Ban installed, check which IPs have been banned:

    fail2ban-client status
    fail2ban-client status sshd
{: .language-bash}

Unban an IP if needed:

    fail2ban-client set sshd unbanip IP_ADDRESS
{: .language-bash}

## 9. Set Up Uptime Monitoring

Use a free external monitoring service to get alerted when your server
goes offline:

* [UptimeRobot][1] – Free, monitors every 5 minutes
* [Freshping][2] – Free tier available
* [Better Uptime][3] – Free tier with on-call alerts

These services ping your server from outside and notify you by email or
SMS if it becomes unreachable.

## Red Flags to Watch For

* 🚩 Unfamiliar user accounts in `/etc/passwd`
* 🚩 Unusual cron jobs - check with `crontab -l` and `ls /etc/cron.*`
* 🚩 High CPU usage from unknown processes
* 🚩 Large numbers of outbound connections (possible spam bot or DDoS
  participant)
* 🚩 Files modified in `/etc/` unexpectedly - check with `find /etc
  -mtime -1`

## Quick Security Audit Commands

    # List all users with login shells
    grep -v nologin /etc/passwd
    
    # Find files modified in the last 24 hours
    find / -mtime -1 -type f 2>/dev/null | grep -v /proc
    
    # Check for world-writable files (potential security risk)
    find / -perm -002 -type f 2>/dev/null
    
    # List all open ports
    ss -tulnp
{: .language-bash}

[1]: https://uptimerobot.com
[2]: https://freshping.io
[3]: https://betteruptime.com

