import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { cpSync, mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))
const verifier = join(repoRoot, 'scripts', 'verify-public-snapshot.mjs')

function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'ss-wd-verifier-'))
  mkdirSync(join(root, 'scripts'))
  cpSync(verifier, join(root, 'scripts', 'verify-public-snapshot.mjs'))
  execFileSync('git', ['init', '-q'], { cwd: root })
  execFileSync('git', ['config', 'user.email', 'audit@example.invalid'], { cwd: root })
  execFileSync('git', ['config', 'user.name', 'audit'], { cwd: root })
  return root
}

function run(root) {
  return spawnSync(process.execPath, ['scripts/verify-public-snapshot.mjs'], {
    cwd: root,
    encoding: 'utf8',
  })
}

test('passes a clean staged and working tree', () => {
  const root = fixture()
  try {
    writeFileSync(join(root, 'README.md'), '# Safe fixture\n')
    execFileSync('git', ['add', 'README.md'], { cwd: root })
    const result = run(root)
    assert.equal(result.status, 0, result.stderr)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('fails when the index contains a secret hidden by clean working-tree content', () => {
  const root = fixture()
  try {
    const token = ['github', 'pat', 'A'.repeat(24)].join('_')
    writeFileSync(join(root, 'candidate.txt'), `${token}\n`)
    execFileSync('git', ['add', 'candidate.txt'], { cwd: root })
    writeFileSync(join(root, 'candidate.txt'), 'safe working tree content\n')
    const result = run(root)
    assert.notEqual(result.status, 0)
    assert.match(result.stderr, /index:candidate\.txt: GitHub token/)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('fails on an unquoted generic credential assignment', () => {
  const root = fixture()
  try {
    writeFileSync(join(root, 'settings.ini'), `api_key=${'z'.repeat(32)}\n`)
    const result = run(root)
    assert.notEqual(result.status, 0)
    assert.match(result.stderr, /generic credential assignment/)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('fails on generic credentials and common cloud access keys', () => {
  const root = fixture()
  try {
    const candidate = {
      apiKey: `provider-${'x'.repeat(32)}`,
      awsAccessKeyId: `AKIA${'A'.repeat(16)}`,
    }
    writeFileSync(join(root, 'candidate.json'), `${JSON.stringify(candidate)}\n`)
    const result = run(root)
    assert.notEqual(result.status, 0)
    assert.match(result.stderr, /generic credential assignment/)
    assert.match(result.stderr, /AWS access key/)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})

test('fails closed on binary public candidates', () => {
  const root = fixture()
  try {
    writeFileSync(join(root, 'candidate.bin'), Buffer.from([0, 1, 2, 3]))
    const result = run(root)
    assert.notEqual(result.status, 0)
    assert.match(result.stderr, /binary candidate requires explicit exclusion or review/)
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
