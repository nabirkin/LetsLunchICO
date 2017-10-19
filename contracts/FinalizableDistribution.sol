pragma solidity ^0.4.4;

import "./libs/crowdsale/FinalizableCrowdsale.sol";

contract FinalizableDistribution is FinalizableCrowdsale {

  address public restrictedWallet;
  uint256 public restrictedPercent;

  /**
   * event for token distribution logging
   * @param beneficiary who got the tokens
   * @param amount amount of tokens purchased
   */
  event TokenDistribute(address indexed beneficiary, uint256 amount);


  function FinalizableDistribution(
    address _restrictedWallet,
    uint256 _restrictedPercent) {
    restrictedWallet = _restrictedWallet;
    restrictedPercent = _restrictedPercent;
  }

  //  overriding FinalizableCrowdsale#finalization finalization task, called when owner calls finalize()
  function finalization() internal {

    uint256 totalTokens = token.totalSupply();
    uint256 restrictedTokens = totalTokens.mul(restrictedPercent).div(100 - restrictedPercent);

    token.mint(restrictedWallet, restrictedTokens);
    TokenDistribute(restrictedWallet, restrictedTokens);

    super.finalization();
  }
}
