const socket = io();

/////////////////////////////////////////////////////////////////////////

const FallowStudios = {
  VDM: {
    Match: {
      Get: function(matchId, callback, err) {
        socket.emit("getMatch", {
          MatchId: matchId
        }, function(e) {
          if (e !== undefined && e.Match !== undefined) {
            callback(e);
            return;
          }
          err(e);
        });
      },
      Join: function(name, matchId, callback, err) {
        socket.emit("join", {
          MatchId: matchId,
          Name: name
        }, function(e) {
          if (e === undefined || e.Id === undefined) {
            err(e);
            return;
          }
          callback(e);
        });
      },
      Host: function(options, callback, err) {
        socket.emit("host", options, function(e) {
          if (e !== undefined && e.Id !== undefined) {
            callback(e);
            return;
          }
          err(e);
        });
      },
      Start: function(matchId, callback, err) {
        socket.emit("start", {
          MatchId: matchId
        }, function(e) {
          if (e !== undefined && e.Id !== undefined) {
            callback(e);
            return;
          }
          err(e);
        });
      }
    }
  }
};

/////////////////////////////////////////////////////////////////////////
