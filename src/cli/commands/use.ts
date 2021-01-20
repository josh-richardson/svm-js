import { Command, command, param } from 'clime';
import { writeFileSync } from 'fs';
import { SolcVersions } from '../../solc-versions';
import { instance } from '../cli';

@command({
  description: 'Use a specific solc version in the current shell',
})
export default class Use extends Command {
  async execute(
    @param({
      description: 'The version to use',
      required: true,
    })
    version: string,
  ): Promise<string> {
    const solcToUse = new SolcVersions().getLocalVersions().find(i => i.matches(version));
    if (solcToUse) {
      instance().settings.lastUsed = solcToUse.releaseMeta.tag_name;
      const activateCommand = `export PATH=${solcToUse.pathString()}`;
      const tempFile = process.env.TEMP_FILE;
      if (tempFile) {
        writeFileSync(tempFile, activateCommand);
        return `Version ${solcToUse.releaseMeta.tag_name} activated successfully`;
      }
      return activateCommand;
    }
    return 'The specified version is not installed';
  }
}
