# LetsLunch Token, Presale & Crowdsale contracts

This contracts implement LetsLunch token (more at [official LetsLunch site](https://letslunch.ai)), open tokens presale and crowdsale.

## Dependenies
To complete tests on this contracts you need.

* testrpc
* truffle

## Run test
In separate tab start `testrpc` with command:
```sh
$ testrpc
```

On first tab from project folder run:
```sh
$ cd LetsLunchICO
$ truffle compile
$ truffle migrate
$ truffle test
```

In next time you can use only `truffle test` command.