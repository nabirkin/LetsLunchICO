var LetsLunchToken = artifacts.require("./LetsLunchToken.sol");

const assertJump = require('./helpers/assertJump');

contract('LetsLunchToken', function(accounts) {

    before(async function() {
        this.token = await LetsLunchToken.new();
    })

    it('Should name equals LetsLunch Token', async function() {
        let name = await this.token.name.call();
        assert.equal(name, "LetsLunch Token", "Token name is wrong");
    });

    it('Should symbol equals LLT', async function() {
        let symbol = await this.token.symbol.call();
        assert.equal(symbol, "LLT", "Token symbol is wrong");
    });

    it('Should decimals is 18', async function() {
        let decimals = await this.token.decimals.call();
        assert.equal(decimals, 18, "Token decimals is wrong");
    });

    it('Should not mint from not owner', async function() {
        const startBalance = await this.token.balanceOf(accounts[1]);

        try {
            await this.token.mint(accounts[1], 10000, {from : accounts[2]});

            assert.fail('should have thrown before');

        } catch ( error ) {
            assertJump(error);
        }

        const endBalance = await this.token.balanceOf(accounts[1]);

        assert.equal(startBalance.valueOf(), endBalance.valueOf());
    })

});