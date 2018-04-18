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
     getMyCards();
}

var getMyCards = function () {
    App.deployed.getCardsByOwner.call(App.accounts[0]).then(function (result) {
        result.forEach(function (card) {
            App.deployed.getCardDetails.call(card).then(function (result) {
                my_cards_holder.innerHTML += getCardHtmlResult(result);
            });

            loading(false);

        });
    });
    loading(false);
};
  
var getCardHtmlResult = function (cardData) {
    return `
    <div class="card w-40">
    <img class="card-img-top" src="images/` + cardData[4] + `.jpg">

    <div class="card-body">
      <h5 class="card-title">` + cardData[0] + `</h5>      
      <p class="card-text">Values</p>
      <table class="table">        
        <tr><td>Top speed</td><td>` + cardData[1] + ` km/h</td></tr>
        <tr"><td>Sylinders</td><td>` + cardData[2] + ` </td></tr>
        <tr"><td>Max power</td><td>` + cardData[3] + ` hp</td></tr>        
      </table>
    </div>
  </div>
  <div class="spacer"></div>
    `
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
    console.log(opponentId + opponentName);

    $("#modal-btn-si").on("click", function () {
        console.log("SISIS");
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

var back = function () {
    window.location.href = "index.html";
}

$(document).ready(function () {
    console.log("Init start.");
    initWeb3();
    $("#btn_register").hide();

    if (getAccounts()) {
        initContract();
        $("#your_address").text(App.accounts[0]);
    } else {
        alert("Check MetaMask account!");
    }

    // initContract();
    //getAccounts();





    console.log("Init ready.");

});