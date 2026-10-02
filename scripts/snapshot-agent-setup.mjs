#!/usr/bin/env node

import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))
const snapshotsDir = join(repoRoot, 'snapshots')
mkdirSync(snapshotsDir, { recursive: true })

const secretKey = /(token|secret|password|cookie|credential|private.?key|authorization|oauth|session)/i

function sha256File(path) {
  return createHash('sha256').update(readFileSync(path)).digest('hex')
}

function inventoryFiles(root, extension) {
  if (!existsSync(root)) return []
  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
    .map((entry) => {
      const path = join(root, entry.name)
      return { name: entry.name, sha256: sha256File(path), bytes: statSync(path).size }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
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

function sanitize(value, key = '') {
  if (secretKey.test(key)) return '<REDACTED>'
  if (Array.isArray(value)) return value.map((item) => sanitize(item))
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([name, item]) => [name, sanitize(item, name)]))
  }
  if (typeof value === 'string') {
    const home = homedir().replaceAll('\\', '/')
    const normalized = value.replaceAll('\\', '/')
    return normalized.toLowerCase().startsWith(home.toLowerCase())
      ? `\${HOME}${normalized.slice(home.length)}`
      : value
  }
  return value
}

const home = homedir()
const piRoot = join(home, '.pi', 'agent')
const inventory = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  note: 'First-party portable metadata only. External product implementations, credentials, memories, binaries and transcripts are excluded.',
  piAgentProfiles: inventoryFiles(join(piRoot, 'agents'), '.md'),
}
writeFileSync(join(snapshotsDir, 'capability-inventory.json'), `${JSON.stringify(inventory, null, 2)}\n`)

const settingsPath = join(piRoot, 'settings.json')
if (existsSync(settingsPath)) {
  const settings = sanitize(JSON.parse(readFileSync(settingsPath, 'utf8')))
  writeFileSync(join(snapshotsDir, 'pi-settings.sanitized.json'), `${JSON.stringify(settings, null, 2)}\n`)
}

const versions = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  tools: {
    pi: commandVersion('pi'),
    cmdc: commandVersion('cmdc'),
    agy: commandVersion('agy'),
    node: process.version,
    git: commandVersion('git'),
  },
}
writeFileSync(join(snapshotsDir, 'runtime-versions.json'), `${JSON.stringify(versions, null, 2)}\n`)

console.log(`Wrote sanitized snapshot files under ${relative(process.cwd(), snapshotsDir) || snapshotsDir}`)
