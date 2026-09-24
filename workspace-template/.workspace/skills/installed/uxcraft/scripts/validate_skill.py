#!/usr/bin/env python3
"""Validate the UXCraft skill package.

Dependency-free by design so the package can be checked on a fresh machine.
Use --release for stricter deployment packaging checks.
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "SKILL.md"
PACKAGE = ROOT / "package.json"

REQUIRED = [
    "README.md",
    "LICENSE",
    "package.json",
    "bin/uxcraft.mjs",
    "bin/uxcraft-mcp.mjs",
    "docs/slash-command-compatibility.md",
    "docs/mcp-server.md",
    "llms.txt",
    "ai-discovery/uxcraft.manifest.json",
    "system-prompts/uxcraft-system-add-on.md",
    "system-prompts/uxcraft-compact.md",
    "system-prompts/uxcraft-mcp-add-on.md",
    "agent-templates/claude/commands/uxcraft.md",
    "agent-templates/universal/uxcraft-trigger.md",
    "agent-templates/codex/AGENTS.append.md",
    "agent-templates/windsurf/rules/uxcraft.md",
    "agent-templates/antigravity/AGENTS.append.md",
    "agent-templates/gemini/GEMINI.append.md",
    "agent-templates/cursor/rules/uxcraft.mdc",
    "references/ui-ux-complete-checklist.md",
    "references/ui-ux-frontend-implementation-rules.md",
    "references/ui-ux-memory-workflow.md",
    "references/wcag-aa-quick-reference.md",
    "references/design-system-playbook.md",
    "references/top-100-brand-website-analysis.md",
    "references/ux-research-methods.md",
    "references/usability-heuristics.md",
    "references/platform-guidelines.md",
    "references/content-design-and-i18n.md",
    "references/ux-measurement-quality-gates.md",
    "references/ethical-inclusive-design.md",
    "references/service-design-journey-mapping.md",
    "references/data-visualization-dashboard-ux.md",
    "references/accessibility-advanced-patterns.md",
    "references/ui-ux-curriculum-and-standards.md",
    "references/competitive-landscape.md",
    "templates/ui-ux-brief.md",
    "templates/ui-ux-memory.md",
    "templates/ui-ux-audit-report.md",
    "templates/component-spec.md",
    "templates/design-system-spec.md",
    "templates/top-brand-frontend-spec.md",
    "scripts/build_deployment_zip.py",
    "tests/install-smoke.test.mjs",
]

REQUIRED_PHRASES = [
    "Information Architecture",
    "User Flows",
    "Accessibility",
    "Design Systems",
    "Responsive",
    "Handoff",
    "WCAG",
    "Screen State Checklist",
    "Top-Brand Frontend Method",
    "UI/UX memory",
    "research",
    "heuristic",
    "platform",
    "content design",
    "Internationalization",
    "Measurement and Quality Gates",
    "Ethics",
    "privacy",
    "/uxcraft",
    "Cross-Agent Activation",
    "AI Discovery and MCP",
    "system prompt",
    "MCP",
]

REQUIRED_HEADINGS = {
    "README.md": ["## Install with npm", "## Supported Agents", "## Competitive Positioning", "## Validation and Testing", "## Deployment Readiness Checklist"],
    "docs/slash-command-compatibility.md": ["## What `/ui-ux-master` Does", "## Native Slash Commands vs Text Triggers", "## Supported Agents"],
    "docs/mcp-server.md": ["## Why MCP Matters", "## Tools", "## Resources", "## Prompts", "## Security"],
    "system-prompts/uxcraft-system-add-on.md": ["## Activation Rule", "## Source of Truth", "## Required Behavior"],
    "system-prompts/uxcraft-mcp-add-on.md": ["## MCP Discovery", "## Behavior", "## Hermes Example"],
    "references/ux-research-methods.md": ["## Research Decision Tree", "## Research Plan Template", "## Evidence Confidence Levels"],
    "references/usability-heuristics.md": ["## Nielsen's 10 Usability Heuristics", "## Severity Rating"],
    "references/platform-guidelines.md": ["## Web App", "## iOS / Apple Platforms", "## Android / Material", "## Cross-Platform Rule"],
    "references/content-design-and-i18n.md": ["## Content Design Principles", "## Internationalization Checklist"],
    "references/ux-measurement-quality-gates.md": ["## Metric Selection", "## Quality Gate Template"],
    "references/ethical-inclusive-design.md": ["## Dark Pattern Checks", "## Privacy UX", "## Inclusive Design"],
    "references/service-design-journey-mapping.md": ["## Journey Map Elements", "## Service Blueprint Elements"],
    "references/data-visualization-dashboard-ux.md": ["## Dashboard Principles", "## Chart Selection", "## Tables and Data Grids"],
    "references/accessibility-advanced-patterns.md": ["## Complex Widget Checklist", "## Testing Matrix"],
    "references/ui-ux-curriculum-and-standards.md": ["## Beginner Foundations", "## Intermediate Practice", "## Advanced Practice"],
    "references/competitive-landscape.md": ["## What Existing Tools Do Well", "## Gaps UI/UX Master Must Beat", "## Strategy to Stay Ahead"],
    "templates/ui-ux-brief.md": ["## Research and Evidence Plan", "## Constraints", "## Deliverables Needed"],
    "templates/ui-ux-audit-report.md": ["## Heuristic Findings", "## Measured Evidence and Quality Gates"],
    "templates/component-spec.md": ["## Acceptance Criteria and Test Matrix"],
    "templates/design-system-spec.md": ["## Governance"],
    "templates/top-brand-frontend-spec.md": ["## 11. Quality Gates", "## 12. Do Not Copy"],
}


def fail(message: str) -> None:
    print(f"FAIL: {message}")
    sys.exit(1)


def warn(message: str) -> None:
    print(f"WARN: {message}")


def parse_frontmatter(content: str) -> tuple[dict[str, str], str]:
    if not content.startswith("---\n"):
        fail("SKILL.md must start with YAML frontmatter at byte 0")
    end_marker = content.find("\n---\n", 4)
    if end_marker == -1:
        fail("SKILL.md frontmatter is not closed")
    frontmatter_text = content[4:end_marker]
    body = content[end_marker + 5 :]
    if not body.strip():
        fail("SKILL.md body is empty")
    frontmatter: dict[str, str] = {}
    for raw_line in frontmatter_text.splitlines():
        if not raw_line or raw_line.startswith(" ") or raw_line.lstrip().startswith("#"):
            continue
        if ":" in raw_line:
            key, value = raw_line.split(":", 1)
            frontmatter[key.strip()] = value.strip().strip('"').strip("'")
    return frontmatter, body


def skill_version() -> str:
    fm, _ = parse_frontmatter(SKILL.read_text(encoding="utf-8"))
    return fm.get("version", "")


def check_required_files() -> None:
    for rel in REQUIRED:
        path = ROOT / rel
        if not path.exists():
            fail(f"missing supporting file: {rel}")
        text = path.read_text(encoding="utf-8")
        min_len = 150 if rel.endswith((".json", ".mjs")) else 200
        if len(text.strip()) < min_len:
            fail(f"supporting file too small or empty: {rel}")


def check_required_headings() -> None:
    for rel, headings in REQUIRED_HEADINGS.items():
        text = (ROOT / rel).read_text(encoding="utf-8")
        for heading in headings:
            if heading not in text:
                fail(f"{rel} missing heading: {heading}")


def check_skill_frontmatter_and_body() -> None:
    if not SKILL.exists():
        fail("SKILL.md is missing")
    content = SKILL.read_text(encoding="utf-8")
    fm, body = parse_frontmatter(content)
    for key in ["name", "description", "version", "author", "license", "metadata"]:
        if key not in content.split("---", 2)[1]:
            fail(f"frontmatter missing {key}")
    name = fm.get("name", "")
    if not re.fullmatch(r"[a-z0-9][a-z0-9-]{0,63}", name):
        fail("name must be lowercase hyphenated and <=64 chars")
    description = fm.get("description", "")
    if len(description) > 1024:
        fail("description must be <=1024 chars")
    if not description.startswith("Use when"):
        fail('description should start with "Use when"')
    if fm.get("author") != "Rupak Biswas":
        fail("SKILL.md author must be Rupak Biswas")
    if len(content) > 100_000:
        fail("SKILL.md exceeds 100,000 characters")
    if len(content) > 45_000:
        warn("SKILL.md is getting large; keep detailed material in references/")
    lower_body = body.lower()
    for phrase in REQUIRED_PHRASES:
        if phrase.lower() not in lower_body:
            fail(f"SKILL.md missing required phrase: {phrase}")


def check_package_json() -> None:
    try:
        data = json.loads(PACKAGE.read_text(encoding="utf-8"))
    except Exception as exc:
        fail(f"package.json is invalid JSON: {exc}")
    for key in ["name", "version", "description", "type", "bin", "files", "scripts", "license", "author", "engines"]:
        if key not in data:
            fail(f"package.json missing {key}")
    if data["name"] != "uxcraft":
        fail("package.json name must be uxcraft")
    if data["version"] != skill_version():
        fail("package.json version must match SKILL.md version")
    if data.get("license") != "MIT":
        fail("package.json license must be MIT")
    if data.get("bin", {}).get("uxcraft") != "./bin/uxcraft.mjs":
        fail("package.json bin.uxcraft must point to ./bin/uxcraft.mjs")
    if data.get("bin", {}).get("uxcraft-mcp") != "./bin/uxcraft-mcp.mjs":
        fail("package.json bin.uxcraft-mcp must point to ./bin/uxcraft-mcp.mjs")
    if data.get("author") != "Rupak Biswas":
        fail("package.json author must be Rupak Biswas")
    for script in ["validate", "test", "prepack"]:
        if script not in data.get("scripts", {}):
            fail(f"package.json scripts missing {script}")
    required_files = ["SKILL.md", "references/", "templates/", "agent-templates/", "docs/", "system-prompts/", "ai-discovery/", "llms.txt", "bin/", "scripts/", "tests/"]
    for item in required_files:
        if item not in data.get("files", []):
            fail(f"package.json files missing {item}")


def check_bin_installer() -> None:
    text = (ROOT / "bin/uxcraft.mjs").read_text(encoding="utf-8")
    if not text.startswith("#!/usr/bin/env node"):
        fail("bin/uxcraft.mjs must have node shebang")
    for phrase in ["install", "doctor", "uninstall", "--dry-run", "fileURLToPath", "/uxcraft", "copyProjectSkillAssets", ".uxcraft", "system-prompts", "ai-discovery", "uxcraft-mcp"]:
        if phrase not in text:
            fail(f"bin installer missing {phrase}")
    forbidden = ["C:\\", "C:/xampp", "C:/Users", "/home/"]
    for bad in forbidden:
        if bad in text:
            fail(f"bin installer contains local absolute path: {bad}")


def check_agent_templates() -> None:
    template_files = [rel for rel in REQUIRED if rel.startswith("agent-templates/") or rel.startswith("docs/")]
    for rel in template_files:
        text = (ROOT / rel).read_text(encoding="utf-8")
        for phrase in ["/uxcraft", "UXCraft", "memory", ".uxcraft"]:
            if phrase not in text:
                fail(f"{rel} missing required trigger phrase: {phrase}")
        for bad in ["C:\\", "C:/xampp", "C:/Users", "/workspace"]:
            if bad in text:
                fail(f"{rel} contains local absolute path: {bad}")
    docs = (ROOT / "docs/slash-command-compatibility.md").read_text(encoding="utf-8")
    for agent in ["Claude", "Codex", "Windsurf", "Antigravity", "Gemini", "Cursor", "Native"]:
        if agent not in docs:
            fail(f"slash compatibility docs missing {agent}")


def check_mcp_server() -> None:
    text = (ROOT / "bin/uxcraft-mcp.mjs").read_text(encoding="utf-8")
    if not text.startswith("#!/usr/bin/env node"):
        fail("bin/uxcraft-mcp.mjs must have node shebang")
    for phrase in ["tools/list", "tools/call", "resources/list", "resources/read", "prompts/list", "prompts/get", "uxcraft://skill", "generate_system_prompt"]:
        if phrase not in text:
            fail(f"MCP server missing {phrase}")
    for bad in ["C:\\", "C:/xampp", "C:/Users", "/workspace"]:
        if bad in text:
            fail(f"MCP server contains local absolute path: {bad}")


def check_discovery_assets() -> None:
    manifest = json.loads((ROOT / "ai-discovery/uxcraft.manifest.json").read_text(encoding="utf-8"))
    if manifest.get("author") != "Rupak Biswas":
        fail("AI manifest author must be Rupak Biswas")
    if manifest.get("activation", {}).get("trigger") != "/uxcraft":
        fail("AI manifest trigger must be /uxcraft")
    if "uxcraft-mcp" not in manifest.get("entrypoints", {}).get("mcp_server_bin", ""):
        fail("AI manifest missing mcp_server_bin entrypoint")
    expected_resources = {
        "uxcraft://skill",
        "uxcraft://readme",
        "uxcraft://llms",
        "uxcraft://manifest",
        "uxcraft://system-prompt",
        "uxcraft://compact-prompt",
        "uxcraft://mcp-prompt",
        "uxcraft://mcp-docs",
        "uxcraft://checklist",
        "uxcraft://memory-template",
    }
    actual_resources = set(manifest.get("mcp", {}).get("resources", []))
    missing_resources = sorted(expected_resources - actual_resources)
    if missing_resources:
        fail("AI manifest missing MCP resources: " + ", ".join(missing_resources))
    for rel in ["README.md", "LICENSE", "llms.txt", "system-prompts/uxcraft-system-add-on.md", "system-prompts/uxcraft-compact.md", "system-prompts/uxcraft-mcp-add-on.md", "docs/mcp-server.md"]:
        text = (ROOT / rel).read_text(encoding="utf-8")
        if rel in {"README.md", "LICENSE"} and "Rupak Biswas" not in text:
            fail(f"{rel} must identify Rupak Biswas")
        if rel not in {"LICENSE"} and "/uxcraft" not in text:
            fail(f"{rel} must mention /uxcraft")


def check_referenced_files_exist() -> None:
    content = SKILL.read_text(encoding="utf-8")
    refs = sorted(set(re.findall(r"`((?:references|templates|agent-templates|docs|bin|scripts|system-prompts|ai-discovery)/[^`]+?\.(?:md|mdc|mjs|py|json)|README\.md|llms\.txt)`", content)))
    for rel in refs:
        if rel in {"docs/ui-ux-memory.md", "docs/design/ui-ux-memory.md", "design/ui-ux-memory.md"}:
            continue
        if not (ROOT / rel).exists():
            fail(f"SKILL.md references missing file: {rel}")


def check_markdown_links() -> None:
    for path in [ROOT / rel for rel in REQUIRED if rel.endswith(".md")]:
        text = path.read_text(encoding="utf-8")
        for match in re.findall(r"\[[^\]]+\]\(([^)]+)\)", text):
            if match.startswith(("http://", "https://", "mailto:", "#")):
                continue
            target = (path.parent / match.split("#", 1)[0]).resolve()
            if not target.exists():
                fail(f"broken local markdown link in {path.relative_to(ROOT)}: {match}")


def check_release_artifacts(strict: bool) -> None:
    bad_patterns = [
        "**/__pycache__",
        "**/*.pyc",
        "**/.DS_Store",
        "**/Thumbs.db",
        "node_modules",
        "coverage",
        ".nyc_output",
        "*.tgz",
        "npm-debug.log*",
    ]
    found: list[str] = []
    for pattern in bad_patterns:
        for path in ROOT.glob(pattern):
            found.append(str(path.relative_to(ROOT)))
    if found:
        message = "release artifacts found: " + ", ".join(sorted(found)[:20])
        if strict:
            fail(message)
        warn(message)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--release", action="store_true", help="run stricter deployment packaging checks")
    args = parser.parse_args()
    check_skill_frontmatter_and_body()
    check_required_files()
    check_required_headings()
    check_package_json()
    check_bin_installer()
    check_agent_templates()
    check_mcp_server()
    check_discovery_assets()
    check_referenced_files_exist()
    check_markdown_links()
    check_release_artifacts(strict=args.release)
    print("PASS: UXCraft skill package is valid")
    print(f"Root: {ROOT}")
    print(f"Files checked: {1 + len(REQUIRED)}")
    if args.release:
        print("Release mode: PASS")


if __name__ == "__main__":
    main()
