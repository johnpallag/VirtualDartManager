var matchId = matchId || null;

/////////////////////////////////////////////////////////////////////////

const GameManager = function(socket) {
  this.Socket = socket;
  this.Callbacks = [];
  this.Match = null;
  this.Player = null;
};

/////////////////////////////////////////////////////////////////////////

GameManager.prototype.Initialize = function() {
  var gm = this;
  if(matchId === null || matchId === undefined)
    return;
  FallowStudios.VDM.Match.Get(matchId, function(e) {
    gm.Match = e.Match;
    gm.Player = e.Player;
    gm.Callbacks.map((x)=>x(gm.Match));
  }, function(e) {
    alert(e);
  });

  socket.on("match", function(e){
    gm.Match = e;
    gm.Callbacks.map((x)=>x(gm.Match));
  });
};

/////////////////////////////////////////////////////////////////////////

GameManager.prototype.AddCallback = function(callback){
  this.Callbacks.push(callback);
};

/////////////////////////////////////////////////////////////////////////
