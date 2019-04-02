var Migrations = artifacts.require("./Migrations.sol");
var MarketStore = artifacts.require("./MarketStore.sol");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(MarketStore);
};
