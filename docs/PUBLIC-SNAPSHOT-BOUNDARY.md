# Public snapshot boundary

SS-WD is public. It stores portable behavior and reproducible allowlisted metadata, not a clone of a workstation.

## Included

- source-authored Chief of Staff rules and protocols;
- runtime-neutral adapter contracts and platform guides;
- sanitized settings selected by `config/snapshot-policy.json`;
- approved generic agent-profile filenames, hashes, and sizes;
- selected runtime versions;
- first-party scripts, tests, workflows, and templates.

## Excluded

- authentication files, OAuth state, API keys, tokens, cookies, passwords, and private keys;
- trust databases and provider account state;
- private memories, rollout summaries, mission state, and session databases;
- terminal transcripts, runtime handles, populated timelines, and generated evidence;
- machine-specific paths, hostnames, private domains, addresses, and production topology;
- third-party source, product manuals, binaries, branding, model weights, caches, and dependencies;
- deployment configuration and private project data.

## Allowlist model

`scripts/snapshot-agent-setup.mjs` reads `config/snapshot-policy.json`. Only listed setting fields and profile filenames are eligible for output. Unknown settings and unapproved profiles are omitted.

`snapshots/capability-inventory.json` contains approved **agent-profile metadata**, not an inventory or copy of installed skills. External skill implementations are not snapshotted. If a locally authored skill becomes durable source, add it explicitly with provenance and license review.

The allowlist is the primary privacy boundary. Pattern-based redaction and verification are defense in depth, not substitutes for explicit review.

## Staged and working-tree verification

`scripts/verify-public-snapshot.mjs` scans:

- exact blobs in the Git index;
- tracked working-tree candidates;
- untracked non-ignored candidates.

This prevents a clean working-tree file from hiding unsafe content already staged. The verifier checks forbidden filenames, common credential formats, private-key material, and machine paths. It cannot recognize every sensitive value.

## Pre-push audit

```powershell
npm run check
git diff --check
git status --short
git diff --cached
```

Manually inspect every staged file. If sensitive data reaches GitHub, stop publishing, rotate affected credentials, remove live refs, follow GitHub's sensitive-data removal process, and verify the cleaned repository. Rewriting branch history alone does not guarantee immediate removal from caches or existing clones.
