import { Command, command, metadata, param } from 'clime';
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
  ) {
    SolcVersions.getLocalVersions()
      .find(i => i.releaseMeta.tag_name === version || i.releaseMeta.tag_name.substring(1) === version)
      ?.uninstall();
  }
}
