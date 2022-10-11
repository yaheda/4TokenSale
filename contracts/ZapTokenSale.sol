pragma solidity ^0.5.0;

import './ZapToken.sol';

contract ZapTokenSale {

  address admin;
  ZapToken public tokenContract;
  uint256 public tokenPrice;
  
  constructor(ZapToken _tokenContract, uint256 _tokenPrice) public {
    // assign admin
    admin = msg.sender;
    // assign token contract
    tokenContract = _tokenContract;
    // token price
    tokenPrice = _tokenPrice;

  }

  // buytin tokens
}