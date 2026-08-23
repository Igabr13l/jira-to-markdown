# Project instructions

## Product boundary

This repository is one local Chrome extension. Its main flow reads the Jira Cloud ticket in the active tab, creates editable Markdown, and copies it after an explicit user action.

## Architecture

- Keep one Manifest V3 extension with no backend until paid demand requires one.
- Keep page extraction in `src/extract.ts`, Markdown formatting in `src/markdown.ts`, and popup wiring in `src/popup.ts`.
- Use `activeTab`; do not add persistent Jira host access.
- Add abstractions only after a second concrete use case needs them.

## Required checks

Run `npm run check` before considering work complete. Load `dist/` as an unpacked extension for manual Jira tests.

## Security and data

- Never send ticket content, URLs, selections, or usage data to an external service.
- Never add remote code or execute ticket content.
- Request only the minimum Chrome permissions.
- Never commit credentials, license keys, or private ticket fixtures.

## V1 non-goals

- Jira Server/Data Center, custom Jira domains, Confluence, Gmail, Notion, screenshots, history, AI rewriting, accounts, billing, or telemetry.
