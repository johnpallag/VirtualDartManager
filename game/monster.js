const UTIL = require("../util");
const CARD = require("./card");
const uuidv1 = require('uuid/v1');
require("../util/seedrandom");

/////////////////////////////////////////////////////////////////////////

const Monster = function(health, power) {
  this.Id = uuidv1();
  this.Health = health;
  this.Power = power;
  this.Step = 0;
}

/////////////////////////////////////////////////////////////////////////

Monster.prototype.Act = function(){
  this.Step++;
}

/////////////////////////////////////////////////////////////////////////

Monster.prototype.GainPower = function(){
  if(this.Step >= 4)
    return this.Power;
  return 0;
}

/////////////////////////////////////////////////////////////////////////

exports.Monster = Monster;
