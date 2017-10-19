pragma solidity ^0.4.4;

import './libs/ownership/Ownable.sol';

/**
 * @title Whitelist
 * @dev The Whitelist contract manages an early participant whitelist
 */
contract Whitelist is Ownable {

    // Addresses that are allowed to have extra bonus. For testing, for ICO partners, etc.
    mapping (address => bool) public whitelist;

    // Address early participation whitelist status changed
    event Whitelisted(address addr, bool status);

    // allow addresses to do early participation
    function setEarlyParticipantWhitelist(address _investor, bool _status) onlyOwner {
        whitelist[_investor] = _status;
        Whitelisted(_investor, _status);
    }

    // allow addresses to do early participation
    function addEarlyParticipantWhitelist(address[] _investors) onlyOwner {
        for (uint256 i; i < _investors.length; i++) {
            setEarlyParticipantWhitelist(_investors[i], true);
        }
    }

    function isInWhitelist(address _investor) public constant returns (bool) {
        return whitelist[_investor];
    }

}
