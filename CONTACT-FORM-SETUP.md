# Activate contact form storage on Cloudflare

The production DB binding is configured in wrangler.jsonc. Existing SQL migrations in drizzle create the inquiries table, its indexes, and portfolio metadata.

In the Cloudflare Workers Builds settings, keep the existing build command and change the production Deploy command to:

    npx wrangler d1 migrations apply DB --remote && npx wrangler deploy

Commit and push wrangler.jsonc using GitHub Desktop, then run the production build. The migration command records applied migrations so later deployments only apply new ones. If the command fails, deployment stops. Do not delete existing tables to resolve a migration error; inspect the error first.

After deployment, send one clearly labelled test brief on madebeside.com and confirm the form reports success. In Cloudflare D1, the inquiries table stores submissions. The form sends notifications through Resend when RESEND_API_KEY is configured.

This change configures inquiry storage only. Portfolio media still requires R2 and secure owner authentication on your Cloudflare deployment.

## Email notifications
Verify notifications.madebeside.com in Resend and store RESEND_API_KEY as a Cloudflare Worker secret. Notifications go from briefs@notifications.madebeside.com to hello@madebeside.com with the visitor as Reply-To. Temporary failures retry up to three attempts. Permanent/exhausted failures are logged; the brief remains in D1. There is no durable retry queue; check Worker and Resend logs for failed notifications. Existing briefs are not emailed retroactively. Commit, push and deploy these changes before testing a new brief.
