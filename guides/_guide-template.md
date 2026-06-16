---
# Copy this file to guides/<slug>.md and fill in the fields.
# The filename becomes the URL: guides/my-topic.md -> https://bithost.io/guides/my-topic
# (The leading underscore keeps THIS template out of the built site.)
layout: guide
nav: guides
jsonld: jsonld/guide.html        # auto-generates HowTo/Article + BreadcrumbList from the fields below
schema_type: Article             # Article renders complete schema; only use "HowTo" if you populate step[] in the include
title: "GUIDE TITLE | Guides | bithost"      # the <title> tag
h1: "GUIDE TITLE"                            # on-page <h1>, breadcrumb, and schema name
description: "Unique meta description, 120-160 characters."
canonical: "https://bithost.io/guides/GUIDE-SLUG/"
og_title: "GUIDE TITLE - bithost Guide"
og_url: "https://bithost.io/guides/GUIDE-SLUG/"
og_description: "Open Graph description."
og_type: article
category: "Getting Started"      # shown in the meta row
read_time: "5 min read"
updated: "May 2026"
# "On this page" sidebar — each id must match a {#id} on a heading below
toc:
  - { id: "section-one", label: "Section one" }
  - { id: "next-steps", label: "Next steps" }
# Related links shown under the TOC
sidebar_title: "Getting Started"
sidebar:
  - { url: "/guides/getting-started", label: "Deploy your first server" }
  - { url: "/guides", label: "All guides →" }
---

Intro paragraph describing what this guide covers and who it's for.

## Section One   {#section-one}

Write the body in **Markdown**. Use inline `code`, and fenced code blocks:

~~~bash
your-command --here
~~~

- A bullet
- Another bullet

## Next steps   {#next-steps}

- [Getting started guide](/guides/getting-started){: style="color: var(--rd-indigo);"} — if you haven't already.
