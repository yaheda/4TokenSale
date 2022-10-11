var ZapToken = artifacts.require('ZapToken.sol');

contract('ZapToken', function (accounts) {

  it('init contract with correct values', async function(){
    var instance = await ZapToken.deployed();
    var name = await instance.name();
    var symbol = await instance.symbol();
    var standard = await instance.standard();

    assert.equal(name, 'ZapToken', 'has the correct name');
    assert.equal(symbol, 'Zap', 'has the correct symbol');
    assert.equal(standard, 'ZapToken v1.0', 'has the correct standard');
  });

  it('sets total supply', async function(){
    var instance = await ZapToken.deployed();
    var totalSupply = await instance.totalSupply();

    assert.equal(totalSupply.toNumber(), 1000000, 'sets total supply');

    var balanceOf = await instance.balanceOf(accounts[0]);
    assert(balanceOf.toNumber(), 1000000, 'allocates initial supply to admin account');
  });

  it('transfer', async function() {
    var instance = await ZapToken.deployed();

    try {
      await instance.transfer(accounts[1], 999999999999999);
    } catch(error) {
      assert(error.message.indexOf('revert') >= 0, 'error must contain revert');
    }

    var success = await instance.transfer.call(accounts[1], 250000, { from: accounts[0] });

    assert(success, 'it returns true');

    var receipt = await instance.transfer(accounts[1], 250000, { from: accounts[0] });

    assert.equal(receipt.logs.length, 1, 'triggers an event');
    assert.equal(receipt.logs[0].event, 'TransferEvent', 'should be "Transfer"');
    assert.equal(receipt.logs[0].args._from, accounts[0], 'from account');
    assert.equal(receipt.logs[0].args._to, accounts[1], 'to account');
    assert.equal(receipt.logs[0].args._value, 250000, 'amount value');

    var balanceOf = await instance.balanceOf(accounts[1]);

    assert.equal(balanceOf.toNumber(), 250000, 'transfers the amount');

    var balanceOfAdmin = await instance.balanceOf(accounts[0]);

    assert.equal(balanceOfAdmin.toNumber(), 1000000 - 250000, 'deducts amount from sender');
    
  });

  it('approves tokens for delegated transfer', async function() {
    var instance = await ZapToken.deployed();

    var success = await instance.approve.call(accounts[1], 100);
    
    assert(success, 'can approve true');

    var receipt = await instance.approve(accounts[1], 100);

    assert.equal(receipt.logs.length, 1, 'triggers an event');
    assert.equal(receipt.logs[0].event, 'ApproveEvent', 'should be "Transfer"');
    assert.equal(receipt.logs[0].args._owner, accounts[0], 'from account');
    assert.equal(receipt.logs[0].args._spender, accounts[1], 'to account');
    assert.equal(receipt.logs[0].args._value, 100, 'amount value');

    var allowance = await instance.allowance(accounts[0], accounts[1]);

    assert.equal(allowance.toNumber(), 100, 'stores allowance for delegated transfer');
  });

  it('transfer from - handle delegated transer', async function() {
    var instance = await ZapToken.deployed();
    fromAccount = accounts[2];
    toAccount = accounts[3];
    spendingAccount = accounts[4];

    await instance.transfer(fromAccount, 100, { from: accounts[0] });
    await instance.approve(spendingAccount, 10, { from: fromAccount });
    
    try {
      await instance.transferFrom(fromAccount, toAccount, 99999990000000, { from: spendingAccount });
    } catch(error) {
      assert(error.message.indexOf('revert') >= 0, 'error must contain revert');
    }

    try {
      await instance.transferFrom(fromAccount, toAccount, 20, { from: spendingAccount });
    } catch(error) {
      assert(error.message.indexOf('revert') >= 0, 'error must contain revert');
    }

    var success = await instance.transferFrom.call(fromAccount, toAccount, 10, { from: spendingAccount });
    assert(success, 'true');

    var receipt = await instance.transferFrom(fromAccount, toAccount, 10, { from: spendingAccount });

    assert.equal(receipt.logs.length, 1, 'triggers an event');
    assert.equal(receipt.logs[0].event, 'TransferEvent', 'should be "Transfer"');
    assert.equal(receipt.logs[0].args._from, fromAccount, 'from account');
    assert.equal(receipt.logs[0].args._to, toAccount, 'to account');
    assert.equal(receipt.logs[0].args._value.toNumber(), 10, 'amount value');

    var balanceFrom = await instance.balanceOf(fromAccount);
    assert.equal(balanceFrom.toNumber(), 90, 'deduct from sending account');

    var balanceTo = await instance.balanceOf(toAccount);
    assert.equal(balanceTo.toNumber(), 10, 'add to account');

    var allowance = await instance.allowance(fromAccount, spendingAccount);
    assert.equal(allowance, 0, 'deducs amount from allowance');

  });

});