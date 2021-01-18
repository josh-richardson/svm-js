import { Command, command, metadata } from 'clime';
import { instance } from '../cli';
import Use from './use';

@command({
  description: 'Set up svm to work with the current shell',
})
export default class extends Command {
  @metadata
  async execute(): Promise<string> {
    if (instance().settings.lastUsed !== undefined) {
      return await new Use().execute(instance().settings.lastUsed);
    }
    return '';
  }
}
