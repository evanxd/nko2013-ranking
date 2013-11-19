$.getJSON('./data/ranking.json', function(data) {
  var result = [
    '<h3>', data.date, '</h3>'
  ];

  result.push('<ol>');
  data.rankingData.forEach(function(team) {
    result.push(
      '<li>',
        '<a href="', team.url, '" target="_blank">', team.name, '</a>: ',
        team.score,
      '</li>'
    );
  });
  result.push('</ol>');

  $('#console').html(result.join(''));
});
