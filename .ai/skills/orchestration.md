# Orchestration skill

Use visible independent command-line workers through explicit runtime adapters. Do not use hidden internal subagents unless the Founder explicitly requests them.

## Separate worker from runtime

A worker is the harness/provider/model executing a task. A runtime is the host that creates endpoints, displays output, reports lifecycle state, and cleans up. Select them independently.

Read `.ai/skills/worker-capabilities.md` for worker routing. Read `.ai/skills/runtime-adapters.md`, `docs/RUNTIME-ADAPTERS.md`, and one platform guide for runtime routing.

Supported operating patterns include Herdr, Orca, PowerShell, CMD, and future hosts that satisfy the same contract. No host is the control plane.

## When to delegate

Delegate when work is genuinely independent, benefits from a second investigation, or can proceed in parallel without shared-file conflict. Do not delegate trivial work, unclear work that lacks context, or work where spawning costs more than direct execution. Normally use one to three workers.

Semantic roles are `RESEARCH`, `IMPLEMENT`, `FRONTEND`, `BACKEND`, `DEBUG`, `REVIEW`, and `TEST`. Give endpoints descriptive titles such as `RESEARCH-auth`, never `worker1`.

Use the active workspace for research, exploration, read-only analysis, testing, and review. Use isolated Git worktrees for concurrent mutation: one writer per worktree and no concurrent editing of the same files.

## Lifecycle

`PREFLIGHT -> SPAWN -> ASSIGN -> TRACK -> MONITOR -> REVIEW -> FOLLOW-UP -> INTEGRATE -> VERIFY -> ARCHIVE -> CLEAN`

Before delegation, understand the objective, inspect enough context, identify dependencies, choose the minimum worker count, and preflight the selected runtime. The Chief reviews actual code, diffs, tests, builds, runtime evidence, and logs as relevant. Never stop at a worker saying done.

Monitoring is active work. Follow `.ai/protocols/monitoring.md`. Use authenticated lifecycle events when supported. Otherwise require a unique completion sentinel and poll bounded output/process evidence. Do not use one long blind wait.

At creation and every lifecycle change, append the worker, runtime, endpoint/workspace identity, task, commits, evidence, and disposition to `.pi/worker-workspace-timeline.md`. After completion and safe integration or preservation, archive useful output, verify Git status, finalize the timeline entry, and remove only exact owned endpoint/workspace state. Preserve dirty, ambiguous, active-main, or in-progress work.

## Worker task contract

Every assignment states:

- **OBJECTIVE**: outcome to achieve;
- **CONTEXT**: relevant repository facts and decisions;
- **SCOPE**: files and boundaries;
- **CONSTRAINTS**: rules, exclusions, and safety limits;
- **EXPECTED OUTPUT**: evidence and artifacts to return;
- **DEFINITION OF DONE**: observable acceptance criteria;
- **COMPLETION SENTINEL**: exact marker when lifecycle support is insufficient.
