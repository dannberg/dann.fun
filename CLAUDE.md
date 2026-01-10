# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is **dann.fun**, a static HTML website hosted on GitHub Pages at https://dann.fun. It's a collection of fun, interactive web pages with no build system - just pure HTML, CSS, and JavaScript.

## Development

**Local development:** Open any HTML file directly in a browser:
```bash
open index.html
```

**Deployment:** Push to the `master` branch. GitHub Pages automatically deploys via the `pages-build-deployment` workflow.

## Architecture

The site consists of standalone HTML pages, each self-contained or with co-located assets:

- **`/index.html`** - Main page with bouncing, draggable face animations (physics-based with gravity)
- **`/click/index.html`** - Idle clicker game (single-file, all CSS/JS inline)
- **`/clicker/index.html`** - More developed clicker game with separate `styles.css` and `script.js`
- **`/burningman2025/`** - Event-specific page with local images

Each page is independent - there's no shared component library or templating. Styles and scripts are typically inlined or co-located with their HTML file.
