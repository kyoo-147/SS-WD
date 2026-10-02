# Worker and workspace timeline

Local append-only operational index. Copy this template to `.pi/worker-workspace-timeline.md`; never commit the populated file.

## Timeline

| Time | Workspace | Task | Worker and terminal/session | Git/result | State/archive |
|---|---|---|---|---|---|

## Detailed entry template

```md
### YYYY-MM-DD HH:MM: <workspace>
- Status: STARTED | ACTIVE | REVIEW | INTEGRATED | BLOCKED | PRESERVED_DIRTY | CLEANED
- Task: <bounded outcome>
- Worker: <CLI/model>
- Workspace/branch: <name and branch>
- Terminal/session handles: <runtime handles>
- Base / worker HEAD / integration commit: <refs>
- Verification: <commands and observed results>
- Result: <factual summary>
- Transcript archive: <local ignored path or unavailable>
- Cleanup: <retained/removed, timestamp, reason>
```

Before cleanup, export useful terminal output under `.pi/worker-session-archive/<workspace>/`, finalize the entry, verify intended work is integrated or safely preserved, and inspect Git status. Never force-delete dirty, ambiguous, active-main, or in-progress work.
