/* guides-registry.js — single source of truth for all guide pages.
   To add a new guide: add an entry to GUIDES below, matching the slug to the HTML filename. */

var GUIDES = [
  // Getting Started
  { slug: "getting-started",          title: "Deploy your first server with bithost",         category: "Getting Started" },
  { slug: "choose-the-right-plan",    title: "How to choose the right cloud server plan",      category: "Getting Started" },
  { slug: "connect-via-ssh",          title: "How to connect to your server via SSH",          category: "Getting Started" },
  { slug: "understanding-your-dashboard", title: "Understanding your server dashboard",        category: "Getting Started" },

  // Security
  { slug: "secure-your-server",         title: "How to secure your cloud server",              category: "Security" },
  { slug: "automated-backups",          title: "How to set up automated backups",              category: "Security" },
  { slug: "monitor-suspicious-activity",title: "Monitor your server for suspicious activity",  category: "Security" },
  { slug: "disable-ssh-keys",           title: "Disable SSH key auth and enable password login", category: "Security" },
  { slug: "ssh-keys",                   title: "Add and manage SSH keys",                      category: "Security" },

  // Web Hosting
  { slug: "host-a-website-with-nginx",  title: "Host a website with Nginx",                   category: "Web Hosting" },
  { slug: "install-wordpress",          title: "Install WordPress on a cloud server",          category: "Web Hosting" },
  { slug: "setup-ssl-https",            title: "Set up HTTPS with Let's Encrypt",              category: "Web Hosting" },
  { slug: "point-domain-to-server",     title: "Point your domain name to your server",        category: "Web Hosting" },

  // Use Cases
  { slug: "setup-vpn-server",           title: "Set up your own VPN with WireGuard",           category: "Use Cases" },
  { slug: "game-server",                title: "Run a game server (Minecraft and more)",        category: "Use Cases" },
  { slug: "nextcloud-cloud-storage",    title: "Self-host cloud storage with Nextcloud",        category: "Use Cases" },
  { slug: "host-nodejs-python-app",     title: "Host a Node.js or Python web app",             category: "Use Cases" },
  { slug: "mail-server",                title: "Set up a mail server with Mailcow",             category: "Use Cases" },

  // Performance & Scaling
  { slug: "scale-server-resources",     title: "How to scale your server resources",            category: "Performance" },
  { slug: "monitor-resource-usage",     title: "Monitor CPU, RAM, and disk usage",              category: "Performance" },
  { slug: "migrate-a-website",          title: "Migrate a website to your cloud server",        category: "Performance" },
  { slug: "setup-docker",               title: "Set up Docker on your cloud server",            category: "Performance" },

  // Troubleshooting
  { slug: "server-unreachable",         title: "What to do if your server is unreachable",      category: "Troubleshooting" },
  { slug: "failed-deployment",          title: "How to recover from a failed deployment",       category: "Troubleshooting" },
  { slug: "common-errors",              title: "Common server error messages and fixes",         category: "Troubleshooting" },
];

(function () {
  function renderOtherGuides() {
    var el = document.getElementById("rd-other-guides");
    if (!el) return;

    // Derive current slug from the URL path: /guides/some-slug → "some-slug"
    var parts = window.location.pathname.replace(/\/$/, "").split("/");
    var currentSlug = parts[parts.length - 1];

    // Find the category for the current guide
    var current = null;
    for (var i = 0; i < GUIDES.length; i++) {
      if (GUIDES[i].slug === currentSlug) { current = GUIDES[i]; break; }
    }
    if (!current) return; // not found — leave placeholder empty

    // Collect up to 5 other guides from the same category
    var others = [];
    for (var j = 0; j < GUIDES.length; j++) {
      if (GUIDES[j].slug !== currentSlug && GUIDES[j].category === current.category) {
        others.push(GUIDES[j]);
        if (others.length === 5) break;
      }
    }

    if (others.length === 0) {
      // Hide the heading if there are no peers
      var heading = el.previousElementSibling;
      if (heading && heading.tagName === "H5") heading.style.display = "none";
      return;
    }

    // Render list items
    var html = "";
    for (var k = 0; k < others.length; k++) {
      html += '<li><a href="/guides/' + others[k].slug + '">' + others[k].title + '</a></li>';
    }
    el.innerHTML = html;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderOtherGuides);
  } else {
    renderOtherGuides();
  }
})();
