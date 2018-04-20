App = {
  web3Provider: null,
  contracts: {},
  cardInstance: null,
  deployed: null,
  accounts: [],
  instance: null,
}

var initWeb3 = function () {
  loading(true);

  if (typeof web3 !== 'undefined') {
    App.web3Provider = web3.currentProvider;
  } else {
    // If no injected web3 instance is detected, fall back to Ganache
    App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
  }
  web3 = new Web3(App.web3Provider);
};

var initContract = function () {
  $.getJSON('TopTrumpsCars.json', function (data) {
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
  if (App.accounts.length == 1) {
    return true;
  } else {
    return false
  }
}

var register = function () {
  var name = $("#nameInput").val();
  loading(true);
  App.deployed.register(name).then(function (instance) {
    loading(false);
    back();
  });
}

var www3Ready = function () {
  checkIfAreRegistered();
}

var checkIfAreRegistered = function () {
  let x = App.deployed.getIsPlayerRegistered.call().then(function (result) {
    if (result === true) {
      alert("You have already registered");

      loading(false);
      $("#user_has_registered_element").show();

    } else {
      loading(false);
      $("#register_element").show();

    }
  });
}

var GetURLParameter = function (sParam) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');
    if (sParameterName[0] == sParam) {
      return sParameterName[1];
    }
  }
}

var loading = function (isLoading) {
  if (isLoading) {
    $("#loader").show();
  } else {
    $("#loader").hide();
  }
}

var back = function () {
  window.location.href = "index.html";
}

$(document).ready(function () {
  console.log("Init start.");
  $("#user_has_registered_element").hide();
  $("#register_element").hide();
  initWeb3();

  if (getAccounts()) {
    initContract();
  } else {
    alert("Check MetaMask account!");
  }

  console.log("Init ready.");
});