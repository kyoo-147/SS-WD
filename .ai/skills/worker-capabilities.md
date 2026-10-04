# Worker Capability Registry

Use this file when choosing a worker or model. Capabilities and availability can drift, so verify current CLI model lists, authentication, quota, and host integration before dispatch.

This registry selects worker harnesses and models, not terminal/workspace hosts. Select the runtime independently through `.ai/skills/runtime-adapters.md`; do not assume that a verified worker requires Orca, Herdr, or any other specific host.

Status labels:

- `VERIFIED`: exercised successfully in this project.
- `AVAILABLE`: installed or listed, but not yet exercised here.
- `BLOCKED`: currently unavailable because of auth, quota, or runtime state.
- `INFERRED`: routing guidance based on model description or family behavior; benchmark before high-risk use.

## Pi

Status: `VERIFIED`

Best use:

- Chief of Staff coordination and local tool control;
- repository inspection and tool-rich local work;
- research, implementation, and verification when the selected Pi model fits.

Pi workers run as independent command-line processes in visible terminals. Do not use Pi's internal or hidden subagents for delegated work.

## Codex

Status: `VERIFIED`, but quota must be checked before dispatch.

Best use:

- implementation, refactoring, tests, and build/debug cycles;
- repository-wide code changes in isolated worktrees;
- provider-backed host lifecycle, including observed turn start and supervised `worker_done`.

Known routing:

- `gpt-5.6-sol`: complex implementation and reasoning;
- `gpt-5.6-luna`: lower-cost mechanical execution.

Current quota is not durable knowledge. Query the active provider account status before selecting Codex.

## Command Code

Status: `VERIFIED` through headless and visible-terminal runs; account-default paid usage may still be `BLOCKED` by credits while explicitly free models remain available. Some hosts cannot report provider lifecycle, so use sentinel monitoring.

The installed CLI exposes many model families. Useful routes from its live model descriptions include:

- `deepseek/deepseek-v4-flash`: fast default reasoning, reconnaissance, and bounded review;
- `deepseek/deepseek-v4-pro`: deeper long-context reasoning;
- `moonshotai/kimi-k3` or `kimi-k2.7-code`: long-horizon coding and large-context work;
- `z-ai/glm-5.3-flash`: fast, affordable coding;
- `zai-org/glm-5.3`: frontier coding and difficult technical analysis;
- `minimaxai/minimax-m3`: agentic coding and multimodal work;
- `claude-sonnet-5`: strong speed/intelligence balance;
- `claude-opus-5` or `claude-fable-5-1`: demanding reasoning and long-horizon agents;
- `gpt-6-astra` or `gpt-5.6-sol`: high-complexity reasoning and implementation;
- `gpt-5.6-luna` or `gpt-5.4-mini`: economical bounded execution;
- `google/gemini-3.8-flash`: fast general reasoning;
- `meta/muse-spark-1.2`: coding-oriented large-codebase work.

Verified native-free routes:

- `poolside/laguna-s-2.1-free`: coding and long-horizon implementation;
- `inclusionai/ling-3.1-flash:free`: fast coding, review, and tool use;
- `stealth/space-bunny-alpha`: free long-context fallback.

The free labels and descriptions come from the live Command Code catalog. Each route above has passed a headless smoke test, but the task-quality mappings remain `INFERRED` until benchmarked on representative project work. Query `commandcode --list-models` and run a live smoke before dispatch.

## Antigravity (`agy`)

Status: `VERIFIED` through a visible terminal using Google AI Pro; some hosts cannot report provider lifecycle, so use sentinel monitoring.

Installed model routes from the live `agy models` catalog:

- `gemini-3.8-flash-high`: fast triage, orchestration advice, moderate debugging, and architecture exploration;
- `gemini-3.8-flash-medium`: bounded frontend/backend/test work;
- `gemini-3.8-flash-low`: deterministic edits, boilerplate, formatting, and simple transformations;
- `gemini-3.7-flash-*`: economical discovery, extraction, and test triage;
- `gemini-3.1-pro-high`: deep research, large-context synthesis, and difficult audits;
- `gemini-3.1-pro-low`: structured planning and integration verification;
- `claude-sonnet-5-5-high`: non-trivial implementation, refactoring, and review;
- `claude-opus-5-5-high`: high-uncertainty architecture and high-blast-radius review;
- `gpt-oss-120b-medium`: isolated or privacy-sensitive transformations and fallback analysis.

Availability has been smoke-verified for `gemini-3.8-flash-high`, `gemini-3.8-flash-low`, `gemini-3.1-pro-high`, and `claude-sonnet-5-5-high`. These task mappings remain `INFERRED`; reasoning-budget semantics, latency, tool reliability, context limits, and quota must be measured before high-risk routing. Query `agy models` before dispatch.

## Routing decision

Before dispatch, answer:

1. Does the task require reading, writing, reviewing, research, or UI/browser work?
2. What is the task's ambiguity and blast radius?
3. Which runtime hosts this worker, and what lifecycle evidence does that exact combination provide?
4. Is the account authenticated and within quota?
5. What is the cheapest verified model capable of producing reliable evidence?

Use strong models for ambiguity, architecture, security, and review. Use fast models for scanning, extraction, mechanical editing, and test execution. Upgrade worker capability when evidence quality is insufficient; change runtime only through an explicit, allowed routing decision.

Apply the three-tier availability policy in `.ai/skills/model-routing.md`: Command Code then Antigravity, then the Navin `free` combo, then verified agent-native free models. A code/test/tool failure is not quota failure and must not trigger model fallback.
