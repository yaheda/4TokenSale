const ZapToken = artifacts.require("ZapToken");
const ZapTokenSale = artifacts.require('ZapTokenSale');

module.exports = async function(deployer) {
  await deployer.deploy(ZapToken, 1000000);

  var tokenPrice = 1000000000000000; // 0.001 eth
  await deployer.deploy(ZapTokenSale, ZapToken.address, tokenPrice);
};
