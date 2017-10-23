var LetsLunchToken = artifacts.require("./LetsLunchToken.sol");
var LetsLunchPrePresale = artifacts.require("./LetsLunchPrePresale.sol");
var FinalizableDistribution = artifacts.require("./FinalizableDistribution.sol")

contract('LetsLunchPrePresale', function(accounts) {

    this.multisigStartBalance = 0;

    before(async function() {

        this.startAt = Math.round(Date.now()/1000);//+5*24*60*60;
        this.period = 21;
        this.rate = 1000;
        this.hardcap = 15000;
        this.wallet = accounts[1];
        this.restrictedWallet = accounts[2];
        this.restrictedPercent = 40;

        this.token = await LetsLunchToken.new();

        // console.log("this.startAt="+this.startAt);
        // console.log("this.period="+this.period);
        // console.log("this.rate="+this.rate);
        // console.log("this.hardcap="+this.hardcap);
        // console.log("this.wallet="+this.wallet);
        // console.log("this.restrictedWallet="+this.restrictedWallet);
        // console.log("this.restrictedPercent="+this.restrictedPercent);
        // console.log("this.token.address="+this.token.address);

        this.presale = await LetsLunchPrePresale.new(
            this.startAt,
            this.period,
            this.rate,
            this.hardcap,
            this.token.address,
            this.wallet,
            this.restrictedWallet,
            this.restrictedPercent);

        this.token.transferOwnership(this.presale.address);

        this.investor = accounts[3];
        this.investmentAmount = 1;//1 ether
    });

    it('Should wallet address equals this.wallet', async function() {
        var wallet = await this.presale.wallet.call();

        assert.equal(wallet, this.wallet, "Wallet address is wrong");
    });

    it('Should contains right startAt', async function() {
        var startTime = await this.presale.startTime.call();

        assert.equal(startTime, this.startAt, "Start date is wrong");
    });

    it('Should contains right endAt', async function() {
        var endTime = await this.presale.endTime.call();
        var calculatedEndAt = this.startAt + this.period*24*60*60;
        assert.equal(endTime, calculatedEndAt, "End date is wrong");
    });

    it('Should contains right rate', async function() {
        var rate = await this.presale.rate.call();

        assert.equal(rate, this.rate, "Rate is wrong");
    });

    it('Should contains right hardcap', async function() {
        var hardcap = await this.presale.cap.call();

        assert.equal(hardcap, this.hardcap * 10 ** 18, "Hardcap is wrong");
    });

    it('Should contains right restrictedWallet', async function() {
        var restrictedWallet = await this.presale.restrictedWallet.call();

        assert.equal(restrictedWallet, this.restrictedWallet, "Restricted wallet is wrong");
    });

    it('Should contains right restrictedPercent', async function() {
        var restrictedPercent = await this.presale.restrictedPercent.call();

        assert.equal(restrictedPercent, this.restrictedPercent, "Restricted percent is wrong");
    });

    it('Should be active', async function() {
        var startTime = await this.presale.startTime.call();
        var endTime = await this.presale.endTime.call();
        var now = Math.round(Date.now()/1000);

        assert.equal( (now >= startTime ) && (now <= endTime), true, "Presale not active" );
    });

    it('Should send tokens to purchaser', async function() {
        this.multisigStartBalance = await web3.eth.getBalance(this.wallet);

        await this.presale.sendTransaction({
            value: this.investmentAmount * 10 ** 18,
            from: this.investor
        });

        const balance = await this.token.balanceOf(this.investor);

        assert.equal(balance.valueOf(), this.investmentAmount * this.rate * 1.45);
    });

    it('Should be change wallet balance in ether', async function() {
        const balance = await web3.eth.getBalance(this.wallet);

        assert.equal(balance.valueOf(), this.multisigStartBalance.add(this.investmentAmount * 10 ** 18).valueOf());
    });

});