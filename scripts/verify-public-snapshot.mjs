#!/usr/bin/env node

import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

const files = execFileSync(
  'git',
  ['ls-files', '-z', '--cached', '--others', '--exclude-standard'],
  { encoding: 'utf8' },
)
  .split('\0')
  .filter(Boolean)

const forbiddenFiles = [
  /(^|\/)auth\.json$/i,
  /(^|\/)trust\.json$/i,
  /(^|\/)\.env(?:\.|$)/i,
  /(^|\/)(?:state|sessions?|memories?)\.(?:sqlite|db|jsonl)$/i,
  /(^|\/)run-history\.jsonl$/i,
  /(^|\/)\.pi\//i,
]
const contentRules = [
  { name: 'Windows user path', pattern: /[A-Za-z]:[\\/]Users[\\/][^\s`"']+/i },
  { name: 'machine work path', pattern: /[A-Za-z]:[\\/]work[\\/][^\s`"']+/i },
  { name: 'private key', pattern: /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
  { name: 'GitHub token', pattern: /\b(?:ghp|github_pat)_[A-Za-z0-9_]{20,}\b/ },
  { name: 'OpenAI key', pattern: /\bsk-[A-Za-z0-9_-]{20,}\b/ },
  { name: 'Google API key', pattern: /\bAIza[0-9A-Za-z_-]{30,}\b/ },
  { name: 'bearer token', pattern: /Authorization\s*:\s*Bearer\s+[A-Za-z0-9._~-]{12,}/i },
]

const failures = []
for (const file of files) {
  if (forbiddenFiles.some((pattern) => pattern.test(file))) {
    failures.push(`${file}: forbidden tracked runtime/secret file`)
    continue
  }
  let text
  try {
    text = readFileSync(file, 'utf8')
  } catch {
    continue
  }
  for (const rule of contentRules) {
    if (rule.pattern.test(text)) failures.push(`${file}: ${rule.name}`)
  }
}

if (failures.length > 0) {
  console.error('Public snapshot verification failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}
console.log(`Public snapshot verification passed for ${files.length} tracked files.`)
