# Property SOPs - Checklist App

Mobile-friendly checklist app for Subah-e-Banaras & Shaam-e-Banaras property operations.

## Checklists
- **Room Ready** — 24-item room inspection after housekeeping (per room)
- **Guest Check-In** — 7-item guest arrival process (per room)
- **Daily Property Close** — 15-item evening wrap-up (kitchen + housekeeping)

## Deploy on Vercel (Easiest - 2 minutes)

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Push this folder to a new GitHub repo:
   ```bash
   cd sop-app
   git init
   git add .
   git commit -m "SOP checklist app"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/sop-app.git
   git push -u origin main
   ```
3. On Vercel, click **"Add New Project"** → Import your repo → Click **Deploy**
4. Done. Share the URL with your staff.

## Deploy on GitHub Pages (Free)

1. Push to GitHub (same steps as above)
2. Install and run:
   ```bash
   npm install
   npm run build
   ```
3. Push the `dist` folder to `gh-pages` branch, or use GitHub Actions

## Run Locally

```bash
npm install
npm run dev
```

Opens at http://localhost:5173

## Staff Usage

1. Open the URL on phone
2. Add to home screen (tap Share → Add to Home Screen) for app-like experience
3. Select property → Select checklist → Tap items → Send on WhatsApp
