---
layout: guide
nav: guides
jsonld: jsonld/guide.html
title: "How to Host a Website on Your Cloud Server Using Nginx | Guides | bithost"
h1: "How to Host a Website on Your Cloud Server Using Nginx"
description: "Nginx is a fast, lightweight web server used to serve websites and web applications. This guide walks you through installing Nginx and serving your first w..."
canonical: "https://bithost.io/guides/host-a-website-with-nginx"
og_title: "How to Host a Website on Your Cloud Server Using Nginx - bithost Guide"
og_url: "https://bithost.io/guides/host-a-website-with-nginx"
og_description: "Nginx is a fast, lightweight web server used to serve websites and web applications. This guide walks you through installing Nginx and serving your first w..."
og_type: article
schema_type: HowTo
category: "Web Hosting"
read_time: "3 min read"
updated: "May 2026"
toc:
  - { id: "prerequisites", label: "Prerequisites" }
  - { id: "step-1-update-your-server", label: "Update Your Server" }
  - { id: "step-2-install-nginx", label: "Install Nginx" }
  - { id: "step-3-allow-http-traffic-through-the-firewall", label: "Allow HTTP Traffic Through the Firewall" }
  - { id: "step-4-test-the-default-page", label: "Test the Default Page" }
  - { id: "step-5-upload-your-website-files", label: "Upload Your Website Files" }
  - { id: "step-6-configure-a-server-block-virtual-host", label: "Configure a Server Block (Virtual Host)" }
  - { id: "step-7-enable-the-site", label: "Enable the Site" }
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

* A cloud server running Ubuntu 22.04
* SSH access to the server ([How to Connect via
  SSH](/guides/connect-via-ssh){: style="color: var(--rd-indigo);"})
* A domain name pointed to your server\'s IP (optional, but recommended)

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
