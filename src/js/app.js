App = {
  web3Provider: null,
  contracts: {},
  cardInstance: null,
  deployed: null,
  accounts: [],
  instance: null,
}

var initWeb3 = function () {
  if (typeof web3 !== 'undefined') {
    App.web3Provider = web3.currentProvider;
  } else {
    // If no injected web3 instance is detected, fall back to Ganache
    App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
  }
  web3 = new Web3(App.web3Provider);
};

var initContract = function () {
  $.getJSON('CardFactory.json', function (data) {
    // Get the necessary contract artifact file and instantiate it with truffle-contract
    var CardFactoryArtifact = data;
    App.contracts.CardFactory = TruffleContract(CardFactoryArtifact);

    // Set the provider for our contract
    App.contracts.CardFactory.setProvider(App.web3Provider);

    App.contracts.CardFactory.deployed().then(function (instance) {
      return instance;
    }).then(function (instance) {
      App.deployed = instance;
      www3Ready();
    });
  });
};

var getAccounts = function () {
  App.accounts = web3.eth.accounts;
}

var register = function () {
  console.log("register");

  App.contracts.CardFactory.deployed().then(function (instance) {
    cardFactoryInstance = instance;

    console.log("Register player");
    var name = $("#nameInput").val();
    return cardFactoryInstance.register(name);
  })
}

var www3Ready = function () {
  checkIfAreRegistered();
}

var checkIfAreRegistered = function () {
  let x = App.deployed.getIsPlayerRegistered.call().then(function (result) {
    console.log("IS: " + result);
    if (result === true) {
      App.deployed.getPlayerName.call(App.accounts[0]).then(function (result) {
        $('#player_info').text("moi " + result);

        App.deployed.getCardsByOwner.call(App.accounts[0]).then(function (result) {

          result.forEach(function (card) {

            App.deployed.getCardDetails.call(card).then(function (result) {
              player_cards.innerHTML += '<li>' + result + '</li>';
            });
          });
        });
      });
    }
    //return result;
  });

  App.deployed.getPlayers.call().then(function (result) {
    
    result.forEach(function (player) {
      console.log("plrs:  " + player);
      App.deployed.getPlayerName.call(player).then(function (result) {
        other_players.innerHTML += '<li>' + result + '</li>';
      });
    });

  });


}

$(document).ready(function () {
  console.log("Init start.");
  initWeb3();
  initContract();
  getAccounts();

  $("#your_address").text(App.accounts[0]);

  console.log("Init ready.");

});