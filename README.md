# Personal Academic Website Starter

This is a minimal, no-dependency starter for an academic personal site. Edit `index.html`, `style.css`, and `publications.json` and deploy to GitHub Pages.

## Quick start

1. Create a repo named `<your-github-username>.github.io`.
2. Upload (or push) these files to the repo root.
3. In **Settings → Pages**, set the source to the `main` branch (root).
4. Wait for deployment, then open `https://<your-github-username>.github.io`.

## Customize

- Replace placeholder text in `index.html` (name, bio, links).
- Put your CV at `assets/CV.pdf` and update the link.
- Update `publications.json` with your entries. Fields:
  ```json
  {
    "title": "Paper title",
    "authors": ["First Last", "Second Last"],
    "venue": "Conference/Journal",
    "year": 2025,
    "doi": "10.xxxx/xxxx",
    "pdf": "link-or-path.pdf",
    "code": "https://github.com/...",
    "poster": "",
    "video": "",
    "badges": ["Award", "Preprint"]
  }
  ```
- Replace `assets/avatar-placeholder.svg` with your photo (rename to `avatar.jpg` and update `index.html` if you like).
- Dark mode toggle is built-in (stored per-browser).

## Optional

- Custom domain: add a `CNAME` file with your domain and configure DNS per GitHub Pages docs.
- Analytics: add your script (e.g., GA) before `</head>`.
- Social preview: replace `assets/social-card.png` (1200×630 suggested).

## Local preview

Double-click `index.html`, or run a tiny server:
- Python: `python -m http.server` then open `http://localhost:8000/`

— Generated 2025-09-28
