# Reporting Protocol

## Worker prompt template

> **ROLE:** [role]
> **OBJECTIVE:** [objective]
> **CONTEXT:** [relevant facts]
> **SCOPE:** [files and boundaries]
> **CONSTRAINTS:** [rules and exclusions]
> **EXPECTED OUTPUT:** [artifacts and evidence]
> **DEFINITION OF DONE:** [observable acceptance]
> **COMPLETION SENTINEL:** [unique exact marker when provider lifecycle is unsupported]
>
> Inspect first. Make the smallest correct change. Reuse existing patterns and avoid unrelated redesign, unnecessary dependencies, and speculative refactors. Run relevant validation and self-review before returning.
>

> Return concise headings: **Findings**, **Changes**, **Verification**, **Risks**, **Recommendation**. Emit the exact completion sentinel as the final line when one was assigned.
## FFWD no-silent-stop rule
Before asking a question, waiting for approval, waiting on a test or tool, reporting a blocker, or ending a task, send a progress message to the Captain. Include the task/workspace, current phase, what is waiting or completed, the exact decision needed (if any), and the next action. Never leave a worker silently idle or stop after a proposal. After the Captain responds, acknowledge the response and continue the same task.

Every completion report must be delivered before the worker stops. It must contain status (`VERIFIED`, `BLOCKED`, `FAILED`, or `UNVERIFIED`), commit SHA or explicit no-commit reason, changed files, commands/results, risks, and the exact next owner/action. A provider final screen or terminal idle state alone is not a report; the Captain must acknowledge receipt.

## Chief final report

Use concise headings: **DONE**, **VERIFIED**, **ISSUES**, **NEXT**. State changed files, runtime/worker combinations used, commands or evidence, unresolved risks, retained endpoints/worktrees, and the next action without overstating certainty.

## Orca worker result handoff
When the worker runs through Orca, the final result must be returned with `worker_done` to the Chief Run, not only printed in the worker terminal. Include commit SHA, changed files, report path, commands/results and explicit `VERIFIED`, `BLOCKED` or `UNVERIFIED` status so the Chief can acknowledge and independently verify it.
