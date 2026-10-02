# Orchestration skill

Use visible independent command-line workers for delegated work. Do not use hidden internal subagents unless the Founder explicitly requests them.

## When to delegate

Delegate when work is genuinely independent, benefits from a second investigation, or can proceed in parallel without shared-file conflict. Do not delegate trivial work, unclear work that lacks context, or work where spawning costs more than direct execution. Normally use one to three workers.

Semantic roles are `RESEARCH`, `IMPLEMENT`, `FRONTEND`, `BACKEND`, `DEBUG`, `REVIEW`, and `TEST`. Give terminals descriptive titles such as `RESEARCH-auth`, never `worker1`.

Use the active or shared workspace for research, exploration, read-only analysis, testing, and review. Use isolated Git worktrees for concurrent mutation: one writer per worktree and no concurrent editing of the same files.

## Lifecycle

`SPAWN -> ASSIGN -> TRACK -> MONITOR -> REVIEW -> FOLLOW-UP if necessary -> INTEGRATE -> VERIFY -> ARCHIVE -> CLEAN`

Before delegation, understand the objective, inspect enough context, identify dependencies, and create the minimum worker count. The Chief reviews actual code, diffs, tests, builds, runtime evidence, and logs as relevant. Never stop at a worker saying done.

Monitoring is active work. Follow `.ai/protocols/monitoring.md`. Use host lifecycle events when supported. Otherwise, require a unique completion sentinel and poll rendered terminal screens in short bounded intervals. Do not use one long blind wait for unsupported providers.

At creation and every lifecycle change, append the worker or workspace identity, task, terminal or session handles, commits, evidence, and disposition to `.pi/worker-workspace-timeline.md`. After completion and safe integration or preservation, archive useful terminal output under `.pi/worker-session-archive/`, verify the workspace is clean, finalize the timeline entry, and remove the completed terminal or worktree. Preserve dirty, ambiguous, active-main, or in-progress work and report it instead of forcing cleanup.

## Worker task contract

Every assignment states:

- **OBJECTIVE**: outcome to achieve
- **CONTEXT**: relevant repository facts and decisions
- **SCOPE**: files and boundaries
- **CONSTRAINTS**: rules, exclusions, and safety limits
- **EXPECTED OUTPUT**: evidence and artifacts to return
- **DEFINITION OF DONE**: observable acceptance criteria
