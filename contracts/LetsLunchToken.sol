pragma solidity ^0.4.4;

import './libs/token/MintableToken.sol';

contract LetsLunchToken is MintableToken {

  string public symbol = "LLT";
  string public name = "LetsLunch Token";
  uint public decimals = 18;
}
