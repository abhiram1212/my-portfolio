# Abhiram's Portfolio

Personal developer portfolio built with React, Vite, and Tailwind CSS — deployed on AWS S3 + CloudFront via GitHub Actions.

🔗 **Live site:** [d2k1s3747cubd5.cloudfront.net](https://d2k1s3747cubd5.cloudfront.net)

---

## Tech Stack

- **Framework:** React 19 + Vite 7
- **Styling:** Tailwind CSS, Google Fonts (Syne + DM Mono)
- **Deployment:** AWS S3 (static hosting) + CloudFront (CDN)
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

The site deploys automatically via GitHub Actions on every push to `main`:

1. Builds the Vite project (`npm run build`)
2. Syncs the `dist/` folder to the S3 bucket (`abhiram-portfolio1289`)
3. Invalidates the CloudFront cache so changes go live immediately

To set this up in your own fork, add the following secrets to your GitHub repo (Settings > Secrets > Actions):

| Secret | Description |
|---|---|
| `AWS_ACCESS_KEY_ID` | IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret key |
| `AWS_REGION` | e.g. `us-east-1` |

The CloudFront distribution ID is set directly in the workflow — update this if you fork the repo.

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
