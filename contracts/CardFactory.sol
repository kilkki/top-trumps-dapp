pragma solidity ^0.4.16;

contract CardFactory {
    struct Card {
        uint name;
        uint topSpeed;        
        uint noOfSylinders;
        uint maxPower;
        uint image;
    }

    mapping (uint => address) public cardToOwner;
    mapping (address => uint) public ownerCardCount;
    mapping (address => string) public playerName;
    mapping (address => uint) public playerId;
    mapping (uint => address) public playerIdToAddress;

    address[] public players;
    Card[] public cards;

    uint randNonce = 0;

  function createCard(uint _name, uint _topSpeed, uint _noOfSylinders, uint _maxPower) public {
      uint id = cards.push(Card(_name, _topSpeed, _noOfSylinders, _maxPower, randMod(3))) - 1;
      cardToOwner[id] = msg.sender;
      ownerCardCount[msg.sender]++;
  }

  function getIsPlayerRegistered() public view returns (bool) {
    uint counter = 0;
    bool isRegistered = false;

    for (uint i = 0; i < players.length; i++) {
      if (players[i] == msg.sender) {
        isRegistered = true;
      }
    }
    return isRegistered;
  }

  function getPlayerName(address _playerAddress) public view returns(string) {
    return playerName[_playerAddress];
  }

  function register(string _name) public {	
      playerId[msg.sender] = players.length;
      playerIdToAddress[players.length] = msg.sender;
	    players.push(msg.sender);
      playerName[msg.sender] = _name;
      
      createCard(randMod(99), randMod(350), randMod(36), randMod(1000));
      createCard(randMod(99), randMod(350), randMod(36), randMod(1000));
      createCard(randMod(99), randMod(350), randMod(36), randMod(1000));
	}

    // Retrieving the players
	function getPlayers() public view returns (address[]) {
	  return players;
	}

  function getCardDetails(uint _cardId) public view returns (uint, uint, uint, uint, uint) {
    Card memory cardToReturn = cards[_cardId];
    
    return (cardToReturn.name, cardToReturn.topSpeed, cardToReturn.noOfSylinders, cardToReturn.maxPower, cardToReturn.image);
  }

    // Retrieving the players
	// function getMyCards() public view returns (uint[]) {
	//  return players;
//	}

  function randMod(uint _modulus) internal returns(uint) {
    randNonce++;
    return uint(keccak256(now, msg.sender, randNonce)) % _modulus;
  }

  function getCardsByOwner(address _owner) external view returns(uint[]) {
    // uint[] memory result = new uint[](ownerCardCount[_owner]);
    // uint counter = 0;
    // for (uint i = 0; i < cards.length; i++) {
    //   if (cardToOwner[i] == _owner) {
    //     result[counter] = i;
    //     counter++;
    //   }
    // }
    // return result;
    return _getCardsByOwner(_owner);
  }

  modifier ownerOf(uint _cardId) {
    require(msg.sender == cardToOwner[_cardId]);
    _;
  }

  function playCard(uint _cardId, uint _targetCardId, uint _playAttribute) external ownerOf(_cardId) {
    require(_playAttribute == 1 || _playAttribute == 2 || _playAttribute == 3);

     Card storage myCard = cards[_cardId];
     Card storage targetCard = cards[_targetCardId];

    uint myValue;
    uint targetValue;

    if (_playAttribute == 1) {
      myValue = myCard.topSpeed;
      targetValue = targetCard.topSpeed;
    } else if (_playAttribute == 2) {
       myValue = myCard.noOfSylinders;
      targetValue = targetCard.noOfSylinders;

    } else if (_playAttribute == 3) {
      myValue = myCard.maxPower;
      targetValue = targetCard.maxPower;
    } 

    if (myValue >= targetValue) {
      address tmp = cardToOwner[_targetCardId];
      cardToOwner[_targetCardId] = msg.sender;

      ownerCardCount[msg.sender]++;
      ownerCardCount[tmp]--;
    } else {
       address newOwner = cardToOwner[_targetCardId];
       cardToOwner[_cardId] = newOwner;
       ownerCardCount[newOwner]++;
       ownerCardCount[msg.sender]--;
    }
    
    // address tmp = cardToOwner[_targetCardId];
    // cardToOwner[_targetCardId] = msg.sender;

    // ownerCardCount[msg.sender]++;
    // ownerCardCount[tmp]--;
  }

  function _getCardsByOwner(address _owner) private view returns(uint[]) {
    uint[] memory result = new uint[](ownerCardCount[_owner]);
    uint counter = 0;
    for (uint i = 0; i < cards.length; i++) {
      if (cardToOwner[i] == _owner) {
        result[counter] = i;
        counter++;
      }
    }
    return result;
  }

  event PlayResult(bool iWon, uint winnerCardId, uint loserCardId, uint playAttribute);

   function playCard2(address _opponent, uint _playAttribute) external {
    require(_playAttribute == 1 || _playAttribute == 2 || _playAttribute == 3);

    uint[] memory myCards = _getCardsByOwner(msg.sender);
    uint[] memory opponentCards = _getCardsByOwner(_opponent);

    uint myCardId = myCards[randMod(uint8(myCards.length) - 1)];
    uint opponentCardId = opponentCards[randMod(uint8(opponentCards.length) - 1)];

    Card storage myCard = cards[myCardId];
    Card storage targetCard = cards[opponentCardId];

    uint myValue;
    uint targetValue;

    if (_playAttribute == 1) {
      myValue = myCard.topSpeed;
      targetValue = targetCard.topSpeed;
    } else if (_playAttribute == 2) {
       myValue = myCard.noOfSylinders;
      targetValue = targetCard.noOfSylinders;

    } else if (_playAttribute == 3) {
      myValue = myCard.maxPower;
      targetValue = targetCard.maxPower;
    } 

    if (myValue >= targetValue) {
      address tmp = cardToOwner[opponentCardId];
      cardToOwner[opponentCardId] = msg.sender;

      ownerCardCount[msg.sender]++;
      ownerCardCount[tmp]--;
      PlayResult(true, myCardId, opponentCardId, _playAttribute);
    } else {
       address newOwner = _opponent; //cardToOwner[myCardId];
       cardToOwner[myCardId] = newOwner;
       ownerCardCount[newOwner]++;
       ownerCardCount[msg.sender]--;
       PlayResult(false, myCardId, opponentCardId, _playAttribute);
    }
  }
}
