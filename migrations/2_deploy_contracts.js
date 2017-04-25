var Voting = artifacts.require("./Voting.sol");

module.exports = function(deployer) {
  deployer.deploy(Voting, ['2B', '9S', 'A2'], {gas: 290000});
};
