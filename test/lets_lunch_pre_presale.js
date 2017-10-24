let LetsLunchToken = artifacts.require("./LetsLunchToken.sol");
let LetsLunchPrePresale = artifacts.require("./LetsLunchPrePresale.sol");

const { wait, waitUntilBlock  } = require('@digix/tempo')(web3);
const assertJump = require('./helpers/assertJump');

contract('LetsLunchPrePresale', function(accounts) {

    let hours = 60 * 60;

    before(async function() {

        let currentTimestamp = web3.eth.getBlock('latest').timestamp;

        this.startAt = currentTimestamp + hours * 1;
        this.period = 21;
        this.rate = 1000;
        this.hardcap = 1500;
        this.minPaymentLimit = 10;
        this.wallet = accounts[1];

        this.token = await LetsLunchToken.new();
        this.presale = await LetsLunchPrePresale.new(
            this.startAt,
            this.period,
            this.rate,
            this.hardcap,
            this.minPaymentLimit,
            this.token.address,
            this.wallet);

        this.token.transferOwnership(this.presale.address);

        this.investor = accounts[3];
    });

    it('Should wallet address equals this.wallet', async function() {
        let wallet = await this.presale.wallet.call();

        assert.equal(wallet, this.wallet, "Wallet address is wrong");
    });

    it('Should contains right startAt', async function() {
        let startTime = await this.presale.startTime.call();

        assert.equal(startTime, this.startAt, "Start date is wrong");
    });

    it('Should contains right endAt', async function() {
        let endTime = await this.presale.endTime.call();
        let calculatedEndAt = this.startAt + this.period * 24 * hours;
        assert.equal(endTime, calculatedEndAt, "End date is wrong");
    });

    it('Should contains right rate', async function() {
        let rate = await this.presale.rate.call();

        assert.equal(rate, this.rate, "Rate is wrong");
    });

    it('Should contains right hardcap', async function() {
        let hardcap = await this.presale.cap.call();

        assert.equal(hardcap.toPrecision(), web3.toWei( this.hardcap, "ether"), "Hardcap is wrong");
    });

    it('Should contains right min payment limit', async function() {
        let minPayment = await this.presale.minPayment.call();

        assert.equal(minPayment.toPrecision(), web3.toWei( this.minPaymentLimit, "ether"), "Min Payment Limit is wrong");
    });

    describe('when presale has not stated yet', function() {

        it('Should be not active', async function() {
            let startTime = await this.presale.startTime.call();
            let now =  web3.eth.getBlock('latest').timestamp;
            assert.equal( now <= startTime, true, "Presale is active" );
        });

        it('should not allow investors to send', async function() {

            let walletBalance1 = await web3.eth.getBalance(this.wallet);

            try {
                await this.presale.sendTransaction({
                    value: web3.toWei( 15, "ether"),
                    from: this.investor
                });

                assert.fail('should have thrown');

            } catch ( error ) {
                assertJump(error);
            }

            let walletBalance2 = await web3.eth.getBalance(this.wallet);

            assert.equal( walletBalance1.valueOf(), walletBalance2.valueOf(), "Start and end contracts balances are not equal" );
        });

    });


    describe('when presale has started', () => {


        beforeEach(async () => {
            await wait(hours * 1.5, 1);
        });

        it('Should send tokens to investor with discount 40%', async function() {
            let walletBalance1 = await web3.eth.getBalance(this.wallet);
            let investorBalance1 = await web3.eth.getBalance(this.investor);
            let investmentAmount = web3.toWei( 15, "ether");

            let txn = await this.presale.sendTransaction({
                value: investmentAmount,
                from: this.investor
            });

            let tokenBalance = await this.token.balanceOf(this.investor);
            let walletBalance2 = await web3.eth.getBalance(this.wallet);
            let investorBalance2 = await web3.eth.getBalance(this.investor);
            let tokens = await web3.fromWei(investmentAmount, "ether") * this.rate * 1.40;

            assert.equal(tokenBalance.valueOf(), tokens.valueOf());
            assert.equal(walletBalance2.valueOf(), walletBalance1.add(investmentAmount).valueOf());
            assert.equal(investorBalance1.valueOf(),
                investorBalance2
                    .add(investmentAmount)
                    .add(txn.receipt.gasUsed * 100000000000)
                    .valueOf());
        });

        it('Should send tokens to investor with discount 45%', async function() {
            let tokenBalance1 = await this.token.balanceOf(this.investor);
            let walletBalance1 = await web3.eth.getBalance(this.wallet);
            let investorBalance1 = await web3.eth.getBalance(this.investor);
            let investmentAmount = web3.toWei( 50, "ether");

            let txn = await this.presale.sendTransaction({
                value: investmentAmount,
                from: this.investor
            });

            let tokenBalance2 = await this.token.balanceOf(this.investor);
            let walletBalance2 = await web3.eth.getBalance(this.wallet);
            let investorBalance2 = await web3.eth.getBalance(this.investor);
            let tokens = await web3.fromWei(investmentAmount, "ether") * this.rate * 1.45;

            assert.equal(tokenBalance2.valueOf(), tokenBalance1.add(tokens).valueOf());
            assert.equal(walletBalance2.valueOf(), walletBalance1.add(investmentAmount).valueOf());
            assert.equal(investorBalance1.valueOf(),
                investorBalance2
                    .add(investmentAmount)
                    .add(txn.receipt.gasUsed * 100000000000)
                    .valueOf());
        });

    });





});