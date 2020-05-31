/////////////////////////////////////////////////////////////////////////

function GetMatchId() {
  var s = window.location.toString().split("/");
  return s[3];
}

/////////////////////////////////////////////////////////////////////////

function JoinMatch(name, matchId, success, failure) {
  $.post("/" + matchId + "/join/", {Name:name}, function(e){
    try {
      var res = JSON.parse(e);
      if (res === undefined || res.Id === undefined)
        throw "Invalid match id";
      success(res);
    } catch(ex){
      failure(ex);
    }
  });
}

/////////////////////////////////////////////////////////////////////////

function LoadMatch(matchId, success, failure){
  $.get("/" + matchId, function(e){
    try {
      var res = JSON.parse(e);
      if (res === undefined || res.Id === undefined)
        throw "Invalid match id";
      success(res);
    } catch(ex){
      failure(ex);
    }
  });
}

/////////////////////////////////////////////////////////////////////////
