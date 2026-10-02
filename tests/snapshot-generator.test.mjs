import assert from 'node:assert/strict'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { inventoryApprovedProfiles, sanitizeSettings } from '../scripts/snapshot-agent-setup.mjs'

const policy = {
  settingsKeys: [
    'shellPath',
    'lastChangelogVersion',
    'defaultProvider',
    'defaultModel',
    'defaultThinkingLevel',
    'packages',
    'theme',
    'endpoint',
  ],
}

test('exports only allowlisted settings and rejects unsafe package sources', () => {
  const home = process.platform === 'win32' ? 'C:\\Users\\example' : '/home/example'
  const result = sanitizeSettings(
    {
      shellPath: `${home}/tools/bash`,
      defaultProvider: 'provider',
      defaultModel: 'model',
      theme: 'light',
      packages: ['npm:public-package@1.2.3', 'https://private.example.invalid/package.tgz'],
      apiKey: `provider-${'x'.repeat(32)}`,
      privateEndpoint: 'https://private.example.invalid',
      endpoint: 'https://private.example.invalid',
    },
    policy,
    home,
  )

  assert.equal(result.shellPath, '${HOME}/tools/bash')
  assert.deepEqual(result.packages, ['npm:public-package@1.2.3'])
  assert.equal(Object.hasOwn(result, 'apiKey'), false)
  assert.equal(Object.hasOwn(result, 'privateEndpoint'), false)
  assert.equal(result.endpoint, '<REDACTED_URL>')
})

test('does not mistake a sibling home directory for the configured home', () => {
  const home = process.platform === 'win32' ? 'C:\\Users\\example' : '/home/example'
  const sibling = `${home}-private/tools/bash`
  const result = sanitizeSettings({ shellPath: sibling }, policy, home)
  assert.equal(result.shellPath, '<REDACTED_PATH>')
})

test('inventories only explicitly approved profile filenames', () => {
  const root = mkdtempSync(join(tmpdir(), 'ss-wd-profiles-'))
  try {
    mkdirSync(root, { recursive: true })
    writeFileSync(join(root, 'worker.md'), 'worker\n')
    writeFileSync(join(root, 'private-project.md'), 'private\n')
    const result = inventoryApprovedProfiles(root, ['worker.md'])
    assert.deepEqual(result.map((item) => item.name), ['worker.md'])
  } finally {
    rmSync(root, { recursive: true, force: true })
  }
})
