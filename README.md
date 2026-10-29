# SimpleCMS – Content Management System Checkpoint

A simple, end-to-end Content Management System built with plain HTML, CSS and JavaScript. It has no build step and no dependencies.

**Live demo:** https://martindevoncall.github.io/cms-checkpoint/

## Features

- **Public site**: lists published posts, with live search, a category filter and a page for each post
- **Admin panel** (`#/admin`): log in with the demo account, then:
  - Create, edit and delete posts (CRUD)
  - Save posts as **Draft** or **Published** (drafts stay hidden from the public site)
  - See counts of total, published and draft posts
  - Reset the content to the demo data
- **Persistence**: content is stored in the browser's `localStorage`
- **Responsive** layout for desktop and mobile
- Output is HTML-escaped to prevent script injection

## Demo credentials

| Username | Password   |
|----------|------------|
| admin    | admin123   |

> Authentication is client-side only and is meant for demonstration.

## Project structure

```
index.html        # App shell
css/style.css     # Styles
js/store.js       # ContentStore class: CRUD over localStorage
js/auth.js        # Auth class: demo login/logout (sessionStorage)
js/views.js       # HTML templates for each page
js/app.js         # App class: hash router + event handling
```

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Deployment

Deployed with GitHub Pages from the `main` branch.
