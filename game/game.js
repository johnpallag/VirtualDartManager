const UTIL = require("../util");
require("../util/seedrandom");

const EnumGameState = {
  "eDrawCards": 0,
  "eRefreshTown": 1,
  "eRefreshTravelers": 2,
  "eMonstersAct": 3,
  "eMonstersGainPower": 4,
  "eAddMonsters": 5,
  "eHereosAct": 6,
  "eCleanup": 7
};

/////////////////////////////////////////////////////////////////////////

const Game = function(host, gameType) {
  this.Id = UTIL.GenerateId();
  this.Players = [];
  this.PlayerMap = [];
  this.GameType = gameType;
  this.Host = host;
  this.GameState = -1;
};

/////////////////////////////////////////////////////////////////////////

Game.prototype.Start = function() {
  this.GameState = 0;
};

/////////////////////////////////////////////////////////////////////////

Game.prototype.AddThrow = function(playerIdx, newThrow) {
  this.Players[playerIdx].Throws.push(newThrow);
  var value = "" + newThrow.split("x")[0];
  var multiplier = parseInt(newThrow.split("x")[1] || "1");
  this.Players[playerIdx].Scores[value] = (this.Players[playerIdx].Scores[value] || 0) + multiplier;
};

/////////////////////////////////////////////////////////////////////////

Game.prototype.NextState = function() {
  this.State++;
  if (this.State == EnumGameState.eDrawCards)
    this.DrawCards();
  else if (this.State == EnumGameState.eRefreshTown)
    this.RefreshTown();
  else if (this.State == EnumGameState.eRefreshTravelers)
    this.RefreshTravelers();
  else if (this.State == EnumGameState.eMonstersAct)
    this.MonstersAct();
  else if (this.State == EnumGameState.eMonstersGainPower)
    this.MonstersGainPower();
  else if (this.State == EnumGameState.eAddMonsters)
    this.AddMonsters();
  else if (this.State == EnumGameState.eHereosAct)
    this.HereosAct();
  else if (this.State == EnumGameState.eCleanup)
    this.Cleanup();
};

/////////////////////////////////////////////////////////////////////////

exports.Game = Game;
