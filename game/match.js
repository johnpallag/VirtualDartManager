const UTIL = require("../util");
const GAME = require("./game");
const CRICKET = require("./cricket");
require("../util/seedrandom");

/////////////////////////////////////////////////////////////////////////

const Match = function(host, gameType) {
  this.Id = UTIL.GenerateId();
  this.Players = [];
  this.PlayerMap = [];
  this.Host = host;
  this.Games = [];
  this.GameMap = [];
  this.GameType = gameType;
};

/////////////////////////////////////////////////////////////////////////

Match.prototype.IsAuthorized = function(address){
  return address = this.Host;
};

/////////////////////////////////////////////////////////////////////////

Match.prototype.Start = function(){
  
};

/////////////////////////////////////////////////////////////////////////

exports.Match = Match;

/////////////////////////////////////////////////////////////////////////
