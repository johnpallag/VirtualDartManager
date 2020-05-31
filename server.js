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

app.get('/:matchId', function(req, res){
  var matchId = req.params.matchId;
  var match = UTIL.Clone(matches[matchId]);
  if(match !== undefined) {
    match.IsHost = req.ip === match.Host;
    delete match.Host;
    delete match.PlayerMap;
  }
  res.end(JSON.stringify(match));
});

/////////////////////////////////////////////////////////////////////////

app.get('/:matchId/join', function(req, res){
  res.sendFile(path.join(__dirname + '/static/join/index.html'));
});

/////////////////////////////////////////////////////////////////////////

app.get('/:matchId/:gameId/game', function(req, res){
  res.sendFile(path.join(__dirname + '/static/game/index.html'));
});

/////////////////////////////////////////////////////////////////////////

app.post('/host', function(req, res){
  var gameType = req.body.GameType;
  var newMatch = new MATCH.Match(req.ip, gameType);
  matches[newMatch.Id] = newMatch;
  res.end(JSON.stringify(newMatch));
});

/////////////////////////////////////////////////////////////////////////

app.post('/:matchId/join', function(req, res){
  var address = req.ip;
  var matchId = req.params.matchId;
  if(matches[matchId] === undefined) {
    res.end(JSON.stringify("Invalid match id"));
    return;
  }

  var player = new PLAYER.Player(req.body.Name);
  matches[matchId].Players.push(player);
  matches[matchId].PlayerMap[address] = matches[matchId].Players.length - 1;
  res.end(JSON.stringify(player));
});

/////////////////////////////////////////////////////////////////////////

app.post('/game/:gameId', function(req, res){
  var gameId = req.params.gameId;
  var game = UTIL.Clone(games[gameId]);
  if(game !== undefined) {
    game.IsHost = req.ip === game.Host;
    delete game.Host;
    delete game.PlayerMap;
  }
  res.end(JSON.stringify(game));
});

/////////////////////////////////////////////////////////////////////////

app.post('/start/:gameId', function(req, res) {
  var gameId = req.params.gameId;
  var address = req.ip;
  var game = games[gameId];
  if(game === undefined) {
    res.end(JSON.stringify("Invalid game"));
    return;
  }
  if(game.Host !== address) {
    res.end(JSON.stringify("Not host"));
    return;
  }
  game.Start();
  res.end();
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
