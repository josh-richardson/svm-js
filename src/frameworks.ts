import { SolcVersions } from './solc-versions';
import deasyncPromise from 'deasync-promise';

export async function useNativeSolidity(version: string): Promise<string> {
  const solc =
    SolcVersions.getLocalVersions().find(i => i.matches(version)) ??
    (await SolcVersions.getRemoteVersions()).find(i => i.matches(version));
  if (solc) {
    if (!solc.installed()) {
      await solc.install();
    }
    return solc.useProcess();
  }
  return version;
}

export function useNativeSoliditySync(version: string): string {
  return deasyncPromise(useNativeSolidity(version));
}
