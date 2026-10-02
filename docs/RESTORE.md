# Restore and update guide

This guide restores SS-WD's first-party operating rules and sanitized configuration references. It does not install or redistribute external agent products or runtime hosts.

## 1. Install the minimum prerequisites

Install Git, Node.js 24 or newer, and only the worker/runtime CLIs required by your environment. Obtain every external tool from its official distribution channel.

```powershell
git --version
node --version
pi --version
cmdc --version
agy --version
herdr --version
orca --version
```

A missing optional worker or runtime does not justify silent substitution. Update the relevant capability record only after live verification.

## 2. Choose worker and runtime separately

Read:

1. `.ai/skills/worker-capabilities.md` for harness/model routing;
2. `.ai/skills/runtime-adapters.md` for host routing;
3. `docs/RUNTIME-ADAPTERS.md`;
4. one selected guide under `docs/platforms/`.

The same task contract may run through Orca, Herdr, PowerShell, CMD, or a future SS-WD runtime. Record the exact combination and its verified lifecycle signals.

## 3. Restore settings deliberately

`snapshots/pi-settings.sanitized.json` is a reference, not an automatic overwrite. Compare each field with the current Pi version and machine:

- choose provider, model, and thinking settings deliberately;
- install only reviewed package versions;
- resolve shell paths on the current host;
- authenticate interactively;
- never restore an old authentication, token, cookie, or trust store.

The generic worker profiles under `templates/pi-agents/` contain placeholders. Copy and customize them only when the target agent mechanism requires it.

## 4. Initialize private worker records

```powershell
New-Item -ItemType Directory -Force .pi | Out-Null
Copy-Item templates/worker-workspace-timeline.md .pi/worker-workspace-timeline.md
New-Item -ItemType Directory -Force .pi/worker-session-archive | Out-Null
```

Do not commit populated timelines, transcripts, runtime handles, or generated evidence.

## 5. Refresh the safe inventory

Review `config/snapshot-policy.json`, then run:

```powershell
npm run snapshot
```

The script records only allowlisted settings, approved agent-profile metadata, and selected tool versions. It does not inventory installed skills or copy third-party implementations.

## 6. Verify before publishing

```powershell
npm run check
git diff --check
git status --short
git diff --cached
```

The verifier scans both staged Git blobs and working-tree candidates. A passing scan is not proof that arbitrary content is safe; manually inspect every staged file.

## 7. Follow the worker lifecycle

1. Create one bounded task per worker.
2. Preflight the selected runtime.
3. Use a shared workspace only for read-only or lightweight work.
4. Use an isolated Git worktree for every concurrent writer.
5. Record runtime, endpoint/workspace, worker, and delivery identities.
6. Separate input acceptance, turn start, blocked state, worker completion, and Chief acceptance.
7. Monitor through lifecycle events or bounded polling and sentinel fallback.
8. Review and verify actual artifacts.
9. Archive useful output before cleanup.
10. Remove only exact completed clean state owned by the task.

Preserve dirty, ambiguous, unreadable, active-main, and in-progress work.
