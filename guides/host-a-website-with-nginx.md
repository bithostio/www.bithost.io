---
layout: guide
nav: guides
jsonld: jsonld/guide.html
title: "How to Host a Website on a VPS with Nginx | bithost"
h1: "How to Host a Website on a VPS with Nginx"
description: "Host a website with Nginx on a VPS: install and configure Nginx on Ubuntu 22.04, set up a server block, upload your site, and go live in minutes."
canonical: "https://bithost.io/guides/host-a-website-with-nginx/"
og_title: "How to Host a Website on a VPS with Nginx - bithost Guide"
og_url: "https://bithost.io/guides/host-a-website-with-nginx/"
og_description: "Host a website with Nginx on a VPS: install and configure Nginx on Ubuntu 22.04, set up a server block, upload your site, and go live in minutes."
og_type: article
schema_type: Article
category: "Web Hosting"
read_time: "3 min read"
updated: "June 2026"
date_published: "2026-05-01"
date_modified: "2026-06-15"
toc:
  - { id: "prerequisites", label: "Prerequisites" }
  - { id: "step-1-update-your-server", label: "Update Your Server" }
  - { id: "step-2-install-nginx", label: "Install Nginx" }
  - { id: "step-3-allow-http-traffic-through-the-firewall", label: "Allow HTTP Traffic Through the Firewall" }
  - { id: "step-4-test-the-default-page", label: "Test the Default Page" }
  - { id: "step-5-upload-your-website-files", label: "Upload Your Website Files" }
  - { id: "step-6-configure-a-server-block-virtual-host", label: "Configure a Server Block (Virtual Host)" }
  - { id: "step-7-enable-the-site", label: "Enable the Site" }
  - { id: "step-8-visit-your-website", label: "Visit Your Website" }
sidebar_title: "Web Hosting"
sidebar:
  - { url: "/guides/install-wordpress", label: "Install WordPress" }
  - { url: "/guides/setup-ssl-https", label: "Set up HTTPS (SSL)" }
  - { url: "/guides/point-domain-to-server", label: "Point domain to server" }
  - { url: "/guides", label: "All guides →" }
---

Nginx is a fast, lightweight web server used to serve websites and web
applications. This guide walks you through installing Nginx and serving
your first website on a cloud server running Ubuntu 22.04.

## Prerequisites

* A VPS running Ubuntu 22.04 ([see vps prices](/prices/){: style="color: var(--rd-indigo);"}). Deploy your first [VPS with bithost](/guides/getting-started/){: style="color: var(--rd-indigo);"}.
* SSH access to the server ([How to Connect via
  SSH](/guides/connect-via-ssh/){: style="color: var(--rd-indigo);"})
* A [domain name pointed to your server\'s IP](/guides/point-domain-to-server/){: style="color: var(--rd-indigo);"} (optional, but recommended)

## Step 1: Update Your Server

    apt update && apt upgrade -y
{: .language-bash}

## Step 2: Install Nginx

    apt install nginx -y
{: .language-bash}

Start and enable Nginx so it runs automatically on boot:

    systemctl start nginx
    systemctl enable nginx
{: .language-bash}

Verify it\'s running:

    systemctl status nginx
{: .language-bash}

You should see `active (running)` in green.

## Step 3: Allow HTTP Traffic Through the Firewall

If you have UFW (Ubuntu\'s firewall) enabled:

    ufw allow 'Nginx Full'
{: .language-bash}

This opens both port 80 (HTTP) and port 443 (HTTPS).

## Step 4: Test the Default Page

Open a browser and go to:

    http://YOUR_SERVER_IP

You should see the **Nginx Welcome Page**. Your server is working.

## Step 5: Upload Your Website Files

Your website files go in `/var/www/`. Create a directory for your site:

    mkdir -p /var/www/mywebsite
{: .language-bash}

Upload your HTML/CSS/JS files using SCP from your local machine:

    scp -r ./my-site/* root@YOUR_SERVER_IP:/var/www/mywebsite/
{: .language-bash}

Or create a simple test page directly on the server:

    echo "<h1>Hello from my cloud server!</h1>" > /var/www/mywebsite/index.html
{: .language-bash}

## Step 6: Configure a Server Block (Virtual Host)

A server block tells Nginx which files to serve and for which domain.
Create a config file:

    nano /etc/nginx/sites-available/mywebsite
{: .language-bash}

Paste the following (replace `yourdomain.com` and the file path as
needed):

    server {
        listen 80;
        listen [::]:80;
    
        server_name yourdomain.com www.yourdomain.com;
        root /var/www/mywebsite;
        index index.html index.htm;
    
        location / {
            try_files $uri $uri/ =404;
        }
    }
{: .language-nginx}

Save and exit (`Ctrl+X`, then `Y`, then `Enter`).

## Step 7: Enable the Site

Link the config to the `sites-enabled` directory:

    ln -s /etc/nginx/sites-available/mywebsite /etc/nginx/sites-enabled/
{: .language-bash}

Test the configuration for syntax errors:

    nginx -t
{: .language-bash}

If you see `syntax is ok`, reload Nginx:

    systemctl reload nginx
{: .language-bash}

## Step 8: Visit Your Website

If you\'ve pointed a domain to your server IP, visit:

    http://yourdomain.com

Otherwise, visit:

    http://YOUR_SERVER_IP

Your website is now live!

Next, [secure it with HTTPS](/guides/setup-ssl-https/){: style="color: var(--rd-indigo);"} for
a free SSL certificate, or [install WordPress](/guides/install-wordpress/){: style="color: var(--rd-indigo);"} if
you want a CMS instead of static files.
