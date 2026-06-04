---
layout: guide
nav: guides
jsonld: jsonld/guide.html
title: "How to Connect to Your Cloud Server via SSH | Guides | bithost"
h1: "How to Connect to Your Cloud Server via SSH"
description: "Generate SSH keys on Mac, Linux, or Windows, add your public key to the server, and connect from your terminal. Covers ed25519 keys, PuTTY, and SSH config shortcuts."
canonical: "https://bithost.io/guides/connect-via-ssh"
og_title: "How to Connect to Your Cloud Server via SSH - bithost Guide"
og_url: "https://bithost.io/guides/connect-via-ssh"
og_description: "Generate SSH keys on Mac, Linux, or Windows, add your public key to the server, and connect from your terminal. Covers ed25519 keys, PuTTY, and SSH config shortcuts."
og_type: article
schema_type: HowTo
category: "Getting Started"
read_time: "4 min read"
updated: "May 2026"
toc:
  - { id: "what-is-ssh", label: "What Is SSH?" }
  - { id: "part-1-generate-an-ssh-key-recommended", label: "Part 1: Generate an SSH Key (Recommended)" }
  - { id: "part-2-add-your-public-key-to-the-server", label: "Part 2: Add Your Public Key to the Server" }
  - { id: "part-3-connect-to-your-server", label: "Part 3: Connect to Your Server" }
  - { id: "part-4-first-time-connection", label: "Part 4: First-Time Connection" }
  - { id: "useful-ssh-tips", label: "Useful SSH Tips" }
  - { id: "troubleshooting", label: "Troubleshooting" }
sidebar_title: "Getting Started"
sidebar:
  - { url: "/guides/getting-started", label: "Deploy your first server" }
  - { url: "/guides/choose-the-right-plan", label: "Choose the right plan" }
  - { url: "/guides/understanding-your-dashboard", label: "Understanding your dashboard" }
  - { url: "/guides", label: "All guides →" }
---

SSH (Secure Shell) is the standard way to access and manage your Linux
cloud server remotely. This guide covers everything from generating your
SSH key to logging in for the first time.

## What Is SSH?   {#what-is-ssh}

SSH is an encrypted protocol that lets you control your server from your
computer\'s terminal (command line). Think of it as a secure remote
control for your server.

## Part 1: Generate an SSH Key (Recommended)   {#part-1-generate-an-ssh-key-recommended}

SSH keys are more secure than passwords. If you already have one, skip
to Part 2.

### On macOS / Linux

Open your terminal and run:

    ssh-keygen -t ed25519 -C "your@email.com"
{: .language-bash}

* Press **Enter** to accept the default file location
  (`~/.ssh/id_ed25519`)
* Optionally set a passphrase for extra security

Your keys are saved at:

* **Private key:** `~/.ssh/id_ed25519` - keep this secret, never share
  it
* **Public key:** `~/.ssh/id_ed25519.pub` - this is what you give to
  your server

To view your public key:

    cat ~/.ssh/id_ed25519.pub
{: .language-bash}

Copy the output - it starts with `ssh-ed25519 AAAA...`

### On Windows

**Option A: Windows Terminal / PowerShell (Windows 10/11)**

    ssh-keygen -t ed25519 -C "your@email.com"
{: .language-powershell}

Follow the same steps as above. Keys are saved in
`C:\Users\YourName\.ssh\`.

**Option B: PuTTY**

1.  Download [PuTTYgen][1]
2.  Select **EdDSA** and click **Generate**
3.  Move your mouse to generate randomness
4.  Save your private key (`.ppk` file)
5.  Copy the public key from the text box at the top

## Part 2: Add Your Public Key to the Server   {#part-2-add-your-public-key-to-the-server}

When creating your server, paste your public key into the **SSH Key**
field in your control panel. This is the recommended approach.

If your server is already running, add the key manually:

    # On the server (logged in as root via password)
    mkdir -p ~/.ssh
    echo "YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
    chmod 700 ~/.ssh
    chmod 600 ~/.ssh/authorized_keys
{: .language-bash}

## Part 3: Connect to Your Server   {#part-3-connect-to-your-server}

### macOS / Linux / Windows Terminal

    ssh root@YOUR_SERVER_IP
{: .language-bash}

Replace `YOUR_SERVER_IP` with your server\'s IPv4 address (e.g.
`123.45.67.89`).

If you used a non-default key file:

    ssh -i ~/.ssh/id_ed25519 root@YOUR_SERVER_IP
{: .language-bash}

### Windows with PuTTY

1.  Open PuTTY
2.  Enter your server\'s IP in **Host Name**
3.  Go to **Connection → SSH → Auth** and browse to your `.ppk` private
    key file
4.  Click **Open**

## Part 4: First-Time Connection   {#part-4-first-time-connection}

On your first connection, you\'ll see a message like:

    The authenticity of host '123.45.67.89' can't be established.
    Are you sure you want to continue connecting? (yes/no)

Type `yes` and press Enter. This adds your server to your list of known
hosts.

## Useful SSH Tips   {#useful-ssh-tips}

### Create a Shortcut (SSH Config)

Edit or create `~/.ssh/config` on your local machine:

    Host myserver
      HostName 123.45.67.89
      User root
      IdentityFile ~/.ssh/id_ed25519

Now you can connect with just:

    ssh myserver
{: .language-bash}

### Copy Files to/from the Server (SCP)

    # Upload a file to the server
    scp localfile.txt root@YOUR_SERVER_IP:/home/
    
    # Download a file from the server
    scp root@YOUR_SERVER_IP:/home/file.txt ./
{: .language-bash}

### Keep Sessions Alive

Add this to your `~/.ssh/config` to prevent timeouts:

    Host *
      ServerAliveInterval 60

## Troubleshooting   {#troubleshooting}

| Problem | Solution |
|----------
| `Connection refused` | Server may still be booting - wait 1–2 min and retry |
| `Permission denied (publickey)` | Wrong key or key not added to server - check `~/.ssh/authorized_keys` |
| `Host key verification failed` | Run `ssh-keygen -R YOUR_SERVER_IP` to clear old entry |
| Timeout / no response | Check your server\'s firewall - port 22 must be open |

[1]: https://www.putty.org/

