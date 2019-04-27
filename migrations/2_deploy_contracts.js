var MarketStore = artifacts.require("./MarketStore.sol");
var Escrow = artifacts.require("./Escrow.sol");
var Market = artifacts.require("./Market.sol");

module.exports = async function(deployer) {
  await deployer.deploy(MarketStore);
  await deployer.deploy(Escrow);
  await deployer.deploy(Market, MarketStore.address, Escrow.address);
};
