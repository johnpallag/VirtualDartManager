/////////////////////////////////////////////////////////////////////////

$(window).on("load", function() {
  $("#join").on("click", function(e) {
    if (matchId === null)
      return;
    if ($("#name").val() === "") {
      alert("Please input a name");
      return;
    }
    FallowStudios.VDM.Match.Join($("#name").val(), matchId, function() {
      $("#join").hide();
      $("#name").hide();
    }, function(e) {
      alert(e);
    });
  });

  $("#start").on("click", function(e) {
    FallowStudios.VDM.Match.Start(matchId, function(e) {}, function(e) {
      alert(e);
    });
  });

  const gm = new GameManager(socket);
  gm.AddCallback(function(match){
    if(gm.Player !== null && gm.Player !== undefined) {
      $("#join").hide();
      $("#name").hide();
      $("#playerId").text(gm.Player.Name);
      console.log(gm.Player.Name);
    }
    $("#matchId").text(match.Id);
    if (match.IsHost === true)
      $("#start").removeClass("disabled");
    $("#players").html("");
    for (let i = 0; i < match.Players.length; i++) {
      $("#players").append("<div class='player'>" + match.Players[i].Name + "</div>");
    }
    if (match.Started === true)
      window.location = "/" + match.Id + "/" + match.Games[0].Id + "/game";
  });
  gm.Initialize();
});

/////////////////////////////////////////////////////////////////////////
