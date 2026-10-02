# Orca adapter guide

Orca is an optional workspace host that can own Git worktrees, terminal endpoints, and visible UI state. It is not the SS-WD control plane and is never an implicit requirement.

Load the version-matched Orca CLI skill before operating it. Prefer JSON responses and exact runtime handles.

## Preflight

```text
orca status --json
orca worktree current --json
orca terminal list --json
```

Confirm that the app/host is reachable and ready. A failed preflight is `BLOCKED`; do not silently move the task to another host.

## Create

Use a separate Orca terminal in the active worktree for read-only work. Use an Orca-managed isolated worktree for every concurrent writer. Capture the complete composite worktree ID and the startup terminal handle returned by Orca.

Do not create a second agent terminal when an agent-first worktree creation already returned one. Labels and display names are for humans; the composite worktree ID and terminal handle are authority.

## Send and observe

A send receipt may prove only `input_accepted`. When the installed host supports durable stages, record `turn_started` separately. A timeout while observing the same request does not authorize resending it.

Use bounded terminal waits and cursor-based reads. If provider lifecycle is unsupported, require the task sentinel and poll the rendered terminal in bounded intervals while tracking cursor, output hash, timestamp, and process state.

## Capture

Use terminal cursor reads for long output and retain the next cursor. Record whether the read was limited or truncated. A terminal tail is supporting evidence; inspect files, commits, and test output directly before acceptance.

## Interrupt and close

Use the exact terminal handle. Report a close as successful only when the host confirms the process stopped. Bulk close is allowed only for an exact task worktree whose terminals are all owned by that task.

Before releasing an Orca worktree, confirm:

- expected repository and path;
- intended changes integrated or safely preserved;
- clean or explicitly preserved Git status;
- useful transcript archived;
- timeline finalized.

A stale handle, unreachable host, or identity mismatch preserves the worktree and reports `UNKNOWN`.

## Performance posture

Orca is currently a convenient rich host, but responsiveness and resource use are implementation characteristics, not architectural dependencies. SS-WD may route lighter work to Herdr or plain shells and may later use a first-party lightweight runtime without changing worker contracts.
