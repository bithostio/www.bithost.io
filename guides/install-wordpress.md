---
layout: guide
nav: guides
jsonld: jsonld/guide.html
title: "How to Install WordPress on a VPS | Guides | bithost"
h1: "How to Install WordPress on a VPS"
description: "Install WordPress on a VPS step by step: set up the LEMP stack (Nginx, MySQL, PHP) on Ubuntu 22.04, configure your site, and add free HTTPS."
canonical: "https://bithost.io/guides/install-wordpress/"
og_title: "How to Install WordPress on a VPS - bithost Guide"
og_url: "https://bithost.io/guides/install-wordpress/"
og_description: "Install WordPress on a VPS step by step: set up the LEMP stack (Nginx, MySQL, PHP) on Ubuntu 22.04, configure your site, and add free HTTPS."
og_type: article
schema_type: Article
category: "Web Hosting"
read_time: "3 min read"
updated: "June 2026"
date_published: "2026-05-01"
date_modified: "2026-06-15"
toc:
  - { id: "prerequisites", label: "Prerequisites" }
  - { id: "step-1-install-required-software", label: "Install Required Software" }
  - { id: "step-2-configure-mysql", label: "Configure MySQL" }
  - { id: "step-3-download-wordpress", label: "Download WordPress" }
  - { id: "step-4-configure-wordpress", label: "Configure WordPress" }
  - { id: "step-5-configure-nginx-for-wordpress", label: "Configure Nginx for WordPress" }
  - { id: "step-6-complete-the-wordpress-setup", label: "Complete the WordPress Setup" }
  - { id: "step-7-add-https-strongly-recommended", label: "Add HTTPS (Strongly Recommended)" }
sidebar_title: "Web Hosting"
sidebar:
  - { url: "/guides/host-a-website-with-nginx/", label: "Host a website with Nginx" }
  - { url: "/guides/setup-ssl-https/", label: "Set up HTTPS (SSL)" }
  - { url: "/guides/point-domain-to-server/", label: "Point domain to server" }
  - { url: "/guides/", label: "All guides →" }
---

This guide walks you through installing WordPress on a VPS running Ubuntu
22.04 with Nginx, MySQL, and PHP (the LEMP stack) - so you can self-host
WordPress with full control over your data.

## Prerequisites

* A VPS running Ubuntu 22.04 with SSH access ([see vps prices](/prices/){: style="color: var(--rd-indigo);"}). Deploy your first [VPS with bithost](/guides/getting-started/){: style="color: var(--rd-indigo);"}.
* Nginx installed ([Host a Website with
  Nginx](/guides/host-a-website-with-nginx/){: style="color:
  var(--rd-indigo);"})
* A [domain name pointed to your server\'s IP](/guides/point-domain-to-server/){: style="color: var(--rd-indigo);"}

## Step 1: Install Required Software

Install PHP, MySQL, and required extensions:

    apt update
    apt install mysql-server php8.1-fpm php8.1-mysql php8.1-xml php8.1-mbstring php8.1-curl php8.1-zip php8.1-gd unzip -y
{: .language-bash}

## Step 2: Configure MySQL

Secure your MySQL installation:

    mysql_secure_installation
{: .language-bash}

Follow the prompts to set a root password and remove test databases.

Now create a database and user for WordPress:

    mysql -u root -p
{: .language-bash}

Inside the MySQL prompt:

    CREATE DATABASE wordpress DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    CREATE USER 'wpuser'@'localhost' IDENTIFIED BY 'StrongPassword123!';
    GRANT ALL PRIVILEGES ON wordpress.* TO 'wpuser'@'localhost';
    FLUSH PRIVILEGES;
    EXIT;
{: .language-sql}

## Step 3: Download WordPress

    cd /tmp
    wget https://wordpress.org/latest.tar.gz
    tar -xzf latest.tar.gz
    cp -r wordpress /var/www/mywordpresssite
    chown -R www-data:www-data /var/www/mywordpresssite
    chmod -R 755 /var/www/mywordpresssite
{: .language-bash}

## Step 4: Configure WordPress

Copy the sample config file:

    cp /var/www/mywordpresssite/wp-config-sample.php /var/www/mywordpresssite/wp-config.php
    nano /var/www/mywordpresssite/wp-config.php
{: .language-bash}

Update these lines with your database details:

    define( 'DB_NAME', 'wordpress' );
    define( 'DB_USER', 'wpuser' );
    define( 'DB_PASSWORD', 'StrongPassword123!' );
    define( 'DB_HOST', 'localhost' );
{: .language-php}

Also update the secret keys by visiting:
https://api.wordpress.org/secret-key/1.1/salt/ and replacing the
placeholder block in the config.

## Step 5: Configure Nginx for WordPress

Create an Nginx server block:

    nano /etc/nginx/sites-available/wordpress
{: .language-bash}

Paste:

    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;
        root /var/www/mywordpresssite;
    
        index index.php index.html;
    
        location / {
            try_files $uri $uri/ /index.php?$args;
        }
    
        location ~ \.php$ {
            include snippets/fastcgi-php.conf;
            fastcgi_pass unix:/run/php/php8.1-fpm.sock;
        }
    
        location ~ /\.ht {
            deny all;
        }
    }
{: .language-nginx}

Enable and reload:

    ln -s /etc/nginx/sites-available/wordpress /etc/nginx/sites-enabled/
    nginx -t
    systemctl reload nginx
{: .language-bash}

## Step 6: Complete the WordPress Setup

Visit your domain in a browser:

    http://yourdomain.com

You\'ll see the WordPress installation wizard. Enter:

* **Site title** – Your website name
* **Username** – Your admin username (don\'t use \"admin\")
* **Password** – A strong password
* **Email** – Your email address

Click **Install WordPress**. Done!

## Step 7: Add HTTPS (Strongly Recommended)

Secure your site with a free SSL certificate:

    apt install certbot python3-certbot-nginx -y
    certbot --nginx -d yourdomain.com -d www.yourdomain.com
{: .language-bash}

Follow the prompts and your site will be automatically configured for
HTTPS. For a full walkthrough, see [Set up HTTPS
(SSL)](/guides/setup-ssl-https/){: style="color: var(--rd-indigo);"}.

## Useful Tips

* Log in to the admin panel at `https://yourdomain.com/wp-admin`
* Keep WordPress, themes, and plugins updated regularly
* Install a caching plugin (e.g. WP Super Cache) to improve performance
* Take regular backups ([How to Set Up Automated
  Backups](/guides/automated-backups/){: style="color:
  var(--rd-indigo);"})
