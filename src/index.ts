import fetch from 'node-fetch';


interface Global extends NodeJS.Global {
  fetch: typeof fetch;
}
declare let global: Global;

if (!global.fetch) {
  global.fetch = fetch;
}

export * from './frameworks';
export * from './solc';
export * from './solc-versions';
