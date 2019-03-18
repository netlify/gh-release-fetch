import * as download from 'download';
import * as mkdirp from 'mkdirp';
import fetch from 'node-fetch';

export interface Release {
  repository: string;
  package: string;
  destination: string;
  version: string;
  extract: boolean;
}

export async function fetchLatest(release: Release) {
  release.version = await resolveRelease(release.repository);
  return fetchVersion(release);
}

export async function fetchVersion(release: Release) {
  validateRelease(release);
  await downloadFile(release);
}

async function resolveRelease(repository: string): Promise<string> {
  const res = await fetch(`https://api.github.com/repos/${repository}/releases/latest`);
  const json = await res.json();
  return json.tag_name;
}

async function downloadFile(release: Release) {
  const url = `https://github.com/${release.repository}/releases/download/${release.version}/${release.package}`;
  mkdirp.sync(release.destination);
  await download(url, release.destination, { extract: release.extract });
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
