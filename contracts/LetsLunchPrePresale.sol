pragma solidity ^0.4.4;

import "./LetsLunchToken.sol";
import "./libs/crowdsale/CappedCrowdsale.sol";

contract LetsLunchPrePresale is CappedCrowdsale {

  uint256 public minPayment;
  uint256 public discountBorder = 50 * 1 ether;

  function LetsLunchPrePresale(
    uint256 _startTime,
    uint256 _period,
    uint256 _rate,
    uint256 _cap,
    uint256 _minPayment,
    address _token,
    address _wallet
  )
  CappedCrowdsale(_cap * 1 ether)
  Crowdsale(_startTime, _startTime + _period * 1 days, _rate, _wallet)
  {
    // instead of Crowdsale creating token, we create it beforehand to decouple & split gas costs
    // remember to also token.transferOwnership to this contract after deploying
    token = LetsLunchToken(_token);

    minPayment = _minPayment * 1 ether;

  }

  // overriding Crowdsale#validPurchase to add min payment amount checking
  // @return true if investors can buy at the moment
  function validPurchase() internal constant returns (bool) {
    bool withinMinPaymentLimit = minPayment > msg.value;
    return super.validPurchase() && !withinMinPaymentLimit;
  }

  function createTokenContract() internal returns (MintableToken) {
    return token; // don't actually create new token since we're assigning in constructor
  }

  // overriding Crowdsale#calculateBonusTokens to add bonus tokens calculation
  function calculateBonusTokens(uint256 _base) internal constant returns (uint256 _bonusTokens) {
    if (msg.value < discountBorder)
      _bonusTokens = _base.mul(40).div(100); // 40%
    else
      _bonusTokens = _base.mul(45).div(100); // 45%
  }

}