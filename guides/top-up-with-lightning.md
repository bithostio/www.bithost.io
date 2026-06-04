---
layout: guide
nav: guides
jsonld: jsonld/guide.html
title: "Top up instantly with Lightning Network | Guides | bithost"
h1: "Top up instantly with Lightning Network"
description: "Use Lightning Network to add funds to your bithost account in seconds - no block confirmation wait. Minimum $1. Works with any Lightning wallet."
canonical: "https://bithost.io/guides/top-up-with-lightning"
og_title: "Top up instantly with Lightning Network - bithost Guide"
og_url: "https://bithost.io/guides/top-up-with-lightning"
og_description: "Top up your bithost balance instantly with Lightning Network. Credits appear in seconds, no waiting for block confirmations. Works with any LN wallet."
og_type: article
schema_type: HowTo
category: "Getting Started"
read_time: "3 min read"
updated: "May 2026"
toc:
  - { id: "why-lightning", label: "Why use Lightning?" }
  - { id: "step-1", label: "1. Open Add funds" }
  - { id: "step-2", label: "2. Generate invoice" }
  - { id: "step-3", label: "3. Pay and confirm" }
  - { id: "wallets", label: "Recommended wallets" }
  - { id: "limits", label: "Limits" }
---

Lightning Network lets you top up your bithost balance in seconds - no
waiting for Bitcoin block confirmations. Credits appear immediately
after payment settles, which is typically under a second.

## Why use Lightning instead of on-chain Bitcoin?   {#why-lightning}

On-chain Bitcoin transactions require at least one confirmation (around
10 minutes) before bithost credits your balance. Lightning is instant,
has near-zero fees, and works for any amount down to $1. If you need to
deploy a server right now, Lightning is the fastest way to fund your
account.

## 1. Open Add funds   {#step-1}

Log in to [dashboard.bithost.io][1]{: style="color:var(--rd-indigo);"}.
Click **Add funds** in the top navigation bar. You\'ll see a list of
supported payment methods.

## 2. Select Lightning and enter an amount   {#step-2}

Choose **Lightning Network** from the payment method list. Enter the USD
amount you want to credit. The minimum is $1. Click **Generate invoice**
- you\'ll see a QR code and a payment request string (a long string
starting with `lnbc`).

The invoice is valid for 15 minutes. If it expires, simply generate a
new one.

## 3. Pay the invoice and confirm   {#step-3}

Open your Lightning wallet, scan the QR code or paste the payment
request, and confirm the payment. Your bithost balance updates within
seconds of the payment settling. You\'ll see a confirmation message on
screen and an email receipt.

## Recommended Lightning wallets   {#wallets}

Any Lightning wallet works. Popular options:

* **Phoenix** (iOS/Android) - self-custodial, simple, excellent UX
* **Breez** (iOS/Android) - self-custodial with podcast player and POS
* **Muun** (iOS/Android) - hybrid on-chain/Lightning, very
  beginner-friendly
* **Zeus** (iOS/Android) - connects to your own node
* **Alby** (browser extension) - great for desktop users

## Limits and fees   {#limits}

Minimum top-up: $1. There is no maximum per transaction, though very
large Lightning payments may be limited by your wallet\'s channel
capacity. bithost does not charge fees on Lightning top-ups. Your wallet
may charge a small routing fee (typically less than 1 sat).

See also: [Deploy your first server with
Bitcoin](/guides/getting-started){: style="color:var(--rd-indigo);"} for
the full account setup walkthrough.



[1]: https://dashboard.bithost.io/

