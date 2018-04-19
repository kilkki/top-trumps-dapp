var TopTrumpsCars = artifacts.require("./TopTrumpsCars.sol");
var CardFactory = artifacts.require("./CardFactory.sol");
var PlayerService = artifacts.require("./PlayerService.sol");

module.exports = function(deployer) {
   deployer.deploy(TopTrumpsCars);
   //deployer.deploy(CardFactory);
   //deployer.deploy(PlayerService);

};
