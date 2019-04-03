var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var MarketStore = artifacts.require("./MarketStore.sol");
var Escrow = artifacts.require("./Escrow.sol");
var Market = artifacts.require("./Market.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(MarketStore);
  deployer.deploy(Escrow);
  deployer.deploy(Market, MarketStore.address, Escrow.address);
};
