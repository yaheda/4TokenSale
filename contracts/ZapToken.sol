pragma solidity ^0.5.0;

contract ZapToken {

  uint256 public totalSupply;
  string public name = "ZapToken";
  string public symbol = "Zap";
  string public standard = "ZapToken v1.0";

  mapping(address => uint256) public balanceOf;

  mapping(address => mapping(address => uint256)) public allowance;

  event TransferEvent(
    address indexed _from,
    address indexed _to,
    uint256 _value
  );

  event ApproveEvent(
    address indexed _owner,
    address indexed _spender,
    uint256 _value
  );

  constructor(uint256 _initialSupply) public {
    totalSupply = _initialSupply;
    balanceOf[msg.sender] = _initialSupply;
  }

  function transfer(address _to, uint256 _value) public returns (bool success) {
    require(balanceOf[msg.sender] >= _value);

    balanceOf[msg.sender] -= _value;
    balanceOf[_to] += _value;

    emit TransferEvent(msg.sender, _to, _value);

    return true;
  }

  function approve(address _spender, uint256 _value) public returns (bool success) {

    allowance[msg.sender][_spender] = _value;

    emit ApproveEvent(msg.sender, _spender, _value);
    return true;
  } 

  function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
    require(balanceOf[_from] >= _value);
    require(allowance[_from][msg.sender] >= _value);

    balanceOf[_from] -= _value;
    balanceOf[_to] += _value;
    allowance[_from][msg.sender] -= _value;

    emit TransferEvent(_from, _to, _value);
    return true;
  }

}