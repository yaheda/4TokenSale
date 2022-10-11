pragma solidity ^0.5.0;

import './ZapToken.sol';

contract ZapTokenSale {

  address admin;
  ZapToken public tokenContract;
  uint256 public tokenPrice;
  
  uint256 public tokensSold;

  constructor(ZapToken _tokenContract, uint256 _tokenPrice) public {
    // assign admin
    admin = msg.sender;
    // assign token contract
    tokenContract = _tokenContract;
    // token price
    tokenPrice = _tokenPrice;

  }

  function buyTokens(uint256 _numberOfTokens) public payable {
    // require that value is equal to tokens
    // require that there are enough tokens
    // require that transfer is successfull
    // keep track of token sold
    tokensSold += _numberOfTokens;
    // emit sell event
  }

}