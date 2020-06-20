const UTIL = require("../util");
const GAME = require("./game");
const MATCH = require("./match");
const THROW = require("./throw");
require("../util/seedrandom");

/////////////////////////////////////////////////////////////////////////
// Simple object to track a value and the throws made
const ValueScore = function(value) {
  this.Value = value;
  this.Multiples = [];
};

/////////////////////////////////////////////////////////////////////////
// Total points from this value (after 3 successful hits)
ValueScore.prototype.GetTotal = function() {
  return this.Value * Math.max(this.Multiples.reduce((a, b) => a + b) - 3, 0);
};

/////////////////////////////////////////////////////////////////////////
// Checks if >3 hits have been made
ValueScore.prototype.IsClosed = function() {
  return this.Multiples.reduce((a, b) => a + b) >= 3;
};

/////////////////////////////////////////////////////////////////////////
// Game mode: Cricket
// - Each player must score 3 or more hits on bull and 20-15
// - More than 3 hits will earn points
// - First to close with most points wins
const Cricket = function(playerIdxs) {
  if (playerIdxs.length !== 2)
    throw "Invalid Cricket game";

  this.Id = UTIL.GenerateId();

  this.Players = playerIdxs;
  this.CurrentPlayerThrows = 0;

  this.Scores = [];

  this.RoundCounter = 0;
  this.Started = false;
};

/////////////////////////////////////////////////////////////////////////

const CricketScores = [25, 20, 19, 18, 17, 16, 15];

/////////////////////////////////////////////////////////////////////////

Cricket.prototype.Start = function() {
  this.Started = true;
};

/////////////////////////////////////////////////////////////////////////

Cricket.prototype.GetCurrentPlayer = function() {
  return this.RoundCounter % 2;
};

/////////////////////////////////////////////////////////////////////////

Cricket.prototype.GetNextPlayer = function() {
  return (this.RoundCounter + 1) % 2;
};

/////////////////////////////////////////////////////////////////////////

Cricket.prototype.SumPlayerScore = function(playerIdx) {
  const scores = this.Scores[playerIdx];
  if (scores === undefined)
    return 0;
  return scores.reduce((sum, valueScore) => sum + valueScore.GetTotal());
};

/////////////////////////////////////////////////////////////////////////

Cricket.prototype.CheckWinCondition = function() {
  const currentPlayerIdx = this.GetCurrentPlayer();
  const scores = this.Scores[currentPlayerIdx];
  if (scores === undefined)
    return false;
  if (!scores.reduce((allClosed, valueScore) => allClosed && valueScore.IsClosed()))
    return false;
  const score = this.SumPlayerScore(currentPlayerIdx);
  const otherPlayerScore = this.SumPlayerScore(this.GetNextPlayer());
  return score >= otherPlayerScore;
};

/////////////////////////////////////////////////////////////////////////

Cricket.prototype.AddThrow = function(match, playerIdx, throwData) {
  let newThrow = new THROW.Throw(throwData.Value, throwData.Multiple);
  const currentPlayerIdx = this.GetCurrentPlayer();
  if (playerIdx !== this.Players[currentPlayerIdx])
    return;
  const nextPlayerIdx = this.GetNextPlayer();

  match.Players[this.Players[currentPlayerIdx]].Throws.push(newThrow);

  if (CricketScores.includes(newThrow.Value)) {
    // Create score object if empty
    this.Scores[currentPlayerIdx] = this.Scores[currentPlayerIdx] || {};

    this.Scores[currentPlayerIdx][newThrow.Value] =
      this.Scores[currentPlayerIdx][newThrow.Value] ||
      new ValueScore(newThrow.Value);

    const nextClosed = this.Scores[nextPlayerIdx][newThrow.Value].IsClosed();
    const totalMultilples =
      this.Scores[currentPlayerIdx][newThrow.Value].Multiples.reduce(
        (a, x) => a + x
      );

    // Clamp to close only
    if (nextClosed)
      newThrow.Multiple = Math.max(
        Math.min(3 - totalMultilples, newThrow.Multiple),
        0
      );

    if (newThrow.Multiple > 0) {
      // Increment score
      this.Scores[currentPlayerIdx][newThrow.Value].Multiples.push(newThrow.Multiple);
    }
  }

  if (this.CheckWinCondition())
    this.Winner = currentPlayerIdx;

  // Increment throws/rounds as necessary
  if (this.CurrentPlayerThrows++ >= 3) {
    this.RoundCounter++;
    this.CurrentPlayerThrows = 0;
  }
};

/////////////////////////////////////////////////////////////////////////

Cricket.prototype.ToJson = function() {
  var data = {};
  data.Id = this.Id;
  data.GameType = this.GameType;
  data.GameState = this.GameState;
  data.Scores = this.Scores;
  data.Started = this.Started;
  return data;
};

/////////////////////////////////////////////////////////////////////////

exports.Cricket = Cricket;

/////////////////////////////////////////////////////////////////////////
