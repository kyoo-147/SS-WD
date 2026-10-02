# Contributing to SS-WD

Thank you for improving SS-WD. This repository is public operational infrastructure, so correctness, portability, and privacy matter more than adding breadth quickly.

## Before changing code

1. Read `AGENTS.md`, `.ai/identity.md`, `.ai/working-style.md`, and `.ai/projects/index.md`.
2. Load only the protocol, skill, project, or runtime guide relevant to the change.
3. Confirm that the proposal is first-party source and does not vendor an external runtime, product manual, binary, branding, or private operational state.
4. Open an issue first for public contract changes, destructive migrations, or a new runtime support claim.

## Design rules

- Keep the control plane independent from worker providers and runtime hosts.
- Put host-specific mechanics under an adapter guide or implementation boundary.
- Keep one writer per mutation boundary and use isolated worktrees for parallel writers.
- Treat lifecycle events as evidence, not artifact acceptance.
- Fail closed on unknown identity, ownership, delivery, or cleanup state.
- Do not silently substitute providers, models, or runtime hosts.
- Keep `UNKNOWN`, `BLOCKED`, and `UNVERIFIED` truthful.
- Prefer the smallest reliable implementation and avoid speculative abstractions.

## Public-snapshot rules

Never commit credentials, cookies, authentication stores, private keys, internal endpoints, memories, session databases, transcripts, populated timelines, machine-local paths, or generated operational evidence.

Snapshot generation is allowlist-based. To publish another setting or agent profile:

1. explain why the field is portable and public-safe;
2. add it deliberately to `config/snapshot-policy.json`;
3. add tests covering secret and path handling;
4. regenerate the snapshot;
5. inspect the complete staged diff.

A passing verifier is necessary but not sufficient.

## Runtime adapter contributions

A new runtime adapter or support claim must include:

- a platform guide covering every operation in `docs/RUNTIME-ADAPTERS.md`;
- exact version/protocol evidence;
- stable endpoint and workspace identities;
- send, observe, capture, interrupt, close, and cleanup semantics;
- explicit unsupported capabilities;
- clean lifecycle, stalled lifecycle, and ambiguous-cleanup tests;
- no copied third-party implementation source.

An experimental adapter must be labeled experimental. Documentation alone must not be described as executable support.

## Development

Requirements:

- Git;
- Node.js 24 or newer.

No package installation is required. Run:

```powershell
npm test
npm run check
git diff --check
```

To refresh snapshots intentionally:

```powershell
npm run snapshot
npm run check
git diff --check
git status --short
git diff --cached
```

## Tests

Add a regression test for every bug fix. Security-sensitive tests should prove the previous bypass, including index-versus-working-tree differences where relevant. Build secret-looking fixtures from fragments so the repository itself does not contain a scanner trigger.

Documentation changes must preserve valid relative links. Runtime claims should name their evidence and verification date when drift is likely.

## Pull requests

Keep each pull request focused. Include:

- objective and user-visible outcome;
- files and contract boundaries changed;
- exact validation commands and results;
- security/privacy impact;
- runtime or provider assumptions;
- residual risks and unsupported behavior.

Do not include private worker transcripts or memory in a pull request.

## Review and release

A reviewer inspects the actual diff and relevant surrounding behavior. Passing tests or worker completion prose does not replace review.

Before release:

1. run `npm run check`;
2. run `git diff --check`;
3. inspect staged blobs and the full diff;
4. confirm snapshots contain only allowlisted metadata;
5. confirm version and status claims match shipped behavior;
6. create a signed or annotated tag when available;
7. publish release notes that separate shipped capability from roadmap direction.

## License

By contributing, you agree that your contribution is licensed under the repository's MIT License.
