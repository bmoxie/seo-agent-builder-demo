# SEO Agent Builder — example page

Static HTML/CSS/JS demo: build an SEO agent pipeline (keyword intel → reporting) with a live visualization.

## Run locally

Open `index.html` in a browser, or from this folder:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Deploy on Vercel (with GitHub)

1. **Create a GitHub repository**  
   - New repository on GitHub (empty, no README required if you push this folder first).

2. **Push this project**

   ```bash
   cd seo-agent-builder-demo
   git init
   git add .
   git commit -m "Add SEO agent builder example page"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

3. **Import to Vercel**  
   - Sign in at [vercel.com](https://vercel.com) with GitHub.  
   - **Add New** → **Project** → import your repository.  
   - Framework preset: **Other** (static). Root directory: repo root.  
   - Deploy. Vercel will serve `index.html` at your production URL.

4. **Share**  
   - Use the `*.vercel.app` URL from the deployment dashboard, or attach a custom domain under **Project → Settings → Domains**.

Optional: install the [Vercel CLI](https://vercel.com/docs/cli) and run `vercel` from this folder for previews without connecting GitHub first.
