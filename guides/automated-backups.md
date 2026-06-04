---
layout: guide
nav: guides
jsonld: jsonld/guide.html
title: "How to Set Up Automated Backups for Your Cloud Server | Guides | bithost"
h1: "How to Set Up Automated Backups for Your Cloud Server"
description: "Backups are your safety net. This guide covers how to set up automated backups so you can recover quickly from accidental deletion, data corruption, or a s..."
canonical: "https://bithost.io/guides/automated-backups"
og_title: "How to Set Up Automated Backups for Your Cloud Server - bithost Guide"
og_url: "https://bithost.io/guides/automated-backups"
og_description: "Backups are your safety net. This guide covers how to set up automated backups so you can recover quickly from accidental deletion, data corruption, or a s..."
og_type: article
schema_type: HowTo
category: "Security"
read_time: "3 min read"
updated: "May 2026"
toc:
  - { id: "backup-strategy-the-3-2-1-rule", label: "Backup Strategy: The 3-2-1 Rule" }
  - { id: "option-1-provider-snapshots-easiest", label: "Option 1: Provider Snapshots (Easiest)" }
  - { id: "option-2-automated-file-backups-with-rsync", label: "Option 2: Automated File Backups with rsync" }
  - { id: "option-3-database-backups-mysqlmariadb", label: "Option 3: Database Backups (MySQL/MariaDB)" }
  - { id: "option-4-back-up-to-object-storage-s3-compatible", label: "Option 4: Back Up to Object Storage (S3-Compatible)" }
  - { id: "testing-your-backups", label: "Testing Your Backups" }
  - { id: "backup-checklist", label: "Backup Checklist" }
sidebar_title: "Security"
sidebar:
  - { url: "/guides/secure-your-server", label: "Secure your server" }
  - { url: "/guides/monitor-suspicious-activity", label: "Monitor for threats" }
  - { url: "/guides/disable-ssh-keys", label: "Disable SSH key auth" }
  - { url: "/guides", label: "All guides →" }
---

Backups are your safety net. This guide covers how to set up automated
backups so you can recover quickly from accidental deletion, data
corruption, or a security incident.

## Backup Strategy: The 3-2-1 Rule

* **3** copies of your data
* **2** different storage media/locations
* **1** offsite backup

At minimum: enable provider snapshots **and** back up critical files to
an external location.

## Option 1: Provider Snapshots (Easiest)

Most cloud providers offer built-in snapshot and backup features from
the control panel.

### How to Enable

1.  Log in to your server control panel
2.  Go to your server\'s **Backups** or **Snapshots** section
3.  Enable **Automated Backups** (usually daily or weekly)
4.  Set your **retention period** (how many backups to keep)

### Pros

* No setup required
* Full disk image - restores the entire server in one click
* Managed by the provider

### Cons

* Usually costs extra (typically 20% of server price)
* Limited customisation of backup schedule or retention

> **Recommendation:** Enable provider backups for all production
> servers. It\'s the easiest and most reliable full-server recovery
> option.

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

## Option 4: Back Up to Object Storage (S3-Compatible)

Object storage (like Amazon S3, Backblaze B2, or your provider\'s own
storage) is ideal for offsite backups.

Install `rclone`:

    curl https://rclone.org/install.sh | sudo bash
    rclone config
{: .language-bash}

Follow the wizard to connect your storage provider. Then sync your
backups:

    rclone sync /backups/ remote:my-server-backups/
{: .language-bash}

Automate with cron:

    0 4 * * * rclone sync /backups/ remote:my-server-backups/ >> /var/log/rclone-backup.log 2>&1
{: .language-cron}

## Testing Your Backups

A backup you\'ve never tested is a backup you can\'t trust. Regularly
verify:

* **Restore a file** from backup to confirm files are readable
* **Test a database restore** on a staging server
* **Check backup logs** to ensure jobs completed without errors
^

    cat /var/log/backup.log
{: .language-bash}

## Backup Checklist

* ✅ Provider snapshots enabled (for full-server recovery)
* ✅ Database backed up daily
* ✅ Website files backed up regularly
* ✅ Backups stored in at least one offsite location
* ✅ Backup restoration tested at least once
