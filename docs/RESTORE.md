# Restore and update guide

This guide restores SS-WD’s first-party operating rules and sanitized configuration references. It does not install or redistribute external agent products.

## 1. Install prerequisites

Install Git, Node.js, PowerShell, and the worker command-line interfaces approved for your environment. Obtain every external tool from its official distribution channel.

Verify the commands you plan to use:

```powershell
git --version
node --version
pi --version
cmdc --version
agy --version
```

A missing optional worker does not justify silently routing to a different provider. Update `.ai/skills/worker-capabilities.md` with a verified status before dispatch.

## 2. Restore settings deliberately

`snapshots/pi-settings.sanitized.json` is a reference, not an automatic overwrite. Compare each field with the current Pi version and machine:

- choose provider, model, and thinking settings deliberately
- install only reviewed package versions
- resolve shell paths on the current host
- authenticate interactively
- never restore an old `auth.json`, token, cookie, or trust database

The generic worker profiles under `templates/pi-agents/` avoid project-specific paths. Copy and customize them only when Pi’s external-agent mechanism is required.

## 3. Initialize private worker records

Create the ignored local operations directory and copy the timeline template:

```powershell
New-Item -ItemType Directory -Force .pi | Out-Null
Copy-Item templates/worker-workspace-timeline.md .pi/worker-workspace-timeline.md
New-Item -ItemType Directory -Force .pi/worker-session-archive | Out-Null
```

Do not commit populated timelines, transcripts, or generated evidence.

## 4. Refresh the safe inventory

Run the snapshot script after intentional changes to local settings, profiles, or approved capabilities:

```powershell
node ./scripts/snapshot-agent-setup.mjs
```

The snapshot records sanitized metadata and hashes. It does not copy third-party skill implementations, binaries, private runtime state, or authentication material.

## 5. Verify before publishing

Run the public-safety check and inspect the complete diff:

```powershell
node ./scripts/verify-public-snapshot.mjs
git diff --check
git status --short
git diff --cached
```

A passing pattern scan is not proof that content is safe. Manually inspect every staged file.

## 6. Follow the worker lifecycle

1. Create one bounded task per worker
2. Use a shared workspace only for read-only or lightweight work
3. Use an isolated Git worktree for every concurrent writer
4. Record creation and state changes in `.pi/worker-workspace-timeline.md`
5. Monitor unsupported providers through rendered screen reads and bounded polling
6. Review and verify actual artifacts; worker prose is not acceptance evidence
7. Archive useful output under `.pi/worker-session-archive/` before cleanup
8. Finalize the timeline and inspect Git status
9. Remove only completed clean workspaces and terminals

Preserve dirty, ambiguous, active-main, and in-progress work.
