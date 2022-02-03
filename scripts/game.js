var slider = document.getElementById("slider");
var outcome_text = document.getElementById("outcome-text");
var guessButton = document.getElementById("guess-btn");
var teams = {
  "sx": { "members": [], "score": 0, "iActive": 0},
  "dx": { "members": [], "score": 0, "iActive": 0}
};
var solution;
var gradientSolution;
var turn;
var nOpposites;

function currentTeam() {
  if (turn % 2 == 1)
    return "sx";
  return "dx";
}
function notCurrentTeam() {
  if (turn % 2 == 0)
    return "dx";
  return "sx";
}
function check() {
  guess = slider.value;
  error = guess - solution;
  console.log(guess + " " + solution + " " + error);
  if ( Math.abs(error) <= 3) {
    outcome_text.innerHTML = "Siete proprio alla stessa lunghezza d'onda! 4 Punti!";
    teams[currentTeam()]["score"] += 4;
  } else if ( Math.abs(error) <= 8) {
    outcome_text.innerHTML = "Che sintonia! 3 Punti!";
    teams[currentTeam()]["score"] += 3;
  } else if ( Math.abs(error) <= 13) {
    outcome_text.innerHTML = "Davvero niente male! 2 Punti!";
    teams[currentTeam()]["score"] += 2;
  } else {
    outcome_text.innerHTML = "Meglio che vi risintonizziate...";
  }
  //Bottone "Prossimo Turno"
  outcome_text.innerHTML += "  <button type='button' class='btn btn-primary btn-sm' onclick='newTurn()'> Prossimo turno </button>";
  checkSecond(error);
  refreshPoints();
  showSolution();
}
function checkSecond(err) {
  if (error < -3 && guessButton.innerHTML == opposites_list[indexOpinion][1])
    teams[notCurrentTeam()]["score"]++;
  else if  (error > 3 && guessButton.innerHTML == opposites_list[indexOpinion][0])
    teams[notCurrentTeam()]["score"]++;
}
function changeGuessButton() {
  if (guessButton.innerHTML == opposites_list[indexOpinion][0])
    guessButton.innerHTML = opposites_list[indexOpinion][1];
  else
    guessButton.innerHTML = opposites_list[indexOpinion][0];

  guessButton.classList.toggle("btn-success");
  guessButton.classList.toggle("btn-danger");
}
function refreshGuessButton() {
  guessButton.innerHTML = opposites_list[indexOpinion][0];
  guessButton.classList.add("btn-success");
  guessButton.classList.remove("btn-danger");
}
function refreshPoints() {
  document.getElementById("points-sx").innerHTML = teams["sx"]["score"];
  document.getElementById("points-dx").innerHTML = teams["dx"]["score"];
}

function addMember(team) {
  newMembers = document.getElementById("add-member-" + team).value.split(",");
  for (member of newMembers)
    if (member.trim() != "" && !teams[team]["members"].includes(member.trim()))
      teams[team]["members"].push(member.trim());

  refreshMembers();
  document.getElementById("add-member-" + team).value = "";
}
function removeMember(team) {
  membersToRemove = document.getElementById("add-member-" + team).value;
  if (membersToRemove == "")
    teams[team]["members"].pop();
  else for (member of membersToRemove.split(",")) {
    index = teams[team]["members"].indexOf(member.trim())
    if (index >= 0) {
      teams[team]["members"].splice(index, 1);
    }
  }
  refreshMembers();
  document.getElementById("add-member-" + team).value = "";
}
function refreshMembers() {
  for (var team in teams) {
    team_list = document.getElementById("team-list-" + team);
    team_list.innerHTML = " ";
    for (var i = 0; i < teams[team]["members"].length; i++) {
      team_list.innerHTML += "<li class='list-group-item' id='"+ teams[team]["members"][i] +"'>" + teams[team]["members"][i] + "</li>"
    }
  }
}
function clearTeams() {
  teams["sx"]["members"] = [];
  teams["sx"]["score"] = 0;
  teams["dx"]["members"] = [];
  teams["dx"]["score"] = 0;
  refreshMembers();
}

