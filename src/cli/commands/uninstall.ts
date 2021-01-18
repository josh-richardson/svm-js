import { Command, command, param } from 'clime';
import { SolcVersions } from '../../solc-versions';

@command({
  description: 'Uninstall a locally installed version',
})
export default class extends Command {
  async execute(
    @param({
      description: 'The version to uninstall',
      required: true,
    })
    version: string,
  ): Promise<string> {
    SolcVersions.getLocalVersions()
      .find(i => i.matches(version))
      ?.uninstall();
    return `Uninstalled ${version} successfully`;
  }
}
