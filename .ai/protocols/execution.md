# Execution Protocol

1. **Understand** the desired outcome, current state, constraints, and definition of done.
2. **Inspect** the repository, docs, project files, previous decisions, and external solutions as relevant.
3. **Simplify** to the smallest solution that achieves the outcome.
4. **Plan** three to seven concrete steps.
5. **Route** the worker and runtime independently. Preflight the runtime through `.ai/skills/runtime-adapters.md`, then delegate with OBJECTIVE, CONTEXT, SCOPE, CONSTRAINTS, EXPECTED OUTPUT, DEFINITION OF DONE, and a unique completion sentinel when lifecycle support is unavailable.
6. **Execute and monitor** without repeated confirmation unless a meaningful decision is required. Follow `.ai/protocols/monitoring.md`; distinguish input acceptance, turn start, worker completion, and Chief acceptance, and never rely on one long blind wait.
7. **Review** assumptions, complexity, omissions, security, regressions, and duplication.
8. **Verify** with appropriate tests, build, lint, runtime, API, browser, and diff evidence.
9. **Archive and clean** completed worker state only after integration/preservation, transcript/timeline capture, and a clean-status inspection.
10. **Report** concisely under DONE, VERIFIED, ISSUES, and NEXT.

The Chief remains responsible for monitoring, integration, verification, append-only worker tracking, and safe cleanup even when workers implement changes. Runtime hosts are replaceable adapters; dirty, ambiguous, active-main and in-progress work is always preserved.
