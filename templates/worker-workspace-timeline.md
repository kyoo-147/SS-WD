# Worker and workspace timeline

Local append-only operational index. Copy this template to `.pi/worker-workspace-timeline.md`; never commit the populated file.

## Timeline

| Time | Workspace | Task | Worker / runtime / endpoint | Git/result | State/archive |
|---|---|---|---|---|---|

## Detailed entry template

```md
### YYYY-MM-DD HH:MM: <workspace>
- Status: STARTED | ACTIVE | REVIEW | INTEGRATED | BLOCKED | FAILED | UNKNOWN | PRESERVED_DIRTY | CLEANED
- Task: <bounded outcome>
- Worker: <CLI/model>
- Runtime: <adapter/version/capabilities>
- Workspace/branch: <name and branch>
- Endpoint/session handles: <exact runtime identities>
- Delivery evidence: <accepted/submitted/turn-started>
- Base / worker HEAD / integration commit: <refs>
- Verification: <commands and observed results>
- Result: <factual summary>
- Transcript archive: <local ignored path or unavailable>
- Cleanup: <retained/removed, timestamp, reason>
```

Before cleanup, export useful output under `.pi/worker-session-archive/<workspace>/`, finalize the entry, verify intended work is integrated or safely preserved, revalidate exact runtime ownership, and inspect Git status. Never force-delete dirty, ambiguous, active-main, unreadable, or in-progress work.
