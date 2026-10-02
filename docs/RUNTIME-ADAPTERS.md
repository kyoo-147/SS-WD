# Runtime adapter contract

SS-WD separates three independent choices:

1. **Control plane**: the Chief of Staff lifecycle and evidence rules.
2. **Runtime host**: where endpoints, terminals, and workspaces live.
3. **Worker harness**: the agent CLI and model executing the task.

Changing Orca to Herdr, or Herdr to a plain PowerShell process, must not change the task objective, ownership, evidence, or acceptance contract.

## Common lifecycle

Every adapter returns structured facts for the following operations. A platform guide may use native terminology, but it must preserve the semantics.

### `preflight`

Report:

- adapter name and version or protocol when available;
- host reachability and authentication required for the requested operation;
- capabilities: workspace isolation, stable endpoint IDs, atomic send, lifecycle state, output cursor, interrupt, exact close;
- unsupported or unverified capabilities.

Preflight failure is `BLOCKED`. Do not silently select another runtime.

### `create`

For a read-only worker, create or select one visible endpoint. For a writer, create an isolated Git worktree first or atomically with the endpoint.

Record:

- runtime adapter;
- endpoint identity;
- workspace/worktree identity;
- worker CLI/model;
- creation receipt;
- ownership and cleanup authority.

A mutable label is presentation, not authority. Use opaque IDs or exact process identities whenever the host supplies them.

### `send`

Distinguish these states:

- `accepted`: the transport accepted input;
- `submitted`: Enter or equivalent was delivered;
- `turn_started`: lifecycle or rendered evidence proves processing began;
- `unknown`: delivery cannot be proved safely.

Never resend an accepted prompt merely because turn start is slow. Inspect the endpoint first.

### `observe`

Signal priority:

1. authenticated lifecycle events;
2. native agent state;
3. completion sentinel;
4. process state, output cursor/hash, and timestamps;
5. a narrow follow-up question.

Events reduce latency; bounded polling remains the fallback. Native `idle` alone is not proof that requested work succeeded.

### `capture`

Capture bounded output and record:

- endpoint identity;
- cursor/range or timestamp;
- whether output was truncated;
- capture source such as viewport, recent output, log, or result file.

When a full answer cannot be recovered from terminal scrollback, ask the worker to write a durable report and return its path.

### `interrupt`

Report `confirmed`, `unconfirmed`, or `unsupported`. Input delivery does not prove cancellation. Preserve the worktree and endpoint unless a separate close was authorized.

### `close` and `cleanup`

Close only exact state created or explicitly adopted by this task. Before destructive action:

1. verify endpoint/workspace identity again;
2. verify the task is complete, integrated, or safely preserved;
3. inspect Git status;
4. archive useful output;
5. finalize the private timeline entry.

Unknown ownership, unreadable state, dirty work, or failed close confirmation preserves the state and reports `UNKNOWN` or `PRESERVED_DIRTY`.

## Capability matrix

Adapters must declare facts rather than inherit optimistic defaults.

| Capability | Meaning |
| --- | --- |
| `stable_endpoint_id` | Endpoint can be addressed without relying on focus or label order. |
| `workspace_isolation` | Host can create or bind an isolated Git worktree. |
| `atomic_submit` | Text plus submit can be delivered as one operation. |
| `turn_started` | Host can prove a specific accepted input began processing. |
| `native_lifecycle` | Host reports agent states or events. |
| `cursor_capture` | Output can be read incrementally without replay ambiguity. |
| `process_identity` | PID/start time or stronger identity can be revalidated. |
| `exact_close` | Host can close an exact owned endpoint and confirm absence. |

Missing capabilities select conservative fallbacks; they never become positive claims.

## Adapter selection

Choose explicitly when the Founder or project names a runtime. Otherwise prefer, in order:

1. a verified host already owning the active workspace;
2. a host with stable endpoint identity and native lifecycle evidence;
3. a visible plain shell with durable logs and process identity.

Performance, responsiveness, and operator experience are routing inputs, not reasons to change the lifecycle contract. Orca may be convenient today, Herdr may provide stronger native state, and a future lightweight runtime may reduce overhead. All remain replaceable adapters.

## Adding a runtime

A new runtime is not supported until it has:

- a platform guide covering every lifecycle operation;
- capability and failure-mode documentation;
- exact ownership and cleanup rules;
- at least one clean command lifecycle test;
- one blocked/stalled lifecycle test;
- one ambiguous-cleanup test proving fail-closed behavior;
- a versioned verification record.

Reference implementations may inform the design, but SS-WD must not vendor external runtime source or copy product-specific policy into the neutral core.
