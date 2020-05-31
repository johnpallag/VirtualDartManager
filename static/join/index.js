/////////////////////////////////////////////////////////////////////////

$(window).on("load", function() {
  $("#join").on("click", function(e) {
    if (matchId === null)
      return;
    if ($("#name").val() === "") {
      alert("Please input a name");
      return;
    }
    FallowStudios.VDM.Join($("#name").val(), matchId, function() {
      $("#join").hide();
      $("#name").hide();
    }, function(e) {
      alert(e);
    });
  });

  $("#start").on("click", function(e) {
    FallowStudios.VDM.Start(matchId, function(e) {}, function(e) {
      alert(e);
    });
  });

  FallowStudios.VDM.GetMatch(matchId, function(e){
    //if(e.Player !== undefined){
    //  $("#join").hide();
    //  $("#name").hide();
    //}
    Initialize(e.Match);
  }, function(e){
    alert(e);
  });

  socket.on("match", function(e){
    Initialize(e);
  });

  function Initialize(matchData) {
    match = matchData;
    $("#matchId").text(match.Id);
    if (match.IsHost === true)
      $("#start").removeClass("disabled");
    $("#players").html("");
    for (let i = 0; i < match.Players.length; i++) {
      $("#players").append("<div class='player'>" + match.Players[i].Name + "</div>");
    }
    if (match.Started === true)
      window.location = "/" + match.Id + "/" + match.Games[0].Id + "/game";
  }
});

/////////////////////////////////////////////////////////////////////////
