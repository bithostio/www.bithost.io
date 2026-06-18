---
layout: guide
nav: guides
jsonld: jsonld/guide.html
title: "How to Self-Host Cloud Storage with Nextcloud | bithost"
h1: "How to Self-Host Cloud Storage with Nextcloud"
description: "Self-host Nextcloud on a VPS for a private Google Drive alternative: file sync, photo backup, calendar, and contacts - all on your own server."
canonical: "https://bithost.io/guides/nextcloud-cloud-storage/"
og_title: "How to Self-Host Cloud Storage with Nextcloud - bithost Guide"
og_url: "https://bithost.io/guides/nextcloud-cloud-storage/"
og_description: "Self-host Nextcloud on a VPS for a private Google Drive alternative: file sync, photo backup, calendar, and contacts - all on your own server."
og_type: article
schema_type: Article
category: "Use Cases"
read_time: "3 min read"
updated: "June 2026"
date_published: "2026-05-01"
date_modified: "2026-06-15"
toc:
  - { id: "prerequisites", label: "Prerequisites" }
  - { id: "step-1-install-dependencies", label: "Install Dependencies" }
  - { id: "step-2-configure-mysql", label: "Configure MySQL" }
  - { id: "step-3-download-nextcloud", label: "Download Nextcloud" }
  - { id: "step-4-configure-php", label: "Configure PHP" }
  - { id: "step-5-configure-nginx", label: "Configure Nginx" }
  - { id: "step-6-set-up-https", label: "Set Up HTTPS" }
  - { id: "step-7-complete-installation-via-browser", label: "Complete Installation via Browser" }
  - { id: "step-8-install-the-nextcloud-desktop-and-mobile-apps", label: "Install Desktop and Mobile Apps" }
  - { id: "useful-nextcloud-apps-to-install", label: "Useful Nextcloud Apps to Install" }
sidebar_title: "Use Cases"
sidebar:
  - { url: "/guides/setup-vpn-server/", label: "Set up a VPN server" }
  - { url: "/guides/game-server/", label: "Run a game server" }
  - { url: "/guides/host-nodejs-python-app/", label: "Host a Node.js/Python app" }
  - { url: "/guides/", label: "All guides →" }
---

Nextcloud is a powerful, open-source alternative to Google Drive or
Dropbox. This guide shows you how to **self-host Nextcloud on a VPS** -
giving you full control over your data, file syncing, photo backup,
calendar, contacts, and more, all hosted on a [private VPS](/anonymous-vps/){: style="color: var(--rd-indigo);"}
you control.

## Prerequisites

* A VPS running Ubuntu 22.04 with at least 2 GB RAM ([see vps prices](/prices/){: style="color: var(--rd-indigo);"}). Deploy your first [VPS with bithost](/guides/getting-started/){: style="color: var(--rd-indigo);"}.
* A [domain name pointed to your server](/guides/point-domain-to-server/){: style="color: var(--rd-indigo);"}
* Nginx and MySQL installed (or follow the steps below)

## Step 1: Install Dependencies

    apt update
    apt install nginx mysql-server php8.1-fpm php8.1-mysql php8.1-xml php8.1-mbstring \
      php8.1-curl php8.1-zip php8.1-gd php8.1-intl php8.1-bcmath php8.1-imagick \
      php8.1-redis unzip wget -y
{: .language-bash}

## Step 2: Configure MySQL

    mysql_secure_installation
    mysql -u root -p
{: .language-bash}

    CREATE DATABASE nextcloud CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
    CREATE USER 'nextclouduser'@'localhost' IDENTIFIED BY 'StrongPassword123!';
    GRANT ALL PRIVILEGES ON nextcloud.* TO 'nextclouduser'@'localhost';
    FLUSH PRIVILEGES;
    EXIT;
{: .language-sql}

