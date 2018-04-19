pragma solidity ^0.4.16;
import "./PlayerService.sol";

contract CardFactory is PlayerService {
    struct Card {
        uint name;
        uint topSpeed;        
        uint noOfSylinders;
        uint maxPower;
        uint image;
    }

    mapping (uint => address) public cardToOwner;
    mapping (address => uint) public ownerCardCount;
    Card[] public cards;
    uint randNonce = 0;

  function createCard(uint _name, uint _topSpeed, uint _noOfSylinders, uint _maxPower) public {
        uint id = cards.push(Card(_name, _topSpeed, _noOfSylinders, _maxPower, randMod(3))) - 1;
        cardToOwner[id] = msg.sender;
        ownerCardCount[msg.sender]++;
    }

    function randMod(uint _modulus) internal returns(uint) {
        randNonce++;
        return uint(keccak256(now, msg.sender, randNonce)) % _modulus;
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

  function getCardDetails(uint _cardId) public view returns (uint, uint, uint, uint, uint) {
    Card memory cardToReturn = cards[_cardId];
    
    return (cardToReturn.name, cardToReturn.topSpeed, cardToReturn.noOfSylinders, cardToReturn.maxPower, cardToReturn.image);
  }

  function getCardsByOwner(address _owner) external view returns(uint[]) {
    return _getCardsByOwner(_owner);
  }

  modifier ownerOf(uint _cardId) {
    require(msg.sender == cardToOwner[_cardId]);
    _;
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

  event PlayResult(bool iWon, uint myCardId, uint opponentCardId, uint playAttribute);

  function playCard(address _opponent, uint _playAttribute) external {
    require(_playAttribute == 1 || _playAttribute == 2 || _playAttribute == 3);

    uint[] memory myCards = _getCardsByOwner(msg.sender);
    uint[] memory opponentCards = _getCardsByOwner(_opponent);

    require(myCards.length > 0);
    require(opponentCards.length > 0);

    // get last card to get some change in played cards
    uint myCardId = myCards[myCards.length - 1];
    uint opponentCardId = opponentCards[opponentCards.length - 1];

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
      cardToOwner[opponentCardId] = msg.sender;
      ownerCardCount[msg.sender]++;
      ownerCardCount[_opponent]--;
      PlayResult(true, myCardId, opponentCardId, _playAttribute);
    } else {
        address newOwner = _opponent;
        cardToOwner[myCardId] = newOwner;
        ownerCardCount[newOwner]++;
        ownerCardCount[msg.sender]--;
        PlayResult(false, myCardId, opponentCardId, _playAttribute);
    }
  }
}
