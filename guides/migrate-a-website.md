---
layout: guide
nav: guides
jsonld: jsonld/guide.html
title: "How to Migrate a Website to a VPS | bithost"
h1: "How to Migrate a Website to a VPS"
description: "Migrate a website to a VPS with minimal downtime: move your files and databases, update DNS, and test before cutting over from shared or cloud hosting."
canonical: "https://bithost.io/guides/migrate-a-website"
og_title: "How to Migrate a Website to a VPS - bithost Guide"
og_url: "https://bithost.io/guides/migrate-a-website"
og_description: "Migrate a website to a VPS with minimal downtime: move your files and databases, update DNS, and test before cutting over from shared or cloud hosting."
og_type: article
schema_type: Article
category: "Performance"
read_time: "4 min read"
updated: "June 2026"
date_published: "2026-05-01"
date_modified: "2026-06-15"
toc:
  - { id: "migration-overview", label: "Migration Overview" }
  - { id: "step-1-prepare-the-new-server", label: "Prepare the New Server" }
  - { id: "step-2-export-your-website-files", label: "Export Your Website Files" }
  - { id: "step-3-export-the-database-if-applicable", label: "Export the Database (if applicable)" }
  - { id: "step-4-upload-files-to-the-new-server", label: "Upload Files to the New Server" }
  - { id: "step-5-import-the-database-on-the-new-server", label: "Import the Database on the New Server" }
  - { id: "step-6-update-the-sites-database-configuration", label: "Update the Site's Database Configuration" }
  - { id: "step-7-configure-nginx-on-the-new-server", label: "Configure Nginx on the New Server" }
  - { id: "step-8-test-before-switching-dns", label: "Test Before Switching DNS" }
  - { id: "step-9-switch-dns", label: "Switch DNS" }
  - { id: "step-10-set-up-ssl-on-the-new-server", label: "Set Up SSL on the New Server" }
  - { id: "step-11-keep-the-old-server-running-briefly", label: "Keep the Old Server Running Briefly" }
  - { id: "migration-checklist", label: "Migration Checklist" }
sidebar_title: "Performance"
sidebar:
  - { url: "/guides/scale-server-resources", label: "Scale server resources" }
  - { url: "/guides/monitor-resource-usage", label: "Monitor resource usage" }
  - { url: "/guides/setup-docker", label: "Set up Docker" }
  - { url: "/guides", label: "All guides →" }
---

Whether you\'re moving from shared hosting, another cloud provider, or a
local machine, this guide walks you through migrating a website with
minimal downtime.

## Migration Overview

A typical website migration involves:

1.  Setting up the new server. Deploy your first [VPS with bithost](/guides/getting-started/){: style="color: var(--rd-indigo);"}.
2.  Copying files and database
3.  Testing on the new server
4.  Updating DNS to point to the new server
5.  Verifying everything works

## Step 1: Prepare the New Server

Make sure your new server has everything installed:

* Nginx (or Apache) - [How to Host a Website with
  Nginx](/guides/host-a-website-with-nginx){: style="color:
  var(--rd-indigo);"}
* PHP (if needed)
* MySQL/MariaDB (if your site uses a database)
* SSL certificate (set up after DNS switch)

## Step 2: Export Your Website Files

### From Shared Hosting (via FTP/SFTP)

Use FileZilla or your file manager to download all files from your
hosting\'s `public_html` (or equivalent) to your local machine.

### From Another Server (via SCP)

    # From your local machine, download files from the old server
    scp -r root@OLD_SERVER_IP:/var/www/mysite/ ./mysite-backup/
{: .language-bash}

## Step 3: Export the Database (if applicable)

### MySQL/MariaDB

On the **old server**:

    mysqldump -u root -p database_name > site_backup.sql
{: .language-bash}

Download it to your local machine:

    scp root@OLD_SERVER_IP:~/site_backup.sql ./
{: .language-bash}

## Step 4: Upload Files to the New Server

    # Upload files to the new server
    scp -r ./mysite-backup/ root@NEW_SERVER_IP:/var/www/mysite/
    
    # Set correct permissions
    ssh root@NEW_SERVER_IP "chown -R www-data:www-data /var/www/mysite && chmod -R 755 /var/www/mysite"
{: .language-bash}

## Step 5: Import the Database on the New Server

Upload the SQL file:

    scp ./site_backup.sql root@NEW_SERVER_IP:~/
{: .language-bash}

On the new server, create the database and import:

    mysql -u root -p
{: .language-bash}

    CREATE DATABASE mysite_db;
    CREATE USER 'mysite_user'@'localhost' IDENTIFIED BY 'StrongPassword!';
    GRANT ALL PRIVILEGES ON mysite_db.* TO 'mysite_user'@'localhost';
    FLUSH PRIVILEGES;
    EXIT;
{: .language-sql}

    mysql -u root -p mysite_db < ~/site_backup.sql
{: .language-bash}

## Step 6: Update the Site\'s Database Configuration

For [WordPress](/guides/install-wordpress/){: style="color: var(--rd-indigo);"}, update `wp-config.php` with the new database credentials:

    nano /var/www/mysite/wp-config.php
{: .language-bash}

For other CMS or apps, update their respective config files.

## Step 7: Configure Nginx on the New Server

Make sure your Nginx server block is correctly configured for your
domain:

    nano /etc/nginx/sites-available/mysite
{: .language-bash}

    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;
        root /var/www/mysite;
        index index.php index.html;
    
        location / {
            try_files $uri $uri/ /index.php?$args;
        }
    
        location ~ \.php$ {
            include snippets/fastcgi-php.conf;
            fastcgi_pass unix:/run/php/php8.1-fpm.sock;
        }
    }
{: .language-nginx}

Enable and reload Nginx.

## Step 8: Test Before Switching DNS

Test your site on the new server **before** changing DNS by editing your
local `hosts` file:

### On macOS/Linux

    sudo nano /etc/hosts
{: .language-bash}

Add:

    NEW_SERVER_IP    yourdomain.com
    NEW_SERVER_IP    www.yourdomain.com

Visit your domain in the browser - it will load from the new server
(only for you). Verify everything works: pages, images, forms, logins.

Remove the hosts entry when done testing.

### On Windows

Edit `C:\Windows\System32\drivers\etc\hosts` as Administrator and add
the same lines.

## Step 9: Switch DNS

Once testing is successful, update your domain\'s DNS **A record** to
point to the new server\'s IP:

[How to Point Your Domain to Your
Server](/guides/point-domain-to-server){: style="color:
var(--rd-indigo);"}

DNS propagation takes 15 minutes to 48 hours.

## Step 10: Set Up SSL on the New Server

After DNS propagates:

    certbot --nginx -d yourdomain.com -d www.yourdomain.com
{: .language-bash}

For details and troubleshooting, see [Set up HTTPS
(SSL)](/guides/setup-ssl-https/){: style="color: var(--rd-indigo);"}.

## Step 11: Keep the Old Server Running Briefly

Leave the old server running for 24–48 hours after migration. Some
visitors may still be resolving the old IP due to DNS caching.

## Migration Checklist

* ✅ All files copied to new server
* ✅ Database exported and imported
* ✅ Config files updated (DB credentials, file paths)
* ✅ Tested via hosts file before DNS switch
* ✅ Nginx configured and running
* ✅ DNS switched to new server
* ✅ SSL certificate installed
* ✅ Old server kept online during propagation
