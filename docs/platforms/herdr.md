# Herdr adapter guide

Herdr is an optional runtime host with stable workspace/tab/pane IDs, native agent state, and event-capable observation. It is not required by SS-WD.

The installed binary is the syntax authority. Read `herdr --skill` and relevant `--help` output before operating it. Do not copy commands from a different Herdr version without verification.

## Preflight

```powershell
herdr --version
herdr status --json
herdr session list --json
```

Record client version, protocol, selected named session, server compatibility, and whether the caller is inside Herdr. Use an explicit named session for automation and tests. Never aim destructive lab work at the default session.

When the operator is already in a Herdr pane, use the injected exact IDs (`HERDR_SESSION`, `HERDR_WORKSPACE_ID`, `HERDR_TAB_ID`, `HERDR_PANE_ID`) rather than mutable labels or global focus.

## Create

Use a background pane or tab with `--no-focus`. Parse workspace, tab, and pane IDs from JSON creation responses; do not derive them from labels or ordering. Writers still require an isolated Git worktree and the pane must start in that exact path.

For a recognized agent, prefer Herdr's agent surface. For an ordinary process, use the pane surface. Record both the runtime endpoint and Git worktree identity in the private timeline.

## Send and observe

For agents, prefer the atomic agent prompt operation supported by the installed version. Record input acceptance separately from the observed lifecycle transition.

Strongest signals:

1. native agent lifecycle event;
2. native state such as working, blocked, done, idle, or unknown;
3. completion sentinel in captured output;
4. pane process identity and output movement.

`idle` or `done` means the endpoint settled; it does not verify the requested artifact. `unknown` remains unknown. Push events shorten latency, but bounded polling is the permanent fallback when subscription or protocol support is absent.

For raw commands, use an atomic pane run where supported, wait for a task-specific output marker, then capture recent unwrapped output. Never use a generic shell prompt as the only completion proof.

## Capture

Use explicit pane or agent identity and a bounded source:

- visible viewport for UI/composer inspection;
- recent unwrapped output for command logs;
- native agent read for agent responses.

Record truncation and cursor/timestamp evidence. Alternate-screen agent output may not remain in host scrollback; request a durable report file when terminal capture cannot prove completeness.

## Interrupt and close

Use Herdr's agent control for agent interrupts and pane control only for intentionally raw terminal actions. Report whether cancellation was confirmed.

Close only the exact pane created for the task. Re-read its workspace/tab relationship and Git state first. A label match never grants cleanup authority. Do not run ambient `herdr server stop` for verification.

## Isolated verification

A Herdr smoke test must use a fresh non-default named session, preserve the default session, and delete only the exact lab session it created. If the current operator context cannot prove that isolation, mark the live test `BLOCKED` and run no destructive command.

Minimum smoke sequence:

1. snapshot default-session state;
2. create a unique named lab session;
3. create an endpoint in a disposable directory;
4. run a command that emits a unique marker and exit code;
5. wait and capture the marker;
6. verify process/endpoint state;
7. close the exact endpoint;
8. delete the exact lab session;
9. prove default-session state is unchanged.

## Known boundaries

- Lifecycle state is evidence of process/agent state, not artifact correctness.
- A stale registration may outlive its agent; corroborate recovery decisions with process evidence.
- Mutable labels are presentation only.
- An unreadable endpoint never authorizes replacement or cleanup.
- Current SS-WD guidance is a control contract, not a bundled Herdr adapter implementation.

The multi-backend separation and conservative recovery approach were informed by Firstmate's public Herdr backend documentation. SS-WD remains independent and does not vendor Firstmate or Herdr code.
