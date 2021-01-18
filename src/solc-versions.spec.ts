import { SolcVersions } from './solc-versions';

describe('should successfully get versions', () => {
  test('first version should be v0.1.2', async () => {
    let versions = await SolcVersions.getVersions();
    versions.forEach(it => {
      it.release.assets.forEach(a => {
        console.log(a.browser_download_url);
      });
    });
    let firstVersion = versions.slice(-1)[0].release.tag_name;
    expect(firstVersion).toEqual('v0.1.2');
  });
});
