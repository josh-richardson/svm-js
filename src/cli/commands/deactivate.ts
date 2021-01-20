import { Command, command, metadata, param } from 'clime';
import { writeFileSync } from 'fs';
import { delimiter } from 'path';

@command({
  description: 'Deactivate svm in the current shell',
})
export default class extends Command {
  @metadata
  execute(): string {
    const tempFile = process.env.TEMP_FILE;
    if (tempFile) {
      writeFileSync(
        tempFile,
        'export PATH=' +
          process.env
            .PATH!.split(delimiter)
            .filter(i => i.indexOf('.svm/versions') == -1)
            .join(delimiter),
      );
      return 'svm deactivated';
    }
    return 'Failed to deactivate svm';
  }
}
