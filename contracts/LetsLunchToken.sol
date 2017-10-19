pragma solidity ^0.4.4;

import './libs/token/MintableToken.sol';

contract LetsLunchToken is MintableToken {

  // Metadata
  string public constant symbol = "LLT";
  string public constant name = "LetsLunch Token";
  uint8 public constant decimals = 18;
  string public constant version = "1.0";




}
