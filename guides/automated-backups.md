---
layout: guide
nav: guides
jsonld: jsonld/guide.html
title: "How to Set Up Backups for Your VPS | Guides | bithost"
h1: "How to Set Up Backups for Your VPS"
description: "Learn how to back up your VPS with bithost: automatic backups, manual snapshots, rsync file backups, and database dumps. Protect your server in minutes."
canonical: "https://bithost.io/guides/automated-backups/"
og_title: "How to Set Up Backups for Your VPS - bithost Guide"
og_url: "https://bithost.io/guides/automated-backups/"
og_description: "Learn how to back up your VPS with bithost: automatic backups, manual snapshots, rsync file backups, and database dumps. Protect your server in minutes."
og_type: article
schema_type: Article
category: "Security"
read_time: "3 min read"
updated: "June 2026"
date_published: "2026-05-01"
date_modified: "2026-06-15"
toc:
  - { id: "backup-strategy-the-3-2-1-rule", label: "Backup Strategy: The 3-2-1 Rule" }
  - { id: "option-1-bithost-backups-and-snapshots-easiest", label: "Option 1: bithost Backups and Snapshots (Easiest)" }
  - { id: "option-2-automated-file-backups-with-rsync", label: "Option 2: Automated File Backups with rsync" }
  - { id: "option-3-database-backups-mysqlmariadb", label: "Option 3: Database Backups (MySQL/MariaDB)" }
  - { id: "testing-your-backups", label: "Testing Your Backups" }
  - { id: "backup-checklist", label: "Backup Checklist" }
sidebar_title: "Security"
sidebar:
  - { url: "/guides/secure-your-server/", label: "Secure your server" }
  - { url: "/guides/monitor-suspicious-activity/", label: "Monitor for threats" }
  - { url: "/guides/disable-ssh-keys/", label: "Disable SSH key auth" }
  - { url: "/guides/", label: "All guides →" }
---

Backups are your safety net. This guide covers how to set up backups for
your VPS so you can recover quickly from accidental deletion, data
corruption, or a [security incident](/guides/secure-your-server/).

## Backup Strategy: The 3-2-1 Rule

* **3** copies of your data
* **2** different storage media/locations
* **1** offsite backup

At minimum: enable provider snapshots **and** back up critical files to
an external location.

## Option 1: bithost Backups and Snapshots (Easiest)

You don't need the command line for full-server recovery. Every bithost
server has a **Backups** tab with two built-in options: scheduled
**automatic backups** and on-demand **snapshots**. Open your server from
the **Servers** list and click the **Backups** tab.

<img src="/assets/screenshots/bithost_server_management_backups_and_snapshots_5.webp" alt="bithost server Backups tab showing the Automatic backups toggle and the Create snapshot field" width="1176" height="656" loading="lazy" style="width: 100%; height: auto; display: block; border-radius: 8px; border: 1px solid var(--rd-line);">

### Automatic backups

Toggle **Automatic backups** on to have the underlying provider take
scheduled full-server backups for you. This is the closest thing to
set-and-forget recovery: a complete disk image you can restore in a few
clicks.

* **Cost:** charged at **20% of the server price** while enabled.
* **Best for:** production servers you can't afford to rebuild by hand.

### Snapshots

A **snapshot** is a point-in-time full-disk image you create yourself.
Type a name, click **Create snapshot**, and it appears in the list below
with **Restore** and **Delete** actions. Take one before any risky
change - an OS upgrade, a config rewrite, a big deploy - so you can roll
straight back if it goes wrong.

* **Cost:** snapshots are billed at **$0.06/GB per month** for as long
  as you keep them.
* **Best for:** manual checkpoints before maintenance, or cloning a
  server's exact state.

> **Recommendation:** Turn on automatic backups for production servers,
> and take a manual snapshot before any major change. For a full
> walkthrough of every control on this screen, see
> [Understanding your server dashboard](/guides/understanding-your-dashboard/#backups).

## Option 2: Automated File Backups with rsync

`rsync` copies files efficiently - only changes are transferred, saving
time and bandwidth.

### Back Up to a Remote Server or Storage

    rsync -avz --delete /var/www/ user@backup-server:/backups/www/
    rsync -avz --delete /etc/ user@backup-server:/backups/etc/
{: .language-bash}

### Automate with Cron

Edit the crontab:

    crontab -e
{: .language-bash}

Add a daily backup at 2 AM:

    0 2 * * * rsync -avz --delete /var/www/ user@backup-server:/backups/www/ >> /var/log/backup.log 2>&1
{: .language-cron}

## Option 3: Database Backups (MySQL/MariaDB)

For WordPress and other database-driven sites, back up the database
separately.

### Manual Backup

    mysqldump -u root -p wordpress > /backups/wordpress-$(date +%F).sql
{: .language-bash}

### Automate with Cron

    crontab -e
{: .language-bash}

Add:

    0 3 * * * mysqldump -u root -pYourPassword wordpress > /backups/wordpress-$(date +\%F).sql
{: .language-cron}

> Store database credentials securely - consider using a `.my.cnf` file
> with restricted permissions instead of putting the password in the
> crontab.

## Testing Your Backups

A backup you\'ve never tested is a backup you can\'t trust. Regularly
verify:

* **Restore a file** from backup to confirm files are readable
* **Test a database restore** on a staging server
* **Check backup logs** to ensure jobs completed without errors

    cat /var/log/backup.log
{: .language-bash}

## Backup Checklist

* ✅ Provider snapshots enabled (for full-server recovery)
* ✅ Database backed up daily
* ✅ Website files backed up regularly
* ✅ Backups stored in at least one offsite location
* ✅ Backup restoration tested at least once
