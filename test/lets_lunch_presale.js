var LetsLunchPresale = artifacts.require("./LetsLunchPresale.sol");

contract('LetsLunchPresale', function(accounts) {
  it("should assert true", function(done) {
    var lets_lunch_presale = LetsLunchPresale.deployed();
    assert.isTrue(true);
    done();
  });
});
