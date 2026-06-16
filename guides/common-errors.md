---
layout: guide
nav: guides
jsonld: jsonld/guide.html
title: "Common Server Errors and How to Fix Them | bithost"
h1: "Common Server Error Messages and How to Fix Them"
description: "Fix the most common Linux server errors: SSH connection refused, 502/504/403/404 Nginx errors, MySQL access denied, disk full, and SSL problems."
canonical: "https://bithost.io/guides/common-errors/"
og_title: "Common Server Errors and How to Fix Them - bithost Guide"
og_url: "https://bithost.io/guides/common-errors/"
og_description: "Fix the most common Linux server errors: SSH connection refused, 502/504/403/404 Nginx errors, MySQL access denied, disk full, and SSL problems."
og_type: article
schema_type: Article
category: "Troubleshooting"
read_time: "5 min read"
updated: "June 2026"
date_published: "2026-05-01"
date_modified: "2026-06-15"
toc:
  - { id: "ssh-errors", label: "SSH Errors" }
  - { id: "web-server-errors", label: "Web Server Errors" }
  - { id: "mysql-errors", label: "MySQL Errors" }
  - { id: "disk-system-errors", label: "Disk / System Errors" }
  - { id: "ssl-https-errors", label: "SSL / HTTPS Errors" }
  - { id: "general-diagnostic-commands", label: "General Diagnostic Commands" }
sidebar_title: "Troubleshooting"
sidebar:
  - { url: "/guides/server-unreachable", label: "Server unreachable" }
  - { url: "/guides/failed-deployment", label: "Recover from failed deploy" }
  - { url: "/guides", label: "All guides →" }
---

This reference guide covers the most frequent errors you\'ll encounter
when managing a cloud server, with clear explanations and step-by-step
fixes.

## SSH Errors

### `Connection refused`

**Meaning:** The server rejected the connection - SSH isn\'t listening
or the port is blocked.

**Fixes:**

    # Check if SSHD is running (via web console)
    systemctl status sshd
    systemctl start sshd
    
    # Check if port 22 is open
    ufw status
    ufw allow OpenSSH
{: .language-bash}

### `Connection timed out`

**Meaning:** The connection never reached the server - network issue or
firewall blocking.

**Fixes:**

* Verify the server\'s IP address is correct
* Check the server is powered on in the control panel
* Ensure port 22 is open in your firewall (`ufw allow 22`)
* Check if your provider\'s network firewall (not UFW) is blocking it

### `Permission denied (publickey)`

**Meaning:** [SSH key authentication](/guides/connect-via-ssh/){: style="color: var(--rd-indigo);"} failed.

**Fixes:**

    # Check your key is in the right place on the server
    cat ~/.ssh/authorized_keys   # Run on the server
    
    # Re-add your public key
    echo "YOUR_PUBLIC_KEY" >> ~/.ssh/authorized_keys
    chmod 600 ~/.ssh/authorized_keys
    
    # Connect specifying the right key
    ssh -i ~/.ssh/id_ed25519 user@server
{: .language-bash}

### `WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!`

**Meaning:** The server\'s SSH fingerprint changed (can happen after
rebuild or IP reuse).

**Fix:**

    ssh-keygen -R YOUR_SERVER_IP
    # Then reconnect and accept the new fingerprint
{: .language-bash}

## Web Server Errors

### `502 Bad Gateway`

**Meaning:** [Nginx](/guides/host-a-website-with-nginx/){: style="color: var(--rd-indigo);"}
received no valid response from the backend (PHP-FPM, Node app, etc.).

**Fixes:**

    # Check PHP-FPM is running
    systemctl status php8.1-fpm
    systemctl restart php8.1-fpm
    
    # Check your app is running
    pm2 status        # Node.js
    systemctl status my-app   # Python/other
    
    # Check Nginx logs
    tail -20 /var/log/nginx/error.log
{: .language-bash}

### `504 Gateway Timeout`

**Meaning:** The backend (your app) is too slow to respond.

**Fixes:**

