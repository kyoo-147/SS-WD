# Worker launch policy

## Runtime-neutral execution

All delegated workers run as independent inspectable command-line processes through an explicit runtime adapter. Orca, Herdr, PowerShell, CMD, and future hosts are replaceable execution surfaces.

- Read-only or lightweight work may use a separate visible endpoint in the active workspace.
- Every concurrent writer receives an isolated Git worktree.
- One writer owns each file or package collision boundary.
- Worker harness/model selection is separate from runtime selection.
- The Chief owns review, integration, executable verification, and cleanup.
- External runtimes and worker products remain independently installed dependencies.
- A failed runtime preflight is reported; it never triggers silent fallback.

Read `.ai/skills/runtime-adapters.md`, `docs/RUNTIME-ADAPTERS.md`, and the selected platform guide before operating a host.

## Paid-provider quota gate

Quality-first routing is mandatory for each new worker turn:

1. Open a real Command Code TTY and run `/usage`.
2. Open a real Antigravity TTY and run `/usage` before declaring paid Tier 1 unavailable.
3. Inspect every displayed window and the quota group for the intended model. A nonzero weekly balance can still be blocked by a shorter window, and one Antigravity model group can be exhausted while another is available.
4. Use the smallest capable paid model in the first available provider: Command Code DeepSeek first, then Antigravity.
5. Enter Navin or agent-native free tiers only after both paid providers are currently blocked by quota, authentication, capacity, or model availability.

Quota checks are interactive slash commands, not `cmdc --usage` or `agy --usage` shell flags. When Git Bash sends the slash command through Orca, set `MSYS_NO_PATHCONV=1` so `/usage` is not rewritten as a Windows path.

Refresh both checks after several tasks, after a meaningful elapsed interval, and after reported reset windows. Record the checked provider, model quota group, remaining/reset window, selected model, and fallback reason in private operational evidence. Never put account identifiers or quota balances in public tracked files.

Do not enable Command Code `/extra`, upgrade an account, or incur pay-as-you-go charges without explicit Founder approval. Code, test, tool, workspace, policy, or runtime failures are not quota failures and never authorize model fallback.

## Exact unrestricted worker invocations

When a project or Founder instruction restricts workers to Command Code and Antigravity, use these literal commands:

```text
cmdc --yolo
agy --dangerously-skip-permissions
```

Do not describe one provider as another. Do not silently substitute a different provider when quota or authentication fails. Record the blocker and use only an explicitly allowed fallback.

A host send receipt proves only the stages it names. Record input acceptance, submission, turn start, terminal worker state, and Chief acceptance separately. When lifecycle support is insufficient, inspect the endpoint, poll in bounded intervals, and require a unique completion sentinel.

## Visibility policy

Prefer a visible interactive TUI when Founder inspection or follow-up matters. Headless `-p` output may be buffered and leave a visible terminal blank until completion; use it only as a disclosed unattended fallback. When print mode is used, prove activity with revalidated process state, worktree/file changes, logs, and a completion sentinel rather than silence or an `input_accepted` receipt.

## Task contract

Every assignment contains:

- objective and user-visible outcome;
- relevant context and authoritative documents;
- exact ownership scope and exclusions;
- safety and privacy constraints;
- expected artifacts and evidence;
- definition of done;
- completion sentinel when lifecycle support is insufficient.

## Worker count

Use the smallest number that materially improves delivery. Default to one to three. A project profile may authorize up to five substantial independent lanes when the workstation remains responsive and path ownership does not collide.

## Runtime records

For each worker, record:

- runtime adapter and verified version/capabilities;
- exact endpoint and workspace/worktree identities;
- worker CLI/model and launch command;
- acceptance and turn-start evidence;
- latest cursor/hash/timestamp or lifecycle event;
- terminal outcome and independent verification;
- archive and cleanup disposition.

## Completion and cleanup

Worker completion text is not acceptance evidence. Inspect the diff, tests, runtime, security/privacy boundary, and Git status. After safe integration or preservation, finalize `.pi/worker-workspace-timeline.md`, archive useful output, and remove only exact completed clean state owned by the task. Preserve dirty, active-main, unreadable, or ambiguous work.
