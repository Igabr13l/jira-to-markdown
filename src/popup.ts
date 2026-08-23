import { extractJiraIssue } from "./extract.js";
import { applyCharacterLimit, issueToMarkdown } from "./markdown.js";

const DEFAULT_LIMIT = 12_000;
function requiredElement<T extends Element>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Popup element is missing: ${selector}`);
  return element;
}

const output = requiredElement<HTMLTextAreaElement>("#markdown");
const copyButton = requiredElement<HTMLButtonElement>("#copy");
const limitInput = requiredElement<HTMLInputElement>("#limit");
const status = requiredElement<HTMLElement>("#status");
const count = requiredElement<HTMLElement>("#count");

function setStatus(
  message: string,
  kind: "error" | "ready" | "working" = "working",
): void {
  status.textContent = message;
  status.dataset.kind = kind;
}

function updateCount(): void {
  count.textContent = `${output.value.length.toLocaleString()} characters`;
}

async function loadIssue(): Promise<void> {
  copyButton.disabled = true;
  setStatus("Reading this tab...");

  const stored = await chrome.storage.local.get("characterLimit");
  const characterLimit =
    typeof stored.characterLimit === "number"
      ? stored.characterLimit
      : DEFAULT_LIMIT;
  limitInput.value = String(characterLimit);

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab.id) {
    setStatus("The active tab is unavailable.", "error");
    return;
  }

  try {
    const [injection] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractJiraIssue,
    });
    const result = injection.result;
    if (!result?.issue) {
      setStatus(result?.message ?? "The ticket could not be read.", "error");
      return;
    }

    output.value = issueToMarkdown(result.issue, characterLimit);
    updateCount();
    copyButton.disabled = false;
    setStatus(`${result.issue.key} is ready to review.`, "ready");
  } catch {
    setStatus(
      "Chrome blocked access to this page. Open a Jira Cloud ticket and try again.",
      "error",
    );
  }
}

output.addEventListener("input", updateCount);

limitInput.addEventListener("change", async () => {
  const characterLimit = Math.min(
    100_000,
    Math.max(500, Number(limitInput.value) || DEFAULT_LIMIT),
  );
  limitInput.value = String(characterLimit);
  await chrome.storage.local.set({ characterLimit });
  output.value = applyCharacterLimit(output.value, characterLimit);
  updateCount();
});

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(output.value);
    setStatus("Copied. Paste it into your development tool.", "ready");
    copyButton.textContent = "Copied";
    window.setTimeout(() => {
      copyButton.textContent = "Copy Markdown";
    }, 1_500);
  } catch {
    output.focus();
    output.select();
    setStatus(
      "Clipboard access failed. The preview is selected for manual copying.",
      "error",
    );
  }
});

void loadIssue();
