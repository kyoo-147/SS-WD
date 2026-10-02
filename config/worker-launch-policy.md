# Worker launch policy

## Visible external workers

All delegated workers run as independent visible command-line processes. Do not replace visible workers with hidden internal subagents unless the Founder explicitly requests that exception.

- Read-only or lightweight work may use a separate terminal in the active workspace
- Every concurrent writer receives an isolated Git worktree
- One writer owns each file or package collision boundary
- The Chief owns review, integration, executable verification, and cleanup
- External runtimes and worker products remain independently installed dependencies

## Exact unrestricted worker invocations

When a project or Founder instruction restricts workers to Command Code and Antigravity, use these literal commands:

```text
cmdc --yolo
agy --dangerously-skip-permissions
```

Do not describe one provider as another. Do not silently substitute a different provider when quota or authentication fails. Record the blocker and use only an explicitly allowed fallback.

Some hosts cannot report lifecycle state for these command-line interfaces. A successful send receipt proves only input acceptance. Inspect the rendered screen to confirm prompt delivery and progress. Use bounded polling and a unique completion sentinel for substantial tasks.

## Task contract

Every assignment contains:

- objective and user-visible outcome
- relevant context and authoritative documents
- exact ownership scope and exclusions
- safety and privacy constraints
- expected artifacts and evidence
- definition of done
- completion sentinel when provider lifecycle is unsupported

## Worker count

Use the smallest number that materially improves delivery. Default to one to three. A project profile may authorize up to five substantial independent lanes when the workstation remains responsive and path ownership does not collide.

## Completion and cleanup

Worker completion text is not acceptance evidence. Inspect the diff, tests, runtime, security and privacy boundary, and Git status. After safe integration or preservation, finalize `.pi/worker-workspace-timeline.md`, archive useful output, and remove completed clean workspace and terminal state. Preserve dirty or ambiguous work.
