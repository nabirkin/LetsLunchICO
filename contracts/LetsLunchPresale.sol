pragma solidity ^0.4.4;

import "./LetsLunchToken.sol";
import "./libs/crowdsale/CappedCrowdsale.sol";
import "./libs/crowdsale/RefundableCrowdsale.sol";

contract LetsLunchPresale is CappedCrowdsale, RefundableCrowdsale {

    function LetsLunchPresale(
        uint256 _startTime,
        uint256 _endTime,
        uint256 _rate,
        uint256 _goal,
        uint256 _cap,
        address _token,
        address _wallet
    )
    CappedCrowdsale(_cap)
    FinalizableCrowdsale()
    RefundableCrowdsale(_goal)
    Crowdsale(_startTime, _endTime, _rate, _wallet)
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
}
