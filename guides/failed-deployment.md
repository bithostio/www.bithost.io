---
layout: guide
nav: guides
jsonld: jsonld/guide.html
title: "How to Recover from a Failed Deployment | Guides | bithost"
h1: "How to Recover from a Failed Deployment"
description: "Deployments can go wrong - a broken config file, a failed database migration, or an incompatible package update can take your site offline. This guide walk..."
canonical: "https://bithost.io/guides/failed-deployment"
og_title: "How to Recover from a Failed Deployment - bithost Guide"
og_url: "https://bithost.io/guides/failed-deployment"
og_description: "Deployments can go wrong - a broken config file, a failed database migration, or an incompatible package update can take your site offline. This guide walk..."
og_type: article
schema_type: HowTo
category: "Troubleshooting"
read_time: "4 min read"
updated: "May 2026"
toc:
  - { id: "step-1-dont-panic-identify-what-changed", label: "Don't Panic — Identify What Changed" }
  - { id: "step-2-check-whats-broken", label: "Check What's Broken" }
  - { id: "step-3-fix-a-broken-nginx-config", label: "Fix a Broken Nginx Config" }
  - { id: "step-4-revert-a-failed-code-deployment", label: "Revert a Failed Code Deployment" }
  - { id: "step-5-fix-a-failed-database-migration", label: "Fix a Failed Database Migration" }
  - { id: "step-6-restore-from-a-server-snapshot", label: "Restore from a Server Snapshot" }
  - { id: "step-7-roll-forward-if-you-cant-roll-back", label: "Roll Forward If You Can't Roll Back" }
  - { id: "deployment-best-practices-to-prevent-future-issues", label: "Deployment Best Practices to Prevent Future Issues" }
sidebar_title: "Troubleshooting"
sidebar:
  - { url: "/guides/server-unreachable", label: "Server unreachable" }
  - { url: "/guides/common-errors", label: "Common error messages" }
  - { url: "/guides", label: "All guides →" }
---

Deployments can go wrong - a broken config file, a failed database
migration, or an incompatible package update can take your site offline.
This guide walks you through diagnosing and recovering quickly.

## Step 1: Don't Panic - Identify What Changed   {#step-1-dont-panic-identify-what-changed}

Ask yourself:

* What did I just change? (code, config, packages, database?)
* When did it stop working?
* Can I revert that change?

The fastest fix is almost always **reverting to the last working
state**.

## Step 2: Check What\'s Broken

### Is the web server running?

    systemctl status nginx
    # or
    systemctl status apache2
{: .language-bash}

### Is your app running?

    # Node.js (PM2)
    pm2 status
    pm2 logs my-app --lines 50
    
    # Python (systemd)
    systemctl status my-python-app
    journalctl -u my-python-app -n 50
    
    # Docker
    docker ps
    docker logs container-name
{: .language-bash}

### Check Nginx error logs

    tail -50 /var/log/nginx/error.log
{: .language-bash}

### Check application logs

    # Common locations
    tail -50 /var/log/your-app/error.log
    tail -50 /var/www/myapp/storage/logs/laravel.log   # Laravel
    tail -50 /var/www/myapp/wp-content/debug.log       # WordPress
{: .language-bash}

## Step 3: Fix a Broken Nginx Config

If Nginx won\'t start after a config change:

    nginx -t
{: .language-bash}

This shows the exact line causing the error. Fix it, then:

    systemctl reload nginx
{: .language-bash}

If you\'re unsure what you changed, restore the previous config from
backup or revert to the default:

    # Check git history of config (if using git)
    git log /etc/nginx/sites-available/mysite
    git checkout HEAD~1 /etc/nginx/sites-available/mysite
{: .language-bash}

## Step 4: Revert a Failed Code Deployment

### If Using Git

    cd /var/www/myapp
    
    # See recent commits
    git log --oneline -10
    
    # Revert to the previous commit
    git revert HEAD
    
    # Or hard reset to a specific commit (destructive!)
    git reset --hard COMMIT_HASH
{: .language-bash}

### If You Deployed Manually (No Git)

Restore from your last backup:

    # Restore files from backup
    rsync -avz /backups/mysite/ /var/www/mysite/
{: .language-bash}

## Step 5: Fix a Failed Database Migration

If a database migration broke your app:

### Check What Went Wrong

    # View MySQL error log
    tail -50 /var/log/mysql/error.log
{: .language-bash}

### Restore the Database from Backup

    mysql -u root -p mysite_db < /backups/mysite-db-before-migration.sql
{: .language-bash}

> This is why you should always **back up before migrations**.

### Manually Roll Back a Migration

If your framework supports rollbacks:

    # Laravel
    php artisan migrate:rollback
    
    # Django
    python manage.py migrate app_name 0001  # Replace with previous migration
{: .language-bash}

## Step 6: Restore from a Server Snapshot

If the deployment broke the server badly and you have a snapshot:

1.  Log in to your control panel
2.  Navigate to **Snapshots** or **Backups**
3.  Find the snapshot taken **before** the deployment
4.  Click **Restore**

> ⚠️ Restoring a snapshot rolls back the **entire server** to that point
> in time - including files, database, and config. This is the nuclear
> option but it always works.

## Step 7: Roll Forward If You Can\'t Roll Back

Sometimes reverting isn\'t practical. In that case:

1.  Fix the immediate issue causing downtime (even a temporary
    placeholder page)
2.  Understand what went wrong by reading logs carefully
3.  Fix the root cause in a staging environment first
4.  Re-deploy the corrected version

## Deployment Best Practices to Prevent Future Issues

* **Always back up before deploying** - database and files
* **Test in a staging environment** before production
* **Use version control (Git)** so every change is reversible
* **Deploy during low-traffic periods**
* **Take a server snapshot** before major changes
* **Roll out changes gradually** (feature flags, staged rollouts)
