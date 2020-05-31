const UTIL = require("../util");
const GAME = require("./game");
const CRICKET = require("./cricket");
require("../util/seedrandom");

/////////////////////////////////////////////////////////////////////////

const Match = function(host, private, gameType) {
  this.Id = UTIL.GenerateId();
  this.Players = [];
  this.PlayerMap = [];
  this.Host = host;
  this.Private = private;
  this.Games = [];
  this.GameMap = [];
  this.GameType = gameType;
  this.Started = false;
};

/////////////////////////////////////////////////////////////////////////

Match.prototype.IsAuthorized = function(address){
  return address = this.Host;
};

/////////////////////////////////////////////////////////////////////////

Match.prototype.CanStart = function() {
  if(this.GameType === "Cricket")
    return this.Players.length >= 2;
  return false;
};

/////////////////////////////////////////////////////////////////////////

Match.prototype.Start = function(){
  if(this.GameType === "Cricket"){
    let game = new CRICKET.Cricket([this.Players[0].Id, this.Players[1].Id]);
    this.Games.push(game);
    this.GameMap[game.Id] = this.Games.length - 1;
  }
  this.Started = true;
};

/////////////////////////////////////////////////////////////////////////

exports.Match = Match;

/////////////////////////////////////////////////////////////////////////
