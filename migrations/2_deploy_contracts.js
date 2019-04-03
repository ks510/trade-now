var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var MarketStore = artifacts.require("./MarketStore.sol");
var Escrow = artifacts.require("./Escrow.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(MarketStore);
  deployer.deploy(Escrow);
};
