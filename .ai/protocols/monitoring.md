# Worker monitoring protocol

The Chief must actively observe delegated work. A long blocking wait is not sufficient.

## Signal hierarchy

Use the strongest available signal in this order:

1. Supervised lifecycle messages such as `worker_done`, questions, or escalations
2. Provider-backed turn state or supported idle detection
3. A unique completion sentinel required by the worker prompt
4. Rendered terminal output, cursor growth, and output timestamps
5. Direct inspection or a narrow follow-up question

If a send receipt reports an unsupported provider, do not rely on idle detection as the only completion mechanism.

## Completion sentinel

Every unsupported-provider assignment must end with a unique line:

`WORKER_DONE:<role>:<task-id>:<outcome>`

Allowed outcomes are `SUCCEEDED`, `BLOCKED`, and `FAILED`. The marker reports worker state only. The Chief must still verify the claimed result.

## Polling

- Read the rendered screen because interactive terminal interfaces can repaint output
- Poll active unsupported-provider workers every 5 to 15 seconds for short work and every 30 to 60 seconds for long work
- Track the latest cursor, output timestamp, output hash, current phase, and expected sentinel
- Never issue one long blind wait when a provider lacks lifecycle support
- Poll several active workers as one batch when the host supports batch reads

## Stall handling

A timeout is a checkpoint, not proof of failure.

1. Continue observing if output is changing
2. Inspect the rendered screen and terminal metadata after the soft-stall threshold
3. Send one narrow status request if state remains unclear; do not resend the original task
4. Resolve or escalate a reported blocker
5. Preserve the transcript and mark the outcome `UNKNOWN` when a process exits without a valid result

Never infer success, failure, or process death from silence alone.

## Verification and retention

After detecting completion:

1. Read the final worker output
2. Inspect actual files, diffs, tests, builds, runtime behavior, or artifacts as relevant
3. Record the result and residual risks
4. Finalize the entry in `.pi/worker-workspace-timeline.md`
5. Archive useful terminal output under `.pi/worker-session-archive/` when available
6. Inspect Git status and confirm intended work is integrated or otherwise safely preserved
7. Remove completed clean terminals and worktrees while preserving dirty, ambiguous, active-main, or in-progress work

Never force cleanup to make the workspace list look clean. If preservation or integration is uncertain, record `PRESERVED_DIRTY` or `UNKNOWN` and escalate.
