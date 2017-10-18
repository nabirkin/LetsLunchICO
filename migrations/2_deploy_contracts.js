var LetsLunchToken = artifacts.require("./LetsLunchToken.sol");
var LetsLunchPresale = artifacts.require("./LetsLunchPresale.sol");

module.exports = function(deployer) {

    var startAt = Math.round(Date.now() / 1000);
    var period = 10;
    var multisig = web3.eth.accounts[0];
    var rate = 1000;
    var sofcap = 750;
    var hardcap = 15000;

    deployer.deploy(LetsLunchToken).then(function() {
        deployer.deploy(LetsLunchPresale, startAt, period, rate, sofcap, hardcap, LetsLunchToken.address, multisig);
    });
};
