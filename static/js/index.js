/////////////////////////////////////////////////////////////////////////

function GetGameId() {
  var s = window.location.toString().split("/");
  return s[s.length - 1].split("?")[0];
}

/////////////////////////////////////////////////////////////////////////

function JoinGame(name, gameId, success, failure) {
  $.post("/join/" + gameId, {Name:name}, function(e){
    try {
      var res = JSON.parse(e);
      if (res === undefined || res.Id === undefined)
        throw "Invalid game id";
      success(res);
    } catch(ex){
      failure(ex);
    }
  });
}

/////////////////////////////////////////////////////////////////////////

function LoadGame(gameId, success, failure){
  $.post("/game/" + gameId, function(e){
    try {
      var res = JSON.parse(e);
      if (res === undefined || res.Id === undefined)
        throw "Invalid game id";
      success(res);
    } catch(ex){
      failure(ex);
    }
  });
}

/////////////////////////////////////////////////////////////////////////
