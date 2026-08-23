import type { JiraIssue } from "./extract.js";

export function issueToMarkdown(issue: JiraIssue, limit: number): string {
  const sections = [`# ${issue.key}: ${issue.title}`, `**Jira:** ${issue.url}`];

  if (issue.description)
    sections.push(`## Description\n\n${issue.description}`);
  if (issue.acceptanceCriteria)
    sections.push(`## Acceptance criteria\n\n${issue.acceptanceCriteria}`);
  if (issue.selectedText)
    sections.push(`## Selected text\n\n${issue.selectedText}`);

  return applyCharacterLimit(`${sections.join("\n\n")}\n`, limit);
}

export function applyCharacterLimit(markdown: string, limit: number): string {
  if (markdown.length <= limit) return markdown;

  const notice = "\n\n> Truncated by Jira Ticket to Markdown.\n";
  let cut = Math.max(0, limit - notice.length);
  const code = markdown.charCodeAt(cut - 1);
  if (code >= 0xd800 && code <= 0xdbff) cut -= 1;
  return `${markdown.slice(0, cut).trimEnd()}${notice}`;
}
