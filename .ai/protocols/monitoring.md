# Worker monitoring protocol

The Chief actively observes delegated work through the selected runtime adapter. A long blocking wait is not sufficient, and no single host is assumed.

## Signal hierarchy

Use the strongest available signal in this order:

1. authenticated lifecycle messages or events such as turn start, blocked, worker done, question, or escalation;
2. native agent state corroborated by process identity where recovery or cleanup depends on it;
3. a unique completion sentinel required by the worker prompt;
4. wrapper-owned result file and exit code;
5. endpoint output cursor/hash, timestamps, and revalidated process state;
6. direct inspection or one narrow follow-up question.

Events shorten latency; polling remains the fallback. Native `idle` or `done` never proves artifact correctness.

## Delivery stages

Track these separately:

- `accepted`: host accepted the input;
- `submitted`: submit/Enter was delivered;
- `turn_started`: processing was observed;
- `working`: ongoing lifecycle or output/process evidence;
- `blocked`: worker is waiting for input or permission;
- `terminal`: worker reported or wrapper recorded an outcome;
- `accepted_by_chief`: artifacts passed independent review and verification.

Never resend an accepted prompt only because `turn_started` is delayed. Inspect the endpoint first.

## Completion sentinel

Every assignment on a runtime without reliable lifecycle completion ends with:

`WORKER_DONE:<role>:<task-id>:<outcome>`

Allowed outcomes are `SUCCEEDED`, `BLOCKED`, and `FAILED`. The marker reports worker state only. The Chief still verifies the result.

## Polling

- Prefer cursor-based incremental reads; otherwise track bounded output hashes and timestamps.
- Poll every 5 to 15 seconds for short work and every 30 to 60 seconds for long work.
- Revalidate endpoint/process identity before acting on a PID, handle, or pane.
- Poll several active workers as one batch when the host supports it.
- Never issue one long blind wait when lifecycle support is absent.
- A blank terminal running buffered print mode is not evidence of inactivity. Confirm the launch mode, revalidate the process, and inspect worktree/file/log changes before intervening.
- Record truncation and capture source; a terminal tail may omit the decisive result.

## Stall handling

A timeout is a checkpoint, not proof of failure.

1. Continue observing if lifecycle, output, process, or worktree evidence is changing.
2. Inspect the endpoint and runtime metadata after the soft-stall threshold.
3. Send one narrow status request if state remains unclear; do not resend the original task.
4. Resolve or escalate a reported blocker.
5. Mark the result `UNKNOWN` when the process disappears without a valid terminal record.

Never infer success, failure, process death, or safe replacement from silence alone.

## Runtime-specific routing

- **Herdr:** prefer exact pane/agent IDs, native state/events, and process corroboration; use bounded polling fallback.
- **Orca:** use exact terminal/worktree handles, durable send stages when available, and cursor reads.
- **PowerShell/CMD:** use wrapper-owned PID plus start time, redirected logs, result file, exit code, and sentinel.

Read the relevant guide under `docs/platforms/` before operating the host.

## Verification and retention

After terminal worker state:

1. read final output;
2. inspect actual files, diffs, tests, builds, runtime behavior, or artifacts;
3. record residual risks and acceptance result;
4. finalize `.pi/worker-workspace-timeline.md`;
5. archive useful output;
6. inspect Git status and confirm integration or safe preservation;
7. remove only exact completed clean state owned by the task.

Never force cleanup to make the runtime look tidy. If identity, preservation, integration, or close confirmation is uncertain, record `PRESERVED_DIRTY` or `UNKNOWN` and escalate.
