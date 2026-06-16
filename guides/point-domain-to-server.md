---
layout: guide
nav: guides
jsonld: jsonld/guide.html
title: "How to Point Your Domain to Your VPS | Guides | bithost"
h1: "How to Point Your Domain Name to Your VPS"
description: "Point your domain to your VPS in minutes: find your server IP, add an A record at your registrar, wait for DNS propagation, and test. Cloudflare tips included."
canonical: "https://bithost.io/guides/point-domain-to-server"
og_title: "How to Point Your Domain to Your VPS - bithost Guide"
og_url: "https://bithost.io/guides/point-domain-to-server"
og_description: "Point your domain to your VPS in minutes: find your server IP, add an A record at your registrar, wait for DNS propagation, and test. Cloudflare tips included."
og_type: article
schema_type: Article
category: "Web Hosting"
read_time: "3 min read"
updated: "June 2026"
date_published: "2026-05-01"
date_modified: "2026-06-15"
toc:
  - { id: "how-dns-works-quick-summary", label: "How DNS Works (Quick Summary)" }
  - { id: "what-you-need", label: "What You Need" }
  - { id: "step-1-find-your-servers-ip-address", label: "Find Your Server's IP Address" }
  - { id: "step-2-log-in-to-your-domain-registrar", label: "Log In to Your Domain Registrar" }
  - { id: "step-3-add-an-a-record", label: "Add an A Record" }
  - { id: "step-4-wait-for-dns-propagation", label: "Wait for DNS Propagation" }
  - { id: "step-5-test-your-domain", label: "Test Your Domain" }
  - { id: "optional-using-cloudflare-as-your-dns-provider", label: "Optional: Using Cloudflare as Your DNS Provider" }
sidebar_title: "Web Hosting"
sidebar:
  - { url: "/guides/host-a-website-with-nginx", label: "Host a website with Nginx" }
  - { url: "/guides/install-wordpress", label: "Install WordPress" }
  - { url: "/guides/setup-ssl-https", label: "Set up HTTPS (SSL)" }
  - { url: "/guides", label: "All guides →" }
---

To make your website accessible via a domain (e.g. `yoursite.com`
instead of an IP address), you need to update your domain\'s DNS
records. This guide explains how.

## How DNS Works (Quick Summary)

When someone types your domain into a browser, DNS (Domain Name System)
translates it to your server\'s IP address. You control this mapping
through your domain registrar\'s DNS settings.

## What You Need

* Your server\'s **IPv4 address** (e.g. `123.45.67.89`) - found in your
  server dashboard
* Access to your **domain registrar** (e.g. SuperBitHost). [Buy Domain with crypto](https://www.superbithost.com/domains/domain-search){: style="color: var(--rd-indigo);"}

## Step 1: Find Your Server\'s IP Address

Log in to your [server control panel](/guides/understanding-your-dashboard/){: style="color: var(--rd-indigo);"}
and note the **IPv4 address** on your server\'s **Details** tab.

## Step 2: Log In to Your Domain Registrar

Go to the website where you purchased your domain and navigate to the
**DNS settings** or **DNS Management** section for that domain.

## Step 3: Add an A Record

An **A record** maps your domain to your server\'s IP address.

| Type | Name | Value | TTL |
| --- | --- | --- | --- |
| A | `@` | `YOUR_SERVER_IP` | 3600 |
| A | `www` | `YOUR_SERVER_IP` | 3600 |

* `@` represents the root domain (e.g. `yoursite.com`)
* `www` covers `www.yoursite.com`
* TTL is in seconds - 3600 (1 hour) is standard

> **Note:** Some registrars use `yourdomain.com` instead of `@` for the
> root domain.

## Step 4: Wait for DNS Propagation

DNS changes can take **a few minutes to 48 hours** to propagate
worldwide, though most updates are visible within 15–60 minutes.

Check propagation status at: [https://dnschecker.org][1]

## Step 5: Test Your Domain

Once propagated, open a browser and visit:

    http://yourdomain.com

You should see your website. If you\'ve [set up
HTTPS](/guides/setup-ssl-https/){: style="color: var(--rd-indigo);"}, visit:

    https://yourdomain.com

## Optional: Using Cloudflare as Your DNS Provider

Cloudflare offers free DNS with added benefits: DDoS protection, CDN,
and performance improvements. To use it:

1.  Sign up at [cloudflare.com][2]
2.  Add your domain and import your DNS records
3.  Cloudflare will give you two nameservers (e.g.
    `ada.ns.cloudflare.com`)
4.  Go back to your domain registrar and update the **nameservers** to
    Cloudflare\'s
5.  Manage all DNS from Cloudflare going forward

## Common DNS Record Types

| Record | Purpose |
| --- | --- |
| **A** | Maps domain to IPv4 address |
| **AAAA** | Maps domain to IPv6 address |
| **CNAME** | Alias - points one domain to another |
| **MX** | Mail server routing |
| **TXT** | Verification, SPF, DKIM records |

## Troubleshooting

| Problem | Solution |
| --- | --- |
| Domain not resolving | Check the A record is saved correctly and wait for propagation |
| Showing old/wrong IP | DNS may be cached - try a different browser or use a VPN |
| `ERR_CONNECTION_REFUSED` | Domain resolves but server isn\'t serving - check [Nginx is running](/guides/host-a-website-with-nginx/) |
| SSL error after pointing domain | Run Certbot after DNS propagates, not before |

[1]: https://dnschecker.org
[2]: https://cloudflare.com

