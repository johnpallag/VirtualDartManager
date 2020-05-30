const UTIL = require("../util");
const MONSTER = require("./monster");
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

const Game = function(host, options) {
  this.Id = UTIL.GenerateId();
  this.Players = [];
  this.PlayerMap = [];
  this.Options = options;
  this.Host = host;
  this.GameState = -1;
};

/////////////////////////////////////////////////////////////////////////

Game.prototype.Start = function() {
  this.GameState = 0;
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
