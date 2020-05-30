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

/////////////////////////////////////////////////////////////////////////

var games = [];
var playerMap = [];

/////////////////////////////////////////////////////////////////////////

app.get('/game/:gameId', function(req, res){
  var gameId = req.params.gameId;
  res.sendFile(path.join(__dirname + '/static/game/index.html'));
});

/////////////////////////////////////////////////////////////////////////

app.get('/join/:gameId', function(req, res){
  var gameId = req.params.gameId;
  res.sendFile(path.join(__dirname + '/static/join/index.html'));
});

/////////////////////////////////////////////////////////////////////////

app.post('/host', function(req, res){
  var options = req.body.Options;
  var newGame = new GAME.Game(req.ip, options);
  games[newGame.Id] = newGame;
  res.end(JSON.stringify(newGame));
});

/////////////////////////////////////////////////////////////////////////

app.post('/game/:gameId', function(req, res){
  var gameId = req.params.gameId;
  var game = UTIL.Clone(games[gameId]);
  if(game !== undefined) {
    game.IsHost = req.ip === game.Host;
    //delete game.Host;
    //delete game.PlayerMap;
  }
  res.end(JSON.stringify(game));
});

/////////////////////////////////////////////////////////////////////////

app.post('/join/:gameId', function(req, res){
  var address = req.ip;
  var gameId = req.params.gameId;
  if(games[gameId] === undefined) {
    res.end(JSON.stringify("Invalid game"));
    return;
  }

  var player = new PLAYER.Player(req.body.Name);
  games[gameId].Players.push(player);
  games[gameId].PlayerMap[address] = player;
  res.end(JSON.stringify(player));
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
  var player = game.PlayerMap[address];
  if(player === undefined){
    res.end(JSON.stringify("Invalid player"));
    return;
  }
  player.Throws.push(req.body.Throw1);
  player.Throws.push(req.body.Throw2);
  player.Throws.push(req.body.Throw3);
  res.end();
});

/////////////////////////////////////////////////////////////////////////
