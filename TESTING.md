# Testing and verification report

Verification run on November 10, 2026, against the local project.

Project gallery update: seven supplied completed-work photographs were converted to WebP and added to the Projects page and homepage preview. Captions and alt text were checked against visible photo content; no client, date or project location details were added.

## Checks after the project gallery update

- `npm run lint` — passed.
- `npm run typecheck` — passed.
- `npm run build` — production build passed.
- Local HTTP smoke check — `/projects` and all seven new WebP assets returned HTTP 200 from the Vite server.

Homepage carousel update: arrow controls wrap through all seven project photos; automatic advance is set to six seconds and pauses on hover or keyboard focus. A subtle progress line under the active photo title fills over the same six-second interval and pauses with the carousel. The active card moves back toward the deck as the next card moves forward over 720 ms; motion and the timer line are disabled when the visitor requests reduced motion. Decorative photo cards stack behind the active image; previous/next controls sit outside the photo edges. `npm run lint`, `npm run typecheck` and `npm run build` passed; homepage returned HTTP 200 locally.

Language and contact update, November 11, 2026: shorter page and service copy; header, service, callout and mobile quote links go directly to the quote form. Service links include the selected service. Lint, typecheck, build and local contact route HTTP check passed.

Customer ratings update, November 11, 2026: added nine customer-provided ratings with supplied names, venues and locations. Each card now has one distinct feedback point paraphrased from the themes supplied by the business, with key phrases bolded. These are summaries, not direct quotes; no average score was invented. Confirm permission to publish the names and venues before launch.

Reviews URL update: the public route and sitemap use `/reviews`; `/testimonials` redirects to `/reviews` for older links. Lint, typecheck, build and both local route HTTP checks passed.

## Passed

- `npm run typecheck` — TypeScript project checks passed.
- `npm run lint` — Biome lint passed for the TypeScript and build configuration sources.
- `npm run build` — production build completed successfully with Vite 8.3.7.
- `npm audit --audit-level=moderate` — zero vulnerabilities reported.
- Browser route smoke check — About, Services, all five service detail pages, Projects, Testimonials, Privacy and Terms displayed their expected page headings.
- Navigation smoke check — the narrow-screen menu expanded, routed to Services and closed after navigation.
- Contact form smoke check — with dummy test values, the form generated the success/review state and a prefilled WhatsApp URL containing the selected Fire Alarm Systems service. No message was sent.
- Service-area check — Lucknow, Saharanpur, Dehradun, Uttarakhand and Delhi appeared in the homepage coverage section, contact page and footer.
- Responsive visual review — homepage rendered at desktop width (1280 px) and a narrow viewport (615 px). The mobile header and fixed call/WhatsApp/quote bar were visible; WhatsApp no longer obscures service-card actions.
- SEO generator — generated service URLs using a reserved `.invalid` test origin; the generated sitemap was removed afterward because no production domain is configured.

## Not verified or not included

- Tablet and laptop widths were not independently captured; responsive breakpoints are implemented in CSS and those widths still need visual review.
- No deployed-host checks were possible: the business has no domain configured and the website has not been deployed. HTTPS, response headers and custom-domain DNS must be verified after deployment.
- No server-side form submission exists. The form hands details to WhatsApp only after visitor action; browser validation and a honeypot do not provide server-side abuse controls.
- No automated interaction test suite, Lighthouse run, external penetration test or assistive-technology audit is included.
- No real message was sent to WhatsApp. The site now uses WhatsApp's numberless share link, which lets the visitor choose a recipient.
