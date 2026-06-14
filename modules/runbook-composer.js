// Runbook Composer - turn a risky task into a structured Markdown checklist,
// entirely in the browser. This module powers the /tools/runbook-composer/ page
// and is the same source published in the public browser-tools repo.

function escapeHtml(value) {
  return String(value == null ? "" : value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function composeRunbook({ task, shell, risk } = {}) {
  const safeTask = (task || "").trim() || "Complete the task";
  const commandHint = shell === "PowerShell"
    ? "Use `-WhatIf` or a read-only query first when available."
    : shell === "Bash"
      ? "Use `--dry-run` or a read-only query first when available."
      : "Prefer a dry-run or read-only query before mutation.";
  return [
    "# " + safeTask,
    "Risk: " + risk,
    "Shell: " + shell,
    "",
    "## Preconditions",
    "- Confirm target environment and owner.",
    "- Capture current state and rollback path.",
    "- " + commandHint,
    "",
    "## Execute",
    "- Run the smallest reversible step first.",
    "- Log commands, timestamps, and outputs.",
    "- Stop if the observed state differs from the expected state.",
    "",
    "## Verify",
    "- Check the live endpoint, service status, or affected artifact.",
    "- Record before/after evidence.",
    "- Note follow-up cleanup or monitoring."
  ].join("\n");
}

export function runRunbookTool(card) {
  const taskField = card.querySelector("[data-runbook-task]");
  const shellField = card.querySelector("[data-runbook-shell]");
  const riskField = card.querySelector("[data-runbook-risk]");
  const output = card.querySelector("[data-runbook-output]");
  if (!output) return;
  const runbook = composeRunbook({
    task: taskField ? taskField.value : "",
    shell: shellField ? shellField.value : "Either",
    risk: riskField ? riskField.value : "Medium"
  });
  output.innerHTML = "<span>markdown runbook</span><code>" + escapeHtml(runbook) + "</code>";
}

export function initRunbookComposer(root = document) {
  root.querySelectorAll("[data-tool='runbook']").forEach((card) => {
    if (card.dataset.runbookReady === "true") return;
    card.dataset.runbookReady = "true";
    const button = card.querySelector("[data-tool-action='runbook']");
    if (button) {
      button.addEventListener("click", (event) => { event.preventDefault(); runRunbookTool(card); });
    }
    runRunbookTool(card);
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initRunbookComposer(), { once: true });
  } else {
    initRunbookComposer();
  }
}
