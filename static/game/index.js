/////////////////////////////////////////////////////////////////////////

$(window).on("load", function() {

  const Multiples = ["Select Multiples", "Single", "Double", "Triple"];

  // Construct submit form
  for (let i = 0; i < 3; i++) {
    var selectDropdown = $("<select class='form-control'>");
    selectDropdown.attr("id", "throw" + (i + 1));
    selectDropdown.append("<option value=''>Select Points</option>");
    selectDropdown.append("<option value='0'>Miss</option>");
    selectDropdown.append("<option value='25'>Bull's Eye</option>");
    for (let x = 20; x >= 1; x--) {
      selectDropdown.append("<option value='" + x + "'>" + x + "</option>");
    }
    var multiplierDropdown = $("<select class='form-control'>");
    multiplierDropdown.attr("id", "multiplier" + (i + 1));
    multiplierDropdown.append("<option value=''>Select Multiple</option>");
    for (let x = 1; x <= 3; x++) {
      multiplierDropdown.append("<option value='" + x + "'>" + Multiples[x] + "</option>");
    }
    var group = $("<div class='form-group'>");
    group.append($("<label for='throw" + (i + 1) + "'>Throw " + (i + 1) + "</label>"));
    group.append(selectDropdown);
    group.append(multiplierDropdown);
    $("#throwForm").append(group);
  }
  $("#throwForm").append('<div id="submit" class="btn btn-primary">Submit</div>');

  $("#throwForm").hide();
  $("#submit").on("click", function() {
    var throws = [];
    for (let i = 0; i < 3; i++) {
      const value = $("#throw" + (i + 1)).val();
      if (value === "") {
        alert("Pick a value (or miss) for throw " + (i + 1));
        return;
      }
      const multiple = $("#multiplier" + (i + 1)).val();
      if (multiple === "") {
        alert("Pick a multiple for throw " + (i + 1));
        return;
      }
      throws.push({
        Value: parseInt(value),
        Multiple: parseInt(multiple)
      });
    }
    socket.emit("turn", {
      MatchId: gm.Match.Id,
      GameId: gm.Match.Games[0].Id,
      Throws: throws
    }, function(e) {
      alert(e);
    });
  });

  function GetScore(multiples) {
    if (multiples.length <= 0)
      return "";
    const symbols = ["", "&#x2f;", "&#10008;", "&#10683;"];
    let sum = multiples.reduce((a, b) => a + b) || 1;
    let printout = symbols[Math.min(sum, 3)];
    return printout + " " + ((sum > 3) ? (sum - 3) : "");
  }

  const cricketScores = [20, 19, 18, 17, 16, 15, 25];
  const gm = new GameManager(socket);
  gm.AddCallback(function(match) {
    console.log(match);
    $("#matchId").text(match.Id);
    $("#throwForm").hide();
    const game = gm.Match.Games[0];
    if (gm.Player !== null && gm.Player !== undefined) {
      $("#playerId").text(gm.Player.Name);
      if (gm.Match.Games[0].Players[gm.Match.Games[0].RoundCounter % 2] === gm.Player.Id)
        $("#throwForm").show();
      if(game.Winner !== undefined){
        if(gm.Player === game.Winner) {
          alert("You win!");
        } else {
          alert("You lose!");
        }
        window.location = "/";
      }
    }
    $("#players").html("");
    for (let i = 0; i < match.Players.length; i++) {
      $("#players").append("<div class='player'>" + match.Players[i].Name + "</div><br>");

      for (let j = 0; j < cricketScores.length; j++) {
        var count = game.Scores[i][cricketScores[j]] || {
          Value: cricketScores[j],
          Multiples: []
        };
        var num = cricketScores[j];
        if(num === 25)
          num = "B";
        $("#players").append("<div class='score'>" + num + ": " + GetScore(count.Multiples) + "</div>");
      }
    }
  });
  gm.Initialize();
});

/////////////////////////////////////////////////////////////////////////
