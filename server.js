'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');
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
const io = socketIO(server);

const UTIL = require('./util');
const PLAYER = require('./game/player');
const GAME = require('./game/game');
const CRICKET = require('./game/cricket')
const MATCH = require('./game/match');

/////////////////////////////////////////////////////////////////////////

var matches = [];

/////////////////////////////////////////////////////////////////////////

io.on('connection', function(socket) {
  socket.on('disconnect', function() {
    //delete socketMap[socket.handshake.address];
  });

  /////////////////////////////////////////////////////////////////////////
  // Returns the match data
  // Params:
  // - MatchId: id of the match to join
  socket.on('getMatch', function(data, callback){
    const matchId = data.MatchId;
    const match = matches[matchId];
    if (match === undefined) {
      callback("Invalid match id");
      return;
    }

    var playerIdx = match.PlayerMap[socket];
    if (playerIdx === undefined) {
      callback({Match: match.ToJson()});
      return;
    }

    callback({Match: match.ToJson(), Player: match.Players[playerIdx]});
  });

  /////////////////////////////////////////////////////////////////////////
  // Host new private match
  // Params:
  // - GameType: type of game (Cricket is only one supported)
  socket.on('host', function(data, callback) {
    // TODO: validate game type
    const gameType = data.GameType;
    const newMatch = new MATCH.Match(socket, true, gameType);
    matches[newMatch.Id] = newMatch;
    callback(matches[newMatch.Id].ToJson(socket));
  });

  /////////////////////////////////////////////////////////////////////////
  // Join match
  // Params:
  // - MatchId: id of the match to join
  // - Name: player name
  socket.on('join', function(data, callback) {
    const matchId = data.MatchId;
    const name = data.Name;
    if (matches[matchId] === undefined) {
      callback("Invalid match id");
      return;
    }

    // Create socket 'room'
    socket.join(matchId);

    let player = new PLAYER.Player(name);
    matches[matchId].Players.push(player);
    matches[matchId].PlayerMap[socket] = matches[matchId].Players.length - 1;

    io.in(matchId).emit("match", matches[matchId].ToJson(socket));
    callback(player);
  });

  /////////////////////////////////////////////////////////////////////////
  // Start match
  // - Only the host can start a match if there are enough players
  // Params:
  // - MatchId: id of the match to join
  socket.on('start', function(data, err) {
    const matchId = data.MatchId;
    const match = matches[matchId];
    if (match === undefined) {
      err("Invalid match Id");
      return;
    }
    if (!match.IsAuthorized(socket)) {
      err("Only the host can start the match");
      return;
    }
    if (!match.CanStart()) {
      err("Cannot start match");
      return;
    }

    match.Start();
    io.in(matchId).emit("match", matches[matchId].ToJson(socket));
  });

  /////////////////////////////////////////////////////////////////////////
  // Finish a player's turn (3 darts)
  // Params:
  // - MatchId: id of the match to join
  // - GameId: id of the game in the match
  // - Throws: array containg data about the throws
  //   - Value: value of the hit (0 - 20, 25)
  //   - Multiplier: multiple of the hit (1, 2, 3)
  socket.on('turn', function(data, err) {
    const matchId = data.matchId;
    const match = matches[matchId];
    if (match === undefined) {
      err("Invalid match Id");
      return;
    }
    if (match.Started === false) {
      err("Match has not started");
      return;
    }

    const gameId = data.gameId;
    const gameIdx = match.GameMap[gameId];
    if (gameIdx === undefined) {
      err("Invalid game id");
      return;
    }

    var playerIdx = match.PlayerMap[socket];
    if (playerIdx === undefined) {
      err("Invalid player");
      return;
    }
    game.AddThrow(playerIdx, req.body.Throw1);
    game.AddThrow(playerIdx, req.body.Throw2);
    game.AddThrow(playerIdx, req.body.Throw3);

    io.in(matchId).emit("match", matches[matchId].ToJson(socket));
  });
});

/////////////////////////////////////////////////////////////////////////

app.get('/randomMatch', function(req, res) {
  let targetMatch = null;
  if (matches.length > 0) {
    targetMatch = matches.reduce(
      (targetMatch, match) => targetMatch ||
      ((!match.Private && !match.Started) ? match : null));
  }
  if (targetMatch === null) {
    targetMatch = new MATCH.Match(req.ip, false, "Cricket");
    matches[targetMatch.Id] = targetMatch;
  }
  res.end(JSON.stringify(targetMatch));
});

/////////////////////////////////////////////////////////////////////////

app.get('/:matchId', function(req, res) {
  const matchId = req.params.matchId;
  let match = UTIL.Clone(matches[matchId]);
  if (match === undefined) {
    res.status(404).end("Invalid match id");
    return;
  }
  match.IsHost = req.ip === match.Host;
  delete match.Host;
  delete match.PlayerMap;
  res.end(JSON.stringify(match));
});

/////////////////////////////////////////////////////////////////////////

app.get('/:matchId/join/', function(req, res) {
  const matchId = req.params.matchId;
  if (matches[matchId] === undefined) {
    res.status(404).end("Invalid match id");
    return;
  }
  var content = fs.readFileSync(path.join(__dirname + '/static/join/index.html'), 'utf8');
  content = content.replace("{{MATCH_ID}}", matchId);
  res.send(content);
});

/////////////////////////////////////////////////////////////////////////

app.get('/:matchId/:gameId/game/', function(req, res) {
  const matchId = req.params.matchId;
  const gameId = req.params.gameId;
  if (matches[matchId] === undefined) {
    res.status(404).end("Invalid match id");
    return;
  }
  if (matches[matchId].GameMap[gameId] === undefined) {
    res.status(404).end("Invalid game id");
    return;
  }
  var content = fs.readFileSync(path.join(__dirname + '/static/game/index.html'), 'utf8');
  content = content.replace("{{MATCH_ID}}", matchId);
  content = content.replace("{{GAME_ID}}", gameId);
  res.send(content);
});

/////////////////////////////////////////////////////////////////////////

app.get('/:matchId/:gameId', function(req, res) {
  const matchId = req.params.matchId;
  const gameId = req.params.gameId;
  const match = matches[matchId];
  if (match === undefined) {
    res.status(404).end("Invalid match id");
    return;
  }
  const gameIdx = match.GameMap[gameId];
  if (gameIdx === undefined) {
    res.status(404).end("Invalid game id");
    return;
  }
  res.end(JSON.stringify(UTIL.Clone(match.Games[gameIdx])));
});

/////////////////////////////////////////////////////////////////////////
