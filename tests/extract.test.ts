import assert from "node:assert/strict";
import test from "node:test";
import { parseHTML } from "linkedom";
import { extractJiraIssue } from "../src/extract.js";

function locationFor(url: string): Location {
  return new URL(url) as unknown as Location;
}

test("extracts a structured Jira Cloud ticket", () => {
  const { document } = parseHTML(`
    <body>
      <span>DEV-42</span>
      <h1 data-testid="issue.views.issue-base.foundation.summary.heading">Prevent duplicate invoices</h1>
      <section data-testid="issue.views.field.rich-text.description">
        <h2>Description</h2><p>Customers can submit checkout twice.</p><ul><li>First attempt</li><li><strong>Second</strong> attempt</li></ul>
      </section>
      <section><h2>Acceptance criteria</h2><ul><li>Only one invoice is created.</li></ul></section>
    </body>
  `);

  const result = extractJiraIssue(
    document as unknown as Document,
    locationFor("https://acme.atlassian.net/browse/DEV-42"),
  );

  assert.deepEqual(result.issue, {
    acceptanceCriteria: "- Only one invoice is created.",
    description:
      "Customers can submit checkout twice.\n\n- First attempt\n- **Second** attempt",
    key: "DEV-42",
    selectedText: "",
    title: "Prevent duplicate invoices",
    url: "https://acme.atlassian.net/browse/DEV-42",
  });
});

test("supports board URLs with selectedIssue", () => {
  const { document } = parseHTML("<body><h1>Fix mobile navigation</h1></body>");
  const result = extractJiraIssue(
    document as unknown as Document,
    locationFor(
      "https://acme.atlassian.net/jira/software/c/projects/WEB/boards/1?selectedIssue=WEB-7",
    ),
  );

  assert.equal(result.issue?.key, "WEB-7");
  assert.equal(result.issue?.title, "Fix mobile navigation");
  assert.equal(result.issue?.url, "https://acme.atlassian.net/browse/WEB-7");
});

test("does not infer an issue from backlog cards", () => {
  const { document } = parseHTML(
    "<body><h1>Backlog</h1><article>WEB-7 Fix navigation</article></body>",
  );
  const result = extractJiraIssue(
    document as unknown as Document,
    locationFor(
      "https://acme.atlassian.net/jira/software/c/projects/WEB/backlog",
    ),
  );

  assert.equal(result.issue, undefined);
  assert.match(result.message ?? "", /no open ticket/);
});

test("rejects pages outside Jira Cloud", () => {
  const { document } = parseHTML("<body><h1>DEV-42</h1></body>");
  const result = extractJiraIssue(
    document as unknown as Document,
    locationFor("https://example.com/browse/DEV-42"),
  );

  assert.equal(result.issue, undefined);
  assert.match(result.message ?? "", /Jira Cloud/);
});
