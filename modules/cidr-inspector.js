// CIDR Inspector - decode an IPv4 CIDR range entirely in the browser.
// This module is what the /tools/cidr-inspector/ page loads and what is published
// in the public browser-tools repo, so the live tool and the source are the same.

export function parseCidr(value) {
  const match = String(value).match(/^(\d{1,3}(?:\.\d{1,3}){3})\/(\d|[12]\d|3[0-2])$/);
  if (!match) return { ok: false, error: "Use IPv4 CIDR format, for example 192.168.10.0/24." };
  const octets = match[1].split(".").map(Number);
  if (octets.some((octet) => octet > 255)) return { ok: false, error: "IPv4 octets must be 0 through 255." };
  return {
    ok: true,
    ipInt: octets.reduce((sum, octet) => ((sum << 8) + octet) >>> 0, 0),
    prefix: Number(match[2])
  };
}

export function intToIp(value) {
  return [24, 16, 8, 0].map((shift) => (value >>> shift) & 255).join(".");
}

export function decodeCidr(value) {
  const parsed = parseCidr(String(value).trim());
  if (!parsed.ok) return parsed;
  const { ipInt, prefix } = parsed;
  const mask = prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
  const network = ipInt & mask;
  const broadcast = network | (~mask >>> 0);
  const hostCount = prefix >= 31 ? Math.pow(2, 32 - prefix) : Math.max(0, Math.pow(2, 32 - prefix) - 2);
  const first = prefix >= 31 ? network : network + 1;
  const last = prefix >= 31 ? broadcast : broadcast - 1;
  return {
    ok: true,
    network: `${intToIp(network)}/${prefix}`,
    mask: intToIp(mask),
    usableRange: `${intToIp(first)} - ${intToIp(last)}`,
    broadcast: intToIp(broadcast),
    usableHosts: hostCount
  };
}

function escapeHtml(value) {
  return String(value == null ? "" : value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function runCidrTool(card) {
  const input = card.querySelector("[data-cidr-input]");
  const output = card.querySelector("[data-cidr-output]");
  if (!input || !output) return;
  const result = decodeCidr(input.value);
  if (!result.ok) {
    output.innerHTML = "<span>invalid</span><code>" + escapeHtml(result.error) + "</code>";
    return;
  }
  output.innerHTML =
    "<span>network</span><code>" + escapeHtml(result.network) + "</code>" +
    "<span>mask</span><code>" + escapeHtml(result.mask) + "</code>" +
    "<span>usable range</span><code>" + escapeHtml(result.usableRange) + "</code>" +
    "<span>broadcast</span><code>" + escapeHtml(result.broadcast) + "</code>" +
    "<span>usable hosts</span><code>" + result.usableHosts.toLocaleString() + "</code>";
}

export function initCidrInspector(root = document) {
  root.querySelectorAll("[data-tool='cidr']").forEach((card) => {
    if (card.dataset.cidrReady === "true") return;
    card.dataset.cidrReady = "true";
    const button = card.querySelector("[data-tool-action='cidr']");
    if (button) {
      button.addEventListener("click", (event) => { event.preventDefault(); runCidrTool(card); });
    }
    runCidrTool(card);
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => initCidrInspector(), { once: true });
  } else {
    initCidrInspector();
  }
}
