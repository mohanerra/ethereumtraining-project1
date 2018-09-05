var Splitter = artifacts.require("./Splitter.sol");

// var bob = web3.eth.accounts[1];
// var carol = web3.eth.accounts[2];
module.exports = function(deployer) {

  // deployer.deploy(Splitter, bob, carol);
  deployer.deploy(Splitter);
};
                    