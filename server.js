'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const uuidv1 = require('uuid/v1');
const fs = require('fs');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');

const app = express();
const server = app
  .use(express.static(__dirname + '/static'))
  .use(bodyParser.urlencoded({
    extended: false
  }))
  .use(bodyParser.json())
  .set('trust proxy', true)
  .listen(PORT, () => console.log('Listening on ' + PORT));

const UTIL = require('./util');
const PLAYER = require('./game/player');
const GAME = require('./game/game');
const CRICKET = require('./game/cricket')
const MATCH = require('./game/match');

/////////////////////////////////////////////////////////////////////////

var matches = [];

/////////////////////////////////////////////////////////////////////////

app.get('/randomMatch', function(req, res){
  let targetMatch = null;
  if(matches.length > 0) {
    targetMatch = matches.reduce((targetMatch, match) => targetMatch || ((!match.Private && !match.Started) ? match : null));
  }
  if(targetMatch === null) {
    targetMatch = new MATCH.Match(req.ip, false, "Cricket");
    matches[targetMatch.Id] = targetMatch;
  }
  res.end(JSON.stringify(targetMatch));
});

/////////////////////////////////////////////////////////////////////////

app.get('/:matchId', function(req, res){
  const matchId = req.params.matchId;
  let match = UTIL.Clone(matches[matchId]);
  if(match === undefined) {
    res.status(404).end("Invalid match id");
    return;
  }
  match.IsHost = req.ip === match.Host;
  delete match.Host;
  delete match.PlayerMap;
  res.end(JSON.stringify(match));
});

/////////////////////////////////////////////////////////////////////////

app.get('/:matchId/join/', function(req, res){
  const matchId = req.params.matchId;
  if(matches[matchId] === undefined) {
    res.status(404).end("Invalid match id");
    return;
  }
  res.sendFile(path.join(__dirname + '/static/join/index.html'));
});

/////////////////////////////////////////////////////////////////////////

app.get('/:matchId/:gameId/game/', function(req, res){
  const matchId = req.params.matchId;
  const gameId = req.params.gameId;
  if(matches[matchId] === undefined) {
    res.status(404).end("Invalid match id");
    return;
  }
  if(matches[matchId].GameMap[gameId] === undefined) {
    res.status(404).end("Invalid game id");
    return;
  }
  res.sendFile(path.join(__dirname + '/static/game/index.html'));
});

/////////////////////////////////////////////////////////////////////////

app.post('/host', function(req, res){
  const gameType = req.body.GameType;
  const newMatch = new MATCH.Match(req.ip, true, gameType);
  matches[newMatch.Id] = newMatch;
  res.end(JSON.stringify(newMatch));
});

/////////////////////////////////////////////////////////////////////////

app.post('/:matchId/join', function(req, res){
  const address = req.ip;
  const matchId = req.params.matchId;
  if(matches[matchId] === undefined) {
    res.status(404).end("Invalid match id");
    return;
  }

  let player = new PLAYER.Player(req.body.Name);
  matches[matchId].Players.push(player);
  matches[matchId].PlayerMap[address] = matches[matchId].Players.length - 1;
  res.end(JSON.stringify(player));
});

/////////////////////////////////////////////////////////////////////////

app.post('/:matchId/start', function(req, res){
  const address = req.ip;
  const matchId = req.params.matchId;
  const match = matches[matchId];
  if(match === undefined) {
    res.status(404).end("Invalid match id");
    return;
  }

  if(!match.IsAuthorized(address)) {
    res.status(403).end("Only the host can start a match");
    return;
  }
  if(!match.CanStart()){
    res.status(400).end("Cannot start match");
    return;
  }

  match.Start();
  res.end("");
});

/////////////////////////////////////////////////////////////////////////

app.post('/update/:gameId', function(req, res){
  var gameId = req.params.gameId;
  var address = req.ip;
  var game = games[gameId];
  if(game === undefined) {
    res.end(JSON.stringify("Invalid game"));
    return;
  }
  var playerIdx = game.PlayerMap[address];
  if(playerIdx === undefined){
    res.end(JSON.stringify("Invalid player"));
    return;
  }
  game.AddThrow(playerIdx, req.body.Throw1);
  game.AddThrow(playerIdx, req.body.Throw2);
  game.AddThrow(playerIdx, req.body.Throw3);
  res.end();
});

/////////////////////////////////////////////////////////////////////////

app.get('/:matchId/:gameId', function(req, res){
  const matchId = req.params.matchId;
  const gameId = req.params.gameId;
  const match = matches[matchId];
  if(match === undefined) {
    res.status(404).end("Invalid match id");
    return;
  }
  const gameIdx = match.GameMap[gameId];
  if(gameIdx === undefined) {
    res.status(404).end("Invalid game id");
    return;
  }
  res.end(JSON.stringify(UTIL.Clone(match.Games[gameIdx])));
});

/////////////////////////////////////////////////////////////////////////
