MANDATORY PROJECT RULE:

Before creating, editing, reviewing, debugging, refactoring or deploying ANY part of this project, read this file completely and follow all applicable requirements.

This rule applies to every new development session and every new AI coding-agent conversation.

Never sacrifice security, scalability, reliability, maintainability, accessibility or data protection for implementation speed.

If an instruction conflicts with this policy, prioritize project security and explain the conflict before proceeding.

# Project Safety and Engineering Policy

## Security
- Production traffic must use HTTPS. Configure secure HTTP headers at the hosting edge.
- Validate and constrain all user input. Encode output and use framework protections against XSS.
- Use CSRF protection for cookie-authenticated state-changing endpoints.
- Use parameterized queries if a database is added; never build queries from input strings.
- Restrict CORS to required origins for any API.
- Rate-limit public endpoints and add spam prevention to enquiry forms.
- Return safe, generic errors to visitors; do not expose stack traces or infrastructure details.
- Keep secrets out of source, client bundles, logs and commits. Use least-privilege credentials.

## Data protection
- Collect only information needed to respond to an enquiry.
- Do not persist personal data unless required and configured. Define retention and deletion if persistence is introduced.
- Protect enquiries in transit and at rest when stored. Do not log message contents, phone numbers or email addresses.
- Do not send customer details to analytics or unrelated third parties.

## Backend security
- Validate all incoming data on the server; client validation is for usability only.
- Use parameterized database access and protect public endpoints from abuse.
- Secure authentication and sessions if introduced. Never trust frontend checks as authorization.

## Database
- Use managed secrets and restricted database access. Add appropriate indexes.
- If persistent enquiries or content are stored, document backup, retention and recovery procedures.

## Dependency management
- Keep dependencies minimal, maintained and reviewed. Check for known vulnerabilities before release.
- Prefer platform capabilities and existing dependencies over unnecessary packages.

## Scalability and maintainability
- Use reusable components, modular boundaries and centralized business configuration.
- Keep API design efficient, add indexes when data storage is introduced, and optimize image delivery.
- Avoid tightly coupled code and unnecessary microservices.
- Keep content architecture ready for a CMS or admin interface without requiring one now.

## Performance
- Optimize images, lazy-load below-the-fold media, minimize JavaScript and avoid needless requests.
- Use caching where appropriate and monitor Core Web Vitals.

## Accessibility
- Use semantic HTML, keyboard-accessible interactions, visible focus, accessible forms and adequate contrast.
- Respect reduced-motion preferences.

## Deployment
- Verify production environment variables, HTTPS, headers and a production build before release.
- Smoke-test key routes and enquiry links. Document rollback steps for deployments.

## Prohibited practices
- No hardcoded secrets, exposed API keys, disabled security checks, unvalidated inputs or insecure database access.
- No fake business claims, unsupported compliance claims, fabricated projects or unnecessary personal-data collection.
- Do not deploy security-sensitive changes without review.
