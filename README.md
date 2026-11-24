# SHREE GANGA FIRE & SAFETY

Production-oriented, static-first business website for SHREE GANGA FIRE & SAFETY. Built with React, TypeScript and Vite. Read [safety.md](./safety.md) before changing the project.

## Local development

1. Install Node.js 20.19+ (or 22.12+) and npm.
2. Copy `.env.example` to `.env.local`. Supabase values can remain blank until you configure the admin console.
3. Run `npm install` and `npm run dev`.
4. Open the local URL printed by Vite.

## Build and deploy

The site is prepared for Vercel static hosting. Import this repository into Vercel, use the default Vite build settings (`npm run build`, output `dist`), and add `VITE_SITE_URL` as a production environment variable after the business purchases its domain. Use the full HTTPS origin without a trailing slash, for example `https://your-confirmed-domain.example` (replace with the purchased domain; this example is not a proposed domain). Redeploy after setting it. The build writes route-specific HTML for all public pages so their content and metadata are present before client JavaScript runs. It creates `sitemap.xml` and updates `robots.txt` using this origin. Canonical links and the sitemap are omitted until the origin is configured.

For a custom domain in Vercel: add the purchased domain in Project Settings → Domains, then copy the DNS records Vercel provides into the domain registrar’s DNS panel. DNS values depend on the selected domain and Vercel instructions; do not guess them. Wait for Vercel domain verification and HTTPS certificate provisioning, then verify the domain, HTTPS redirect, canonical tags, sitemap and key routes. Keep the old domain connected during migration if one exists.

## Admin console

The `/admin` route is access-gated and manages the served-customer count, reviews and completed-project photos. The site uses its existing bundled content until Supabase is configured. To enable the console:

1. Create a Supabase project.
2. In Supabase SQL Editor, run [`supabase/schema.sql`](./supabase/schema.sql) once. It creates the tables, public-read/admin-write row policies, a public photo bucket, and seeds the current project photos and customer ratings. The SQL allowlists `shreegangafiresafety@gmail.com`; change that email in the SQL before running it if a different CEO login should be used. For an existing installation, apply new SQL files in [`supabase/migrations`](./supabase/migrations) as they are added.
3. In Supabase Authentication, create the CEO user with that same email. Disable public sign-ups; the admin console does not offer account registration.
4. Copy the project URL and publishable key into `.env.local` as `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. Set `VITE_ADMIN_EMAIL` to the same allowlisted email. Add the same variables in Vercel Project Settings → Environment Variables, then redeploy.
5. Open `/admin` and sign in with the CEO account.

Only the public Supabase publishable key belongs in the website environment. A legacy anon key is accepted as a fallback. **Never add a database password, service-role key, or Supabase secret key to the Vite environment or browser code.** The SQL policies restrict edits to the allowlisted CEO email; public visitors can only read published content and project photos. Keep private business information out of these public records. Content changes appear on the site after the next page load. Supabase Free may pause projects after a week of inactivity and does not include automatic database backups; export the database periodically or move to a plan with backups before relying on it as the only copy of business content.

`vercel.json` configures the SPA route fallback and security headers. Confirm the deployed response headers and HTTPS behavior after deployment. HSTS is enabled; only use this configuration on the intended HTTPS production origin.

## Contact enquiry flow

The contact form validates the required fields in the browser, includes a hidden honeypot, and prepares a WhatsApp message to the configured primary phone number. The service menu includes the five listed services and an “Others...” option; visitors can describe an unlisted request in the requirements field. The form does not store submissions and does not claim an enquiry was sent until the visitor continues in WhatsApp. This initial release has no backend rate limiter; the public website collects no server-side form submissions. If server-side lead capture is added later, use a managed form provider or a backend with server validation, rate limiting, spam controls, retention rules and protected storage before enabling it.

Update company configuration in `src/data/business.ts`. The primary WhatsApp number is configured as `918218442193` (`+91` plus the supplied 10-digit number); confirm the country code and WhatsApp registration before publishing. All confirmed services are centralized in the same file.

## Design assets and content integrity

Images under `public/images/` are generated illustrative industry imagery for service presentation and are labeled as illustrative. The seven optimized photographs under `public/images/projects/` were supplied by the business as completed project work; image paths, captions and alt text are centralized in `src/data/business.ts`. Captions describe visible installations only and omit unprovided client names, dates and exact locations. The reviews page shows nine customer-provided ratings with the names, venues and locations supplied by the business. Each card has one distinct feedback point paraphrased from themes supplied by the business; these are summaries, not direct customer quotes. Confirm approval to publish customer names and venue names before launch. There are no published claims of certification, government approval, business address, business hours or years of experience. Confirmed service areas are maintained in `src/data/business.ts`.

The About page uses a one-time Glass Reveal logo animation adapted from the supplied component. Its shader and motion timeline credit [zanwei/glass-icon-reveal](https://github.com/zanwei/glass-icon-reveal); the upstream MIT notice is preserved in `third-party-licenses/glass-icon-reveal-MIT.txt`.

## Security checklist

- HTTPS and a production domain: configure and verify after purchase.
- Security headers: configured in `vercel.json`; verify at deployment.
- Content Security Policy: self-hosted app assets; Google Fonts and the configured Supabase project are allowed. Avoid adding unreviewed third-party scripts.
- Secrets: `.env.local` is ignored; `VITE_SITE_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (or legacy `VITE_SUPABASE_ANON_KEY`) and `VITE_ADMIN_EMAIL` are public browser configuration. Never put database credentials or service-role/secret keys in Vite variables.
- Enquiry data: no website storage or analytics transmission; WhatsApp transmission happens only after visitor action.
- Input: native required/type/length/pattern constraints and a honeypot are present. These are client-side usability/spam hurdles, not server-side protection.
- Dependencies: minimal runtime dependencies; review advisories before release.
- Supabase access is protected by row-level security in `supabase/schema.sql`. Public content is intentionally readable; only the allowlisted CEO can edit it. The free tier does not provide automatic backups; follow the export guidance above.

## Test and verification report

Run `npm run lint`, `npm run typecheck` and `npm run build` before deployment. Confirm the five detail routes, navigation, responsive menu, telephone/email links and WhatsApp handoff in a browser. This repository does not currently include an automated interaction test suite or server-side form API. See [TESTING.md](./TESTING.md) for the latest executed checks and remaining verification.

## Still needed from the business

- Confirm the `+91` country code and WhatsApp registration for primary number 8218442193.
- Confirm whether any additional service locations should be listed. Current locations supplied by the business are Lucknow, Saharanpur, Dehradun, Uttarakhand and Delhi.
- Purchase and provide the production domain.
- Confirm any client naming, project dates, exact locations or additional project details before adding them to the gallery.
- Confirm approval to publish the customer names and venue names shown on the reviews page.
- Confirm product, installation and maintenance scopes that the company can currently fulfill.
- Provide brand-approved logo or social profiles if available.

## Growth roadmap

Business details and service definitions are centralized in `src/data/business.ts`; editable site content is stored in Supabase and read by the public pages. Before adding lead storage, add server-side validation, abuse controls, data retention/deletion and backup/recovery procedures. Add analytics only after selecting a privacy-appropriate provider and documenting consent/data handling.
