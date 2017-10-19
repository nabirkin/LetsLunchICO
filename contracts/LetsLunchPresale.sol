pragma solidity ^0.4.4;

import "./LetsLunchToken.sol";
import "./FinalizableDistribution.sol";
import "./libs/crowdsale/CappedCrowdsale.sol";


contract LetsLunchPresale is CappedCrowdsale, FinalizableDistribution {


    function LetsLunchPresale(
        uint256 _startTime,
        uint256 _period,
        uint256 _rate,
        uint256 _cap,
        address _token,
        address _wallet,
        address _restrictedWallet,
        uint256 _restrictedPercent
    )
    CappedCrowdsale(_cap * 1 ether)
    FinalizableDistribution(_restrictedWallet, _restrictedPercent)
    Crowdsale(_startTime, _startTime + _period * 1 days, _rate, _wallet)
    {
        // instead of Crowdsale creating token, we create it beforehand to decouple & split gas costs
        // remember to also token.transferOwnership to this contract after deploying
        token = LetsLunchToken(_token);
    }

    function createTokenContract() internal returns (MintableToken) {
        return token; // don't actually create new token since we're assigning in constructor
    }


}
