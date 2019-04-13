const IPFS = require('ipfs-http-client');
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });
// use infuria IPFS node to instantie this IPFS instance

export default ipfs;
