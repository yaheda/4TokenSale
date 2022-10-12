var ZapTokenSale = artifacts.require('ZapTokenSale');
var ZapToken = artifacts.require('ZapToken');

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
    var zapTokenInstance = await ZapToken.deployed();

    

    var tokenPrice = 1000000000000000;
    var numberOfTokens = 10;
    var admin = accounts[0];
    var buyer = accounts[1];
    var tokensAvailable = 750000;

    await zapTokenInstance.transfer(instance.address, tokensAvailable, { from: admin});

    var value = numberOfTokens * tokenPrice;
    var receipt = await instance.buyTokens(numberOfTokens, { from: buyer, value: value});
    var tokensSold = await instance.tokensSold();

    assert.equal(tokensSold.toNumber(), numberOfTokens, 'increment number of tokens sold');

    assert.equal(receipt.logs.length, 1, 'triggers an event');
    assert.equal(receipt.logs[0].event, 'SellEvent', 'should be "SellEvent"');
    assert.equal(receipt.logs[0].args._buyer, buyer, 'buyer');
    assert.equal(receipt.logs[0].args._amount, numberOfTokens, 'numberOfTokens');

    try {
      await instance.buyTokens(numberOfTokens, { from: buyer, value: 1}); // dont want to be under paid
    } catch(error) {
      assert(error.message.indexOf('revert') >= 0, 'value must equal number og tokens in wei');
    }

    try {
      await instance.buyTokens(numberOfTokens * 10000000000000, { from: buyer, value: value}); // dont want to be under paid
    } catch(error) {
      assert(error.message.indexOf('revert') >= 0, 'require that there are enough tokens');
    }

    var saleBalance = await zapTokenInstance.balanceOf(instance.address);
    assert.equal(saleBalance.toNumber(), tokensAvailable - numberOfTokens, 'transfer from saleinstance');

    var buyerBalance = await zapTokenInstance.balanceOf(buyer);
    assert.equal(buyerBalance.toNumber(),numberOfTokens, 'transfer to buyer');

    
  });

});