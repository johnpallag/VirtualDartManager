const UTIL = require("../util");
const GAME = require("./game");
const CRICKET = require("./cricket");
require("../util/seedrandom");

/////////////////////////////////////////////////////////////////////////
// Top-level class for virtual dart manager
// - Contains a list of players that have joined (spectators not tracked)
// - Contains a list of simultanious games for this match
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

Match.prototype.ToJson = function(socket) {
    var data = {};
    data.Id = this.Id;
    data.Players = this.Players;
    data.Private = this.Private;
    data.Games = this.Games;
    data.GameType = this.Started;
    data.Started = this.Started;
    data.IsHost = socket === this.Host;
    return data;
};

/////////////////////////////////////////////////////////////////////////

exports.Match = Match;

/////////////////////////////////////////////////////////////////////////
