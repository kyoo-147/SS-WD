# Runtime adapter skill

Use this skill whenever selecting, creating, observing, controlling, or cleaning a worker execution host.

The Chief selects two independent things:

- **worker**: harness, provider, model, and permissions;
- **runtime**: endpoint, terminal/workspace host, observation transport, and cleanup mechanism.

Never infer one from the other. A Pi, Command Code, Antigravity, or Codex worker may run through different hosts when those combinations are verified.

## Required procedure

1. Read `docs/RUNTIME-ADAPTERS.md`.
2. Read exactly one relevant platform guide under `docs/platforms/`.
3. Run a non-destructive preflight and record version, identity, reachability, and capabilities.
4. Create one visible endpoint; give writers an isolated Git worktree.
5. Record stable endpoint/workspace identities in the private timeline.
6. Separate `accepted`, `submitted`, `turn_started`, `working`, `blocked`, and terminal outcomes.
7. Observe through native events where available and bounded polling everywhere else.
8. Capture bounded evidence with cursor or timestamp provenance.
9. Revalidate ownership and Git state before interrupt, close, or cleanup.

## Routing

- Prefer the verified host already owning the active workspace.
- Prefer Herdr when native pane/agent lifecycle evidence materially improves supervision.
- Prefer Orca when its managed worktree and terminal UX is useful and responsive enough.
- Use PowerShell or CMD wrappers for the smallest portable fallback.
- Treat a future SS-WD lightweight runtime as another adapter implementing the same contract.

Do not hide a preflight failure by selecting another runtime. Report the requested host `BLOCKED` and use a fallback only when the Founder or project policy explicitly allows it.

## Evidence rules

- A create response proves identity allocation, not worker readiness.
- A send receipt proves only the stages it names.
- Native idle/done proves endpoint state, not task correctness.
- A sentinel proves worker-reported outcome, not integration or acceptance.
- A vanished process without a valid result is `UNKNOWN`.
- An unreadable endpoint never grants cleanup or replacement authority.
