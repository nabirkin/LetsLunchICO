var LetsLunchToken = artifacts.require("./LetsLunchToken.sol");
var LetsLunchPrePresale = artifacts.require("./LetsLunchPrePresale.sol");

module.exports = function(deployer) {

    var startAt = Math.round(Date.now() / 1000);
    var period = 10;
    var multisig = web3.eth.accounts[0];
    var rate = 1000;
    var hardcap = 1500;
    var minPaymentLimit = 10;
    // var restrictedWallet = web3.eth.accounts[1];
    // var restrictedPercent = 50;

    deployer.deploy(LetsLunchToken).then(function() {
        deployer.deploy(LetsLunchPrePresale, startAt, period, rate, hardcap, minPaymentLimit, LetsLunchToken.address, multisig);
    });
};
