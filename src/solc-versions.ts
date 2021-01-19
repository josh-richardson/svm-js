import { fetchPaginate } from 'fetch-paginate';
import { config, Release, Solc } from '.';
import * as fs from 'fs';
import { join } from 'path';
import * as os from 'os';

export class SolcVersions {
  static async getRemoteVersions(): Promise<Solc[]> {
    const response = await fetchPaginate('https://api.github.com/repos/ethereum/solidity/releases?per_page=100');
    let githubSolidityReleases = response.items.map(element => new Solc(element as Release));
    if (os.type() === 'Darwin') {
      const macResponse = await fetchPaginate(
        'https://api.github.com/repos/web3j/solidity-darwin-binaries/releases?per_page=100',
      );
      const macReleases = macResponse.items.map(element => new Solc(element as Release));
      githubSolidityReleases = githubSolidityReleases.map(i => {
        let relevant = macReleases.find(j => j.releaseMeta.tag_name === i.releaseMeta.tag_name);
        if (relevant) {
          i.releaseMeta.assets = [...i.releaseMeta.assets, ...relevant.releaseMeta.assets];
        }
        return i;
      });
    }
    return githubSolidityReleases;
  }

  static solcFromVersion(version: string): Solc {
    return new Solc(JSON.parse(fs.readFileSync(join(config.versionsDirectory, version, 'meta.json'), 'utf8')));
  }

  static getLocalVersions(): Solc[] {
    return fs.readdirSync(config.versionsDirectory).map(i => this.solcFromVersion(i));
  }
}
