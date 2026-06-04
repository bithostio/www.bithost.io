---
layout: guide
nav: guides
jsonld: jsonld/guide.html
title: "How to Set Up Docker on Your Cloud Server | Guides | bithost"
h1: "How to Set Up Docker on Your Cloud Server"
description: "Docker lets you run applications in isolated containers - making deployments reproducible, portable, and easy to manage. This guide covers installing Docke..."
canonical: "https://bithost.io/guides/setup-docker"
og_title: "How to Set Up Docker on Your Cloud Server - bithost Guide"
og_url: "https://bithost.io/guides/setup-docker"
og_description: "Docker lets you run applications in isolated containers - making deployments reproducible, portable, and easy to manage. This guide covers installing Docke..."
og_type: article
schema_type: HowTo
category: "Performance"
read_time: "4 min read"
updated: "May 2026"
toc:
  - { id: "what-is-docker", label: "What Is Docker?" }
  - { id: "step-1-install-docker", label: "Install Docker" }
  - { id: "step-2-install-docker-compose", label: "Install Docker Compose" }
  - { id: "step-3-run-your-first-container", label: "Run Your First Container" }
  - { id: "step-4-use-docker-compose-for-multi-container-apps", label: "Use Docker Compose for Multi-Container Apps" }
  - { id: "common-docker-commands", label: "Common Docker Commands" }
  - { id: "step-5-persist-data-with-volumes", label: "Persist Data with Volumes" }
  - { id: "step-6-configure-nginx-as-a-reverse-proxy-for-docker-apps", label: "Configure Nginx as a Reverse Proxy for Docker Apps" }
sidebar_title: "Performance"
sidebar:
  - { url: "/guides/scale-server-resources", label: "Scale server resources" }
  - { url: "/guides/monitor-resource-usage", label: "Monitor resource usage" }
  - { url: "/guides/migrate-a-website", label: "Migrate a website" }
  - { url: "/guides", label: "All guides →" }
---

Docker lets you run applications in isolated containers - making
deployments reproducible, portable, and easy to manage. This guide
covers installing Docker and getting started with containers on Ubuntu
22.04.

## What Is Docker?

Docker packages an application and all its dependencies into a
**container** - a lightweight, isolated environment that runs
consistently regardless of the underlying server. Instead of installing
and configuring software manually, you pull a container image and run
it.

**Benefits:**

* Deploy apps in seconds
* No dependency conflicts between apps
* Easy to update, restart, or roll back
* Same container runs on any Docker-compatible server

## Step 1: Install Docker

    curl -fsSL https://get.docker.com | sh
{: .language-bash}

This official install script handles everything automatically.

Verify the installation:

    docker --version
    docker run hello-world
{: .language-bash}

## Step 2: Install Docker Compose

Docker Compose lets you define and run multi-container apps with a
single file.

    apt install docker-compose-plugin -y
    docker compose version
{: .language-bash}

## Step 3: Run Your First Container

### Example: Run Nginx in Docker

    docker run -d -p 80:80 --name my-nginx nginx
{: .language-bash}

* `-d` - run in background (detached)
* `-p 80:80` - map port 80 on the host to port 80 in the container
* `--name my-nginx` - give it a friendly name
* `nginx` - the Docker image to use

Visit `http://YOUR_SERVER_IP` - you\'ll see the Nginx welcome page.

### Stop and Remove the Container

    docker stop my-nginx
    docker rm my-nginx
{: .language-bash}

## Step 4: Use Docker Compose for Multi-Container Apps

Docker Compose is the standard way to run apps with multiple services
(e.g. a web app + database).

### Example: WordPress + MySQL

Create a directory and a `docker-compose.yml` file:

    mkdir ~/wordpress && cd ~/wordpress
    nano docker-compose.yml
{: .language-bash}

    version: '3.8'
    
    services:
      db:
        image: mysql:8.0
        restart: always
        environment:
          MYSQL_ROOT_PASSWORD: rootpassword
          MYSQL_DATABASE: wordpress
          MYSQL_USER: wpuser
          MYSQL_PASSWORD: wppassword
        volumes:
          - db_data:/var/lib/mysql
    
      wordpress:
        image: wordpress:latest
        restart: always
        ports:
          - "8080:80"
        environment:
          WORDPRESS_DB_HOST: db
          WORDPRESS_DB_NAME: wordpress
          WORDPRESS_DB_USER: wpuser
          WORDPRESS_DB_PASSWORD: wppassword
        volumes:
          - wp_data:/var/www/html
        depends_on:
          - db
    
    volumes:
      db_data:
      wp_data:
{: .language-yaml}

Start it:

    docker compose up -d
{: .language-bash}

Visit `http://YOUR_SERVER_IP:8080` to complete WordPress setup.

Stop it:

    docker compose down
{: .language-bash}

## Common Docker Commands

| Command | Description |
|----------
| `docker ps` | List running containers |
| `docker ps -a` | List all containers (including stopped) |
| `docker images` | List downloaded images |
| `docker logs container-name` | View container logs |
| `docker exec -it container-name bash` | Open shell inside container |
| `docker stop container-name` | Stop a running container |
| `docker rm container-name` | Remove a stopped container |
| `docker pull image-name` | Download an image |
| `docker rmi image-name` | Remove an image |
| `docker system prune` | Clean up unused containers, images, networks |

## Step 5: Persist Data with Volumes

By default, data inside containers is lost when the container is
removed. Use **volumes** to persist data:

    docker run -d \
      -p 80:80 \
      -v /home/yourname/nginx-html:/usr/share/nginx/html \
      --name my-nginx nginx
{: .language-bash}

Now your HTML files from `/home/yourname/nginx-html` are served by Nginx
inside the container.

## Step 6: Configure Nginx as a Reverse Proxy for Docker Apps

Run your app container on a local port (e.g. 8080) and let Nginx handle
public traffic:

    server {
        listen 80;
        server_name yourdomain.com;
    
        location / {
            proxy_pass http://localhost:8080;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
{: .language-nginx}

Then add SSL with Certbot as usual.

## Popular Docker Images to Explore

| App | Docker Image |
|----------
| Nginx | `nginx` |
| WordPress | `wordpress` |
| MySQL | `mysql` |
| Nextcloud | `nextcloud` |
| Portainer (Docker GUI) | `portainer/portainer-ce` |
| Gitea (self-hosted Git) | `gitea/gitea` |
| Uptime Kuma (monitoring) | `louislam/uptime-kuma` |
