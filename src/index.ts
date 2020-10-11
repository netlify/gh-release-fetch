import * as download from 'download';
import * as mkdirp from 'mkdirp';
import fetch, { RequestInit } from 'node-fetch';
import { gt } from 'semver';
import { Agent } from 'http';

interface DownloadOptions { agent?: Agent; }

export interface Release {
  repository: string;
  package: string;
  destination: string;
  version: string;
  extract: boolean;
}

export async function fetchLatest(
  release: Release,
  fetchOptions?: RequestInit
) {
  release.version = await resolveRelease(release.repository, fetchOptions);
  return fetchVersion(release, { agent: fetchOptions && fetchOptions.agent });
}

export async function fetchVersion(
  release: Release,
  { agent }: DownloadOptions = {}
) {
  validateRelease(release);
  await downloadFile(release, { agent });
}

export async function updateAvailable(
  repository: string,
  currentVersion: string,
  fetchOptions?: RequestInit
): Promise<boolean> {
  const latestVersion = await resolveRelease(repository, fetchOptions);
  return newerVersion(latestVersion, currentVersion);
}

async function resolveRelease(
  repository: string,
  fetchOptions?: RequestInit
): Promise<string> {
  const res = await fetch(
    `https://api.github.com/repos/${repository}/releases/latest`,
    fetchOptions
  );
  const json = await res.json();
  if (
    res.status === 403 &&
    typeof json.message === 'string' &&
    json.message.includes('API rate limit exceeded')
  ) {
    throw new Error('API rate limit exceeded, please try again later');
  }
  return json.tag_name;
}

async function downloadFile(release: Release, { agent }: DownloadOptions) {
  const url = `https://github.com/${release.repository}/releases/download/${release.version}/${release.package}`;
  mkdirp.sync(release.destination);
  await download(url, release.destination, {
    extract: release.extract,
    agent
  });
}

function validateRelease(release: Release) {
  if (!release.repository) {
    throw new Error('Missing release repository');
  }

  if (!release.package) {
    throw new Error('Missing release package name');
  }

  if (!release.destination) {
    throw new Error('Missing release destination');
  }

  if (!release.version) {
    throw new Error('Missing release version');
  }
}

export function newerVersion(latestVersion: string, currentVersion: string): boolean {
  if (!latestVersion) {
    return false;
  }

  if (!currentVersion) {
    return true;
  }

  const l = latestVersion.replace(/^v/, '');
  const c = currentVersion.replace(/^v/, '');

  return gt(l, c);
}
