#!/usr/bin/env node

import { execFileSync } from 'node:child_process'
import { lstatSync, readFileSync, readlinkSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))

const forbiddenFiles = [
  /(^|\/)auth\.json$/i,
  /(^|\/)trust\.json$/i,
  /(^|\/)\.env(?:\.|$)/i,
  /(^|\/)(?:\.npmrc|\.pypirc|id_rsa|id_ed25519)$/i,
  /(^|\/)(?:state|sessions?|memories?)\.(?:sqlite|db|jsonl)$/i,
  /(^|\/)run-history\.jsonl$/i,
  /(^|\/)\.pi\//i,
]
const contentRules = [
  { name: 'Windows user path', pattern: /[A-Za-z]:[\\/]Users[\\/][^\s`"']+/i },
  { name: 'machine work path', pattern: /[A-Za-z]:[\\/](?:work|agent-worktrees|home|Documents)[\\/][^\s`"']+/i },
  { name: 'POSIX user path', pattern: /\/(?:Users|home)\/[A-Za-z0-9._-]+\/(?:[^\s`"']+)/ },
  { name: 'private key', pattern: /-----BEGIN (?:[A-Z0-9]+ )*PRIVATE KEY-----/ },
  { name: 'GitHub token', pattern: /\b(?:ghp|github_pat)_[A-Za-z0-9_]{20,}\b/i },
  { name: 'OpenAI key', pattern: /\bsk-[A-Za-z0-9_-]{20,}\b/ },
  { name: 'Google API key', pattern: /\bAIza[0-9A-Za-z_-]{30,}\b/ },
  { name: 'AWS access key', pattern: /\bAKIA[0-9A-Z]{16}\b/ },
  { name: 'npm token', pattern: /\bnpm_[A-Za-z0-9]{20,}\b/ },
  { name: 'Slack token', pattern: /\bxox[baprs]-[A-Za-z0-9-]{20,}\b/ },
  { name: 'Command Code token', pattern: /\buser_[A-Za-z0-9]{20,}\b/ },
  { name: 'bearer token', pattern: /Authorization\s*:\s*Bearer\s+[A-Za-z0-9._~-]{12,}/i },
  {
    name: 'generic credential assignment',
    pattern: /["']?(?:api[_-]?key|access[_-]?key(?:_id)?|client[_-]?secret|password|token)["']?\s*[:=]\s*(?:["'][^"'\r\n]{12,}["']|[A-Za-z0-9_./+~-]{20,})/i,
  },
]

function git(args, encoding = 'utf8') {
  return execFileSync('git', args, { cwd: repoRoot, encoding, maxBuffer: 32 * 1024 * 1024 })
}

function nulList(args) {
  return git(args).split('\0').filter(Boolean)
}

function indexEntries() {
  return nulList(['ls-files', '-s', '-z']).flatMap((record) => {
    const tab = record.indexOf('\t')
    if (tab < 0) return []
    const [mode, object, stage] = record.slice(0, tab).split(' ')
    if (stage !== '0') return []
    return [{ mode, object, file: record.slice(tab + 1) }]
  })
}

function worktreeContent(file) {
  const path = join(repoRoot, file)
  const stat = lstatSync(path)
  return stat.isSymbolicLink() ? Buffer.from(readlinkSync(path)) : readFileSync(path)
}

function isBinary(buffer) {
  const sample = buffer.subarray(0, Math.min(buffer.length, 8192))
  return sample.includes(0)
}

function scanContent(file, source, buffer, failures) {
  if (isBinary(buffer)) {
    failures.add(`${source}:${file}: binary candidate requires explicit exclusion or review`)
    return
  }
  const text = buffer.toString('utf8')
  for (const rule of contentRules) {
    if (rule.pattern.test(text)) failures.add(`${source}:${file}: ${rule.name}`)
  }
}

export function verifyPublicSnapshot() {
  const failures = new Set()
  const entries = indexEntries()

  for (const entry of entries) {
    if (forbiddenFiles.some((pattern) => pattern.test(entry.file))) {
      failures.add(`index:${entry.file}: forbidden runtime/secret file`)
      continue
    }
    if (entry.mode === '160000') continue
    const buffer = git(['cat-file', 'blob', entry.object], null)
    scanContent(entry.file, 'index', buffer, failures)
  }

  const candidates = nulList(['ls-files', '-z', '--cached', '--others', '--exclude-standard'])
  for (const file of candidates) {
    if (forbiddenFiles.some((pattern) => pattern.test(file))) {
      failures.add(`worktree:${file}: forbidden runtime/secret file`)
      continue
    }
    try {
      scanContent(file, 'worktree', worktreeContent(file), failures)
    } catch (error) {
      if (error?.code !== 'ENOENT') failures.add(`worktree:${file}: unreadable candidate`)
    }
  }

  return { failures: [...failures].sort(), indexFiles: entries.length, candidates: candidates.length }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = verifyPublicSnapshot()
  if (result.failures.length > 0) {
    console.error('Public snapshot verification failed:')
    for (const failure of result.failures) console.error(`- ${failure}`)
    process.exit(1)
  }
  console.log(
    `Public snapshot verification passed for ${result.indexFiles} index entries and ${result.candidates} working-tree candidates.`,
  )
}
