pragma solidity ^0.4.16;
import "./PlayerService.sol";


contract PlayerService {
    mapping (address => string) public playerName;
    mapping (address => uint) public playerId;
    mapping (uint => address) public playerIdToAddress;
    address[] public players;

    function getIsPlayerRegistered() public view returns (bool) {
        // uint counter = 0;
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

  

    // Retrieving the players
	function getPlayers() public view returns (address[]) {
	    return players;
	}

    
}