/////////////////////////////////////////////////////////////////////////

$(window).on("load", function() {

  $("#submit").on("click", function() {
    $.post("/update/" + game.Id, {
      Throw1: $("#throw1").val(),
      Throw2: $("#throw2").val(),
      Throw3: $("#throw3").val()
    });
  });

  const gm = new GameManager(socket);
  gm.AddCallback(function(match){
    $("#matchId").text(match.Id);
    if(gm.Player !== null && gm.Player !== undefined)
      $("#playerId").text(gm.Player.Name);
    $("#players").html("");
    for (let i = 0; i < match.Players.length; i++) {
      $("#players").append("<div class='player'>" + match.Players[i].Name + "</div><br>");

      /*for (let j = 0; j < cricketScores.length; j++) {
        var count = game.Scores[Players[i]]cricketScores[j]] || 0;
        var printout = "";
        if (count == 1)
          printout = "&#x2f;";
        else if (count == 2)
          printout = "X";
        else if (count >= 3)
          printout = "&#9447; " + ((count - 3 > 0) ? ("" + (count - 3)) : "");
        $("#players").append("<div class='score'>" + cricketScores[j] + ": " + printout + "</div>");
      }*/
  }});
  gm.Initialize();
});

/////////////////////////////////////////////////////////////////////////
