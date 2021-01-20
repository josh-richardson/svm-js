import { fetchPaginate } from 'fetch-paginate';
import { Release, Solc } from '.';
import * as fs from 'fs';
import { join, normalize } from 'path';
import * as os from 'os';

export class SolcVersions {
  public readonly baseDirectory: string;
  public readonly versionsDirectory: string;

  constructor(baseDirectory: string = join(os.homedir(), '.svm')) {
    this.baseDirectory = normalize(baseDirectory);
    this.versionsDirectory = join(baseDirectory, 'versions');
    if (!fs.existsSync(this.versionsDirectory)) {
      fs.mkdirSync(this.versionsDirectory, { recursive: true });
    }
  }

  async getRemoteVersions(): Promise<Solc[]> {
    const response = await fetchPaginate('https://api.github.com/repos/ethereum/solidity/releases?per_page=100');
    let githubSolidityReleases = response.items.map(element => new Solc(element as Release, this.versionsDirectory));
    if (os.type() === 'Darwin') {
      const macResponse = await fetchPaginate(
        'https://api.github.com/repos/web3j/solidity-darwin-binaries/releases?per_page=100',
      );
      const macReleases = macResponse.items.map(element => new Solc(element as Release, this.versionsDirectory));
      githubSolidityReleases = githubSolidityReleases.map(i => {
        const relevant = macReleases.find(j => j.releaseMeta.tag_name === i.releaseMeta.tag_name);
        if (relevant) {
          i.releaseMeta.assets = [...i.releaseMeta.assets, ...relevant.releaseMeta.assets];
        }
        return i;
      });
    }
    return githubSolidityReleases;
  }

  solcFromVersion(version: string): Solc {
    return new Solc(
      JSON.parse(fs.readFileSync(join(this.versionsDirectory, version, 'meta.json'), 'utf8')),
      this.versionsDirectory,
    );
  }

  getLocalVersions(): Solc[] {
    return fs.readdirSync(this.versionsDirectory).map(i => this.solcFromVersion(i));
  }
}
