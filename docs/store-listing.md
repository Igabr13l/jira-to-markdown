# Chrome Web Store listing

## Name

Jira Ticket to Markdown

## Short description

Copy the open Jira Cloud ticket as clean, editable Markdown. Processing stays in your browser.

## Detailed description

Turn the Jira Cloud ticket you are viewing into a clean Markdown brief for your development workflow.

Jira Ticket to Markdown extracts the issue key, title, description, acceptance criteria, URL, and selected text when available. Review and edit the result before copying it into your editor or coding tool.

- Works through an explicit click or keyboard shortcut.
- Uses temporary access to the active tab only.
- Processes everything locally in your browser.
- Makes no network requests and includes no analytics.
- Lets you set a character limit for the output.

Beta limitation: Jira Cloud sites hosted on `*.atlassian.net` only. Jira Server, Jira Data Center, and custom domains are not supported.

This extension is not affiliated with or endorsed by Atlassian. Jira is a trademark of Atlassian.

## Category and language

- Category: Developer Tools
- Language: English

## Single purpose

Convert the Jira Cloud ticket in the user-activated tab into editable Markdown and copy it at the user's request.

## Permission justifications

- `activeTab`: temporarily read only the Jira Cloud page on which the user explicitly invokes the extension.
- `scripting`: run the packaged ticket extractor in that active tab after invocation.
- `storage`: save the user's character-limit preference locally.

## Data disclosure

- Collects user data: No.
- Sells or transfers user data: No.
- Uses data for purposes unrelated to the single purpose: No.
- Uses remote code: No.

## Submission assets

- Privacy URL: `https://igabr13l.github.io/jira-to-markdown/`
- Screenshot: `store-assets/screenshot-1280x800.png`
- Store icon: `dist/icons/icon-128.png`
- Upload package: `release/jira-ticket-to-markdown-0.1.0.zip`
