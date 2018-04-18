var CardFactory = artifacts.require("./CardFactory.sol");

contract('CardFactory', async (accounts) => {
    it("Should create 3 cards in register. Registers 2 players", async () => {
        var name1 = "Name1";
        var name2 = "Name2";
        let instance = await CardFactory.deployed();
        let balance = await instance.register(name1, { from: accounts[0] });

        let x = await instance.getCardsByOwner(accounts[0]);
        assert.equal(x.length, 3);

        let isRegistered = await instance.getIsPlayerRegistered({ from: accounts[0] });
        assert.equal(isRegistered, true);

        isRegistered = await instance.getIsPlayerRegistered({ from: accounts[1] });
        assert.equal(isRegistered, false);

        // let instance = await CardFactory.deployed();
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

        let players =  await instance.getPlayers.call({ from: accounts[0] });
        assert.equal(2, players.length);
        
        

        // let card1 = x[0];
        // let card2 = x2[0];

        // console.log("CARDS");
        // // console.log(x);
        // // console.log(x2);
        // console.log(card1.topSpeed);
        // console.log(card2.topSpeed);

        // let cardData1 = await instance.cards(card1);
        // let cardData2 = await instance.cards(card2);

        // console.log(cardData1);
        // console.log(cardData2);
        // let x3 = await instance.playCard(card1, card2, 1);

        // let x4 = await instance.getCardsByOwner(accounts[0]);
        // x2 = await instance.getCardsByOwner(accounts[1]);

        // if (cardData1[1] >= cardData2[1]) {
        //     assert.equal(x4.length, 4);
        //     assert.equal(x2.length, 2);
        // } else {
        //     assert.equal(x4.length, 2);
        //     assert.equal(x2.length, 4);
        // }

        // console.log("play card");
        // console.log(x3);

        // let o = await instance.getPlayers();
        // console.log("add");
        // console.log(o);

        // let x4 = await instance.getCardsByOwner(accounts[0]);
        // assert.equal(x4.length, 4);

        // x2 = await instance.getCardsByOwner(accounts[1]);
        // assert.equal(x2.length, 2);
    });

    it("Should show cards of a player", async () => {
        let instance = await CardFactory.deployed();

        let cardsPlayer1 = await instance.getCardsByOwner(accounts[0]);
        assert.equal(cardsPlayer1.length, 3);
        
        let cardsPlayer2 = await instance.getCardsByOwner(accounts[1]);
        assert.equal(cardsPlayer2.length, 3);
    });

    it("Should show card details", async () => {
        let instance = await CardFactory.deployed();

        let cardsPlayer1 = await instance.getCardsByOwner(accounts[0]);
        assert.equal(cardsPlayer1.length, 3);

        let card1Details = await instance.getCardDetails(cardsPlayer1[0]);      
        assert.isNumber(parseInt(card1Details[0]));
        assert.isNumber(parseInt(card1Details[1]));
        assert.isNumber(parseInt(card1Details[2]));
        assert.isNumber(parseInt(card1Details[3]));

    });



    it("Winner should get one card from the loser", async () => {
        let instance = await CardFactory.deployed();
    
        let cardsPlayer1 = await instance.getCardsByOwner(accounts[0]);
        assert.equal(cardsPlayer1.length, 3);
        
        let cardsPlayer2 = await instance.getCardsByOwner(accounts[1]);
        assert.equal(cardsPlayer2.length, 3);

       
        // ****************

        
        // await instance.playCard(card1, card2, 1);
        //var value = await instance.playCard2(accounts[1], 1, { from: accounts[0] }).call();

        let iWon;
        let opponentCardId;
        let result = await instance.playCard2(accounts[1], 1, { from: accounts[0] }); //.then(function(result) {            
            // We can loop through result.logs to see if we triggered the Transfer event.
            for (var i = 0; i < result.logs.length; i++) {
              var log = result.logs[i];
          
              if (log.event == "PlayResult") {
                // We found the event!
                console.log("PLAY RES");
                console.log(log.args);
                iWon = log.args.iWon;
                opponentCardId = log.args.loserCardId;
                console.log(parseInt(opponentCardId));

                //break;
              }
            }
        //   }).catch(function(err) {
        //     // There was an error! Handle it.
        //   });    

          console.log(parseInt(opponentCardId));

        // let x1 = await instance.cards[playResult];
        // let x2 = await instance.cards[playResult[1]];
        // console.log(x1);
        // console.log(x2);

         // // For debugging only
         let card1 = cardsPlayer1[0];
         // let card2 = cardsPlayer2[0];
         
         let cardData1 = await instance.getCardDetails(card1);
         let cardData2 = await instance.getCardDetails(parseInt(opponentCardId));
        
         console.log(cardData1);
         console.log(cardData2);
    
        cardsPlayer1 = await instance.getCardsByOwner(accounts[0]);
        cardsPlayer2 = await instance.getCardsByOwner(accounts[1]);
        // console.log("****");

        // console.log("p1:");

        // console.log(cardsPlayer1);
        // console.log("p2:");
        // console.log(cardsPlayer2);

        let myCount = 3;
        let opponentCount = 3;

        if (iWon) {
            myCount++;
            opponentCount--;        
        } else {
            myCount--
            opponentCount++;            
        }

        assert.equal(cardsPlayer1.length, myCount);
        assert.equal(cardsPlayer2.length, opponentCount);

        // Play other card
        result = await instance.playCard2(accounts[1], 1, { from: accounts[0] }); //.then(function(result) {            
            // We can loop through result.logs to see if we triggered the Transfer event.
            for (var i = 0; i < result.logs.length; i++) {
              var log = result.logs[i];
          
              if (log.event == "PlayResult") {
                // We found the event!
                console.log("PLAY RES 2");
                console.log(log.args.iWon);
                console.log(log.args.winnerCardId);
                iWon = log.args.iWon;
                //break;
              }
            }
        //   }).catch(function(err) {
        //     // There was an error! Handle it.
        //   });    

        cardsPlayer1 = await instance.getCardsByOwner(accounts[0]);
        cardsPlayer2 = await instance.getCardsByOwner(accounts[1]);

        if (iWon) {
            myCount++;
            opponentCount--;        
        } else {
            myCount--
            opponentCount++;            
        }

        assert.equal(cardsPlayer1.length, myCount);
        assert.equal(cardsPlayer2.length, opponentCount);

        // console.log("****");

        // console.log("p1:");

        // console.log(cardsPlayer1);
        // console.log("p2:");
        // console.log(cardsPlayer2);

        // if (cardData1[1] >= cardData2[1]) {
        //     assert.equal(cardsPlayer1.length, 5);
        //     assert.equal(cardsPlayer2.length, 1);
        // } else {
        //     assert.equal(cardsPlayer1.length, 1);
        //     assert.equal(cardsPlayer2.length, 5);
        // }
    });

});
