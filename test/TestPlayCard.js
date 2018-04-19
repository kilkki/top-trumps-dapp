var TopTrumpsCars = artifacts.require("./TopTrumpsCars.sol");

contract('TopTrumpsCars', async (accounts) => {
    it("Should create 3 cards in register. Registers 2 players", async () => {
        var name1 = "Name1";
        var name2 = "Name2";
        let instance = await TopTrumpsCars.deployed();
        let balance = await instance.register(name1, { from: accounts[0] });

        let x = await instance.getCardsByOwner(accounts[0]);
        assert.equal(x.length, 3);

        let isRegistered = await instance.getIsPlayerRegistered({ from: accounts[0] });
        assert.equal(isRegistered, true);

        isRegistered = await instance.getIsPlayerRegistered({ from: accounts[1] });
        assert.equal(isRegistered, false);

        let balance2 = await instance.register(name2, { from: accounts[1] });

        let x2 = await instance.getCardsByOwner(accounts[1]);
        assert.equal(x2.length, 3);

        let player1Name = await instance.getPlayerName(accounts[0]);
        let player2Name = await instance.getPlayerName(accounts[1]);

        assert.equal(player1Name, name1);
        assert.equal(player2Name, name2);

        assert.equal(0, await instance.playerId(accounts[0]));
        assert.equal(1, await instance.playerId(accounts[1]));

        assert.equal(accounts[0], await instance.playerIdToAddress.call(0));
        assert.equal(accounts[1], await instance.playerIdToAddress.call(1));

        let players = await instance.getPlayers.call({ from: accounts[0] });
        assert.equal(2, players.length);
    });

    it("Should show cards of a player", async () => {
        let instance = await TopTrumpsCars.deployed();

        let cardsPlayer1 = await instance.getCardsByOwner(accounts[0]);
        assert.equal(cardsPlayer1.length, 3);

        let cardsPlayer2 = await instance.getCardsByOwner(accounts[1]);
        assert.equal(cardsPlayer2.length, 3);
    });

    it("Should show card details", async () => {
        let instance = await TopTrumpsCars.deployed();

        let cardsPlayer1 = await instance.getCardsByOwner(accounts[0]);
        assert.equal(cardsPlayer1.length, 3);

        let card1Details = await instance.getCardDetails(cardsPlayer1[0]);
        assert.isNumber(parseInt(card1Details[0]));
        assert.isNumber(parseInt(card1Details[1]));
        assert.isNumber(parseInt(card1Details[2]));
        assert.isNumber(parseInt(card1Details[3]));
    });

    it("Winner should get one card from the loser", async () => {
        let instance = await TopTrumpsCars.deployed();

        let cardsPlayer1 = await instance.getCardsByOwner(accounts[0]);
        assert.equal(cardsPlayer1.length, 3);

        let cardsPlayer2 = await instance.getCardsByOwner(accounts[1]);
        assert.equal(cardsPlayer2.length, 3);

        let iWon;
        let myCardId;
        let opponentCardId;
        let playedAttribute;

        let myCount = 3;
        let opponentCount = 3;

        for (var y = 0; y < 15; y++) {
            console.log("ITERATION: " + y);

            cardsPlayer1 = await instance.getCardsByOwner(accounts[0]);
            cardsPlayer2 = await instance.getCardsByOwner(accounts[1]);

            // If a player dont have cards. Stop testing
            if (cardsPlayer1.length == 0 || cardsPlayer2.length == 1) {
                break;
            }

            let result = await instance.playCard(accounts[1], 1, { from: accounts[0] });

            for (var i = 0; i < result.logs.length; i++) {
                var log = result.logs[i];
                if (log.event == "PlayResult") {
                    // console.log(log.args);
                    iWon = log.args.iWon;
                    myCardId = log.args.myCardId;
                    opponentCardId = log.args.opponentCardId;
                    playedAttribute = log.args.playAttribute;
                }
            }

            cardsPlayer1 = await instance.getCardsByOwner(accounts[0]);
            cardsPlayer2 = await instance.getCardsByOwner(accounts[1]);

            console.log(cardsPlayer1);
            console.log("dddsdasd");
            console.log(cardsPlayer2);

            if (iWon) {
                myCount++;
                opponentCount--;
            } else {
                myCount--
                opponentCount++;
            }

            assert.equal(cardsPlayer1.length, myCount);
            assert.equal(cardsPlayer2.length, opponentCount);
        };
    });
});
