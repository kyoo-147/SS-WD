import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))

function markdownCandidates() {
  return execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard', '--', '*.md'], {
    cwd: repoRoot,
    encoding: 'utf8',
  })
    .split('\0')
    .filter(Boolean)
}

test('all relative Markdown links resolve', () => {
  const missing = []
  for (const file of markdownCandidates()) {
    const text = readFileSync(resolve(repoRoot, file), 'utf8')
    for (const match of text.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      const target = match[1].split('#')[0]
      if (!target || /^(?:https?:|mailto:)/.test(target)) continue
      if (!existsSync(resolve(repoRoot, dirname(file), target))) missing.push(`${file}: ${match[1]}`)
    }
  }
  assert.deepEqual(missing, [])
})
