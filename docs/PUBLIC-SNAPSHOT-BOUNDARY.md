# Public Snapshot Boundary

SS-WD is public. It stores portable behavior and reproducible setup metadata, not a clone of a workstation.

## Included

- source-authored Chief of Staff rules and protocols;
- sanitized configuration examples;
- skill names, descriptions, source selectors, hashes and runtime versions;
- first-party operating rules and generic templates;
- scripts that regenerate snapshots from the local installation;
- generic worker profile templates without local paths or credentials.

## Excluded

- `auth.json`, OAuth files, API keys, tokens, cookies and passwords;
- trust databases and provider account state;
- private memories, rollout summaries, session databases and mission state;
- terminal transcripts, runtime handles, worktree timelines and generated evidence;
- machine-specific paths, SSH paths, hostnames, domains, addresses and production topology;
- binaries, model weights, caches, `node_modules`, generated assets and the 1+ GiB local skill payload;
- deployment configuration or private project data.

## Why the complete local skill tree is not vendored

The installed skill tree is large, changes independently, and combines multiple upstream licenses and runtime assets. Blindly committing it would be neither reproducible nor legally or operationally safe. `snapshots/skill-inventory.json` stores approved metadata and content hashes only. Install external products and skills from their official sources instead of copying their implementations into SS-WD.

If a locally authored skill must become durable source, add it explicitly in a dedicated directory with provenance and a license review. Do not broaden the snapshot script to copy every file automatically.

## Pre-push audit

Run `node scripts/verify-public-snapshot.mjs`, then manually inspect all staged files. If sensitive data ever reaches the remote, stop publishing, rotate affected credentials, remove the data from reachable history, and verify the cleaned repository before resuming.
