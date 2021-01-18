import * as readline from 'readline';
import fetch from 'node-fetch';
import { createWriteStream, PathLike } from 'fs';

export function writeProgress(p: string): void {
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0, undefined);
  process.stdout.write(p);
}

export async function download(
  url: string,
  path: PathLike,
  onProgress: (percentage: number) => any,
) {
  const res = await fetch(url);
  await new Promise<void>((resolve, reject) => {
    const fileStream = createWriteStream(path);
    res.body.pipe(fileStream);
    const contentLength = Number(res.headers.get('content-length'));
    let contentReceived = 0;
    res.body.on('error', err => {
      reject(err);
    });
    res.body.on('data', p => {
      contentReceived += p.length;
      onProgress(Math.floor((contentReceived / contentLength) * 100));
    });
    fileStream.on('finish', function() {
      resolve();
    });
  });
}
