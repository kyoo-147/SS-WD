# Coding-agent routing and capability matrix

This document is the portable routing reference. It contains no credentials, account identifiers, quota balances, or machine-local paths. Current operational results belong in `.pi/coding-agent-tracking.md`.

## Three routing tiers

| Tier | Purpose | Candidate order | Entry condition | Exit condition |
| --- | --- | --- | --- | --- |
| 1 | Highest-capability coding agents | Command Code, then Antigravity (`agy`) | New worker turn | Both are unavailable because of auth, credits/quota, capacity, or model availability |
| 2 | Central provider routing | Navin 9Router `free` combo via OpenCode | Tier 1 unavailable | Gateway/combo unavailable after bounded retry |
| 3 | Agent-native free safety net | Verified Command Code free models; connected OpenCode Console free models when listed live | Tier 2 unavailable | First capable model succeeds, otherwise `BLOCKED` |

A worker that discovers a code defect, failing test, denied operation, or invalid task assumption has not suffered a provider outage. Preserve that result and stop or escalate; do not hide it by switching models.

## Harness capabilities

| Harness | Headless | Model pin | Unrestricted mode | Worktree support | Model discovery | Operational role |
| --- | --- | --- | --- | --- | --- | --- |
| Command Code | `cmdc -p` | `-m` / `--model` | `--yolo` | `--worktree` | `--list-models` | First Tier 1 candidate; Tier 3 native-free provider |
| Antigravity | `agy -p` | `--model` | `--dangerously-skip-permissions` | Project UI supports new-worktree mode; external runtime isolation remains authoritative | `agy models` | Second Tier 1 candidate; strong Google/Claude model access |
| OpenCode | `opencode run` | `--model provider/model` | `--auto` | Use runtime-managed Git worktree for concurrent writers | `opencode models` | Tier 2 Navin client; optional Tier 3 OpenCode Console free client |
| Claude Code | `claude -p` | `--model` | `--dangerously-skip-permissions` | Use runtime-managed Git worktree for concurrent writers | CLI/config catalog | Direct Navin client and manual diagnostic route; not in the default three-tier worker order |
| Gemini CLI | `gemini -p` | `--model` | `--yolo` | `--worktree` | CLI catalog | Use only after native client/account eligibility succeeds |
| Codex | `codex exec` | `--model` | `--dangerously-bypass-approvals-and-sandbox` | `--worktree` | CLI/provider catalog | Separate explicit route; never silent fallback |

Unrestricted mode is a permission decision, not a workspace-isolation or acceptance decision. Concurrent writers still require isolated worktrees and independent review.

## Model capability map

The table separates verified availability from inferred task fit.

| Route | Availability requirement | Suggested work | Epistemic status |
| --- | --- | --- | --- |
| Command Code task-selected model | Authenticated account, usable credits, and exact ID in `--list-models` | Tier 1 architecture, implementation, review, scan, or UI work according to the profile map | Catalog availability verified live; task fit inferred until benchmarked |
| `agy/gemini-3.1-pro-high` | Exact slug in `agy models`; smoke succeeds | Architecture, research synthesis, security/review | Availability verified in a prior live pass; task fit inferred |
| `agy/claude-sonnet-5-5-high` | Exact slug in `agy models`; smoke succeeds | Implementation, refactoring, review, UI coding | Availability verified in a prior live pass; task fit inferred |
| `agy/gemini-3.8-flash-high` | Exact slug in `agy models`; smoke succeeds | Balanced general work, triage, orchestration | Availability verified in a prior live pass; task fit inferred |
| `agy/gemini-3.8-flash-low` | Exact slug in `agy models`; smoke succeeds | Scanning, extraction, mechanical edits | Availability verified in a prior live pass; task fit inferred |
| `9router/free` | Authenticated Navin gateway and passing smoke | Gateway-managed coding fallback | Combo membership and quality are live state |
| `poolside/laguna-s-2.1-free` | Listed by Command Code and passing smoke | Coding and long-horizon implementation fallback | Free label and availability verified; quality mapping inferred |
| `inclusionai/ling-3.1-flash:free` | Listed by Command Code and passing smoke | Fast review, tool use, bounded coding | Free label and availability verified; quality mapping inferred |
| `stealth/space-bunny-alpha` | Listed by Command Code and passing smoke | Long-context fallback and analysis | Free label and availability verified; quality mapping inferred |
| OpenCode Console `*-free` IDs | Connected `opencode` provider and exact ID in `opencode models` | Coding fallback according to live model metadata | Official catalog fact; local availability unverified until connected and smoked |

Official OpenCode Console documentation currently advertises free IDs including `laguna-s-2.1-free`, `ling-3.0-tiny-free`, `longcat-2.0-free`, `north-mini-code-free`, `nemotron-3-ultra-free`, and `deepseek-v4-flash-free`. Do not dispatch them merely because they appear in documentation; the local provider must be connected and the live CLI must list them.

## Dispatch algorithm

1. Classify task profile: architecture, implementation, review, scan, UI, or general.
2. Select runtime and workspace independently. Create an isolated worktree for every concurrent writer.
3. Preflight the candidate CLI, auth/quota if supported, exact model slug, and headless invocation.
4. Launch in the Founder-selected unrestricted mode.
5. Retry transient network/429/5xx failures up to three times with 1s, 2s, and 4s backoff.
6. On provider/model unavailability, move to the next candidate and then next tier.
7. On task/tool/test/workspace/policy failure, stop fail-closed.
8. Require worker evidence, then independently inspect diff, tests, Git state, and integration outcome.
9. Record the route and lifecycle in the private timeline.

## Multi-worker behavior

- Default to one to three independent lanes.
- Give each writer a non-overlapping ownership boundary and isolated worktree.
- Read-only workers may share the source checkout only through separate visible endpoints.
- Never let fallback change workspace identity, path ownership, or completion criteria.
- A new model invocation is a new worker turn and must be recorded as such.
- Preserve dirty, ambiguous, or unreadable worktrees rather than cleaning optimistically.

## Executable entry point

```powershell
pwsh -File .\tools\invoke-tiered-worker.ps1 `
  -Prompt "Implement the requested change and run acceptance checks" `
  -TaskProfile implementation `
  -WorkingDirectory D:\path\to\isolated-worktree
```

Useful controls:

- `-DryRun`: print the candidate board without launching.
- `-StartTier 2`: begin at Navin for an explicit recovery/test.
- `-StartTier 3`: test only agent-native free candidates.
- `-MaxAttempts 3`: bounded same-candidate retry.
- `-EvidencePath <private-path>`: write a secret-free attempt ledger.
- `-NoYolo`: explicit restricted-mode exception.

## Primary documentation

- Command Code permissions: https://commandcode.ai/docs/permissions
- Command Code headless mode: https://commandcode.ai/docs/headless
- Antigravity headless mode: https://www.antigravity.google/docs/cli/headless/
- Antigravity execution modes: https://www.antigravity.google/docs/cli/modes/
- Antigravity projects/worktrees: https://www.antigravity.google/docs/projects?tab=cli
- OpenCode CLI: https://dev.opencode.ai/docs/cli/
- OpenCode models: https://opencode.ai/v2/docs/models
- OpenCode Console models: https://opencode.ai/v2/docs/console/models/
