import { SolcVersions } from './solc-versions';

describe('should successfully get versions', () => {
  test('first version should be v0.1.2', async () => {
    const versions = await new SolcVersions().getRemoteVersions();
    const firstVersion = versions.slice(-1)[0].releaseMeta.tag_name;
    expect(firstVersion).toEqual('v0.1.2');
  });
});
