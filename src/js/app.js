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
    if (result === true) {
      setRegisteredElementsVisible(false);

      App.deployed.getPlayerName.call(App.accounts[0]).then(function (result) {
        $('#player_info').text(result + "!");
        App.deployed.ownerCardCount(App.accounts[0]).then(function (result) {
          player_cards.innerHTML += '<p>You have <span class="badge badge-success"> ' + result + '</span> cards</p>'
        });

        loading(false);
      });
    } else {
      setRegisteredElementsVisible(true);
      loading(false);
    }
  });

  App.deployed.getPlayers.call().then(function (result) {

    result.forEach(function (player) {
      if (player != App.accounts[0]) {
        App.deployed.playerId(player).then(function (result) {
          var playerId = result;

          App.deployed.getPlayerName.call(player).then(function (result) {
            var opponentName = result;
            App.deployed.ownerCardCount.call(player).then(function (cardCount) {

              other_players.innerHTML += '<tr><td>' + opponentName + '</td><td><span class="badge badge-success">' + cardCount + '</span></td><td>' +
                `<button class="btn btn-info btn-sm" onclick="playWith(` + playerId + `,'` + opponentName + `')">Play with</button></td></tr>`;
            });
          });
        });
      }
    });
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

var playWith = function (opponentId, opponentName) {
  $("#modal-btn-si").on("click", function () {
    window.location.href = "gameplay.html?opponent=" + opponentId;
  });

  $('#modal_player_name').text(opponentName);
  $('#confirmModal').modal('show');
}

var loading = function (isLoading) {
  if (isLoading) {
    $("#loader").show();
  } else {
    $("#loader").hide();
  }
}

var mycards = function () {
  window.location.href = "mycards.html";
}

var setRegisteredElementsVisible = function (isRegistered) {
  if (isRegistered) {
    $("#register_placeholder").show();
    $("#registered_placeholder").hide();
  } else {
    $("#register_placeholder").hide();
    $("#registered_placeholder").show();
  }
}


$(document).ready(function () {
  console.log("Init start.");
  initWeb3();
  setRegisteredElementsVisible(false);

  if (getAccounts()) {
    initContract();
    $("#your_address").text(App.accounts[0]);
  } else {
    alert("Check MetaMask account!");
  }
});