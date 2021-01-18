import { Command, command, param } from 'clime';
import { SolcVersions } from '../../solc-versions';
import { homedir } from 'os';
import { join } from 'path';

@command({
  description: 'Install a version',
})
export default class extends Command {
  async execute(
    @param({
      description: 'The version to install',
      required: true,
    })
    version: string,
  ) {
    const wantedVersion = (await SolcVersions.getRemoteVersions()).find(
      i =>
        i.releaseMeta.tag_name === version ||
        i.releaseMeta.tag_name.substring(1) === version,
    );
    if (wantedVersion !== undefined) {
      await wantedVersion.install();
      return `Version ${wantedVersion.releaseMeta.tag_name} installed!`;
    }
    return `Version ${version} not found!`;
  }
}
