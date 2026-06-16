---
layout: guide
nav: guides
jsonld: jsonld/guide.html
title: "How to Set Up HTTPS with Let's Encrypt (Free SSL) | bithost"
h1: "How to Set Up HTTPS with Let's Encrypt (Free SSL)"
description: "Set up free HTTPS with Let's Encrypt on Nginx (Ubuntu 22.04): install Certbot, get a trusted SSL certificate, force HTTPS redirects, and auto-renew."
canonical: "https://bithost.io/guides/setup-ssl-https/"
og_title: "How to Set Up HTTPS with Let's Encrypt (Free SSL) - bithost Guide"
og_url: "https://bithost.io/guides/setup-ssl-https/"
og_description: "Set up free HTTPS with Let's Encrypt on Nginx (Ubuntu 22.04): install Certbot, get a trusted SSL certificate, force HTTPS redirects, and auto-renew."
og_type: article
schema_type: Article
category: "Web Hosting"
read_time: "3 min read"
updated: "June 2026"
date_published: "2026-05-01"
date_modified: "2026-06-15"
toc:
  - { id: "prerequisites", label: "Prerequisites" }
  - { id: "step-1-install-certbot", label: "Install Certbot" }
  - { id: "step-2-obtain-and-install-the-certificate", label: "Obtain and Install the Certificate" }
  - { id: "step-3-verify-https-is-working", label: "Verify HTTPS Is Working" }
  - { id: "step-4-auto-renewal", label: "Auto-Renewal" }
  - { id: "checking-certificate-details", label: "Checking Certificate Details" }
  - { id: "manual-renewal-if-needed", label: "Manual Renewal (if needed)" }
  - { id: "troubleshooting", label: "Troubleshooting" }
  - { id: "what-your-nginx-config-looks-like-after-certbot", label: "Nginx Config After Certbot" }
sidebar_title: "Web Hosting"
sidebar:
  - { url: "/guides/host-a-website-with-nginx", label: "Host a website with Nginx" }
  - { url: "/guides/install-wordpress", label: "Install WordPress" }
  - { url: "/guides/point-domain-to-server", label: "Point domain to server" }
  - { url: "/guides", label: "All guides →" }
---

HTTPS encrypts traffic between your server and visitors, protects user
data, and is required for modern websites. Let\'s Encrypt provides free,
trusted SSL certificates. This guide covers setting up HTTPS on Nginx
(Ubuntu 22.04) with Certbot.

## Prerequisites

* A [domain name pointed to your server\'s IP](/guides/point-domain-to-server/){: style="color: var(--rd-indigo);"}. Buy server [with crypto](https://dashboard.bithost.io/registration){: style="color: var(--rd-indigo);"}
* [Nginx installed and running](/guides/host-a-website-with-nginx/){: style="color: var(--rd-indigo);"}
* Port 80 and 443 open in your firewall

## Step 1: Install Certbot

    apt update
    apt install certbot python3-certbot-nginx -y
{: .language-bash}

## Step 2: Obtain and Install the Certificate

Run Certbot with the Nginx plugin:

    certbot --nginx -d yourdomain.com -d www.yourdomain.com
{: .language-bash}

Certbot will:

1.  Verify you own the domain (via an HTTP challenge)
2.  Download and install the certificate
3.  Automatically update your Nginx config for HTTPS
4.  Set up a redirect from HTTP to HTTPS

Follow the prompts - when asked about redirects, choose **option 2**
(redirect all HTTP to HTTPS).

## Step 3: Verify HTTPS Is Working

Visit your site in a browser:

    https://yourdomain.com

You should see a padlock icon in the address bar. Your site is now
secured with HTTPS.

## Step 4: Auto-Renewal

Let\'s Encrypt certificates expire every 90 days. Certbot automatically
sets up a cron job to renew them. Test the renewal process with:

    certbot renew --dry-run
{: .language-bash}

If you see `Congratulations, all simulated renewals succeeded`,
auto-renewal is working correctly.

## Checking Certificate Details

View your certificate\'s expiry date and domains:

    certbot certificates
{: .language-bash}

## Manual Renewal (if needed)

    certbot renew
    systemctl reload nginx
{: .language-bash}

## Troubleshooting

| Problem | Solution |
| --- | --- |
| `Domain not resolving` | Check your DNS A record points to the correct server IP |
| `Port 80 not accessible` | Make sure port 80 is open in your firewall (`ufw allow 80`) |
| `Too many requests` | Let\'s Encrypt has rate limits - wait an hour and try again |
| `Certificate not trusted` | Ensure you\'re using the full chain certificate |

## What Your Nginx Config Looks Like After Certbot

Certbot automatically updates your server block to something like:

    server {
        listen 443 ssl;
        server_name yourdomain.com www.yourdomain.com;
    
        ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
        include /etc/letsencrypt/options-ssl-nginx.conf;
    
        root /var/www/mywebsite;
        index index.html;
    
        location / {
            try_files $uri $uri/ =404;
        }
    }
    
    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;
        return 301 https://$host$request_uri;
    }
{: .language-nginx}
