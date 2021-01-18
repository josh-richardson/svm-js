import { Command, command, metadata } from 'clime';
import { SolcVersions } from '../../solc-versions';

@command({
  description: 'List installed versions',
})
export default class extends Command {
  @metadata
  execute() {
    return SolcVersions.getLocalVersions().join('\n');
  }
}
