let dbPromised = idb.open('football', 1, upgradeDb => {
    switch (upgradeDb.oldVersion) {
      case 0:
        upgradeDb.createObjectStore('matches', { 'keyPath': 'id' })
        upgradeDb.createObjectStore('teams', { 'keyPath': 'id' })
    }
  });

  let insertMatch = (match) => {
    dbPromised.then(db => {
      let tx = db.transaction('matches', 'readwrite');
      let store = tx.objectStore('matches')
      store.put(match)
      return tx.complete;
    }).then(() => {
      M.toast({ html: `Match ${match.homeTeam.name} VS ${match.awayTeam.name}\nhas saved!` })
      console.log('Match has saved');
    }).catch(err => {
      console.error('Match not saved', err);
    });
  }
  
  let deleteMatch = (matchId) => {
    dbPromised.then(db => {
      let tx = db.transaction('matches', 'readwrite');
      let store = tx.objectStore('matches');
      store.delete(matchId);
      return tx.complete;
    }).then(() => {
      M.toast({ html: 'Match has deleted!' });
      SaveMatch();
    }).catch(err => {
      console.error('Error: ', err);
    });
  }
    

  let getSaveMatch = () => {
    return dbPromised.then(db => {
      let tx = db.transaction('matches', 'readonly');
      let store = tx.objectStore('matches');
      return store.getAll();
    })
  }


  let insertTeam = (team) => {
    dbPromised.then(db => {
      let tx = db.transaction('teams', 'readwrite');
      let store = tx.objectStore('teams')
      team.createdAt = new Date().getTime()
      store.put(team)
      return tx.complete;
    }).then(() => {
      M.toast({ html: `${team.name} has saved!` })
      console.log('Match has saved');
    }).catch(err => {
      console.error('Match not saved', err);
    });
  }

  
let deleteTeam = (teamId) => {
  dbPromised.then(db => {
    let tx = db.transaction('teams', 'readwrite');
    let store = tx.objectStore('teams');
    store.delete(teamId);
    return tx.complete;
  }).then(() => {
    M.toast({ html: 'Team has deleted!' });
    SaveTeams();
  }).catch(err => {
    console.error('Error: ', err);
  });
}

let getSaveTeams = () => {
  return dbPromised.then(db => {
    let tx = db.transaction('teams', 'readonly');
    let store = tx.objectStore('teams');
    return store.getAll();
  })
}