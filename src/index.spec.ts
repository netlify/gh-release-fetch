import { newerVersion, fetchLatest } from "./index";

test('compare versions', () => {
  expect(newerVersion("0.1.0", "0.0.1")).toBe(true)
  expect(newerVersion("v0.1.0", "v0.0.1")).toBe(true)
  expect(newerVersion("v0.0.1", "")).toBe(true)

  expect(newerVersion("0.0.1", "0.0.1")).toBe(false)
  expect(newerVersion("v0.0.1", "v0.0.1")).toBe(false)
  expect(newerVersion("", "0.0.1")).toBe(false)
})

jest.mock('node-fetch');

describe('fetchLatest', () => {
  test('should throw error when api limit is reached', async () => {
    const fetch = require("node-fetch");
    const response = {
      status: 403,
      json: () =>
        Promise.resolve({
          message: 'API rate limit exceeded for ',
        }),
    };
    fetch.mockResolvedValue(response)

    await expect(
      fetchLatest({
        repository: 'netlify/test',
        package: 'test',
        destination: 'bin/test',
        version: '1.0.0',
        extract: true,
      })
    ).rejects.toEqual(
      new Error('API rate limit exceeded, please try again later')
    );
  });
});
