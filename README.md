# svm-js

Solidity Version Manager inspired by nvm & jabba. Speeds up Solidity compilation in Truffle projects and allows you to easily install & switch between different versions of the Solidity compiler (solc) from the Terminal.

svm-js is a re-implementation of [svm](https://github.com/josh-richardson/svm) in TypeScript. It is currently in beta and is unstable. It can be used from the command-line in the same way as svm, or included in Truffle projects in order to speed up the `truffle compile` command significantly by using native solc binaries compiled for your platform of choice, rather than the solcjs implementation.

## Installation

Run `npm install svm-js` if you wish to use svm-js as a library, or `npm install -g svm-js` if you want to use svm-js from the commandline. Installing using the `-g` option will add a loader function for svm-js your bashrc/zshrc, allowing you to use the `svm` command globally. Note that this CLI functionality currently only works on Linux and macOS, with Windows support coming soon.

## Usage with Truffle

In your `truffle-config.js` file, replace the replace the compiler version specifier with `useNativeSolidity("<compiler version>")`. This will invoke svm-js, which will automatically download and use the correct native compiler version, and add it to the PATH variable for the running Node process, allowing Truffle to use it. Example usage:

```javascript
const { useNativeSolidity } = require("svm-js");

module.exports = {
  networks: {
      // networks
  },
  compilers: {
    solc: {
      version: useNativeSolidity("0.6.12"),    
    }
  }
}
```

## Usage with your shell
![screenshot](https://i.imgur.com/JnwPkIl.png)

svm-js integrates with your shell and provides an `svm` command. The usage is identical to that of [svm](https://github.com/josh-richardson/svm).

### Executables
Executables used by svm are downloaded using TLS, and are served directly from the Solidity Github [releases page](https://github.com/ethereum/solidity/releases) for Windows and Linux. Unfortunately native images are not supplied for earlier solc versions on macOS, so they are downloaded from [this repository](https://github.com/web3j/solidity-darwin-binaries/releases).


### Notes:

svm-js should be compatible with Node versions 10+. It also exposes useful functionality to download arbitary versions of Solidity when used as a library, beyond just the `useNativeSolidity` command. Using svm-js in Hardhat projects is not needed, as it already downloads & uses native solc binaries. 