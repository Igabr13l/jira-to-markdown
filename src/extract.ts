export interface JiraIssue {
  acceptanceCriteria: string;
  description: string;
  key: string;
  selectedText: string;
  title: string;
  url: string;
}

export interface ExtractionResult {
  issue?: JiraIssue;
  message?: string;
}

export function extractJiraIssue(
  page: Document = document,
  currentLocation: Location = location,
): ExtractionResult {
  const clean = (value: string | null | undefined): string =>
    (value ?? "")
      .replace(/\u00a0/g, " ")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

  const markdownFrom = (root: Element | null): string => {
    if (!root) return "";

    const serialize = (node: Node): string => {
      if (node.nodeType === 3) return node.textContent ?? "";
      if (node.nodeType !== 1) return "";

      const element = node as Element;
      const tag = element.tagName.toLowerCase();
      const children = [...element.childNodes].map(serialize).join("");
      const content = clean(children);

      if (tag === "br") return "\n";
      if (tag === "li") return `- ${content}\n`;
      if (tag === "a") {
        const href = element.getAttribute("href");
        return href && content ? `[${content}](${href})` : content;
      }
      if (
        tag === "code" &&
        element.parentElement?.tagName.toLowerCase() !== "pre"
      ) {
        return content ? `\`${content}\`` : "";
      }
      if (tag === "pre")
        return content ? `\n\n\`\`\`\n${content}\n\`\`\`\n\n` : "";
      if (tag === "strong" || tag === "b")
        return content ? `**${content}**` : "";
      if (tag === "em" || tag === "i") return content ? `*${content}*` : "";
      if (
        [
          "p",
          "div",
          "section",
          "article",
          "ul",
          "ol",
          "h1",
          "h2",
          "h3",
          "h4",
        ].includes(tag)
      ) {
        return content ? `${content}\n\n` : "";
      }
      return children;
    };

    return clean([...root.childNodes].map(serialize).join(""));
  };

  if (!currentLocation.hostname.endsWith(".atlassian.net")) {
    return {
      message:
        "Open a Jira Cloud ticket on an atlassian.net site, then try again.",
    };
  }

  const sourceUrl = currentLocation.href;
  const pathKey = currentLocation.pathname.match(
    /\/browse\/([A-Z][A-Z0-9_]*-\d+)/i,
  )?.[1];
  const queryKey = new URL(sourceUrl).searchParams
    .get("selectedIssue")
    ?.match(/[A-Z][A-Z0-9_]*-\d+/i)?.[0];
  const key = (pathKey ?? queryKey ?? "").toUpperCase();

  if (!key) {
    return {
      message:
        "This looks like Jira Cloud, but no open ticket could be identified.",
    };
  }

  const markdownFromSelectors = (selectors: string[]): string => {
    for (const selector of selectors) {
      const value = markdownFrom(page.querySelector(selector));
      if (value) return value;
    }
    return "";
  };

  const title = markdownFromSelectors([
    '[data-testid="issue.views.issue-base.foundation.summary.heading"]',
    '[data-testid*="summary"] h1',
    'h1[data-testid*="summary"]',
    "h1",
  ]).replace(new RegExp(`^${key}\\s*[-:–—]?\\s*`, "i"), "");

  const description = markdownFromSelectors([
    '[data-testid="issue.views.field.rich-text.description"]',
    '[data-testid*="field-rich-text-description"]',
    '[data-field-id="description"]',
    '[aria-label="Description"]',
  ]).replace(/^description\s*/i, "");

  const labels = [
    ...page.querySelectorAll("h2, h3, h4, label, span, div"),
  ].filter((element) => {
    const text = clean(element.textContent);
    return (
      text.length < 40 &&
      /^(acceptance criteria|acceptance criterion|criterios? de aceptaci[oó]n)$/i.test(
        text,
      )
    );
  });

  let acceptanceCriteria = "";
  for (const label of labels) {
    let container: Element | null = label.parentElement;
    for (
      let depth = 0;
      container && depth < 4;
      depth += 1, container = container.parentElement
    ) {
      const text = markdownFrom(container);
      const value = clean(text.replace(markdownFrom(label), ""));
      if (value && value.length < 8_000) {
        acceptanceCriteria = value;
        break;
      }
    }
    if (acceptanceCriteria) break;
  }

  return {
    issue: {
      acceptanceCriteria,
      description,
      key,
      selectedText: clean(page.getSelection?.()?.toString()),
      title: title || "Untitled ticket",
      url: `${currentLocation.origin}/browse/${key}`,
    },
  };
}
