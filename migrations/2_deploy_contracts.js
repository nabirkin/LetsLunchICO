var LetsLunchToken = artifacts.require("./LetsLunchToken.sol");

module.exports = function(deployer) {
    deployer.deploy(LetsLunchToken);
};
