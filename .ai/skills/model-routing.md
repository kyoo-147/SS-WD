# Model Routing

The full portable capability matrix and dispatch algorithm are in `docs/CODING-AGENT-ROUTING.md`.

Read `.ai/skills/worker-capabilities.md` before selecting an agent or model. Verify live CLI model lists, authentication, quota, and host lifecycle support because these drift independently.

Select the worker separately from the runtime host. A model, coding-agent harness, terminal host, and Git workspace are different routing dimensions.

## Three-tier policy

Route each new worker turn through these tiers. Retry within a candidate only for transient failures; move down a tier only for provider/model availability failures.

1. **Primary coding agents** — try Command Code, then Antigravity (`agy`). Command Code uses the Founder-selected DeepSeek family only; select Flash or Pro by task capability.
2. **Navin gateway** — use the authenticated `free` combo through `https://ai.navinresearch.com/v1` after both primary agents are unavailable because of quota, authentication, capacity, or model availability.
3. **Agent-native free models** — use only free models advertised by an installed coding agent, visible in its current model list, and proven by a live smoke test. Current verified Command Code fallbacks are `poolside/laguna-s-2.1-free`, `inclusionai/ling-3.1-flash:free`, and `stealth/space-bunny-alpha`. OpenCode Console free models are eligible only when the `opencode` provider is connected locally and `opencode models` lists the exact ID.

This is a policy, not a promise that a provider or model remains available. Never encode API keys, OAuth state, passwords, or machine-local auth files in SS-WD.

## Capability-first selection

Choose the cheapest verified capability that satisfies the task:

| Task profile | Preferred capability | Current primary route | Evidence status |
| --- | --- | --- | --- |
| Architecture, security, high-blast-radius review | Deep reasoning, long context, reliable tool planning | `cmdc/deepseek/deepseek-v4-pro`; then `agy/gemini-3.1-pro-high` | Command Code and AGY smoke-verified; task mapping inferred |
| Non-trivial implementation and refactoring | Coding-specialized tools, edit/test loop | `cmdc/deepseek/deepseek-v4-flash`; then `agy/gemini-3.8-flash-medium`, upgrading to `claude-sonnet-4-6` only when needed | Catalog availability must be checked live; task mapping inferred |
| UI implementation | Coding/tool use; verified vision when required | `cmdc/deepseek/deepseek-v4-flash`; then `agy/gemini-3.8-flash-medium`, upgrading when visual complexity requires it | Catalog availability must be checked live; task mapping inferred |
| Fast scanning, extraction, test triage | Low latency and economical context | `cmdc/deepseek/deepseek-v4-flash`; then `agy/gemini-3.8-flash-low` | Command Code and AGY smoke-verified; task mapping inferred |
| General bounded work | Balanced coding/reasoning | `cmdc/deepseek/deepseek-v4-flash`; then `agy/gemini-3.8-flash-high` | Command Code and AGY smoke-verified; task mapping inferred |

Model descriptions are routing hypotheses, not benchmarks. Upgrade or reroute when evidence quality is inadequate.

- For Command Code CLI usage, Provider API protocol boundaries, secret handling, and compatible clients, read `.ai/skills/command-code-provider.md`.
- Prefer the Command Code CLI for coding work because its harness adds model-specific tool repair and context optimization. Use the Provider API when another compatible client is operationally preferable.

## Live paid-quota gate

Before every new Tier 1 worker turn:

1. open Command Code in a real TTY and run `/usage`;
2. open Antigravity in a real TTY and run `/usage` before deciding that paid Tier 1 is unavailable;
3. inspect weekly and shorter-window limits plus the quota group containing the intended model;
4. record the observation privately, including reset time and fallback reason;
5. select the smallest capable model in the first paid provider with current capacity.

These are interactive slash commands. `cmdc --usage` and `agy --usage` are not valid replacements. With Git Bash-mediated `orca terminal send`, set `MSYS_NO_PATHCONV=1` so `/usage` remains literal.

Quota state is ephemeral. Recheck both providers after several tasks, after a meaningful interval, and after reported reset windows. Do not continue using a free model merely because an earlier paid check failed. Do not enable Command Code `/extra` or any paid upgrade without explicit Founder approval.

