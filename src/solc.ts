import os from 'os';
import { download, writeProgress } from './utils';
import { join, basename, dirname, delimiter, normalize } from 'path';
import { chmodSync, existsSync, mkdirSync, renameSync, writeFileSync } from 'fs';
import extract from 'extract-zip';
import * as rimraf from 'rimraf';

export interface Author {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface Uploader {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}

export interface Asset {
  url: string;
  id: number;
  node_id: string;
  name: string;
  label?: any;
  uploader: Uploader;
  content_type: string;
  state: string;
  size: number;
  download_count: number;
  created_at: Date;
  updated_at: Date;
  browser_download_url: string;
}

export interface Release {
  url: string;
  assets_url: string;
  upload_url: string;
  html_url: string;
  id: number;
  author: Author;
  node_id: string;
  tag_name: string;
  target_commitish: string;
  name: string;
  draft: boolean;
  prerelease: boolean;
  created_at: Date;
  published_at: Date;
  assets: Asset[];
  tarball_url: string;
  zipball_url: string;
  body: string;
}

interface InstallData {
  asset?: Asset;
  postInstall: (path: string) => Promise<void>;
}

export class Solc {
  public readonly releaseMeta: Release;
  public readonly installPath: string;
  private readonly versionsDirectory: string;

  constructor(release: Release, versionsDirectory: string) {
    this.releaseMeta = release;
    this.versionsDirectory = versionsDirectory;
    this.installPath = join(versionsDirectory, this.releaseMeta.tag_name);
  }

  public matches = (version: string): boolean => {
    return this.releaseMeta.tag_name === version || this.releaseMeta.tag_name.substring(1) === version;
  };

  public toString = (showInstalled = false): string => {
    return `${this.releaseMeta.tag_name}${(showInstalled && this.installed() && ' (installed)') || ''}`;
  };

  public installed = (): boolean => {
    return existsSync(this.installPath);
  };

  public isCompatible = (): boolean => {
    return this.getInstallStructure().asset != undefined;
  };

  public getInstallStructure = (): InstallData => {
    if (os.type() === 'Darwin') {
      return {
        asset: this.releaseMeta.assets.find(i => ['solc-macos', 'solc_mac'].indexOf(i.name) !== -1),
        postInstall: async (path): Promise<void> => {
          chmodSync(path, '0755');
          renameSync(path, join(dirname(path), 'solc'));
        },
      };
    } else if (os.type() === 'Windows_NT') {
      return {
        asset: this.releaseMeta.assets.find(
          i => ['solc-windows.exe', 'solc-windows.zip', 'solidity-windows.zip'].indexOf(i.name) !== -1,
        ),
        postInstall: async (path): Promise<void> => {
          if (path.endsWith('.zip')) {
            await extract(path, { dir: dirname(path) });
          } else {
            renameSync(path, join(dirname(path), 'solc.exe'));
          }
        },
      };
    }
    return {
      asset: this.releaseMeta.assets.find(i => i.name === 'solc-static-linux'),
      postInstall: async (path): Promise<void> => {
        chmodSync(path, '0755');
        renameSync(path, join(dirname(path), 'solc'));
      },
    };
  };

  public install = async (): Promise<void> => {
    const installData = this.getInstallStructure();
    const downloadUrl = installData.asset?.browser_download_url;
    if (downloadUrl !== undefined) {
      console.log(`Downloading and installing ${downloadUrl}`);

      if (!existsSync(this.installPath)) mkdirSync(this.installPath, { recursive: true });

      const fileName = normalize(join(this.installPath, basename(downloadUrl)));
      await download(downloadUrl, fileName, progress => {
        writeProgress(`Downloading: ${progress}%`);
      });
      console.log('');

      installData.postInstall(fileName);

      writeFileSync(join(this.installPath, 'meta.json'), JSON.stringify(this.releaseMeta));
    } else {
      console.log(
        `Could not find a download URL for version ${this.releaseMeta.tag_name} for your current platform. Are you sure version ${this.releaseMeta.tag_name} appears in "svm ls-remote"?`,
      );
    }
  };

  public uninstall = (): void => {
    if (this.installed()) {
      rimraf.sync(this.installPath);
    }
  };

  public pathString = (): string => {
    return [
      this.installPath,
      ...process.env.PATH!.split(delimiter).filter(i => !i.startsWith(this.versionsDirectory)),
    ].join(delimiter);
  };

  public useProcess = (): string => {
    process.env.PATH = this.pathString();
    return 'native';
  };
}
