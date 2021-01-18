import { Command, HelpInfo, Options, command, metadata, option } from 'clime';

export class DefaultCommandOptions extends Options {
  @option({
    toggle: true,
    flag: 'v',
  })
  version!: boolean;
}
@command({
  description: 'Install and manage versions of the Solidity Compiler (solc)',
})
export default class DefaultCommand extends Command {
  @metadata
  async execute(options: DefaultCommandOptions): Promise<string | HelpInfo> {
    if (options.version) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
      return require('../../../package').version;
    }
    return DefaultCommand.getHelp();
  }
}
