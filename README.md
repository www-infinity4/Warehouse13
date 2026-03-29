# Warehouse13 — Infinity Master Portal

The unified master site for the [www-infinity4](https://github.com/www-infinity4) GitHub ecosystem.  
Every repo. Every signal. One portal.

## What's inside

| Category | Projects |
|---|---|
| **Tools** | Gitpub, Gitpal, Gitpal+, Gitpro, Gitmap, Gitpin, Gitflow, Gitcoin, Gitdad, Git-Stream, Git Core, Clone-of-Gitpal |
| **Games** | Escape From New York, Escape From LA, Pirates of Silicon Valley, Emulation Station |
| **Media** | Alien Radio, Shortwave, Camera App |
| **Research** | Thermite Earth Core, Fission, Unthinkable, Giro |
| **Social** | Suleman |

## Live Site

Deployed via **GitHub Pages** — see the [Actions tab](../../actions) for deployment status.

## Structure

```
Warehouse13/
├── index.html              # Master portal entry point
├── css/styles.css          # Site styles (dark cyberpunk theme)
├── js/main.js              # Hamburger menu, scroll effects, animations
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Pages deployment workflow
├── .nojekyll               # Bypass Jekyll processing
└── README.md
```

## Deployment

Push to `main` → GitHub Actions auto-deploys to GitHub Pages.

> Enable GitHub Pages in **Settings → Pages → Source: GitHub Actions** to activate.