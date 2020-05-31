const UTIL = require("../util");
const uuidv1 = require('uuid/v1');
//require("../util/seedrandom");

/////////////////////////////////////////////////////////////////////////

const Player = function(name) {
  this.Id = UTIL.GenerateId();
  this.Throws = [];
  this.Name = name;
}

/////////////////////////////////////////////////////////////////////////

exports.Player = Player;
