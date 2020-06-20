const socket = io({transports: ['websocket'], upgrade: false});

/////////////////////////////////////////////////////////////////////////

const FallowStudios = {
  VDM: {
    Player: {
      Id: null,
      Create: function(callback, err){
        socket.emit("createPlayer", function(e){
          if (e !== undefined && e.Id !== undefined) {
            FallowStudios.VDM.Player.SetId(e.Id);
            if(callback !== undefined)
              callback(e);
            return;
          }
          if(err !== undefined)
            err(e);
        });
      },
      Get: function(id, callback, err){
        socket.emit("getPlayer", {PlayerId: id}, function(e){
          if (e !== undefined && e.Id !== undefined) {
            FallowStudios.VDM.Player.SetId(e.Id);
            if(callback !== undefined)
              callback(e);
            return;
          }
          if(err !== undefined)
            err(e);
        });
      },
      SetId: function(id){
        window.localStorage.setItem("playerId", id);
        FallowStudios.VDM.Player.Id = id;
      },
      Init: function() {
        const id = window.localStorage.getItem("playerId");
        if(id === undefined || id === null) {
          FallowStudios.VDM.Player.Create();
        } else {
          FallowStudios.VDM.Player.Get(id, function(){}, function(){
            FallowStudios.VDM.Player.Create();
          });
        }
      }
    },
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
