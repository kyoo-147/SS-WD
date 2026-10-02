<div align="center">

# SS-WD

[![CI](https://github.com/kyoo-147/SS-WD/actions/workflows/ci.yml/badge.svg)](https://github.com/kyoo-147/SS-WD/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/tag/kyoo-147/SS-WD?label=Release&style=flat-square)](https://github.com/kyoo-147/SS-WD/tags)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**A portable operating system for supervised agent work**

Turn product intent into bounded tasks, visible execution, reviewed evidence, and safely integrated results—without binding the workflow to one terminal host or agent provider.

[Get started](#get-started) · [Runtime adapters](#runtime-neutral-by-design) · [Worker operations](#operate-workers) · [Security](SECURITY.md) · [Contributing](CONTRIBUTING.md)

</div>

SS-WD stores the first-party operating contract for a technical Chief of Staff and its delegated AI workforce. It defines how the Chief interprets intent, decomposes work, selects workers, supervises isolated processes and worktrees, verifies results, and reports decisions to the Founder.

> **Project status:** SS-WD `v1.1.0` is an operations toolkit, not an agent runtime. Orca and Herdr are supported host patterns, plain CMD and PowerShell are valid fallback hosts, and a lightweight first-party runtime is planned. External tools remain independently installed dependencies.

## What SS-WD is

SS-WD is source-controlled operational infrastructure for AI-assisted work. It provides a shared contract for:

- translating informal direction into executable outcomes;
- assigning bounded work to visible independent agents;
- isolating concurrent writers in separate Git worktrees;
- matching task risk and ambiguity to worker capability;
- adapting the same lifecycle to Orca, Herdr, CMD, PowerShell, or another host;
- observing progress without confusing input acceptance with task completion;
- reviewing code, diffs, tests, builds, runtime behavior, and artifacts;
- preserving a private append-only worker history;
- cleaning completed workspaces without discarding uncertain work;
- restoring reviewed configuration without copying secrets.

SS-WD is not Orca, Herdr, Firstmate, an agent harness, or a model provider. Those systems can host or inform SS-WD workflows, but none owns the core contract.

## Why SS-WD exists

Parallel agents are useful, but unmanaged parallelism creates predictable failures: tasks overlap, terminals stall, provider receipts are mistaken for completion, worktrees accumulate, and private machine state leaks into public repositories.

SS-WD addresses those failures with explicit boundaries:

- **Visible execution:** every delegated process has an inspectable endpoint.
- **Exclusive ownership:** each concurrent writer owns a separate mutation boundary.
- **Evidence-led acceptance:** worker prose never replaces executable verification.
- **Bounded authority:** workers receive only the context and permissions required for one task.
- **Truthful status:** unresolved work remains `UNKNOWN`, `BLOCKED`, or `UNVERIFIED`.
- **Safe cleanup:** dirty, active, ambiguous, or unintegrated work is preserved.
- **Portable control:** host-specific mechanics stay behind runtime adapters.
- **Public-safe recovery:** Git stores portable rules and allowlisted metadata, not workstation state.

## Runtime-neutral by design

The stable layer is the worker lifecycle, not the product that renders a terminal.

```text
INTENT
  -> RESEARCH
  -> DECOMPOSE
  -> ASSIGN
  -> CREATE ENDPOINT
  -> SEND
  -> OBSERVE
  -> CAPTURE
  -> REVIEW
  -> INTEGRATE
  -> VERIFY
  -> ARCHIVE
  -> CLEAN
  -> REPORT
```

Every runtime adapter must implement or explicitly refuse these operations:

| Operation | Required outcome |
| --- | --- |
| `preflight` | Prove availability, identity, version/capabilities, and authentication needed for the task. |
| `create` | Return a stable endpoint identity and, for writers, an isolated workspace identity. |
| `send` | Return input acceptance separately from submission or turn-start evidence. |
| `observe` | Report lifecycle events when available, otherwise bounded polling evidence. |
| `capture` | Return bounded output with cursor/timestamp provenance. |
| `interrupt` | Use a runtime-supported control and report confirmed versus unconfirmed cancellation. |
| `close` | Stop only the exact owned endpoint and preserve uncertain work. |
| `cleanup` | Remove state only after integration or explicit safe preservation is verified. |

Current host guidance:

| Host | Current posture | Strongest progress signal |
| --- | --- | --- |
| Herdr | Supported pattern; native lifecycle-capable | pane agent state/events, with polling fallback |
| Orca | Supported pattern; host-managed terminals/worktrees | durable send stages, terminal reads, host lifecycle |
| PowerShell | Portable fallback | process handle, exit code, redirected log/result and sentinel |
| CMD | Portable fallback | PID/process query, exit code wrapper, log/result and sentinel |
| Future SS-WD runtime | Planned | must satisfy the same adapter contract |

See [`docs/RUNTIME-ADAPTERS.md`](docs/RUNTIME-ADAPTERS.md), [`docs/platforms/herdr.md`](docs/platforms/herdr.md), [`docs/platforms/orca.md`](docs/platforms/orca.md), and [`docs/platforms/shell.md`](docs/platforms/shell.md).

The adapter boundary is informed by mature multi-backend systems such as [Firstmate](https://github.com/kunchenguid/firstmate), particularly its separation between task lifecycle, worktree ownership, terminal backends, and harness-specific behavior. SS-WD does not vendor or depend on Firstmate source.

## Core capabilities

### Chief of Staff system

- Founder/Chief identity and decision boundaries;
- research, execution, review, monitoring, and reporting protocols;
- progressive project context loading;
- provider- and host-neutral task contracts;
- evidence-based integration and cleanup.

### Worker orchestration policy

- visible workers and stable endpoint identities;
- one writer per file/package collision boundary;
- lifecycle events where available;
- completion sentinels and bounded polling where lifecycle support is absent;
- private worker ledger and transcript archive;
- no silent provider or runtime fallback.

### Portable configuration

- allowlisted sanitized Pi settings;
- allowlisted agent-profile names and content hashes;
- generic worker and reviewer templates;
- runtime version inventory;
- snapshot generation and public-safety verification scripts.

### Public safety

- default exclusion of credentials, sessions, memories, transcripts, databases, and evidence;
- staged-index and working-tree scanning;
- common credential and machine-path detection;
- allowlist-based snapshot generation;
- human diff review as a required final gate.

## Get started

### Prerequisites

Install only the tools required by the runtime and workers you choose:

- Git;
- Node.js 24 or newer;
- at least one worker CLI;
- optionally Orca or Herdr;
- optionally PowerShell on Windows.

Verify only the commands relevant to your environment:

```powershell
git --version
node --version
pi --version
cmdc --version
agy --version
herdr --version
orca --version
```

A missing runtime or worker must not trigger an undocumented fallback.

### Initialize private worker tracking

```powershell
New-Item -ItemType Directory -Force .pi | Out-Null
Copy-Item templates/worker-workspace-timeline.md .pi/worker-workspace-timeline.md
New-Item -ItemType Directory -Force .pi/worker-session-archive | Out-Null
```

Never commit the populated timeline or transcript archive.

### Load the operating contract

1. [`AGENTS.md`](AGENTS.md)
2. [`.ai/identity.md`](.ai/identity.md)
3. [`.ai/working-style.md`](.ai/working-style.md)
4. [`.ai/projects/index.md`](.ai/projects/index.md)
5. task-relevant project, protocol, skill, and runtime-adapter files

### Run validation

No dependency installation is required.

```powershell
npm test
npm run check
```

## Operate workers

1. Define the objective, scope, exclusions, expected evidence, and definition of done.
2. Select the worker independently from the runtime host.
3. Preflight the chosen runtime and record its exact capabilities.
4. Give every concurrent writer an isolated Git worktree.
5. Record endpoint and workspace identities in `.pi/worker-workspace-timeline.md`.
6. Separate input acceptance, turn start, ongoing activity, blocked state, and completion.
7. Review actual artifacts and run the relevant gates.
8. Archive useful output and remove only exact, completed, clean owned state.

When a project restricts workers to Command Code and Antigravity, preserve these literal invocations:

```text
cmdc --yolo
agy --dangerously-skip-permissions
```

A send receipt is not completion. Unsupported lifecycle hosts require a unique final marker:

```text
WORKER_DONE:<role>:<task-id>:SUCCEEDED|BLOCKED|FAILED
```

The marker reports worker state only; the Chief still verifies the result.

## Refresh the public snapshot

The manifest at [`config/snapshot-policy.json`](config/snapshot-policy.json) is the allowlist. Review it before approving a new setting or profile name.

```powershell
npm run snapshot
npm run check
git diff --check
git status --short
git diff --cached
```

The verifier checks both staged Git blobs and working-tree candidates. Human review remains required because pattern matching cannot prove that arbitrary public content is safe.

## Repository layout

```text
.
├── .ai/                         # Chief identity, protocols, skills, project context
├── .github/workflows/           # Automated validation
├── config/                      # Launch and snapshot policies
├── docs/                        # Runtime, restore, security-boundary guidance
├── scripts/                     # Snapshot and verification tools
├── snapshots/                   # Sanitized allowlisted metadata
├── templates/                   # Generic worker and private-ledger templates
├── tests/                       # Regression tests for safety and documentation
├── AGENTS.md                    # Permanent operating rules
├── CONTRIBUTING.md              # Contribution contract
├── SECURITY.md                  # Vulnerability reporting and support policy
└── LICENSE                      # MIT license
```

## Status and roadmap

### Available in `v1.1.0`

- provider- and runtime-neutral operating contract;
- Orca, Herdr, PowerShell, and CMD adapter guidance;
- allowlist-based snapshot generation;
- staged-index plus working-tree public-safety verification;
- regression tests and CI;
- contribution, security, and license documents.

### Planned

- executable adapter conformance tests for additional hosts;
- machine-readable runtime capability discovery;
- signed release artifacts and integrity manifests;
- benchmark-backed worker routing;
- a lightweight first-party SS-WD runtime implementing the same adapter contract.

Roadmap entries are direction, not shipped capability.

## Public snapshot boundary

Read [`docs/PUBLIC-SNAPSHOT-BOUNDARY.md`](docs/PUBLIC-SNAPSHOT-BOUNDARY.md) before expanding snapshot scope. If sensitive material reaches GitHub, stop publishing, rotate affected credentials, remove live refs, follow GitHub's sensitive-data removal process, and verify the cleaned repository.

## Contributing

See [`CONTRIBUTING.md`](CONTRIBUTING.md). Every change must preserve visible execution, exclusive mutation ownership, fail-closed status reporting, public-safe metadata, and executable verification.

## Security

See [`SECURITY.md`](SECURITY.md). Do not report suspected credentials or exploitable snapshot bypasses in a public issue.

## License

MIT—see [`LICENSE`](LICENSE).
