# Made Beside — GitHub Desktop

This is the complete source snapshot of Made Beside published September 22, 2026, with transparent logo and dark policy pages. It is already a Git repository on the main branch, with no remote connected.

## Add it to GitHub Desktop

1. Drag this extracted folder onto GitHub Desktop. If that does not open it, choose File > Add Local Repository and select this folder.
2. Choose Publish repository. Give it a name such as made-beside, choose private or public, then publish.
3. Publish the folder, not the ZIP. Do not choose Create a New Repository inside this folder.

## Run locally

Install Node.js 24 or newer and pnpm 11. In this folder run:

    pnpm install --frozen-lockfile
    pnpm build
    pnpm dev

Open http://127.0.0.1:4173. Run pnpm test for the six backend checks.

## What is included

React source, all website assets and fonts, policies, portfolio studio, contact backend, database migrations, dependency lockfile and build scripts. Historical saved iterations are retained. Dependencies, temporary files, credentials and live customer records are excluded.

## Hosting

Uploading to GitHub stores the source; it does not automatically publish or update the live website. This is a Worker application, not a standalone GitHub Pages site. Full functionality requires D1 database binding DB, R2 storage binding BUCKET, migrations and trusted owner authentication. The existing Sites project identifier is retained for the existing deployment.

Uploaded portfolio media and inquiry records are stored in the hosting database/storage and are not included in this repository. Moving to another host requires migrating those records and implementing equivalent trusted authentication. See README.md and PORTFOLIO-GUIDE.md.
