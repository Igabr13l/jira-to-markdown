import assert from "node:assert/strict";
import test from "node:test";
import { applyCharacterLimit, issueToMarkdown } from "../src/markdown.js";

const issue = {
  acceptanceCriteria: "- Checkout succeeds",
  description: "A customer needs to pay.",
  key: "PAY-12",
  selectedText: "Customer tier: Pro",
  title: "Repair checkout",
  url: "https://acme.atlassian.net/browse/PAY-12",
};

test("formats every available section", () => {
  const markdown = issueToMarkdown(issue, 12_000);

  assert.match(markdown, /^# PAY-12: Repair checkout/);
  assert.match(markdown, /## Description\n\nA customer needs to pay\./);
  assert.match(markdown, /## Acceptance criteria/);
  assert.match(markdown, /## Selected text/);
});

test("honors the character limit", () => {
  const markdown = issueToMarkdown(issue, 120);

  assert.ok(markdown.length <= 120);
  assert.match(markdown, /Truncated by Jira Ticket to Markdown/);
});

test("does not split an emoji when truncating edited Markdown", () => {
  const markdown = `${"x".repeat(80)}😀 more content`;
  const result = applyCharacterLimit(markdown, 122);

  assert.ok(result.length <= 122);
  assert.doesNotMatch(result, /�/);
  assert.notEqual(result.charCodeAt(result.indexOf("\n") - 1), 0xd83d);
});
