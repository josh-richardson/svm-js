#!/usr/bin/env node
import * as Path from 'path';
import { CLI, Shim } from 'clime';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { config } from '..';

export interface Settings {
  lastUsed: string;
}

export default class Cli {
  static settingsFile = Path.join(config.baseDirectory, 'settings.json');
  public settings: Settings;

  constructor() {
    this.settings = existsSync(Cli.settingsFile)
      ? JSON.parse(readFileSync(Cli.settingsFile, 'utf8'))
      : { lastUsed: undefined, aliases: {} };
  }

  public async run(): Promise<void> {
    const cli = new CLI('svm', Path.join(__dirname, 'commands'));
    const shim = new Shim(cli);
    await shim.execute(process.argv);

    writeFileSync(Cli.settingsFile, JSON.stringify(this.settings));
  }
}

const cli = new Cli();

if (require.main === module) {
  cli.run();
}

export function instance(): Cli {
  return cli;
}
