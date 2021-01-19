import fetch from 'node-fetch';
import { homedir } from 'os';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

if (!(global as any).fetch) {
  (global as any).fetch = fetch;
}

export interface Config {
  baseDirectory: string;
  versionsDirectory: string;
}

export var config: Config = {
  baseDirectory: join(homedir(), '.svm'),
  versionsDirectory: join(homedir(), '.svm', 'versions'),
};

export function load(_config: Config) {
  config = _config;
}

if (!existsSync(config.versionsDirectory)) {
  mkdirSync(config.versionsDirectory, { recursive: true });
}

export * from './frameworks';
export * from './solc';
export * from './solc-versions';
