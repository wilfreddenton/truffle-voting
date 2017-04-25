# Truffle Voting Distributed Application

## Usage

Start and connect geth to the Testnet with the following command

```
geth --testnet --fast --rpc --rpcapi db,eth,net,web3,personal --cache=1024  --rpcport 8545 --rpcaddr 127.0.0.1 --rpccorsdomain "*" --bootnodes "enode://20c9ad97c081d63397d7b685a412227a40e23c8bdc6688c6f37e97cfbc22d2b4d1db1510d8f61e6a8866ad7f0e17c02b14182d37ea7c3c8b9c2683aeb6b733a1@52.169.14.227:30303,enode://6ce05930c72abc632c58e2e4324f7c7ea478cec0ed4fa2528982cf34483094e9cbc9216e7aa349691242576d552a2a56aaeae426c5303ded677ce455ba1acd9d@13.84.180.240:30303"
```

It may take awhile to synchronize with the blockchain.

Install truffle if it's not already installed

`npm install -g truffle`

Create an account with the following commands

```
$ node
> Web3 = require('web3')
> web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
> web3.personal.newAccount('<password>')
```

This should output the address of the newly created account. I'll reference it with `<address>`.

Now we want to provide the account with Ether so that we can deploy the Voting smart contract as well as send transactions.

First we have to unlock the account.

```
$ truffle console
truffle(development)> web3.personal.unlockAccount('<address>', '<password>', 15000)
```

Now let's provide the account with Ether.

```
curl -X POST  -H "Content-Type: application/json" -d '{"toWhom":"<address>"}' https://ropsten.faucet.b9lab.com/tap
```

Now to deploy the smart contract

`truffle migrate`

We can test that the contract works in the console

```
$ truffle console
truffle(development)> Voting.deployed().then(function(contractInstance) {contractInstance.voteForCandidate('2B').then(function(v) {console.log(v)})})
truffle(development)> Voting.deployed().then(function(contractInstance) {contractInstance.totalVotesFor.call('2B').then(function(v) {console.log(v)})})
```

The first command adds a vote for "2B" and the second gets 2B's vote count.

Finally, to use the UI run

`npm run dev`

and point your browser to `http://localhost:8080`

# References

I created this following Mahesh Murthy's helpful [tutorial](https://medium.com/@mvmurthy/full-stack-hello-world-voting-ethereum-dapp-tutorial-part-2-30b3d335aa1f) on the basics of using truffle to create Dapps.

This [post](https://medium.com/@AndyConrad/i-ran-into-another-issue-i-kept-getting-typeerror-cannot-read-property-0-of-null-when-running-29c9e5ad6c7e) shows how to create a new account using node and web3.

This [post](https://blog.b9lab.com/when-we-first-built-our-faucet-we-deployed-it-on-the-morden-testnet-70bfbf4e317e) contains the curl request used to provide the account with test Ether.
