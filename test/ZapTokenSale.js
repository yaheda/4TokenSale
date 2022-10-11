var ZapTokenSale = artifacts.require('ZapTokenSale');

contract('ZapTokenSale', function(accounts) {

  it('initialises contract with corrrect values', async function() {
    var instance = await ZapTokenSale.deployed();
    var address = instance.address;

    assert.notEqual(address, 0x0, 'the contract has address');

    var tokenContract = await instance.tokenContract();
    address = tokenContract.address;

    assert.notEqual(address, 0x0, 'has token contract');

    var tokenPrice = 1000000000000000 // in wei
    var price = await instance.tokenPrice();

    assert.equal(price, tokenPrice, 'token price is correct');
  });
});