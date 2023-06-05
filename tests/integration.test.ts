import { existsSync } from 'fs'
import { readFile, rm } from 'fs/promises'
import { Agent } from 'https'
import { join } from 'path'
import process from 'process'

import { Headers } from 'node-fetch'
import { temporaryDirectory } from 'tempy'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { fetchLatest } from '../src/index.js'

const baseRelease = {
  repository: 'netlify/live-tunnel-client',
  version: '0.2.10',
}

describe('integration', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  const headers = new Headers()

  if (process.env.GITHUB_TOKEN) {
    headers.append('Authorization', `Bearer ${process.env.GITHUB_TOKEN}`)
  }

  // Do as little tests as necessary here for now, as we run into GH rate limiting

  test('should download simple file with custom agent', async () => {
    const tmpDir = temporaryDirectory()
    await fetchLatest(
      {
        ...baseRelease,
        package: 'checksums.txt',
        destination: tmpDir,
        extract: false,
      },
      { agent: new Agent({ keepAlive: false }), headers },
    )

    const file = join(tmpDir, 'checksums.txt')

    expect(existsSync(file)).toBe(true)

    const content = await readFile(file, 'utf-8')
    expect(content).toContain('live-tunnel-client-linux-386.tar.gz')

    await rm(tmpDir, { force: true, recursive: true, maxRetries: 10 })
  })

  test('should download an archive and extract it', async () => {
    const tmpDir = temporaryDirectory()
    await fetchLatest(
      {
        ...baseRelease,
        package: 'live-tunnel-client-linux-386.tar.gz',
        destination: tmpDir,
        extract: true,
      },
      { headers },
    )

    const file = join(tmpDir, 'live-tunnel-client')

    expect(existsSync(file)).toBe(true)

    await rm(tmpDir, { force: true, recursive: true, maxRetries: 10 })
  })
})