`tools/invoke-tiered-worker.ps1` cannot safely scrape interactive quota screens. For a normal Tier 1 run, pass fresh operator-attested `-CommandCodeUsageState` and `-AntigravityUsageState` values obtained from those TTY checks. The tool fails closed when either state is unknown. Explicit `-StartTier 2` or `-StartTier 3` remains available for deliberate recovery and testing.

## Retry and failure classification

- Run a live preflight: CLI exists, auth/status where supported, exact model appears in the live catalog, and a minimal headless smoke test succeeds.
- Retry only network failures, timeouts, HTTP 429, and HTTP 5xx with bounded backoff of 1s, 2s, and 4s; maximum three attempts.
- Provider/model availability failures include exhausted credits/quota, invalid or expired auth, unsupported/retired/missing models, HTTP 401/402/403/406/410/429, and provider capacity failures. These may move to the next candidate or tier.
- A code, test, tool, workspace, policy, or unknown runtime failure is not a model outage. Stop `BLOCKED` rather than hiding it with fallback.
- Fallback must preserve required tools, modalities, context, privacy, workspace ownership, and output contract.
- Report the selected tier, agent, model, attempts, fallback reason, and final `VERIFIED`, `BLOCKED`, or `USER ACTION REQUIRED` state.

## Exact invocation shapes

All supported workers run in unrestricted/YOLO mode by Founder decision. YOLO changes permissions, not model capability, and therefore does not waive worktree isolation, path ownership, review, or verification.

```powershell
# Command Code
cmdc -p "<task>" -m <model-id> --yolo --output-format text

# Antigravity
agy -p "<task>" --model <model-id> --dangerously-skip-permissions --output-format json

# Navin through OpenCode
opencode run --standalone --model 9router/free "<task>" --auto

# Command Code native free fallback
cmdc -p "<task>" -m poolside/laguna-s-2.1-free --yolo
```

Use `tools/invoke-tiered-worker.ps1` for the full three-tier policy:

```powershell
pwsh -File .\tools\invoke-tiered-worker.ps1 `
  -Prompt "<task>" `
  -TaskProfile implementation `
  -WorkingDirectory <isolated-worktree> `
  -CommandCodeUsageState available `
  -AntigravityUsageState available
```

`-StartTier 2` or `-StartTier 3` exists for explicit recovery and verification. `-NoYolo` is the deliberate restricted-mode escape hatch. `-DryRun` prints the resolved candidate order without launching a worker.

Pass `blocked` for a paid provider only when its current TTY `/usage` view or an equivalent live provider check proves it unavailable. Optional `-CommandCodeUsageNote` and `-AntigravityUsageNote` values belong only in private evidence and must not contain account identifiers or secrets.

`tools/invoke-agent-fallback.ps1` remains the lower-level single-agent fallback runner.

## Multi-worker workspace contract

Routing does not create authority to share a mutable checkout:

- Use the smallest useful worker count, normally one to three.
- Read-only workers may use separate visible endpoints in the active workspace.
- Every concurrent writer gets an isolated Git worktree with one writer per collision boundary.
- Record endpoint, worktree, agent, model, exact command, lifecycle evidence, result, and cleanup disposition in `.pi/worker-workspace-timeline.md`.
- A worker's success message is not acceptance. The Chief reviews diffs, runs authoritative checks, integrates, and preserves or cleans exact owned state.
- A runtime preflight failure remains `BLOCKED`; do not disguise it as model fallback. Model fallback occurs inside a verified runtime or after an explicit runtime decision.

## Maintenance

Refresh the private matrix at `.pi/coding-agent-tracking.md` after login changes, quota errors, CLI updates, model retirement, or a 9Router combo edit. Keep public files limited to portable policy and sanitized model identifiers.

Primary references:

- Command Code Provider API: https://commandcode.ai/docs/provider
- Command Code models: https://commandcode.ai/docs/reference/cli/models
- Command Code GOAT plan: https://commandcode.ai/docs/plans/goat

- Command Code permissions: https://commandcode.ai/docs/permissions
- Command Code headless mode: https://commandcode.ai/docs/headless
- Antigravity headless mode: https://www.antigravity.google/docs/cli/headless/
- Antigravity CLI reference: https://www.antigravity.google/docs/cli/reference/
- OpenCode CLI: https://dev.opencode.ai/docs/cli/
- OpenCode models: https://opencode.ai/v2/docs/models
- OpenCode Console models: https://opencode.ai/v2/docs/console/models/
