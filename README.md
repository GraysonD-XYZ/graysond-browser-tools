# graysond.xyz — browser tools

> Source for the simple local browser tools and the probability lab that run on [graysond.xyz](https://graysond.xyz/tools/). Everything runs in your browser — nothing you type leaves the page.

These five tools are implemented inline in the (private) graysond.xyz site generator rather than as separate modules, so this repo packages them as **one standalone, runnable page**. Open `index.html` in a browser and all five work locally, exactly as they do on the site.

## Tools included
| Tool | Live page |
|---|---|
| Hash Inspector — SHA-1/256/384/512 + Base64 | [/tools/hash-inspector/](https://graysond.xyz/tools/hash-inspector/) |
| Passphrase Generator — EFF Diceware + verification card | [/tools/passphrase-generator/](https://graysond.xyz/tools/passphrase-generator/) |
| CIDR Inspector — IPv4 network/mask/range/hosts | [/tools/cidr-inspector/](https://graysond.xyz/tools/cidr-inspector/) |
| Runbook Composer — risky task → Markdown checklist | [/tools/runbook-composer/](https://graysond.xyz/tools/runbook-composer/) |
| Probability Signal Simulator — Bayesian-style signal lab | [/labs/probability-signal-simulator/](https://graysond.xyz/labs/probability-signal-simulator/) |

## Run it
Open `index.html` in any modern browser (no build, no server, no network). `styles.css` is the site's own stylesheet so the tools look the same locally.

## How it's built
The page markup and the two browser scripts (the toolkit script for the four utilities, the lab script for the probability simulator) are extracted verbatim from the site's rendered output — so this is the real logic, not a reimplementation. The EFF long wordlist is bundled inline for the passphrase generator. Decorative background textures from the site are intentionally omitted.

## Live modules (`modules/`)
Three of these tools have been refactored into dedicated ES modules that the **live detail pages on graysond.xyz load directly** — so the source here is exactly what runs:

- [`modules/cidr-inspector.js`](modules/cidr-inspector.js) → [graysond.xyz/tools/cidr-inspector/](https://graysond.xyz/tools/cidr-inspector/)
- [`modules/runbook-composer.js`](modules/runbook-composer.js) → [graysond.xyz/tools/runbook-composer/](https://graysond.xyz/tools/runbook-composer/)
- [`modules/hash-inspector.js`](modules/hash-inspector.js) → [graysond.xyz/tools/hash-inspector/](https://graysond.xyz/tools/hash-inspector/)

`index.html` remains a single-page demo of all five tools for convenience. The Passphrase Generator and Probability Signal Simulator still run from the combined inline scripts in `index.html`.

## Other public repos
Standalone modules for the larger tools/labs live in their own repos: [promptpack-studio](https://github.com/GraysonD-XYZ/promptpack-studio), [ai-token-budget-lab](https://github.com/GraysonD-XYZ/ai-token-budget-lab), [chaos-divergence-explorer](https://github.com/GraysonD-XYZ/chaos-divergence-explorer), [documentation-roi-calculator](https://github.com/GraysonD-XYZ/documentation-roi-calculator), [structure-zip-builder](https://github.com/GraysonD-XYZ/structure-zip-builder).

## License
Source-available, **not** open source. See [LICENSE.md](LICENSE.md) and [NOTICE.md](NOTICE.md): published for review, learning, and citation — not for copying, redistribution, or commercial/production use without written permission.
