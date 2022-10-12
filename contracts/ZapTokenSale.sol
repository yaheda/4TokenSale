pragma solidity ^0.5.0;

import './ZapToken.sol';

contract ZapTokenSale {

  address admin;
  ZapToken public tokenContract;
  uint256 public tokenPrice;
  
  uint256 public tokensSold;

  event SellEvent(
    address _buyer,
    uint256 _amount
  );

  constructor(ZapToken _tokenContract, uint256 _tokenPrice) public {
    // assign admin
    admin = msg.sender;
    // assign token contract
    tokenContract = _tokenContract;
    // token price
    tokenPrice = _tokenPrice;

  }

  // multiply
  function multiply(uint x, uint y) internal pure returns (uint z) {
    require(y == 0 || (z = x * y) / y == x);
  }

  function buyTokens(uint256 _numberOfTokens) public payable {
    // require that value is equal to tokens
    require(msg.value == multiply(_numberOfTokens, tokenPrice)); // for safe maths see ds-math
    // require that there are enough tokens
    require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);

    // require that transfer is successfull
    require(tokenContract.transfer(msg.sender, _numberOfTokens));


    // keep track of token sold
    tokensSold += _numberOfTokens;
    // emit sell event
    emit SellEvent(msg.sender, _numberOfTokens);
  }

  function endSale() public {
    // only an admin can
    require(msg.sender == admin);
    // transfer remaining tokens back to admin
    require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));
    // destroy contract
    selfdestruct(admin);
  }

}