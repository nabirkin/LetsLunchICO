pragma solidity ^0.4.4;

import "./LetsLunchToken.sol";
import "./libs/crowdsale/CappedCrowdsale.sol";
import "./libs/crowdsale/RefundableCrowdsale.sol";
import "./libs/lifecycle/Pausable.sol";

contract LetsLunchPresale is CappedCrowdsale, RefundableCrowdsale, Pausable {

    function LetsLunchPresale(
        uint256 _startTime,
        uint256 _period,
        uint256 _rate,
        uint256 _goal,
        uint256 _cap,
        address _token,
        address _wallet
    )
    CappedCrowdsale(_cap * 1 ether)
    FinalizableCrowdsale()
    RefundableCrowdsale(_goal * 1 ether)
    Crowdsale(_startTime, _startTime + _period * 1 days, _rate, _wallet)
    {
        //As goal needs to be met for a successful crowdsale
        //the value needs to less or equal than a cap which is limit for accepted funds
        require(_goal <= _cap);

        // instead of Crowdsale creating token, we create it beforehand to decouple & split gas costs
        // remember to also token.transferOwnership to this contract after deploying
        token = LetsLunchToken(_token);
    }

    function createTokenContract() internal returns (MintableToken) {
        return token; // don't actually create new token since we're assigning in constructor
    }

    // overriding Crowdsale#validPurchase to add extra cap logic
    // @return false when the contract is paused.
    function validPurchase() internal constant returns (bool) {
        return super.validPurchase() && !paused;
    }

    // overriding Crowdsale#calculateBonusTokens to add bonus tokens calculation
    function calculateBonusTokens(uint256 base) internal constant returns (uint256 bonusTokens) {
        uint256 period = (endTime - startTime) / 1 days;
        if(now < startTime + period * 1 days) {
            bonusTokens = base.div(4);
        } else if(now >= startTime + (period * 1 days).div(4) && now < startTime + (period * 1 days).div(4).mul(2)) {
            bonusTokens = base.div(10);
        } else if(now >= startTime + (period * 1 days).div(4).mul(2) && now < startTime + (period * 1 days).div(4).mul(3)) {
            bonusTokens = base.div(20);
        }
    }
}
