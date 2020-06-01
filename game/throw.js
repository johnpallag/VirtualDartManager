const UTIL = require("../util");

/////////////////////////////////////////////////////////////////////////

const Throw = function(value, multiple){
  // Check value range
  if ((value > 20 && value !== 25) || value < 0)
    throw "Invalid value";
  // Check multiple range
  if (multiple > 3 || multiple < 1)
    throw "Invalid value";
  // Check bull's eye
  if (value === 25 && multiple > 2)
    throw "Invalid value";
  this.Value = value;
  this.Multiple = multiple;
};

/////////////////////////////////////////////////////////////////////////

exports.Throw = Throw;

/////////////////////////////////////////////////////////////////////////
