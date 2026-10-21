# Abhiram's Portfolio

Personal developer portfolio built with React, Vite, and Tailwind CSS — deployed on GitHub Pages via GitHub Actions.

🔗 **Live site:** [abhiram1212.github.io/my-portfolio/](https://abhiram1212.github.io/my-portfolio/)

---

## Tech Stack

- **Framework:** React 19 + Vite 7
- **Styling:** Tailwind CSS, Google Fonts (Syne + DM Mono)
- **Deployment:** GitHub Pages
- **CI/CD:** GitHub Actions — auto-deploys on every push to `main`

---

## Sections

- **Hero** — intro, role, and links to GitHub and LinkedIn
- **About** — background and what I'm working on
- **Skills** — Python, Go, AWS, PostgreSQL, Docker, Kubernetes, FastAPI, MLflow, Airflow, and more
- **Experience** — Social Tech Labs, 1Stop.ai, Pixelvide
- **Projects** — DocMind (AI PDF chat assistant)
- **Education** — M.S. Computer Science, George Mason University
- **Contact** — reach out form and social links

---

## Running Locally

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Deployment

To enable hosting, open the repository's **Settings → Pages** and select
**GitHub Actions** under **Build and deployment → Source**.

On every push to `main` (or a manual run from the Actions tab), the workflow:

1. Installs dependencies with `npm ci --legacy-peer-deps`
2. Builds the Vite project (`npm run build`)
3. Uploads `dist/` and deploys it to GitHub Pages

The site is served at https://abhiram1212.github.io/my-portfolio/.
Vite's `base` is set to `/my-portfolio/` so assets load under that path.
When previewing locally, open the preview server's `/my-portfolio/` path.
If you rename the repository, update `base` in `vite.config.js`; for a custom
domain or a `<username>.github.io` repository, use `/` instead.

No AWS credentials are needed for deployment. After verifying the Pages site,
you can remove unused AWS repository secrets and retire the old portfolio's
S3 bucket and CloudFront distribution separately.

---

## Project Structure

```
my-portfolio/
├── .github/
│   └── workflows/
│       └── deploy.yml      # CI/CD pipeline
├── public/
├── src/
│   ├── App.jsx             # All sections and components
│   └── main.jsx            # React entry point
├── index.html
├── vite.config.js
└── package.json
```

---

## License

MIT
