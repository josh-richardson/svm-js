import { SolcVersions } from './solc-versions';
import deasyncPromise from 'deasync-promise';

export async function nativeSolidity(version: string): Promise<string> {
  const solcVersions = new SolcVersions();

  const solc =
    solcVersions.getLocalVersions().find(i => i.matches(version)) ??
    (await solcVersions.getRemoteVersions()).find(i => i.matches(version));
  if (solc) {
    if (!solc.installed()) {
      await solc.install();
    }
    return solc.useProcess();
  }
  return version;
}

export function useNativeSolidity(version: string): string {
  return deasyncPromise(nativeSolidity(version));
}
