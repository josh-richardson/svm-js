import { Command, command, metadata } from 'clime';
import { SolcVersions } from '../../solc-versions';

@command({
  description: 'List remote versions available for install',
})
export default class extends Command {
  @metadata
  async execute(): Promise<string> {
    return (await SolcVersions.getRemoteVersions())
      .reverse()
      .filter(i => i.isCompatible())
      .map(i => i.toString())
      .join('\n');
  }
}
