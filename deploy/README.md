# Deploying to the VPS (nginx)

The site is a pure static build (`dist/`). Deployment is: build locally (or in
CI), then `rsync` the output into the nginx web root.

## One-time VPS setup

1. Install nginx and certbot:
   ```
   sudo apt install nginx certbot python3-certbot-nginx
   ```
2. Create the web root and a deploy user with write access:
   ```
   sudo mkdir -p /var/www/arachne-site
   sudo chown deploy:deploy /var/www/arachne-site
   ```
3. Install the server block:
   ```
   sudo cp deploy/nginx.conf /etc/nginx/sites-available/arachne-site
   sudo ln -s /etc/nginx/sites-available/arachne-site /etc/nginx/sites-enabled/
   sudo nginx -t && sudo systemctl reload nginx
   ```
4. Point DNS (A / AAAA) at the VPS, then provision TLS:
   ```
   sudo certbot --nginx -d arachne.example.com -d www.arachne.example.com
   ```

## Each deploy

From a machine with SSH key access to the VPS:

```
DEPLOY_HOST=deploy@vps.example.com ./deploy/deploy.sh
```

That builds `dist/` and rsyncs it to `/var/www/arachne-site/` (override the
remote path with `DEPLOY_PATH`).

## Optional: push-to-deploy via GitHub Actions

Add a workflow that runs `npm ci && npm run build` and rsyncs over an SSH
deploy key (stored as a repo secret). Skipped for now — the manual
`deploy.sh` is enough until the cadence justifies CI.

## Before going live — find-and-replace the placeholder domain

`arachne.example.com` appears in:
- `astro.config.mjs` (`site:`)
- `public/robots.txt`
- `deploy/nginx.conf`

Replace all three with the real domain.
