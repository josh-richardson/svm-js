import { Command, command, metadata } from 'clime';
import { SolcVersions } from '../../solc-versions';
import { instance } from '../cli';

@command({
  description: 'List installed versions',
})
export default class extends Command {
  @metadata
  execute() {
    return SolcVersions.getLocalVersions()
      .map(i => {
        return instance().settings.lastUsed === i.releaseMeta.tag_name ? i.toString() + ' (in use)' : i;
      })
      .join('\n');
  }
}
