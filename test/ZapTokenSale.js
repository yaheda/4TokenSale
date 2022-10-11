var ZapTokenSale = artifacts.require('ZapTokenSale');

contract('ZapTokenSale', function(accounts) {

  it('initialises contract with corrrect values', async function() {
    var instance = await ZapTokenSale.deployed();
    var address = instance.address;

    assert.notEqual(address, 0x0, 'the contract has address');

    var tokenContract = await instance.tokenContract();
    address = tokenContract.address;

    assert.notEqual(address, 0x0, 'has token contract');

    var tokenPrice = 1000000000000000; // in wei
    var price = await instance.tokenPrice();

    assert.equal(price, tokenPrice, 'token price is correct');
  });

  it('buy tokens', async function() {
    var instance = await ZapTokenSale.deployed();

    var tokenPrice = 1000000000000000;
    var numberOfTokens = 10;
    var buyer = accounts[1];

    var value = numberOfTokens * tokenPrice;
    var receipt = await instance.buyTokens(numberOfTokens, { from: buyer, value: value});
    var tokensSold = await instance.tokensSold();

    assert.equal(tokensSold.toNumber(), numberOfTokens, 'increment number of tokens sold');
  });

});