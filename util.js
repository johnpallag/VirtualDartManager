/////////////////////////////////////////////////////////////////////////

exports.SelectRandomWithProbability = function(pairs) {
  const sum = pairs.reduce((total, x) => total + x);
  let prob = 0.0;
  pairs = pairs.map((x) => {
    prob += x;
    return prob / sum;
  });
  const r = Math.random();
  for (let i = 0; i < pairs.length; i++) {
    if (r < pairs[i])
      return i;
  }
}

/////////////////////////////////////////////////////////////////////////

exports.DrawCard = function(obj){
  if(obj.Deck.length <= 0){
    obj.Discard = exports.Shuffle(obj.Discard);
    obj.Deck = obj.Discard;
    obj.Discard = [];
  }
  var newCard = obj.Deck.pop();
  obj.Active.push(newCard);
  return newCard;
}

/////////////////////////////////////////////////////////////////////////

exports.Shuffle = function(arr) {
  var currentIndex = arr.length,
    temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = arr[currentIndex];
    arr[currentIndex] = arr[randomIndex];
    arr[randomIndex] = temporaryValue;
  }

  return arr;
}

/////////////////////////////////////////////////////////////////////////

exports.RandomRange = function(min, max) {
  return Math.random() * (max - min) + min;
}

/////////////////////////////////////////////////////////////////////////

exports.PickRandom = function(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/////////////////////////////////////////////////////////////////////////

exports.OrbitDistanceToPosition = function(orbit, distance) {
  return [Math.cos(orbit) * distance, 0, Math.sin(orbit) * distance];
}

/////////////////////////////////////////////////////////////////////////

exports.Distance = function(p1, p2) {
  var v = [];
  v[0] = p1[0] - p2[0];
  v[1] = p1[1] - p2[1];
  v[2] = p1[2] - p2[2];
  return Math.sqrt((v[0] * v[0]) + (v[1] * v[1]) + (v[2] * v[2]));
}

/////////////////////////////////////////////////////////////////////////

const consanents = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'qu', 'r', 's', 't', 'v', 'w', 'y', 'z', 'br', 'ch', 'cr', 'dr', 'fr', 'gr', 'pr', 'sh', 'sk', 'sl', 'sm', 'sn', 'sp', 'squ', 'st', 'str', 'tr', 'vr', 'wr'];
const vowels = ['a', 'e', 'i', 'o', 'u', 'ee', 'oo', 'ei', 'ie', 'ae', 'ou', 'ai', 'ia', 'ay', 'oy', 'ey'];
const endings = ['', 'nd', 'ns', 'n', 'd', 't', 'p', 'z', 'v', 's', 'ts', 'x', 'nch', 'y', 'w', 'll', 'rn', 'ps', 'ds', 'ws', 'ny', 'na', 'ra', 'ry'];
const letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']

exports.GenerateWord = function() {
  const numSylables = Math.floor(Math.random() * 3) + 1;
  let word = "";
  for (let i = 0; i < numSylables; i++) {
    word += exports.PickRandom(consanents);
    word += exports.PickRandom(vowels);
  }
  word += exports.PickRandom(endings);
  return word;
}

/////////////////////////////////////////////////////////////////////////

exports.GenerateId = function(num) {
  var res = "";
  if(num === undefined)
    num = 5;
  for(let i=0;i<num;i++){
    res += exports.PickRandom(letters);
  }
  return res;
}

/////////////////////////////////////////////////////////////////////////

exports.Clone = function(inObject) {
  let outObject, value, key

  if (typeof inObject !== "object" || inObject === null) {
    return inObject // Return the value if inObject is not an object
  }

  // Create an array or object to hold the values
  outObject = Array.isArray(inObject) ? [] : {}

  for (key in inObject) {
    value = inObject[key]

    // Recursively (deep) copy for nested objects, including arrays
    outObject[key] = exports.Clone(value)
  }

  return outObject
}

/////////////////////////////////////////////////////////////////////////

if (!Array.prototype.last) {
  Array.prototype.last = function() {
    return this[this.length - 1];
  };
};

/////////////////////////////////////////////////////////////////////////
