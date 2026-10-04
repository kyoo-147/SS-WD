<div align="center">

# Sky Striker Work Deck

**One deck for assigning work, watching it move, and checking what comes back.**

[![Release](https://img.shields.io/github/v/tag/kyoo-147/SS-WD?label=Release&style=flat-square)](https://github.com/kyoo-147/SS-WD/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-f1f5f9?style=flat-square)](LICENSE)
[![Security](https://img.shields.io/badge/Security-Policy-334155?style=flat-square)](SECURITY.md)
[![Contributing](https://img.shields.io/badge/Contributing-Guide-334155?style=flat-square)](CONTRIBUTING.md)

[Start here](#start-here) · [How the deck works](#how-the-deck-works) · [Runtime guides](docs/RUNTIME-ADAPTERS.md) · [Agent routing](docs/CODING-AGENT-ROUTING.md) · [Restore](docs/RESTORE.md)

</div>

**Sky Striker Work Deck**, or **SS-WD**, is the working deck used by a Founder and Chief of Staff to run software work through independent command-line workers. It keeps the brief, task boundaries, worker instructions, review rules, and cleanup discipline in one place.

The deck is not tied to one app. It can work through Orca, Herdr, PowerShell, CMD, or another terminal host. Those tools provide the workspace; SS-WD keeps the way work is assigned and checked consistent.

> The public website is planned for `skystriker.navinresearch.com`. The domain is not live yet, so this README remains the current project home.

## Why this exists

Running one coding worker takes little coordination. Running several at once creates the real problems: two workers edit the same file, a terminal goes quiet, a “done” message arrives without proof, or an old worktree gets removed before its changes are safe.

Sky Striker Work Deck gives that work a consistent shape:

- one clear brief for each task;
- one owner for each area being changed;
- a separate worktree for every concurrent writer;
- visible progress and explicit blockers;
- review of the actual diff and test results;
- cleanup only after the work is integrated or safely preserved.

The Founder sets direction, constraints, and taste. The Chief of Staff turns that direction into bounded work, follows each worker, checks what comes back, and raises only decisions that matter.

## How the deck works

```text
DIRECTION
  -> RESEARCH
  -> BREAK DOWN THE WORK
  -> ASSIGN
  -> OPEN A WORKSPACE
  -> WATCH PROGRESS
  -> REVIEW
  -> INTEGRATE
  -> VERIFY
  -> ARCHIVE
  -> CLEAN UP
  -> REPORT
```

A worker and the place it runs are separate choices:

- **Worker:** the command-line tool and model doing the task.
- **Runtime:** the terminal or workspace host showing and controlling that task.

That separation matters. Orca is useful today, Herdr can provide lighter native terminal control, and plain PowerShell or CMD remains a valid fallback. A smaller Navin Research runtime can be built later without rewriting the whole working method.

### Runtime choices

| Runtime | Best fit today | How progress is read |
| --- | --- | --- |
| Herdr | Lightweight visible terminal work with native pane state | Pane state and events, with polling as a fallback |
| Orca | Managed worktrees and rich terminal workflows | Terminal handles, send receipts, cursor reads, and host state |
| PowerShell | Portable Windows process runner | Process identity, exit code, logs, result file, and completion marker |
| CMD | Minimal Windows fallback | Wrapper-owned PID, logs, exit code, and completion marker |
| SS-WD runtime | Later | Will follow the same task and evidence rules |

Detailed guides:

- [`docs/RUNTIME-ADAPTERS.md`](docs/RUNTIME-ADAPTERS.md)
- [`docs/platforms/herdr.md`](docs/platforms/herdr.md)
- [`docs/platforms/orca.md`](docs/platforms/orca.md)
- [`docs/platforms/shell.md`](docs/platforms/shell.md)

The multi-runtime design was informed by [Firstmate](https://github.com/kunchenguid/firstmate), especially its separation of worker tasks, worktrees, terminal backends, and tool-specific behavior. SS-WD does not copy or bundle Firstmate.

## What is in this repository

### Working rules

- the Founder and Chief of Staff relationship;
- research, execution, review, monitoring, and reporting rules;
- worker and model routing notes;
- runtime-specific operating guides;
- private worker-history and cleanup conventions.

### Safe setup references

- reviewed Pi settings with private values removed;
- approved generic worker-profile hashes;
- selected tool versions;
- templates for workers, reviewers, and the private timeline;
- restore instructions for a new machine.

### Public safety checks

- exact checks of files already staged in Git;
- checks of tracked and untracked public candidates;
- allowlisted snapshot fields and profile names;
- detection for common credentials, private keys, machine paths, and binary files;
- regression tests for known failure cases.

## Start here

### Requirements

Use only the tools needed for your setup:

- Git;
- Node.js 24 or newer;
- at least one supported command-line worker;
- optionally Orca or Herdr;
- optionally PowerShell on Windows.

Check what is installed:

```powershell
git --version
node --version
pi --version
cmdc --version
agy --version
herdr --version
orca --version
```

A missing tool is reported as a blocker. SS-WD does not quietly swap in another provider or runtime.

### Read the project in this order

1. [`AGENTS.md`](AGENTS.md)
2. [`.ai/identity.md`](.ai/identity.md)
3. [`.ai/working-style.md`](.ai/working-style.md)
4. [`.ai/projects/index.md`](.ai/projects/index.md)
5. only the project, protocol, skill, and runtime guide needed for the current task

### Set up the private work log

```powershell
New-Item -ItemType Directory -Force .pi | Out-Null
Copy-Item templates/worker-workspace-timeline.md .pi/worker-workspace-timeline.md
New-Item -ItemType Directory -Force .pi/worker-session-archive | Out-Null
```

The populated timeline and worker output stay local. They must not be committed.

### Run the checks

No dependency installation is required.

```powershell
npm test
npm run check
```

## Running workers

Each assignment should state:

- what outcome is wanted;
- what the worker owns;
- what it must not touch;
- what evidence it must return;
- what “done” means.

For every worker:

1. Check that the selected runtime is available.
2. Create a visible endpoint.
3. Give concurrent writers separate Git worktrees.
4. Record the exact workspace and endpoint identities.
5. Distinguish accepted input from work that actually started.
6. Follow progress with runtime events or bounded polling.
7. Inspect the files, diff, tests, build, or running result yourself.
8. Archive useful output and remove only clean state owned by that task.

When Command Code or Antigravity is explicitly required, keep these exact launch commands:

```text
cmdc --yolo
agy --dangerously-skip-permissions
```

For runtimes without reliable completion events, require a final marker:

```text
WORKER_DONE:<role>:<task-id>:SUCCEEDED|BLOCKED|FAILED
```

The marker tells the Chief what the worker believes happened. It does not replace review.

## Public snapshot

The snapshot manifest is [`config/snapshot-policy.json`](config/snapshot-policy.json). Only fields and profile names listed there are eligible for export.

```powershell
npm run snapshot
npm run check
git diff --check
git status --short
git diff --cached
```

The verifier reads the exact blobs staged in Git as well as working-tree candidates. A passing scan still needs a human diff review.

Read [`docs/PUBLIC-SNAPSHOT-BOUNDARY.md`](docs/PUBLIC-SNAPSHOT-BOUNDARY.md) before adding anything to the snapshot.

## Repository map

```text
.
├── .ai/                         # Project rules, protocols, and working skills
├── .github/workflows/           # Repository checks
├── config/                      # Worker launch and snapshot policy
├── docs/                        # Runtime, restore, and public-boundary guides
├── scripts/                     # Snapshot and verification scripts
├── snapshots/                   # Reviewed public metadata
├── templates/                   # Worker, reviewer, and timeline templates
├── tests/                       # Regression tests
├── AGENTS.md                    # Entry point for agents working in this repo
├── CONTRIBUTING.md              # Contribution guide
├── SECURITY.md                  # Security and private reporting policy
└── LICENSE                      # MIT license
```

## Current state

Available now:

- the Founder and Chief of Staff working contract;
- worker assignment, monitoring, review, and cleanup rules;
- Orca, Herdr, PowerShell, and CMD guidance;
- allowlisted public snapshots;
- staged-file safety verification;
- regression tests and repository checks.

Planned:

- executable compatibility tests for more runtimes;
- clearer machine-readable runtime capabilities;
- signed release files;
- measured worker-routing updates;
- a lightweight Navin Research runtime for the same deck.

Planned work is direction, not a claim that it already ships.

## Contributing

Read [`CONTRIBUTING.md`](CONTRIBUTING.md). Keep changes focused, preserve the public/private boundary, and include the commands used to verify the work.

## Security

Read [`SECURITY.md`](SECURITY.md). Use GitHub Private Vulnerability Reporting for credentials, snapshot bypasses, or unsafe process-control findings.

## License

MIT. See [`LICENSE`](LICENSE).
