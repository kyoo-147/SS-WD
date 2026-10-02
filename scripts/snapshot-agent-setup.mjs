#!/usr/bin/env node

import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { basename, isAbsolute, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptPath = fileURLToPath(import.meta.url)
const repoRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))
const snapshotsDir = join(repoRoot, 'snapshots')
const policyPath = join(repoRoot, 'config', 'snapshot-policy.json')

const secretValueRules = [
  /\b(?:ghp|github_pat)_[A-Za-z0-9_]{20,}\b/i,
  /\bsk-[A-Za-z0-9_-]{20,}\b/,
  /\bAIza[0-9A-Za-z_-]{30,}\b/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\b(?:npm|xox[baprs])_[A-Za-z0-9_-]{20,}\b/i,
  /-----BEGIN (?:[A-Z0-9]+ )*PRIVATE KEY-----/,
]
const sensitiveKey = /(api.?key|access.?key|token|secret|password|cookie|credential|private.?key|authorization|oauth|session)/i
const safePackage = /^(?:npm:)?(?:@[a-z0-9._-]+\/)?[a-z0-9._-]+(?:@[a-z0-9._*+^-]+)?$/i

function sha256File(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex')
}

function normalizeHomePath(value, home = homedir()) {
  const normalized = value.replaceAll('\\', '/')
  const normalizedHome = home.replaceAll('\\', '/')
  const lower = normalized.toLowerCase()
  const lowerHome = normalizedHome.toLowerCase().replace(/\/$/, '')
  if (lower === lowerHome || lower.startsWith(`${lowerHome}/`)) {
    return `\${HOME}${normalized.slice(lowerHome.length)}`
  }
  if (isAbsolute(value) || /^[A-Za-z]:[\\/]/.test(value)) return '<REDACTED_PATH>'
  return value
}

function sanitizeScalar(value, key, home) {
  if (typeof value !== 'string') return value
  if (secretValueRules.some((rule) => rule.test(value))) return '<REDACTED>'
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) return '<REDACTED_URL>'
  if (sensitiveKey.test(key)) return '<REDACTED>'
  if (key === 'shellPath') return normalizeHomePath(value, home)
  return value
}

export function sanitizeSettings(settings, policy, home = homedir()) {
  const output = {}
  for (const key of policy.settingsKeys ?? []) {
    if (!Object.hasOwn(settings, key)) continue
    const value = settings[key]
    if (key === 'packages') {
      if (!Array.isArray(value)) continue
      output[key] = value.filter((item) => typeof item === 'string' && safePackage.test(item))
      continue
    }
    if (Array.isArray(value) || (value && typeof value === 'object')) continue
    output[key] = sanitizeScalar(value, key, home)
  }
  return output
}

export function inventoryApprovedProfiles(root, approvedNames) {
  const profiles = []
  for (const approvedName of approvedNames ?? []) {
    const name = basename(approvedName)
    if (name !== approvedName || !name.endsWith('.md')) continue
    const path = join(root, name)
    if (!existsSync(path) || !statSync(path).isFile()) continue
    profiles.push({ name, sha256: sha256File(path), bytes: statSync(path).size })
  }
  return profiles.sort((a, b) => a.name.localeCompare(b.name))
}

function commandVersion(command, args = ['--version']) {
  try {
    const output =
      process.platform === 'win32'
        ? execFileSync(process.env.ComSpec || 'cmd.exe', ['/d', '/s', '/c', command, ...args], {
            encoding: 'utf8',
            windowsHide: true,
          })
        : execFileSync(command, args, { encoding: 'utf8', windowsHide: true })
    return output.trim().split(/\r?\n/)[0]
  } catch {
    return null
  }
}

export function createSnapshot({ home = homedir(), now = new Date() } = {}) {
  const policy = JSON.parse(readFileSync(policyPath, 'utf8'))
  if (policy.schemaVersion !== 1) throw new Error(`Unsupported snapshot policy schema: ${policy.schemaVersion}`)

  mkdirSync(snapshotsDir, { recursive: true })
  const piRoot = join(home, '.pi', 'agent')
  const inventory = {
    schemaVersion: 1,
    generatedAt: now.toISOString(),
    note: 'Allowlisted portable agent-profile metadata only. Implementations, credentials, memories, binaries and transcripts are excluded.',
    approvedPiAgentProfiles: inventoryApprovedProfiles(join(piRoot, 'agents'), policy.agentProfiles),
  }
  writeFileSync(join(snapshotsDir, 'capability-inventory.json'), `${JSON.stringify(inventory, null, 2)}\n`)

  const settingsPath = join(piRoot, 'settings.json')
  if (existsSync(settingsPath)) {
    const settings = sanitizeSettings(JSON.parse(readFileSync(settingsPath, 'utf8')), policy, home)
    writeFileSync(join(snapshotsDir, 'pi-settings.sanitized.json'), `${JSON.stringify(settings, null, 2)}\n`)
  }

  const versions = {
    schemaVersion: 1,
    generatedAt: now.toISOString(),
    tools: {
      pi: commandVersion('pi'),
      cmdc: commandVersion('cmdc'),
      agy: commandVersion('agy'),
      herdr: commandVersion('herdr'),
      orca: commandVersion('orca'),
      node: process.version,
      git: commandVersion('git'),
    },
  }
  writeFileSync(join(snapshotsDir, 'runtime-versions.json'), `${JSON.stringify(versions, null, 2)}\n`)

  return snapshotsDir
}

if (process.argv[1] && resolve(process.argv[1]) === scriptPath) {
  const output = createSnapshot()
  console.log(`Wrote sanitized snapshot files under ${relative(process.cwd(), output) || output}`)
}
