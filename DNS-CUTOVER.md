# DNS Cutover: Webflow to Vercel

Step-by-step plan for a seamless zero-downtime migration of francescoronel.com from Webflow to Vercel.

## Pre-Cutover Checklist

- [ ] All pages built and rendering correctly (`npm run build` passes)
- [ ] All 665+ blog posts render with images
- [ ] Redirects configured in `next.config.ts` covering all Webflow URL patterns
- [ ] Sitemap generates correctly at `/sitemap.xml`
- [ ] RSS feed generates correctly at `/feed`
- [ ] robots.txt allows all crawlers
- [ ] Google Analytics 4 firing on all pages
- [ ] Vercel Analytics + Speed Insights configured
- [ ] Open Graph images and meta tags working
- [ ] Dark mode toggle working
- [ ] Search (Pagefind) indexing all content
- [ ] Mobile responsive across all breakpoints
- [ ] Lighthouse scores: Performance 90+, Accessibility 95+, SEO 95+

## Step 1: Deploy to Vercel

1. Connect the GitHub repo (`FrancesCoronel/francescoronel.com`) to Vercel
2. Configure build settings:
   - Framework: Next.js
   - Build command: `npm run build` (includes postbuild Pagefind indexing)
   - Output directory: `.next`
3. Deploy and get the Vercel preview URL (e.g., `francescoronel-com.vercel.app`)

## Step 2: Test on Vercel Preview

- [ ] Visit every page type on the preview URL
- [ ] Test all redirects (old Webflow URLs like `/detail_blog/...`)
- [ ] Verify images load from Webflow CDN (they will continue to work)
- [ ] Test search functionality
- [ ] Test dark/light mode toggle
- [ ] Test on mobile devices
- [ ] Run Lighthouse on preview URL
- [ ] Compare screenshots against current Webflow site

## Step 3: Add Custom Domain to Vercel

1. In Vercel dashboard: **Settings > Domains**
2. Add `francescoronel.com` and `www.francescoronel.com`
3. Vercel will show the DNS records needed:
   - `francescoronel.com` -> `A` record pointing to `76.76.21.21`
   - `www.francescoronel.com` -> `CNAME` record pointing to `cname.vercel-dns.com`

## Step 4: Lower DNS TTL (48 hours before cutover)

1. Log into your DNS provider (likely Webflow DNS or a registrar like Namecheap/Google Domains)
2. Lower the TTL on the `A` and `CNAME` records to **60 seconds** (or the minimum allowed)
3. This ensures the DNS change propagates quickly when you switch

## Step 5: Update DNS Records

**This is the actual cutover moment.** Do this during low-traffic hours (e.g., late night or early morning).

1. Remove the existing Webflow DNS records:
   - Delete the `A` record(s) pointing to Webflow IPs
   - Delete any `CNAME` record for `www` pointing to Webflow
2. Add the Vercel DNS records:
   - `francescoronel.com` -> `A` record: `76.76.21.21`
   - `www.francescoronel.com` -> `CNAME` record: `cname.vercel-dns.com`
3. Vercel automatically provisions SSL certificates (Let's Encrypt)

**Alternative: If using Vercel DNS**
- Transfer your domain's nameservers to Vercel DNS for the simplest setup
- Vercel dashboard: **Settings > Domains > Transfer to Vercel DNS**
- This eliminates the need to manually manage DNS records

## Step 6: Verify Propagation

1. Check DNS propagation: `dig francescoronel.com` or use https://dnschecker.org
2. Wait for the `A` record to show Vercel's IP globally (usually 5-60 minutes with low TTL)
3. Visit `https://francescoronel.com` and verify it loads the Next.js site
4. Check that `https://www.francescoronel.com` redirects to `https://francescoronel.com`
5. Verify SSL certificate is valid (padlock in browser)

## Step 7: Post-Cutover Verification

- [ ] All pages load correctly on the production domain
- [ ] Google Search Console: Submit new sitemap, request re-indexing
- [ ] Google Analytics: Verify real-time data is flowing
- [ ] Test all old Webflow URLs redirect correctly (spot-check 10-20 URLs)
- [ ] Test social sharing (paste a blog URL into Slack/Twitter to check OG preview)
- [ ] Restore DNS TTL to normal (3600 seconds / 1 hour)

## Step 8: Clean Up

- [ ] Cancel Webflow subscription (after 1-2 weeks of stable operation)
- [ ] Remove any Webflow-specific DNS records
- [ ] Consider migrating images from Webflow CDN to Cloudflare R2 (future, not urgent — Webflow CDN will continue serving images even after cancellation for a grace period, but plan to self-host eventually)

## Rollback Plan

If something goes wrong after cutover:

1. Revert DNS records to point back to Webflow's IPs
2. With a 60-second TTL, traffic will return to Webflow within minutes
3. Investigate and fix the issue on the Vercel deployment
4. Re-attempt cutover when ready

## Timeline Estimate

| Step | Duration |
|---|---|
| Deploy to Vercel | 5 minutes |
| Test on preview | 1-2 hours |
| Lower TTL | 5 minutes (then wait 48 hours) |
| Update DNS | 5 minutes |
| Propagation | 5-60 minutes |
| Post-cutover verification | 30 minutes |
| **Total active time** | **~3 hours** |
| **Total elapsed time** | **~3 days** (including TTL lowering wait) |
