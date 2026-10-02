<div align="center">

# SS-WD

[![Release](https://img.shields.io/github/v/tag/kyoo-147/SS-WD?label=Release&style=flat-square)](https://github.com/kyoo-147/SS-WD/tags)
[![Snapshot](https://img.shields.io/badge/Public%20snapshot-verified-166534?style=flat-square)](docs/PUBLIC-SNAPSHOT-BOUNDARY.md)

**A portable operating system for supervised agent work**

Turn product intent into bounded agent tasks, visible execution, reviewed evidence, and safely integrated results.

[Get started](#get-started) · [How it works](#how-ss-wd-works) · [Worker operations](#operate-workers) · [Restore guide](docs/RESTORE.md)

</div>

SS-WD stores the operating system for a technical Chief of Staff and its delegated artificial intelligence (AI) workforce. It defines how the Chief interprets intent, decomposes work, selects workers, supervises isolated terminals and worktrees, verifies results, and reports decisions to the Founder.

The repository also preserves a public-safe snapshot of the surrounding agent setup. It includes first-party operating rules, sanitized configuration references, generic worker profiles, capability inventories, restore guidance, and pre-publish safety checks.

> **Project status:** SS-WD `v1.0.1` is a first-party operations toolkit. It does not vendor third-party agent runtimes, skill implementations, product documentation, binaries, or branding. Private credentials, memories, sessions, transcripts, machine paths, and provider account state remain outside Git.

## What SS-WD is

SS-WD is source-controlled operational infrastructure for AI-assisted software work. It gives the Founder and Chief a shared contract for:

- translating informal direction into executable outcomes
- assigning bounded work to visible independent agents
- isolating concurrent writers in separate Git worktrees
- matching task risk and ambiguity to worker capability
- monitoring providers that do not expose reliable lifecycle events
- reviewing code, diffs, tests, builds, runtime behavior, and artifacts
- preserving an append-only worker history outside public Git
- cleaning completed workspaces without discarding uncertain work
- restoring reviewed configuration without copying secrets

SS-WD is not an agent runtime or a bundle of third-party products. External tools remain independently installed dependencies. The Chief remains responsible for coordination, technical judgment, integration, and acceptance.

## Why SS-WD exists

AI workers can produce useful code quickly, but speed without ownership creates new failure modes. Tasks overlap, terminals stall, workers report success without evidence, worktrees accumulate, and private machine state leaks into repositories.

SS-WD addresses those failures with explicit operating boundaries:

- **Visible execution:** delegated workers run in inspectable terminals
- **Exclusive ownership:** each concurrent writer owns a separate file or package boundary
- **Evidence-led acceptance:** worker completion text never replaces executable verification
- **Bounded authority:** workers receive the context and permissions required for one task
- **Truthful reporting:** unresolved work remains `UNKNOWN`, `BLOCKED`, or `UNVERIFIED`
- **Safe cleanup:** completed clean workspaces are archived and removed; dirty or ambiguous work is preserved
- **Public-safe recovery:** Git stores portable rules and metadata, not workstation credentials or private history

## Core capabilities

The current repository contains an operating toolkit rather than an application runtime.

### Chief of Staff system

- **Identity contract:** defines the Founder and Chief relationship, decision boundaries, and escalation rules
- **Execution protocol:** turns goals into research, plans, delegated tasks, integration, and verification
- **Review protocol:** checks assumptions, regressions, security, duplication, and scope
- **Monitoring protocol:** supervises lifecycle-aware and unsupported terminal providers
- **Reporting protocol:** separates completed work, evidence, blockers, and next actions
- **Project context index:** loads only the durable context relevant to the active repository

### Worker orchestration policy

- **Visible workers:** keeps every delegated command-line process available for inspection
- **Worktree isolation:** separates concurrent code writers by collision boundary
- **Sentinel monitoring:** handles workers whose host cannot report provider lifecycle
- **Worker ledger:** records creation, state changes, commits, evidence, archives, and cleanup disposition
- **Safe teardown:** removes only completed work that has been integrated or safely preserved
- **No silent fallback:** reports provider failures instead of substituting an unauthorized worker

### Portable configuration

- **Sanitized settings:** records reviewed preferences without authentication material
- **Capability inventory:** records portable metadata and content hashes without vendoring implementations
- **Worker templates:** supplies generic worker and reviewer profiles
- **Runtime inventory:** records selected command-line tool versions used to create the snapshot
- **Refresh script:** regenerates sanitized local inventories after intentional setup changes

### Public safety

- **Default exclusions:** ignores credentials, databases, logs, sessions, memories, transcripts, evidence, and local dependencies
- **Snapshot verifier:** scans tracked and untracked public candidates for forbidden files, secret patterns, and machine-local paths
- **Explicit boundary:** documents what belongs in Git and what must remain private
- **First-party source rule:** excludes third-party source code, product manuals, binaries, and branded assets

## How SS-WD works

SS-WD organizes agent work around one supervised lifecycle:

```text
INTENT
  -> RESEARCH
  -> DECOMPOSE
  -> ASSIGN
  -> TRACK
  -> MONITOR
  -> REVIEW
  -> INTEGRATE
  -> VERIFY
  -> ARCHIVE
  -> CLEAN
  -> REPORT
```

The Founder defines direction, constraints, taste, and consequential decisions. The Chief converts that direction into bounded work, selects workers, resolves dependencies, verifies results, and reports the outcome. Workers execute scoped tasks but do not become hidden authorities.

### Operating principles

- **Research before invention:** inspect repository evidence and official interfaces before creating new systems
- **Minimum adequate architecture:** build the smallest structure that reliably supports the product outcome
- **Selective delegation:** use workers only when parallelism or specialist context improves delivery
- **One writer per boundary:** prevent concurrent mutation of the same package, schema, migration, or component
- **Verification before integration:** inspect artifacts and run relevant checks before accepting worker output
- **No silent fallback:** report authentication, quota, or provider failures instead of substituting an unauthorized worker
- **Progressive context:** load only the project, skill, and protocol files required for the current task

## Get started

### Prerequisites

Install the tools required by your workflow:

- Git
- Node.js
- PowerShell
- one or more supported worker command-line interfaces
- a terminal or workspace host that keeps delegated processes visible

Verify the local commands you intend to use. The current reference configuration recognizes Pi, Command Code, and Antigravity:

```powershell
git --version
node --version
pi --version
cmdc --version
agy --version
```

Install and authenticate external tools through their official distribution channels. SS-WD does not redistribute them. Missing optional workers must not trigger an undocumented provider substitution.

### Initialize private worker tracking

Copy the timeline template into the ignored local operations directory:

```powershell
New-Item -ItemType Directory -Force .pi | Out-Null
Copy-Item templates/worker-workspace-timeline.md .pi/worker-workspace-timeline.md
New-Item -ItemType Directory -Force .pi/worker-session-archive | Out-Null
```

Never commit the populated timeline or transcript archive.

### Load the operating contract

Agents read the source of truth progressively:

1. [`AGENTS.md`](AGENTS.md)
2. [`.ai/identity.md`](.ai/identity.md)
3. [`.ai/working-style.md`](.ai/working-style.md)
4. [`.ai/projects/index.md`](.ai/projects/index.md)
5. task-relevant protocols, skills, and project context

This order keeps durable policy available without flooding every task with unrelated context.

## Operate workers

Create shared-workspace terminals for read-only or lightweight tasks. Give every concurrent writer an isolated Git worktree. Record the workspace, branch, worker, terminal handle, task, and lifecycle state in `.pi/worker-workspace-timeline.md`.

When a project restricts workers to Command Code and Antigravity, use these literal invocations:

```text
cmdc --yolo
agy --dangerously-skip-permissions
```

A successful send receipt proves input acceptance, not prompt delivery. Inspect the rendered terminal, poll in bounded intervals, and require a unique completion sentinel when the host reports provider lifecycle as unsupported.

After a worker reports completion:

1. Read its final output
2. Inspect the actual files and Git diff
3. Run the relevant tests, build, runtime, browser, or service checks
4. Confirm that intended work is integrated or safely preserved
5. Archive useful output under `.pi/worker-session-archive/`
6. Finalize the timeline entry
7. Inspect workspace Git status
8. Remove only completed clean terminals and worktrees

Preserve active, dirty, ambiguous, or unintegrated work. Never force cleanup to make the workspace list look tidy.

## Refresh the public snapshot

Refresh sanitized metadata after an intentional tool, profile, or configuration change:

```powershell
node ./scripts/snapshot-agent-setup.mjs
node ./scripts/verify-public-snapshot.mjs
```

`snapshot-agent-setup.mjs` records approved metadata and hashes. It does not copy external skill implementations, binaries, provider state, or private histories.

Before publishing any refresh, inspect the complete diff:

```powershell
node ./scripts/verify-public-snapshot.mjs
git diff --check
git status --short
git diff --cached
```

A passing pattern scan does not prove that a snapshot is safe. Human review remains required.

## Repository layout

```text
.
├── .ai/                         # Chief identity, project context, skills, and protocols
├── config/                      # Portable worker launch policy
├── docs/                        # Restore and public snapshot boundaries
├── scripts/                     # Snapshot and public-safety verification tools
├── snapshots/                   # Sanitized settings, runtime, and capability metadata
├── templates/                   # Worker profiles and private timeline template
└── AGENTS.md                    # Agent entry point and permanent operating rules
```

## Public snapshot boundary

SS-WD is public. It stores portable behavior and reproducible setup metadata, not a workstation clone.

### Included in Git

- first-party operating rules and protocols
- sanitized configuration references
- approved capability names, hashes, and runtime versions
- generic worker and tracking templates
- scripts that regenerate and verify the snapshot

### Excluded from Git

- third-party source code, product manuals, binaries, and branded assets
- passwords, API keys, authentication files, tokens, cookies, and trust databases
- private memories, rollout summaries, missions, and session databases
- terminal transcripts, populated worker timelines, and generated evidence
- machine-specific paths, hostnames, addresses, production topology, and project data
- model weights, caches, dependencies, and local skill implementations

Read [`docs/PUBLIC-SNAPSHOT-BOUNDARY.md`](docs/PUBLIC-SNAPSHOT-BOUNDARY.md) before expanding snapshot scope. If sensitive material reaches the remote, stop publishing, rotate affected credentials, remove it from reachable history, and verify the cleaned repository.

## Project status and roadmap

### Available in `v1.0.1`

- Chief of Staff identity, working style, review, execution, monitoring, and reporting contracts
- provider-neutral worker launch, monitoring, and cleanup policy
- sanitized settings, runtime versions, and approved capability inventory
- snapshot generation and public-safety verification scripts
- private worker timeline and generic worker templates
- first-party-only repository boundary

### Planned improvements

- automated snapshot drift reports across machines
- additional platform-specific bootstrap guidance
- machine-readable policy validation
- signed release artifacts and integrity manifests
- benchmark-backed worker routing updates

Roadmap entries describe direction. They are not evidence that a capability ships.

## Documentation map

- [`AGENTS.md`](AGENTS.md): permanent operating rules and loading order
- [`.ai/identity.md`](.ai/identity.md): Founder and Chief decision contract
- [`.ai/working-style.md`](.ai/working-style.md): execution philosophy
- [`.ai/skills/orchestration.md`](.ai/skills/orchestration.md): delegation lifecycle
- [`.ai/skills/worker-capabilities.md`](.ai/skills/worker-capabilities.md): worker routing registry
- [`.ai/protocols/monitoring.md`](.ai/protocols/monitoring.md): lifecycle and sentinel monitoring
- [`config/worker-launch-policy.md`](config/worker-launch-policy.md): exact worker launch boundaries
- [`docs/RESTORE.md`](docs/RESTORE.md): restore and update procedure
- [`docs/PUBLIC-SNAPSHOT-BOUNDARY.md`](docs/PUBLIC-SNAPSHOT-BOUNDARY.md): public and private data boundary

## Contributing

Changes must preserve the operating and privacy boundaries:

1. Keep worker execution visible and supervised
2. Keep one writer per mutation boundary
3. Preserve evidence-led acceptance and truthful status labels
4. Do not vendor third-party product code or documentation
5. Keep credentials and operational evidence outside Git
6. Run the snapshot verifier and inspect the complete diff
7. Update version claims when regenerating runtime metadata

Run these checks before publishing:

```powershell
node --check scripts/snapshot-agent-setup.mjs
node --check scripts/verify-public-snapshot.mjs
node scripts/verify-public-snapshot.mjs
git diff --check
```

## License

SS-WD does not currently declare a project-wide license. Public visibility does not grant rights beyond applicable law and explicit file-level terms.
