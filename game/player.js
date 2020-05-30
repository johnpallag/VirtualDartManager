const UTIL = require("../util");
const CARD = require("./card");
const uuidv1 = require('uuid/v1');
//require("../util/seedrandom");

/////////////////////////////////////////////////////////////////////////

const Player = function(name) {
  this.Id = UTIL.GenerateId();
  this.Throws = [];
  this.Name = name;
}

/////////////////////////////////////////////////////////////////////////

Player.prototype.RefreshDeck = function(){
    for(var i=0;i<5;i++) {
      var newCard = UTIL.DrawCard(this.Cards);
      while(newCard.CanDrawAnother())
        newCard = UTIL.DrawCard(this.Cards);
    }
}

/////////////////////////////////////////////////////////////////////////

Player.prototype.AddCard = function(card){
  this.Cards.Discard.push(card);
}

/////////////////////////////////////////////////////////////////////////

Player.prototype.DiscardCard = function(card){
  this.Cards.Active.splice(this.Cards.Active.findIndex(function(x){return x==card;}), 1);
  if(card.CanKeep())
    this.Cards.Active.push(card);
  else
    this.Cards.Discard.push(card);
}

/////////////////////////////////////////////////////////////////////////

Player.prototype.PlayCard = function(card){
  card.Play();
  this.DiscardCard(card);
}

/////////////////////////////////////////////////////////////////////////

exports.Player = Player;