function showSolutionTemp(s) {
  outcome_text.innerHTML = "Tra poco verrà mostrata la soluzione";
  setTimeout( function () {
    showSolution();
    outcome_text.innerHTML = "";
    setTimeout( function() {
      hideSolution();
    }, s*1000);
  }, s*1000);
}
function showSolution() {
  slider.style.background = "-webkit-linear-gradient(" + gradientSolution + ")";
}
function hideSolution() {
  slider.style.background = "#d1d1d1"; //solid grey
}
function getGradientString(val) {
  points = [0, val-14, val-13, val-9, val-8, val-4, val-3, val+2, val+3, val+7, val+8, val+12, val+13, 100]
  for (var i = 0; i < points.length; i++) {
    if (points[i] < 0) {
      points[i] = 0;
    } else if (points[i] > 100) {
      points[i] = 100;
    }
  }
  return "left, "+
    "#d1d1d1 " + points[0] + "%, #d1d1d1 " + points[1] + "%, " +
    "#ff5c5c " + points[2] + "%, #ff5c5c " + points[3] + "%, " +
    "#f7ff5c " + points[4] + "%, #f7ff5c " + points[5] + "%, " +
    "#82ff5c " + points[6] + "%, #82ff5c " + points[7] + "%, " +
    "#f7ff5c " + points[8] + "%, #f7ff5c " + points[9] + "%, " +
    "#ff5c5c " + points[10] + "%, #ff5c5c " + points[11] + "%, " +
    "#d1d1d1 " + points[12] + "%, #d1d1d1 " + points[13] + "%";
}

function newCards() {
  indexOpinion = Math.floor(Math.random() * opposites_list.length);
  document.getElementById('left_card_text').innerHTML = opposites_list[indexOpinion][0];
  document.getElementById('right_card_text').innerHTML = opposites_list[indexOpinion][1];
  refreshGuessButton();
}
function newTurn() {
  newCards();
  hideSolution();

  slider.value = 50;
  outcome_text.innerHTML = "";

  solution = Math.floor(Math.random() * 100 + 1);
  gradientSolution = getGradientString(solution);

  if (turn % 2 == 1 && teams["dx"]["members"].length > 0) {
    turn++;

    if (teams["dx"]["iActive"] >= teams["dx"]["members"].length)
      teams["dx"]["iActive"] = 0;
    document.getElementById(teams["dx"]["members"][teams["dx"]["iActive"]++]).classList.add("active");

    if (teams["dx"]["iActive"] == 0)
      document.getElementById(teams["sx"]["members"][teams["sx"]["members"].length]-1).classList.remove("active");
    else
      document.getElementById(teams["sx"]["members"][teams["sx"]["iActive"]-1]).classList.remove("active");
  } else if (teams["sx"]["members"].length > 0){
    turn++;

    if (teams["sx"]["iActive"] >= teams["sx"]["members"].length)
      teams["sx"]["iActive"] = 0;
    document.getElementById(teams["sx"]["members"][teams["sx"]["iActive"]++]).classList.add("active");

    if (teams["dx"]["iActive"] == 0)
      document.getElementById(teams["dx"]["members"][teams["dx"]["members"].length-1]).classList.remove("active");
    else
      document.getElementById(teams["dx"]["members"][teams["dx"]["iActive"]-1]).classList.remove("active");
  }
}
function restartTurn() {
  turn--;
  newTurn();
}
function newGame() {
  turn = 0;
  teams["sx"]["score"] = 0;
  teams["sx"]["iActive"] = 0;
  teams["dx"]["score"] = 0;
  teams["dx"]["iActive"] = 0;
  newTurn();
}

//AT START
document.getElementById("add-member-sx").addEventListener("keyup", function() {
  if (event.keyCode === 13) { document.getElementById("add-member-btn-sx").click(); }
})
document.getElementById("add-member-dx").addEventListener("keyup", function() {
  if (event.keyCode === 13) { document.getElementById("add-member-btn-dx").click(); }
})
