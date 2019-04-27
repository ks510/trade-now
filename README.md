# TradeNow
A decentralized marketplace built on the Ethereum blockchain. Developed using the Truffle framework and uses IPFS via Infura for storing large data. This project is part of my final year project at University of Sussex.

Author: Karen Suen

## Documentation
Visit the docs site: https://ks510.github.io/trade-now-docs

Can also be run locally by cloning this project, installing all package dependencies
using `npm install` and running these commands from the project root directory:
`cd docs/website`
`npm start`

The documentation site was created using OpenZeppelin's [solidity-docgen](https://github.com/OpenZeppelin/solidity-docgen) using the [NatSpec](https://solidity.readthedocs.io/en/develop/natspec-format.html) format and [docusaurus](https://docusaurus.io/en/) to generate static web pages. The site is hosted on [Github Pages](https://pages.github.com/).

## Dependencies
- [npm](https://www.npmjs.com/get-npm)
- [MetaMask (chrome extension)](https://metamask.io/)
- [Truffle](https://truffleframework.com/)
- [Solidity](https://solidity.readthedocs.io/en/v0.5.0/index.html)
- [IPFS](https://ipfs.io/) via [Infura](https://infura.io/docs)
- [IPFS API](https://www.npmjs.com/package/ipfs-http-client)
- [React.js](https://reactjs.org/)
- React Bootstrap v0.32.4
- [web3.js](https://web3js.readthedocs.io/en/1.0/)

## Project Structure
```
trade-now/
  client/
    public/
    src/
      components/
      containers/
      contracts/
    ...
  contracts/
  docs/
  migrations/
  test/
  ...
  truffle.config.js 
```
Brief summary of contents in key directories:
- `client/` the frontend client application (React project and assets)
- `client/src/` all React source code and assets for UI
- `client/src/components` custom components reused in the React app
- `client/src/containers` high level components representing web pages
- `client/src/contracts` compiled contract ABI files (.json)
- `contracts/` the smart contracts' source code
- `docs/` documentation files and docusaurus project for generating docs site
- `migration/` deployment scripts for migrating smart contracts to blockchain
- `test/` tests for smart contracts (Solidity and JavaScript tests)
- `truffle-config.js` Truffle project configuration file, specifies to use local test blockchain (via Ganache)

## Setup & Running the Dapp locally
These instructions are intended for Mac OS users. Other operating systems may need to run different commands.

### 1. Prequisites
- Clone this project using `git clone https://github.com/ks510/trade-now`
- Go to the cloned directory and run `npm install` to download and install all package dependencies
- Install and start up Ganache (GUI) to start the local development blockchain and copy the RPC Server URL e.g. `http://127.0.0.1:7574`. Ganache will also create 10 test accounts with 100 ETH for you to use (balances and keys are shown in Ganache window)
- Install MetaMask chrome extension change network to connect to custom RPC and paste the URL copied from Ganache
- Import test account(s) from Ganache (using the private keys) to MetaMask via 'Add Account'

### 2. Migrate the contracts
Run `truffle migrate --reset` in the project root to deploy the smart contracts to the development blockchain

### 2. Start the dapp locally
- Make sure Ganache window is running (note: new test accounts are created every time Ganache is closed and opened)
- In the project, go to `client/` directory and run `npm run start` to start the React app. This will open the client app in the a browser served at `localhost:3000`. Make sure you are using Chrome with MetaMask installed and setup.
- Since the dapp is running on a local test blockchain via Ganache, the marketplace will initially be empty.
