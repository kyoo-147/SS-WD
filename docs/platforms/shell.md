# CMD and PowerShell adapter guide

Plain shells are valid SS-WD runtime hosts when no workspace application is available. They provide fewer lifecycle signals, so the control plane must add durable process and result evidence.

A shell worker must run in a separate visible terminal or explicitly approved background process. Concurrent writers still require separate Git worktrees.

## Shared task envelope

Create a private ignored task directory containing:

- `prompt.md` or another immutable task brief;
- `stdout.log` and `stderr.log`;
- `result.json` written atomically by the wrapper;
- process identity including PID and start time;
- a unique completion sentinel.

The result record should include task ID, command, cwd, start/end timestamps, exit code, sentinel outcome, and log paths. Logs and result records are operational evidence and must not be committed.

## PowerShell

Launch with `Start-Process -PassThru`, explicit `-WorkingDirectory`, and redirected standard streams. Save both `$process.Id` and `$process.StartTime` after launch. A reused PID must not be mistaken for the worker.

Poll with bounded intervals:

```powershell
$process.Refresh()
$process.HasExited
$process.ExitCode
Get-Content $stdoutLog -Tail 120
```

Use `Wait-Process -Timeout` only as one checkpoint, not an unbounded blind wait. The wrapper writes `result.json` through a temporary file followed by an atomic rename after the child exits.

For interruption, first request the worker's supported graceful control. Use `Stop-Process` only against the revalidated PID/start-time identity and report that termination does not prove task rollback or cleanup.

## CMD

CMD has weak native process ownership and redirection ergonomics. Prefer a project-approved PowerShell wrapper even when the operator launches it from CMD:

```cmd
powershell.exe -NoProfile -File <approved-worker-wrapper.ps1> ...
```

If pure CMD is required, use a unique task directory, redirect output, capture `%ERRORLEVEL%`, and write the result marker from the same wrapper process. `tasklist` proves only that a PID is present; combine it with creation time through PowerShell or CIM before destructive control.

SS-WD currently defines this wrapper contract but does not ship a process runner. Do not present shell guidance as an executable first-party runtime. Never parse the presence of a prompt line as success.

## Observation fallback

Without native lifecycle events, use this order:

1. wrapper-owned result file;
2. completion sentinel in bounded logs;
3. revalidated process exit and exit code;
4. output growth and timestamps;
5. narrow status request through the terminal.

Silence is not failure. A vanished process with no valid result is `UNKNOWN`.

## Cleanup

Close only the terminal/process created for the task. Inspect Git status and archive useful output before removing the private task directory. Preserve any process or worktree whose identity, completion, or integration state is ambiguous.
