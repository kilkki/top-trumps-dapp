
# Top Trumps Cars dapp

A classic card game where you compare numerical data of cars. 
https://en.wikipedia.org/wiki/Top_Trumps

## Live demo ##
* Use MetaMask connection to Ropsten 
* Open [Live Demo](https://kilkki80.000webhostapp.com/)

### This is Dapp version of the card game ###
Gameplay
 1. Player registers as a player
 2. 3 cards are given for every player in registration
 3. Player can see other players and how many cards they have
 4. Player can play againts a player by choosin "play with" button after player's name
 5. Player chooses a value from his card to compete againts opponents card. By choosing "play" button.
 6. After this result of the game round is show to the player
 7. Winner gets the card of the loser

### Install ###
1. Clone repo
2. Install MetaMask for your browser
3. Run `npm install`
4. Start rpc or ganache. (Change the network address accordingly in truffle.js)
5. Compile and migrate contract `truffle compile && truffle migrate`
6. Run `npm run dev`
7. Open browser to localhost if previous command didn't automatically

### Todo ###
* Use frontend framework like angular
* Clean up code
* Add error checks to frontend
* Wish there was more hours in a day than 24
