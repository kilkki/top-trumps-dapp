App = {
    web3Provider: null,
    contracts: {},
    cardInstance: null,
    deployed: null,
    accounts: [],
    instance: null,
    opponentAddress: null,
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

var getOpponentAddress = function (opponentId) {
    App.deployed.playerIdToAddress.call(opponentId).then(function (opponentAddress) {
        console.log(App.accounts[0]);
        App.opponentAddress = opponentAddress;

        App.deployed.getCardsByOwner(App.accounts[0]).then(function (result) {
            var card = result[0];
            console.log(card);
            App.deployed.getCardDetails.call(card).then(function (result) {
                my_card_details.innerHTML += getCardHtml(result);
                my_card_details_modal.innerHTML += getCardHtmlResult(result, 1);
            });
        });
    });
}

var www3Ready = function () {
    var opponentId = GetURLParameter("opponent");
    getOpponentAddress(opponentId);
}

var getAccounts = function () {
    App.accounts = web3.eth.accounts;
    if (App.accounts.length == 1) {
        return true;
    } else {
        return false
    }
}

var getCardHtml = function (cardData) {
    return `
    <div class="card w-40">
    <div class="card-body">
      <h5 class="card-title">` + cardData[0] + `</h5>      
      <p class="card-text">Values</p>
      <table class="table">        
        <tr><td>Top speed</td><td>` + cardData[1] + ` km/h</td><td><button class="btn btn-info btn-sm" onclick="playAttr(1)">Play</button></td></tr>
        <tr><td>Sylinders</td><td>` + cardData[2] + ` </td><td><button class="btn btn-info btn-sm" onclick="playAttr(2)">Play</button></td></tr>
        <tr><td>Max power</td><td>` + cardData[3] + ` hp</td><td><button class="btn btn-info btn-sm" onclick="playAttr(3)">Play</button></td></tr>        
      </table>
    </div>
  </div>
    `
}


var getCardHtmlResult = function (cardData, index) {
    return `
    <div class="card w-40">
    <div class="card-body">
      <h5 class="card-title">` + cardData[0] + `</h5>      
      <p class="card-text">Values</p>
      <table class="table">        
        <tr id="result_table_row1_`+ index + `"><td>Top speed</td><td>` + cardData[1] + ` km/h</td></tr>
        <tr id="result_table_row2_`+ index + `"><td>Sylinders</td><td>` + cardData[2] + ` </td></tr>
        <tr id="result_table_row3_`+ index + `"><td>Max power</td><td>` + cardData[3] + ` hp</td></tr>        
      </table>
    </div>
  </div>
    `
}

var playAttr = function (attrId) {
    console.log(attrId);

    App.deployed.playCard2(App.opponentAddress, attrId, ).then(function (result) {
        for (var i = 0; i < result.logs.length; i++) {
            var log = result.logs[i];

            if (log.event == "PlayResult") {
                // We found the event!
                console.log("PLAY RES");
                console.log(log.args);
                //iWon = log.args.iWon;
                //opponentCardId = log.args.loserCardId;
                console.log(log);

                showModal(log.args);
                //break;
            }
        }
    });
}

var showModal = function (gameResult) {
    var opponentCardId = gameResult.loserCardId;
    App.deployed.getCardDetails(opponentCardId).then(function (cardData) {
        $('#exampleModal').on('shown.bs.modal', function (e) {
            $("#modal_loader").show();

            setTimeout(function () {
                $("#modal_loader").hide();
            }, 1000);

            opponent_card_placeholder.innerHTML += getCardHtmlResult(cardData, 2);

            var playAttribute = gameResult.playAttribute;

            if (gameResult.iWon) {
                console.log("WON");
                game_result.innerHTML += `
                <p>You won!</p>
                `

                $("#result_table_row" + playAttribute + "_1").addClass("table-success");
                $("#result_table_row" + playAttribute + "_2").addClass("table-danger");
            } else {
                console.log("LOSt");
                game_result.innerHTML += `
                <p>You lose!</p>            
                `
                $("#result_table_row" + playAttribute + "_2").addClass("table-success");
                $("#result_table_row" + playAttribute + "_1").addClass("table-danger");
            }
        });

        $('#exampleModal').modal('show');
    });
}

var back = function () {
    window.location.href = "index.html";
}

$(document).ready(function () {
    console.log("Init start.");
    initWeb3();
    if (getAccounts()) {
        initContract();

        $('#exampleModal').on('hidden.bs.modal', function (e) {
            window.location.href = "index.html";
        })
    } else {
        alert("Check MetaMask account!");
    }


    console.log("Init ready.");
});