var CardFactory = artifacts.require("./CardFactory.sol");

module.exports = function(deployer) {
   deployer.deploy(CardFactory);
};