## Step 3: Download Nextcloud

    cd /tmp
    wget https://download.nextcloud.com/server/releases/latest.zip
    unzip latest.zip
    mv nextcloud /var/www/nextcloud
    chown -R www-data:www-data /var/www/nextcloud
    chmod -R 755 /var/www/nextcloud
{: .language-bash}

## Step 4: Configure PHP

Edit PHP settings for better performance:

    nano /etc/php/8.1/fpm/php.ini
{: .language-bash}

Update:

    memory_limit = 512M
    upload_max_filesize = 10G
    post_max_size = 10G
    max_execution_time = 300
{: .language-ini}

Restart PHP-FPM:

    systemctl restart php8.1-fpm
{: .language-bash}

## Step 5: Configure Nginx

    nano /etc/nginx/sites-available/nextcloud
{: .language-bash}

    server {
        listen 80;
        server_name cloud.yourdomain.com;
        root /var/www/nextcloud;
    
        add_header X-Content-Type-Options nosniff;
        add_header X-Frame-Options SAMEORIGIN;
        add_header X-XSS-Protection "1; mode=block";
    
        client_max_body_size 10G;
        fastcgi_buffers 64 4K;
    
        index index.php index.html;
    
        location / {
            rewrite ^ /index.php;
        }
    
        location ~ ^\/(?:build|tests|config|lib|3rdparty|templates|data)\/ {
            deny all;
        }
    
        location ~ ^\/(?:\.|autotest|occ|issue|indie|db_|console) {
            deny all;
        }
    
        location ~ ^\/(?:index|remote|public|cron|core\/ajax\/update|status|ocs\/v[12]|updater\/.+|oc[ms]-provider\/.+)\.php(?:$|\/) {
            fastcgi_split_path_info ^(.+?\.php)(\/.*|)$;
            include fastcgi_params;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
            fastcgi_param PATH_INFO $fastcgi_path_info;
            fastcgi_pass unix:/run/php/php8.1-fpm.sock;
            fastcgi_intercept_errors on;
            fastcgi_request_buffering off;
        }
    
        location ~ \.(?:css|js|woff2?|svg|gif|map)$ {
            try_files $uri /index.php$request_uri;
            expires 6M;
            add_header Cache-Control "public";
        }
    
        location ~ \.(?:png|html|ttf|ico|jpg|jpeg|bcmap)$ {
            try_files $uri /index.php$request_uri;
        }
    }
{: .language-nginx}

Enable and reload:

    ln -s /etc/nginx/sites-available/nextcloud /etc/nginx/sites-enabled/
    nginx -t
    systemctl reload nginx
{: .language-bash}

## Step 6: Set Up HTTPS

    apt install certbot python3-certbot-nginx -y
    certbot --nginx -d cloud.yourdomain.com
{: .language-bash}

For details and troubleshooting, see [Set up HTTPS
(SSL)](/guides/setup-ssl-https/){: style="color: var(--rd-indigo);"}.

## Step 7: Complete Installation via Browser

Visit:

    https://cloud.yourdomain.com

Fill in:

* **Admin username** and a strong password
* **Data folder:** `/var/www/nextcloud/data`
* **Database:** MySQL/MariaDB
* **Database user:** `nextclouduser`
* **Database password:** your password
* **Database name:** `nextcloud`
* **Host:** `localhost`

Click **Finish setup**.

## Step 8: Install the Nextcloud Desktop and Mobile Apps

Download from [nextcloud.com/install][1] for:

* Windows, macOS, Linux (desktop sync)
* Android and iOS (mobile apps)

Enter your server URL to connect and start syncing files.

## Useful Nextcloud Apps to Install

From the Nextcloud admin panel → Apps:

* **Calendar** – Sync your calendar across devices
* **Contacts** – Replace Google Contacts
* **Talk** – Video calls and messaging
* **Photos** – Auto-backup photos from your phone
* **Deck** – Kanban task boards

[1]: https://nextcloud.com/install

