# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.5.x   | ✅ Yes    |
| < 1.5   | ❌ No     |

## Reporting a Vulnerability

If you discover a security vulnerability in UXCraft, please report it **privately** — do not open a public GitHub issue.

**Email:** Report via GitHub's private vulnerability reporting:  
👉 [https://github.com/Seance1723/UXCraft/security/advisories/new](https://github.com/Seance1723/UXCraft/security/advisories/new)

### What to include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fix (optional)

### Response timeline

- **Acknowledgement:** within 48 hours
- **Assessment:** within 7 days
- **Fix or mitigation:** within 30 days for confirmed vulnerabilities

## Security Notes

- UXCraft has **zero runtime dependencies** — no transitive supply chain risk
- All bin files are plain Node.js with no `eval`, no network calls, and no file writes outside the target project directory
- The package is read-only by design — it only writes files when the user explicitly runs `uxcraft install`
