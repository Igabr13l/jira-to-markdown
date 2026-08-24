# Jira Ticket to Markdown

A local Chrome extension for developers who want to turn the open Jira Cloud ticket into clean, editable Markdown and copy it into their development workflow.

## Status

Free beta, version 0.1.1. Version 0.1.0 is published in the Chrome Web Store; this version stabilizes the popup size for the next update.

## MVP

- Extract issue key, title, description, acceptance criteria, URL, and selected text from Jira Cloud.
- Preview and edit Markdown before copying.
- Configure a local character limit.
- Request temporary active-tab access only; make no network requests.

Not included: Jira Server/Data Center, custom Jira domains, history, AI rewriting, accounts, analytics, billing, or a backend.

## Requirements

- Node.js 24 or newer.
- npm.
- Google Chrome for manual testing.

## Setup and checks

```bash
npm install
npm run check
```

Other commands:

```bash
npm run format
npm run lint
npm run typecheck
npm test
npm run build
npm run package
```

`npm run build` creates the unpacked extension in `dist/`. `npm run package` creates the Chrome Web Store upload ZIP in `release/`.

## Load locally

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Choose **Load unpacked** and select this repository's `dist/` directory.
4. Open a ticket on an `atlassian.net` Jira Cloud site and invoke the extension.

## Publishing

Use the copy and asset paths in [`docs/store-listing.md`](docs/store-listing.md), then upload the versioned ZIP from `release/` through the Chrome Web Store Developer Dashboard. The public privacy policy is hosted at <https://igabr13l.github.io/jira-to-markdown/>.

## Privacy

All ticket processing happens locally after explicit user activation. See [`PRIVACY.md`](PRIVACY.md). The user remains responsible for reviewing confidential information before pasting it into another service.
