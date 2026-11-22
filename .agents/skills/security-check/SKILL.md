---
name: security-check
description: Review the current changes (or the whole repo) for security problems before a commit, push or pull request. Use when asked to "run security-check", "check this for security", "is this safe to push", or before opening a PR. Runs local scanners if they are installed, then reviews the diff by hand for this stack (static Next.js export, GitHub Actions, GitHub Pages) and explains each finding in plain English.
---

# security-check

An on-demand security review. It does **not** run by itself: automatic checks belong in
the pre-commit hook and the pull-request workflows. This skill adds judgement on top of them.

## Ground rules

- **Never write findings into tracked files.** This repo is public. Report in the chat only.
  If a file is needed, write it under `.security-check/` (gitignored) or outside the repo.
- **Never print a secret value.** Show the file, line and type of secret, and mask the value
  (for example `ghp_****abcd`).
- **Read-only.** Do not change code, git history, GitHub settings or DNS. Do not scan the live
  site actively (no fuzzing, no crawling). Propose fixes and wait for approval.
- **Don't guess.** If a tool is missing or fails, say so. "Not checked" is a valid answer.

## 1. Pick the scope

| Request | Scope |
|---|---|
| Default, "before I commit" | staged + unstaged changes: `git diff HEAD` plus untracked files |
| "Before I push", "before the PR" | the branch against its base: `git diff origin/main...HEAD` |
| "Whole repo", "full audit" | every tracked file, plus git history for secrets |

State the scope and the commit range at the top of the report.

## 2. Run the scanners that are installed

Check each one with `command -v <tool>` first. Skip a missing tool, and list it under "Not run".

| Tool | Command (diff scope) | Finds |
|---|---|---|
| gitleaks | `gitleaks git --log-opts="origin/main..HEAD" --redact --no-banner` (staged only: `gitleaks git --staged --redact`) | secrets in commits |
| TruffleHog | `trufflehog git file://. --since-commit origin/main --results=verified,unknown --no-update` | secrets, and checks whether they are still live |
| Semgrep / Opengrep | `semgrep scan --config p/javascript --config p/typescript --config p/react --config p/github-actions --config p/secrets --error <changed files>` | dangerous code patterns |
| npm audit | `npm audit --omit=dev` and then `npm audit` | known vulnerable packages (prod first, then dev) |
| Trivy | `trivy fs --include-dev-deps --scanners vuln,secret,misconfig .` | vulnerable packages, secrets, misconfigured files |

Ignore hits inside `.next/`, `out/`, `node_modules/` and `test-results/`: they are local build
output and never committed (gitleaks flags the Next.js preview-mode keys in `.next/`).

## 3. Review the diff by hand

Scanners match patterns. These checks need context. Go through every changed file:

**Code that runs in the browser** (`app/`, `components/`, `hooks/`, `lib/`)
- `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function`, `document.write`: where does the input come from?
- `NEXT_PUBLIC_*` variables: everything with this prefix is shipped to every visitor. A name with `KEY`, `SECRET` or `TOKEN` in it is a red flag.
- New `fetch()`, `<script src>`, `<iframe>`, fonts or images from another host: what data leaves the site, and to whom?
- `target="_blank"` without `rel="noopener noreferrer"`.
- `localStorage`, `sessionStorage`, cookies, `postMessage`, `window.open`, assignments to `location`.

**Dependencies** (`package.json`, `package-lock.json`)
- Every new package: is it needed? Is the name spelled exactly right (typosquatting)? Who publishes it, and is it maintained?
- New install scripts (`preinstall`, `install`, `postinstall`), and packages that are not resolved from `registry.npmjs.org`.
- A runtime `dependency` that should be a `devDependency`.

**GitHub Actions** (`.github/workflows/`)
- `permissions`: the smallest set per job. `pages: write` and `id-token: write` only in the deploy job, and that job runs no npm code.
- `pull_request_target`, `workflow_run`, or `${{ github.event.* }}` / `${{ github.head_ref }}` inside `run:` (script injection).
- Every `uses:` pinned to a full commit SHA, with a version comment.
- `actions/checkout` with `persist-credentials: false` when no later step needs to push.
- New `secrets.*`: which step can read them?

**Hosting and public files** (`public/`, `next.config.mjs`)
- `public/CNAME` changes, new files in `public/`: everything there is published as-is.
- Images and PDFs: EXIF location, unredacted screenshots, personal data.
- `output: "export"` must stay: it is what keeps the site free of server code.

**Agent and repo instructions** (`AGENTS.md`, `CLAUDE.md`, `.agents/`, `.claude/`)
- Instructions that tell an agent to push, merge, deploy, skip checks or disable hooks.
- New hooks or settings that run commands automatically.

## 4. Report

Use this format, in the chat:

```markdown
## security-check: <scope> (<base>..<head>)

**Result:** <n> findings: <h> High, <m> Medium, <l> Low. <one-sentence verdict, e.g. "Safe to push.">

### Scanners
| Tool | Result |
|---|---|
| gitleaks | 0 leaks |
| Semgrep | not run (not installed) |

### Findings
#### [Medium] <short title>
- **Where:** `path/to/file.ts:42`
- **What:** <what the code does>
- **Why it matters:** <plain English: what could an attacker do, and how likely is it here>
- **Fix:** <the smallest change that solves it>

### Not checked
<anything skipped, and why>
```

Severity:
- **High:** a realistic path to a leaked secret, a defaced site or code running in visitors' browsers.
- **Medium:** a missing safety net that is cheap to add, or a risk that needs one more mistake to become real.
- **Low:** defence in depth.

End with "Safe to push", "Fix first" or "Needs a decision", and the reason in one line.
Write for a frontend developer who is learning security: explain each term once, the first time it appears.
