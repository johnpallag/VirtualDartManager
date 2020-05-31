/////////////////////////////////////////////////////////////////////////

function JoinMatch(name, matchId, success, failure) {
  $.post("/" + matchId + "/join/", {
    Name: name
  }, function(e) {
    try {
      var res = JSON.parse(e);
      if (res === undefined || res.Id === undefined)
        throw "Invalid match id";
      success(res);
    } catch (ex) {
      failure(ex);
    }
  });
}

/////////////////////////////////////////////////////////////////////////

function LoadMatch(matchId, success, failure) {
  $.get("/" + matchId, function(e) {
    try {
      var res = JSON.parse(e);
      if (res === undefined || res.Id === undefined)
        throw "Invalid match id";
      success(res);
    } catch (ex) {
      failure(ex);
    }
  });
}

/////////////////////////////////////////////////////////////////////////

var matchId = matchId || null;
var match = null;

/////////////////////////////////////////////////////////////////////////

$(window).on("load", function() {
  if (matchId !== null) {
    LoadMatch(matchId, function(e) {
      match = e;
    }, function(e) {
      console.log(e);
    });
    setInterval(function() {
      LoadMatch(matchId, function(e) {
        match = e;
      }, function(e) {
        console.log(e);
      });
    }, 1000)
  }
});

/////////////////////////////////////////////////////////////////////////
