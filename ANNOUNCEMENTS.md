# Publishing announcements

Create a Markdown file in `src/content/announcements`. The filename becomes the article URL, so use a short lowercase name such as `autumn-project-showcase.md`.

Every announcement begins with this frontmatter:

```md
---
title: "Autumn Project Showcase"
date: 2026-10-15
category: "Events"
summary: "Join CESA members for an evening of project demonstrations and conversation."
image: "/assets/images/project-showcase.jpg"
draft: false
---

Write the full announcement here using Markdown.

## Event details

- Date and time
- Location
- Who may attend
```

The `image` field is optional. Put announcement images in `assets/images`. Set `draft: true` to keep a post out of the website while writing it. After committing and pushing the file to `main`, the normal GitHub Pages workflow rebuilds the homepage and creates the full article page automatically.
