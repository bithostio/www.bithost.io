---
layout: guide
nav: guides
jsonld: jsonld/guide.html
title: "How to Host a Node.js or Python App on a VPS | bithost"
h1: "How to Host a Node.js or Python App on a VPS"
description: "Deploy a Node.js or Python web app on a VPS and keep it running with a process manager (PM2 or systemd) and Nginx as a reverse proxy."
canonical: "https://bithost.io/guides/host-nodejs-python-app/"
og_title: "How to Host a Node.js or Python App on a VPS - bithost Guide"
og_url: "https://bithost.io/guides/host-nodejs-python-app/"
og_description: "Deploy a Node.js or Python web app on a VPS and keep it running with a process manager (PM2 or systemd) and Nginx as a reverse proxy."
og_type: article
schema_type: Article
category: "Use Cases"
read_time: "3 min read"
updated: "June 2026"
date_published: "2026-05-01"
date_modified: "2026-06-15"
toc:
  - { id: "prerequisites", label: "Prerequisites" }
  - { id: "part-a-deploying-a-nodejs-app", label: "Part A: Deploying a Node.js App" }
  - { id: "part-b-deploying-a-python-flaskdjango-app", label: "Part B: Deploying a Python (Flask/Django) App" }
  - { id: "step-6-add-https-both-nodejs-and-python", label: "Add HTTPS (Both Node.js and Python)" }
  - { id: "useful-commands", label: "Useful Commands" }
sidebar_title: "Use Cases"
sidebar:
  - { url: "/guides/setup-vpn-server", label: "Set up a VPN server" }
  - { url: "/guides/game-server", label: "Run a game server" }
  - { url: "/guides/nextcloud-cloud-storage", label: "Self-host with Nextcloud" }
  - { url: "/guides", label: "All guides →" }
---

This guide walks you through deploying a Node.js or Python web
application to a cloud server and keeping it running reliably using a
process manager and Nginx as a reverse proxy.

## Prerequisites

* A VPS running Ubuntu 22.04 ([see vps prices](/prices/){: style="color: var(--rd-indigo);"}). Deploy your first [VPS with bithost](/guides/getting-started/){: style="color: var(--rd-indigo);"}.
* [SSH access](/guides/connect-via-ssh/){: style="color: var(--rd-indigo);"} and a non-root sudo user
* A [domain name](/guides/point-domain-to-server/){: style="color: var(--rd-indigo);"} (optional but recommended)
* Your app code ready to deploy

## Part A: Deploying a Node.js App

### Step 1: Install Node.js

    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    apt install nodejs -y
    node -v
    npm -v
{: .language-bash}

### Step 2: Upload Your App

From your local machine:

    scp -r ./my-app yourname@YOUR_SERVER_IP:/home/yourname/
{: .language-bash}

Or clone from Git:

    git clone https://github.com/yourusername/my-app.git
    cd my-app
{: .language-bash}

### Step 3: Install Dependencies and Test

    cd /home/yourname/my-app
    npm install
    node app.js
    # Confirm it runs, then stop with Ctrl+C
{: .language-bash}

### Step 4: Install PM2 (Process Manager)

PM2 keeps your app running and restarts it automatically on crashes or
reboots:

    npm install -g pm2
    pm2 start app.js --name my-app
    pm2 save
    pm2 startup
{: .language-bash}

Run the command PM2 outputs (it looks like `sudo env PATH=... pm2
startup ...`).

### Step 5: Configure Nginx as a Reverse Proxy

Your Node app runs on a port like `3000`.
[Nginx](/guides/host-a-website-with-nginx/){: style="color: var(--rd-indigo);"}
forwards web traffic to it:

    nano /etc/nginx/sites-available/my-app
{: .language-bash}

    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;
    
        location / {
            proxy_pass http://localhost:3000;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
{: .language-nginx}

Enable and reload:

    ln -s /etc/nginx/sites-available/my-app /etc/nginx/sites-enabled/
    nginx -t
    systemctl reload nginx
{: .language-bash}

## Part B: Deploying a Python (Flask/Django) App

### Step 1: Install Python and pip

    apt install python3 python3-pip python3-venv -y
{: .language-bash}

### Step 2: Upload and Set Up the App

    cd /home/yourname
    git clone https://github.com/yourusername/my-python-app.git
    cd my-python-app
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
{: .language-bash}

### Step 3: Install Gunicorn

Gunicorn is a WSGI server that runs Python apps in production:

    pip install gunicorn
{: .language-bash}

Test it:

    # For Flask (app.py with `app` as the Flask instance):
    gunicorn --bind 0.0.0.0:5000 app:app
    
    # For Django:
    gunicorn --bind 0.0.0.0:8000 myproject.wsgi
{: .language-bash}

### Step 4: Create a systemd Service

    nano /etc/systemd/system/my-python-app.service
{: .language-bash}

    [Unit]
    Description=My Python App
    After=network.target
    
    [Service]
    User=yourname
    WorkingDirectory=/home/yourname/my-python-app
    Environment="PATH=/home/yourname/my-python-app/venv/bin"
    ExecStart=/home/yourname/my-python-app/venv/bin/gunicorn --workers 3 --bind unix:/home/yourname/my-python-app/app.sock app:app
    Restart=always
    
    [Install]
    WantedBy=multi-user.target
{: .language-ini}

Enable and start:

    systemctl daemon-reload
    systemctl enable my-python-app
    systemctl start my-python-app
{: .language-bash}

### Step 5: Configure Nginx for Python App

    server {
        listen 80;
        server_name yourdomain.com;
    
        location / {
            include proxy_params;
            proxy_pass http://unix:/home/yourname/my-python-app/app.sock;
        }
    }
{: .language-nginx}

## Step 6: Add HTTPS (Both Node.js and Python)

    apt install certbot python3-certbot-nginx -y
    certbot --nginx -d yourdomain.com -d www.yourdomain.com
{: .language-bash}

For details and troubleshooting, see [Set up HTTPS
(SSL)](/guides/setup-ssl-https/){: style="color: var(--rd-indigo);"}.

## Useful Commands

| Task | Node.js (PM2) | Python (systemd) |
| --- | --- | --- |
| Start app | `pm2 start app.js` | `systemctl start my-python-app` |
| Stop app | `pm2 stop my-app` | `systemctl stop my-python-app` |
| Restart app | `pm2 restart my-app` | `systemctl restart my-python-app` |
| View logs | `pm2 logs my-app` | `journalctl -u my-python-app` |
| Auto-start on boot | `pm2 startup && pm2 save` | `systemctl enable my-python-app` |
