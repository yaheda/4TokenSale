App = {

  web3Provider: null,
  contracts: {

  },
  account: null,
  tokensAvailable: 750000,

  init: () => {
    console.log('App init');
    return App.initWeb3();
  },

  initWeb3: async function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }

    

    return App.initContracts();
  },

  initContracts: async () => {

    var zapTokenSale = await $.getJSON('ZapTokenSale.json');
    App.contracts.ZapTokenSale = TruffleContract(zapTokenSale);
    App.contracts.ZapTokenSale.setProvider(App.web3Provider);

    var tokenSaleInstance = await App.contracts.ZapTokenSale.deployed();
    console.log("ZapTokenSale Address", tokenSaleInstance.address);

    var zapToken = await $.getJSON('ZapToken.json');
    App.contracts.ZapToken = TruffleContract(zapToken);
    App.contracts.ZapToken.setProvider(App.web3Provider);

    var tokenInstance = await App.contracts.ZapToken.deployed();
    console.log("ZapToken Address", tokenInstance.address);

    App.listenForEvents();

    return App.render();
  },

  listenForEvents: async () => {
    var tokenSaleInstance = await App.contracts.ZapTokenSale.deployed();

    tokenSaleInstance.SellEvent({}, {
      fromBlock: 0,
      toBlock: 'latest'
    }).watch(function(error, event){
      console.log("Event triggered", event);
      App.render();
    })
  },

  render: async () => {
    if (App.loading) {
      return;
    }
    App.loading = true;

    web3.eth.getCoinbase((err, account) => {
      if (err == null) {
        App.account = account;
        $('#account-address').html("Your Account: " + account);
      }
    });

    var loader = $('#loader');
    var content = $('#content');

    loader.show();
    content.hide();

    var tokenSaleInstance = await App.contracts.ZapTokenSale.deployed();
    var tokenInstance = await App.contracts.ZapToken.deployed();

    App.tokenPrice = await tokenSaleInstance.tokenPrice();
    App.tokensSold = (await tokenSaleInstance.tokensSold()).toNumber();;

    var tokenContract = await tokenSaleInstance.tokenContract();
    var userBalance = await tokenInstance.balanceOf(App.account);

    var userBalanceAA = await tokenInstance.balanceOf(tokenContract);
    //debugger;

    $('.zap-balance').html(userBalance.toNumber());

    $('.token-price').html(web3.fromWei(App.tokenPrice, 'ether').toNumber());
    $('.tokens-sold').html(App.tokensSold);
    $('.tokens-available').html(App.tokensAvailable);

    var progressPercent = (App.tokensSold / App.tokensAvailable) * 100;
    $('#progress').css('width', progressPercent + '%');


    loader.hide();
    content.show();
  },

  buyTokens: async () => {
    var loader = $('#loader');
    var content = $('#content');

    loader.show();
    content.hide();


    var numberOfTokens = $('#numberOfTokens').val();

    var tokenSaleInstance = await App.contracts.ZapTokenSale.deployed();
    var result = await tokenSaleInstance.buyTokens(numberOfTokens, { 
      from: App.account,
      value: numberOfTokens * App.tokenPrice.toNumber(),
      gas: 500000
    });

    console.log('Tokens Bought');
    $('from').trigger('reset');


    loader.hide();
    content.show();
  }

}

$(() => {
  $(window).load(() => {
    App.init();
  })
})