* Increase Nginx timeout in server block:

    proxy_read_timeout 120;
    proxy_connect_timeout 120;
{: .language-nginx}

* Investigate slow database queries or memory issues in your app

### `403 Forbidden`

**Meaning:** Nginx can see the file but is refusing to serve it -
permissions issue.

**Fixes:**

    # Check and fix file permissions
    chown -R www-data:www-data /var/www/mysite
    chmod -R 755 /var/www/mysite
    chmod -R 644 /var/www/mysite/*.php
{: .language-bash}

### `404 Not Found`

**Meaning:** The requested file doesn\'t exist or Nginx can\'t find it.

**Fixes:**

    # Verify files are in the right location
    ls /var/www/mysite/
    
    # Check your Nginx root path
    grep -n "root" /etc/nginx/sites-available/mysite
    
    # For WordPress - check if mod_rewrite equivalent is set
    # Ensure try_files is in your location block:
    # try_files $uri $uri/ /index.php?$args;
{: .language-bash}

### `413 Request Entity Too Large`

**Meaning:** A file upload exceeds Nginx\'s size limit.

**Fix:**

    nano /etc/nginx/nginx.conf
    # Add or update:
    client_max_body_size 100M;
    
    systemctl reload nginx
{: .language-bash}

Also update PHP:

    upload_max_filesize = 100M
    post_max_size = 100M
{: .language-ini}

## MySQL Errors

### `Access denied for user 'root'@'localhost'`

**Fix:**

    # Reset root password
    systemctl stop mysql
    mysqld_safe --skip-grant-tables &
    mysql -u root
    
    # Inside MySQL:
    ALTER USER 'root'@'localhost' IDENTIFIED BY 'NewPassword';
    FLUSH PRIVILEGES;
    EXIT;
    
    systemctl restart mysql
{: .language-bash}

### `Can't connect to local MySQL server through socket`

**Meaning:** MySQL is not running.

**Fix:**

    systemctl status mysql
    systemctl start mysql
{: .language-bash}

If it won\'t start, check the logs:

    journalctl -u mysql -n 50
{: .language-bash}

## Disk / System Errors   {#disk-system-errors}

### `No space left on device`

**Meaning:** Disk is 100% full - this will break many things.

**Fixes:**

    # Find what's using space
    df -h
    du -sh /var/log/*
    du -sh /tmp/*
    
    # Clear logs
    truncate -s 0 /var/log/syslog
    journalctl --vacuum-size=100M
    
    # Remove unused packages
    apt autoremove -y && apt clean
    
    # Remove old Docker images
    docker system prune -a
{: .language-bash}

To stay ahead of this, [monitor disk usage](/guides/monitor-resource-usage/){: style="color: var(--rd-indigo);"} regularly.

### `bash: /usr/bin/python3: Argument list too long`

**Meaning:** Usually caused by a glob expanding to too many files, or a
nearly full disk.

**Fix:** Free disk space (see above) or check the specific command that
failed.

## SSL / HTTPS Errors   {#ssl-https-errors}

###  `ERR_SSL_PROTOCOL_ERROR` or `NET::ERR_CERT_AUTHORITY_INVALID` 

**Fixes:**

    # Check certificate status
    certbot certificates
    
    # Renew if expired
    certbot renew
    
    # Test Nginx config
    nginx -t
    systemctl reload nginx
{: .language-bash}

For full certificate setup, see [Set up HTTPS
(SSL)](/guides/setup-ssl-https/){: style="color: var(--rd-indigo);"}.

### `Too Many Redirects`

**Meaning:** Nginx or your app is sending the browser in an infinite
redirect loop.

**Fixes:**

* In WordPress: set `siteurl` and `home` to `https://` in wp-config or
  database
* Check for conflicting HTTP→HTTPS redirect rules in both your app and
  Nginx

## General Diagnostic Commands

    # See all failed services
    systemctl --failed
    
    # Recent system errors
    journalctl -p err -n 50
    
    # Check what's listening on all ports
    ss -tulnp
    
    # Check nginx config
    nginx -t
    
    # View real-time logs across all services
    journalctl -f
{: .language-bash}
