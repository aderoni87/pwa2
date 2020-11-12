var DataMatch;
var DataTeam;
const token = 'bad3d24623da46e18dc267129c4d70c7'
const tahun = 2001
var base_url = "https://api.football-data.org/v2/";
var standing_ep = `${base_url}competitions/${tahun}/standings?standingType=TOTAL`;
var matches_ep = `${base_url}competitions/${tahun}/matches`;
var teams_ep = `${base_url}competitions/${tahun}/teams`;

var fetchApi = url => {
  return fetch(url, {
    headers: {
      'X-Auth-Token': token
    }
  });
}

function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);

    return Promise.reject(new Error(response.statusText));
  } else {

    return Promise.resolve(response);
  }
}

function json(response) {
  return response.json();
}

function error(error) {
  console.log("Error : " + error);
}

var getStandings = () => {
  if ('caches' in window) {
    caches.match(standing_ep).then(function (response) {
        if (response) {
            response.json().then(function (data) {
                Standings(data);
            });
        }
    });
}
  return fetchApi(standing_ep)
    .then(status)
    .then(json)
}

const Standings =()=> {
  var standings = getStandings()
  standings.then(data => {
    var str = JSON.stringify(data).replace(/http:/g, 'https:');
    data = JSON.parse(str);
    var html = ''
    data.standings.forEach(standing => {
      var detail = ''
      standing.table.forEach(result => {
        detail += `
            <tr>
            <td>${result.position}</td>
            <td><img class="responsive-img" width="32" height="32" src="${ result.team.crestUrl.replace(/^http:\/\//i, 'https://') || 'img/empty_badge.svg'}"> </td>
            <td>${result.team.name}</td>
            <td>${result.playedGames}</td>
            <td>${result.won}</td>
            <td>${result.draw}</td>
            <td>${result.lost}</td>
            <td>${result.points}</td>
          </tr>
          `;
      })

      html += `
        <div class="card">
        <div class="card-content">
        <h5 class="header">${standing.group}</h5>
        <table>
        <thead>
          <tr>
            <th>Pos</th>
            <th>Logo</th>
            <th>Team Name</th>
            <th>Played</th>
            <th>Won</th>
            <th>Draw</th>
            <th>Lost</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>` + detail + `</tbody>
        </table>
        </div>
        </div>
        </div>
      `
    });
    document.getElementById("articles").innerHTML = html;
})

}

var getMatches = () => {

  if ('caches' in window) {
    caches.match(matches_ep).then(function (response) {
        if (response) {
            response.json().then(function (data) {
                Matches(data);
            });
        }
    });
}
  return fetchApi(matches_ep)
    .then(status)
    .then(json);
}
var Matches = () => {

  var matches = getMatches()
  matches.then(data => {
    DataMatch = data;
    var str = JSON.stringify(data).replace(/http:/g, 'https:');
    data = JSON.parse(str);

    var html = ''
    data.matches.forEach(match => {
    
      html += `
            <div class="card">
              <div class="card-content card-match">
                <div class="col s10">${match.homeTeam.name}</div>
                <div class="col s2">${match.score.fullTime.homeTeam}</div>
                <div class="col s10">${match.awayTeam.name}</div>
                <div class="col s2">${match.score.fullTime.awayTeam}</div>
              </div>
              <div class="card-action right-align">
              <a class="waves-effect waves-light btn-small" onclick="insertMatchListener(${match.id})">SAVE MATCH</a>
              </div>
            </div>
          </div>
            `
    });
    document.getElementById("articles2").innerHTML = html;
  })
}


var getTeams = () => {
  if ('caches' in window) {
    caches.match(teams_ep).then(function (response) {
        if (response) {
            response.json().then(function (data) {
                Teams(data);
            });
        }
    });
}
  return fetchApi(teams_ep)
    .then(status)
    .then(json);
}
  
var Teams = () => {
  
  var teams = getTeams()

  teams.then(data => {
    DataTeam = data;
    var str = JSON.stringify(data).replace(/http:/g, 'https:');
    data = JSON.parse(str);
   
    var html = ''
    
    data.teams.forEach(team => {
      
      html += `
        <div class="card">
          <div class="card-content">
            <div class="center"><img width="64" height="64" src="${team.crestUrl}"></div>
            <div class="center flow-text">${team.name}</div>
            <div class="center">${team.area.name}</div>
          </div>
          <div class="card-action right-align">
              <a class="waves-effect waves-light btn-small green" onclick="insertTeamListener(${team.id})">SAVE TEAMS</a>
          </div>
        </div>
      </div>
    `
    });
    document.getElementById("articles3").innerHTML = html;
  })
}


var SaveMatch = () => {
  var matches = getSaveMatch() 
    matches.then(data => {
    var html = ''
    data.forEach(match => {
      html += `
            <div class="card">
              <div class="card-content card-match">
                <div class="col s10">${match.homeTeam.name}</div>
                <div class="col s2">${match.score.fullTime.homeTeam}</div>
                <div class="col s10">${match.awayTeam.name}</div>
                <div class="col s2">${match.score.fullTime.awayTeam}</div>
              </div>
              <div class="card-action right-align">
              <a class="waves-effect waves-light btn-small" onclick="deleteMatchListener(${match.id})">Delete</a>
              </div>
            </div>
          </div>
            `
    });
    document.getElementById("save-match").innerHTML = html;
  })
}

var insertMatchListener = matchId => {
  var match = DataMatch.matches.filter(el => el.id == matchId)[0]
  insertMatch(match)
}
var deleteMatchListener = matchId => {
    deleteMatch(matchId);
  }

var SaveTeams = () => {
    var teams = getSaveTeams()
        teams.then(data => {
          teamData = data;
          var html = ''
          data.forEach(team => {
        
        html += `
          <div class="card">
            <div class="card-content">
              <div class="center"><img width="64" height="64" src="${team.crestUrl}"></div>
              <div class="center flow-text">${team.name}</div>
              <div class="center">${team.area.name}</div>
            </div>
            <div class="card-action right-align">
                <a class="waves-effect waves-light btn-small green" onclick="deleteTeamListener(${team.id})">DELETE TEAMS</a>
            </div>
          </div>
        </div>
      `
      });
      document.getElementById("save-team").innerHTML = html;
    })
  }

  var insertTeamListener = teamId => { 
    var team = DataTeam.teams.filter(el => el.id == teamId)[0]
    insertTeam(team);
  }

  var deleteTeamListener = teamId => {
      deleteTeam(teamId);
    }
  