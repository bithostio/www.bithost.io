---
layout: guide
nav: guides
jsonld: jsonld/guide.html
title: "Disable SSH Key Auth & Enable Password Login | bithost"
h1: "Disable SSH Key Auth & Enable Password Login on Linux"
description: "Step-by-step guide to disabling SSH key authentication and enabling password login on a Linux VPS. Edit sshd_config, restart SSH, and test access safely."
canonical: "https://bithost.io/guides/disable-ssh-keys/"
og_title: "Disable SSH Key Auth and Enable Password Login on Linux - bithost Guide"
og_url: "https://bithost.io/guides/disable-ssh-keys/"
og_description: "How to switch your Linux VPS from SSH key authentication to password-based login - edit sshd_config, restart the SSH daemon, and test safely."
og_type: article
schema_type: Article
category: "Security"
read_time: "5 min read"
updated: "June 2026"
date_published: "2026-05-01"
date_modified: "2026-06-15"
toc:
  - { id: "prerequisites", label: "Prerequisites" }
  - { id: "set-password", label: "Set a user password" }
  - { id: "edit-sshd-config", label: "Edit sshd_config" }
  - { id: "restart-ssh", label: "Restart SSH" }
  - { id: "test-login", label: "Test password login" }
  - { id: "disable-key-auth", label: "Disable key auth entirely" }
  - { id: "security-note", label: "Security considerations" }
sidebar_title: "Security"
sidebar:
  - { url: "/guides/ssh-keys", label: "Set up SSH keys" }
  - { url: "/guides/secure-your-server", label: "Secure your server" }
  - { url: "/guides/connect-via-ssh", label: "Connect via SSH" }
  - { url: "/guides", label: "All guides →" }
---

By default, bithost deploys servers with [SSH key
authentication](/guides/ssh-keys){: style="color: var(--rd-indigo);"} -
the most secure way to log in. But there are legitimate reasons to
switch to password-based SSH login: legacy automation scripts, shared
access without distributing keys, or testing environments where
convenience outweighs strict security.

This guide walks you through enabling `PasswordAuthentication` in
`sshd_config` on any Linux distribution, with an optional step to
disable public key auth entirely. The process takes about 5 minutes and
works on Ubuntu, Debian, CentOS, AlmaLinux, and Rocky Linux.

<div style="background: rgba(239,68,68,0.08); border-left: 3px solid #ef4444; padding: 16px 20px; border-radius: 4px; margin: 24px 0;" markdown="1">
**Security warning**{: style="color: #ef4444;"}  
 Password authentication is significantly weaker than key-based auth.
Servers exposed to the internet with password login enabled are
constantly targeted by brute-force bots. If you enable password auth,
use a strong, unique password and consider also enabling `fail2ban` or
limiting SSH access by IP.
</div>

## Prerequisites   {#prerequisites}

* A running Linux VPS - [deploy one on
  bithost](/guides/getting-started){: style="color: var(--rd-indigo);"}
  in under a minute.
* An active SSH session connected via key auth (you need to be logged in
  before making changes).
* Root or `sudo` access on the server.

**Important:** Always keep your existing SSH session open while testing
the new login method. If something goes wrong, you\'ll still have your
current session to fix it.

## Step 1 - Set a user password   {#set-password}

Before enabling password authentication in SSH, make sure the account
you\'ll log into actually has a password set. On a freshly deployed VPS,
the root account often has no password (login is key-only).

To set or change the root password:

    passwd

To set a password for a specific user:

    passwd username

Use a strong password - at least 16 characters, mixing letters, numbers,
and symbols. Password auth over SSH is targeted by automated brute-force
attacks within minutes of a server going live.

## Step 2 - Edit sshd\_config   {#edit-sshd-config}

The SSH daemon configuration lives at `/etc/ssh/sshd_config`. Open it
with your preferred editor:

    nano /etc/ssh/sshd_config

Find the `PasswordAuthentication` line. It may be commented out
(prefixed with `#`) or explicitly set to `no`:

    #PasswordAuthentication no

Change it to:

    PasswordAuthentication yes

Make sure there is no leading `#` - commented-out lines are ignored by
the daemon.

On some distributions (particularly Ubuntu 22.04+), there is also a
drop-in config directory that can override the main file. Check for
overrides:

    grep -r "PasswordAuthentication" /etc/ssh/sshd_config.d/

If any file in `sshd_config.d/` sets `PasswordAuthentication no`, either
delete that file or change the value there too. Drop-in files take
precedence over the main `sshd_config`.

Save and close the file (<kbd>Ctrl+O</kbd>, then <kbd>Ctrl+X</kbd> in
nano).

## Step 3 - Restart the SSH service   {#restart-ssh}

Changes to `sshd_config` don\'t take effect until the daemon is
reloaded. Use the appropriate command for your distribution:

**Debian / Ubuntu:**

    systemctl restart ssh

**CentOS / AlmaLinux / Rocky Linux / RHEL:**

    systemctl restart sshd

To reload without dropping active connections (safer, but not all config
changes take effect this way):

    systemctl reload ssh

If you\'re unsure which service name your system uses, both of these
will tell you:

    systemctl status ssh
    systemctl status sshd

## Step 4 - Test password login   {#test-login}

**Do not close your existing SSH session yet.** Open a second terminal
window and attempt to log in with a password:

    ssh -o PubkeyAuthentication=no root@YOUR_SERVER_IP

The `-o PubkeyAuthentication=no` flag forces your SSH client to skip key
auth and use only password, so you can confirm the password method works
independently of your key.

If the login succeeds, your configuration is correct. If it fails, go
back to your original session and double-check `sshd_config` for any
typos or conflicting entries in `sshd_config.d/`.

## Step 5 (optional) - Disable public key authentication entirely   {#disable-key-auth}

If you want to allow *only* password login and prevent SSH key auth
completely, add or update this line in `sshd_config`:

    PubkeyAuthentication no

Then restart SSH again:

    systemctl restart ssh   # or sshd on RHEL-based systems

After this change, SSH clients will only be able to authenticate with a
password - even if they have a valid key for the server. This is useful
when you\'ve distributed the server credentials to multiple users and
want a single, revocable password as the only entry point.

## Security considerations   {#security-note}

Enabling password auth doesn\'t have to mean weak security. A few
measures that significantly reduce risk:

* **Use a strong, random password.** A 20+ character random string from
  a password manager is resistant to brute force.
* **Install fail2ban.** It automatically blocks IP addresses after
  repeated failed login attempts: `apt install fail2ban` on
  Debian/Ubuntu.
* **Limit SSH to specific IPs.** Add `AllowUsers user@1.2.3.4` in
  `sshd_config` to restrict which IPs can authenticate.
* **Change the default SSH port.** Not a security measure on its own,
  but reduces noise from automated scanners: add `Port 2222` (or any
  unused port) to `sshd_config`.
* **Re-enable key auth when possible.** SSH keys are phishing-resistant
  and immune to brute force - switch back via [this
  guide](/guides/ssh-keys){: style="color: var(--rd-indigo);"} once your
  use case allows it.
