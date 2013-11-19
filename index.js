const NKO_URL_PATTERN = '.2013.nodeknockout.com',
      BROKEN_NUMBER = 3,
      RESULT_FILE_PATH = 'data/ranking.json';
var cheerio = require('cheerio'),
    request = require('request'),
    fs = require('fs'),
    path = require('path'),
    nkoEntries = require('./nko_entries'),
    EventEmitter = require('events').EventEmitter,
    eventEmitter = new EventEmitter(),
    entryLength = 0,
    responseTimes = 0,
    ranking = [];

console.log('Loading the scores.');

for (var teamId in nkoEntries) {
  entryLength += 1;
  getEntryDataWithScore(nkoEntries[teamId]);
}

eventEmitter.on('scoresLoaded', function() {
  var place = 0;
  // Sort the ranking data.
  ranking.sort(function(a, b) {
    return b.score - a.score;
  });

  // Render the ranking result.
  ranking.forEach(function(team) {
    console.log((place += 1) + '. ' +
                team.name + ': ' +
                team.score + ' - ' +
                team.url);
  });

  // Write the result into a file.
  fs.writeFileSync(RESULT_FILE_PATH,
                   JSON.stringify({
                     date: new Date().toUTCString(),
                     rankingData: ranking
                   }));
});

function getEntryDataWithScore(entryData) {
  request(entryData.url, function(error, response, body) {
    responseTimes += 1;

    if (!error && response.statusCode == 200) {
      var score = parseInt(cheerio.load(body)('#count').text());
      ranking.push({
        id: entryData.id,
        name: entryData.name,
        url: 'http://' + entryData.id + NKO_URL_PATTERN,
        score: score
      });
    }

    // XXX: Workaround for broken items.
    if (responseTimes === (entryLength - BROKEN_NUMBER)) {
      eventEmitter.emit('scoresLoaded');
      console.log('Loading is finished.');
    }
  });
}
