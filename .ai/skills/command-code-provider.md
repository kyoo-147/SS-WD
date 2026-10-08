# Command Code Provider API

Use this skill when routing Command Code models outside the `cmdc` harness or deciding whether another agent can consume the Command Code Provider API.

## Security boundary

- Never paste, commit, log, or document a real Command Code API key.
- The canonical secret name is `COMMAND_CODE_API_KEY`; clients that require another variable may reference or copy it only at process launch.
- Prefer a credential store or process-scoped environment variable. Do not add the key to SS-WD, evidence files, shell history, or Git.
- Rotate any key exposed in chat, screenshots, logs, or command arguments before integrating it elsewhere.
- Use `CMD_ZDR=1` in the CLI or `x-cmd-zdr: 1` on API requests when fail-closed zero-data-retention routing is required. A `422 cmd_zdr_no_providers` result is a privacy-preserving refusal, not a reason to remove the header silently.

## Preferred coding route

Use Command Code directly for coding work unless another client supplies a necessary capability:

```powershell
cmdc -p "<task>" -m deepseek/deepseek-v4-flash --yolo --output-format text
cmdc -p "<high-risk review>" -m deepseek/deepseek-v4-pro --yolo --output-format text
```

Founder policy limits the Command Code Tier 1 route to DeepSeek:

| Model | Use | Current evidence |
| --- | --- | --- |
| `deepseek/deepseek-v4-flash` | Default implementation, scanning, triage, bounded review | CLI chat and Provider API tool call `VERIFIED` |
| `deepseek/deepseek-v4-pro` | Architecture, security, difficult review, deeper reasoning | CLI chat `VERIFIED` |
| `deepseek/deepseek-v4-flash-fast` | Latency-sensitive work | Live catalog only; benchmark before routing |
| `deepseek/deepseek-v4.1-flash` | Vision-capable UI and multimodal work | Live catalog only; benchmark before routing |

The CLI harness remains preferred because Command Code applies model-specific context management and tool-call repair that generic API clients do not automatically inherit.

## Provider API contract

Base URL:

```text
https://api.commandcode.ai/provider/v1
```

Relevant endpoints:

| Path | Protocol | DeepSeek use |
| --- | --- | --- |
| `/models` | Model discovery | Read `supported_endpoints` live before selecting a wire |
| `/chat/completions` | OpenAI Chat Completions | Primary compatible route |
| `/responses` | OpenAI Responses | Use only when the selected live model advertises it |
| `/messages` | Anthropic Messages | Claude-family models, not the DeepSeek route |

The live catalog verified on 2026-10-04 exposed six DeepSeek models. Flash and Pro advertised both Chat Completions and Responses; Flash Fast advertised Chat Completions only. Treat this as drift-prone and query `/models` again before durable configuration.

Minimal OpenAI-compatible client shape:

```json
{
  "baseURL": "https://api.commandcode.ai/provider/v1",
  "model": "deepseek/deepseek-v4-flash"
}
```

Do not assume API compatibility proves agent compatibility. Run both a chat smoke and a real tool-call smoke in each client.

## Where the API can be connected

| Client or surface | Decision | Notes |
| --- | --- | --- |
| OpenCode / OpenCode 2 | `SUPPORTED` | Custom `@ai-sdk/openai-compatible` provider; both launchers currently share one executable/config |
| MiMo Code | `SUPPORTED` | Custom `@ai-sdk/openai-compatible` provider with exact `baseURL` and model ID |
| OMP / compatible Pi provider config | `SUPPORTED` | OpenAI Completions provider; verify model discovery and tool calls |
| Charm / Crush | `SUPPORTED` | `openai-compat` provider and explicit large/small model selection |
| Kimi Code | `SUPPORTED` | Provider `type = "openai"`; prefer `api_key_env` or a protected credential path instead of plaintext |
| Grok Build | `SUPPORTED` | Custom model slot with `api_backend = "chat_completions"` |
| Cline, Continue, Roo Code | `SUPPORTED IN PRINCIPLE` | Their OpenAI-compatible provider flow should accept the base URL; smoke-test before use |
| Open WebUI, LibreChat, Cherry Studio, n8n, AI SDK, OpenAI SDK | `SUPPORTED IN PRINCIPLE` | Generic OpenAI-compatible consumers; tool semantics vary |
| Navin 9Router | `SUPPORTED IN PRINCIPLE` | Add an OpenAI-compatible provider node with API type `chat`, then add exact DeepSeek model IDs. Keep the upstream key server-side and validate before adding it to a combo |
| Claude Code with DeepSeek | `DO NOT ROUTE` | Claude Code speaks Anthropic Messages; the Command Code `/messages` route is for Claude-family models, not DeepSeek |
| Kiro, Amp, Cursor Agent, Droid, Devin | `BLOCKED/UNVERIFIED` | Vendor backend or authentication protocol is not equivalent to a generic OpenAI-compatible endpoint |

## Sanitized client patterns

### OpenCode and MiMo Code

```json
{
  "provider": {
    "commandcode": {
      "npm": "@ai-sdk/openai-compatible",
      "options": {
        "baseURL": "https://api.commandcode.ai/provider/v1"
      },
      "models": {
        "deepseek/deepseek-v4-flash": {},
        "deepseek/deepseek-v4-pro": {}
      }
    }
  },
  "model": "commandcode/deepseek/deepseek-v4-flash"
}
```

Confirm the exact environment-token syntax against the installed client version before writing it. Never replace the placeholder with a real key in a tracked file.

### Grok Build

```toml
[model.commandcode-deepseek]
model = "deepseek/deepseek-v4-flash"
base_url = "https://api.commandcode.ai/provider/v1"
api_backend = "chat_completions"
name = "Command Code DeepSeek"
```

Supply the key through the client's supported secret mechanism. Do not add it to this snippet.

### Navin 9Router

Create a custom provider node through the authenticated dashboard/API:

```text
Type: openai-compatible
API type: chat
Prefix: cmdc
Base URL: https://api.commandcode.ai/provider/v1
Models: deepseek/deepseek-v4-flash, deepseek/deepseek-v4-pro
```

This is a proposed central integration until the deployed server connection, model prefix, chat, and tool-call behavior have all been verified. Do not put it into `navin-coding` before those checks pass.

## Preflight and failure policy

1. Open a real Command Code TTY and run `/usage`; inspect every displayed usage window. Do not use `cmdc --usage` as a shell flag.
2. Confirm `cmdc --list-models` contains the exact ID.
3. Query `/models` and confirm the intended endpoint appears in `supported_endpoints`.
4. Run one direct CLI smoke and one API chat smoke.
5. Run a required tool-call smoke; plain text success is insufficient for a coding route.
6. Retry only network, timeout, 429, and transient 5xx failures with bounded backoff.
7. Treat 401/403, exhausted credit windows, retired models, unsupported endpoints, and 410 as provider/model availability failures.
8. Treat code, tool, test, workspace, policy, and unknown failures as `BLOCKED`; do not hide them by changing models.

Quota observations are private, ephemeral operational state. Recheck after several tasks and reset windows; never commit account identifiers, balances, or reset screenshots. Do not enable `/extra` without explicit Founder approval.

## References

- Provider API: https://commandcode.ai/docs/provider
- GOAT plan: https://commandcode.ai/docs/plans/goat
- Live model IDs: https://commandcode.ai/docs/reference/cli/models
- Headless CLI: https://commandcode.ai/docs/headless
- Permissions: https://commandcode.ai/docs/permissions
