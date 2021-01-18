import fetch from 'node-fetch';
import { homedir } from 'os';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

if (!(globalThis as any).fetch) {
  (globalThis as any).fetch = fetch;
}

export interface Config {
  baseDirectory: string;
}

export var config: Config = {
  baseDirectory: join(homedir(), '.svm', 'versions'),
};

export function load(_config: Config) {
  config = _config;
}
if (!existsSync(config.baseDirectory)) {
  mkdirSync(config.baseDirectory, { recursive: true });
}

export * from './solc';
export * from './solc-versions';
