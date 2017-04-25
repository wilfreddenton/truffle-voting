// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import voting_artifacts from '../../build/contracts/Voting.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
var Voting = contract(voting_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var candidates = ['2B', '9S', 'A2'];

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the Voting abstraction for Use.
    Voting.setProvider(web3.currentProvider);

    // get elements
    var voteForm = document.getElementById('vote');
    var candidateInput = document.getElementById('candidate');

    // add submit event listener to voting form
    voteForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var candidate = candidateInput.value;
      if (candidate === '' || candidates.indexOf(candidate) < 0) {
        alert('invalid candidate:', candidate)
        return
      }

      var voting
      Voting.deployed().then(function(instance) {
        voting = instance
        return voting.voteForCandidate(candidate, {gas: 140000, from: web3.eth.accounts[0]})
      }).then(function() {
        return voting.totalVotesFor.call(candidate);
      }).then(function(numVotes) {
        self.updateCandidateVotes(candidate, numVotes.toString())
      }).catch(function(err) {
        alert(err);
      });
    })

    // Get the initial votes and display them.
    this.updateVotes();
    // update votes every 30 seconds
    setInterval(this.updateVotes.bind(this), 30000);
  },

  updateVotes: function() {
    var self = this;
    candidates.forEach(function(candidate) {
      Voting.deployed().then(function(instance) {
        return instance.totalVotesFor.call(candidate)
      }).then(function(numVotes) {
        self.updateCandidateVotes(candidate, numVotes.toString());
      }).catch(function(err) {
        alert(err);
      });
    });
  },

  updateCandidateVotes: function (candidate, numVotes) {
    var n = candidates.indexOf(candidate) + 1;
    document.getElementById('candidate-' + n).innerHTML = numVotes;
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
