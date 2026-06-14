// Hash Inspector - compute SHA digests (hex + Base64) in the browser via the Web
// Crypto API. No input ever leaves the page. This module powers the
// /tools/hash-inspector/ page and is published as-is in the public tools repo.

function escapeHtml(value) {
  return String(value == null ? "" : value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function digest(text, algorithm = "SHA-256") {
  const bytes = new TextEncoder().encode(text);
  const buffer = await crypto.subtle.digest(algorithm, bytes);
  const values = Array.from(new Uint8Array(buffer));
  const hex = values.map((value) => value.toString(16).padStart(2, "0")).join("");
  const base64 = btoa(String.fromCharCode.apply(null, values));
  return { hex, base64 };
}

export async function runHashTool(card) {
  const inputField = card.querySelector("[data-hash-input]");
  const algorithmField = card.querySelector("[data-hash-algorithm]");
  const output = card.querySelector("[data-hash-output]");
  if (!output) return;
  const algorithm = algorithmField ? algorithmField.value : "SHA-256";
  try {
    const { hex, base64 } = await digest(inputField ? inputField.value : "", algorithm);
    output.innerHTML =
      "<span>" + escapeHtml(algorithm) + "</span><code>" + escapeHtml(hex) + "</code>" +
      "<span>base64</span><code>" + escapeHtml(base64) + "</code>";
  } catch (error) {
    output.innerHTML = "<span>error</span><code>" + escapeHtml(error.message || "Digest failed.") + "</code>";
  }
}

export function initHashInspector(root = document) {
  root.querySelectorAll("[data-tool='hash']").forEach((card) => {
    if (card.dataset.hashReady === "true") return;
    card.dataset.hashReady = "true";
    const button = card.querySelector("[data-tool-action='hash']");
    if (button) {
      button.addEventListener("click", (event) => { event.preventDefault(); runHashTool(card); });
    }
    runHashTool(card);
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initHashInspector(), { once: true });
  } else {
    initHashInspector();
  }
}
