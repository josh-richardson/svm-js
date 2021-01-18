import { Command, command, metadata, param } from 'clime';
import { SolcVersions } from '../../solc-versions';

@command({
  description: 'Uninstall a locally installed version',
})
export default class extends Command {
  @metadata
  async execute() {
    // SolcVersions.getLocalVersions().find(i => )?.uninstall();
  }
}
