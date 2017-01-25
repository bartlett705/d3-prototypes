// takes a 2D array of 'days' grouped into 'weeks', and an end date,
// and renders a github-style frequency chart for the year berfore
// the end date.

function getConfig(height) {
  const CELL_HEIGHT = CELL_WIDTH = height / 7;
  const CANVAS_WIDTH = CELL_WIDTH * 53;
  const Y_OFFSET = 200;
  return {
    CANVAS_HEIGHT: height,
    CANVAS_WIDTH,
    CELL_HEIGHT,
    CELL_WIDTH,
    Y_OFFSET,
  };
}

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];
let normalizer;


function maxSubArrayLength(arrayOfArrays) {
  return Math.max(...arrayOfArrays.map(subArr => subArr.length))
}

function assignNormalizedValues(array) {
  // takes an array of numbers, which may be nested,
  // and returns a function. that function takes in a number and
  // returns a value between 0 and1 normalized to the range of
  // values in the original dataset.
  const flatArray = ('' + array)
    .split(',')
    .map(x => parseInt(x, 10));
  const max = Math.max(...flatArray);
  return (number) => {
    return number / max
  };
}

function createGraph(data) {
  const {
    CANVAS_HEIGHT, CANVAS_WIDTH, CELL_HEIGHT, CELL_WIDTH, Y_OFFSET,
  } = getConfig(100);
  const aYearAgo = moment(data[data.length - 1].date)
    .subtract(1, 'Y')
    .day(0)
    .format();
  const lastYearsData = data.filter(ele => moment(ele.date) - moment(aYearAgo) > 0);
  const baseWeek = moment(aYearAgo).week();
  console.log('A Year Ago: ', aYearAgo);


  normalizer = assignNormalizedValues(data.map(ele => ele.value));

  d3.select('svg')
    .remove();
  const svg = d3.select('#chartSpace')
    .append('svg');
  svg.attr('height', CANVAS_HEIGHT + Y_OFFSET)
    .attr('width', CANVAS_WIDTH);

  const monthLabels = svg.selectAll('g')
    .data(months)
    .enter()
    .append('text')
    .text(d => d)
    .attr('transform', (d, i) => {
      const offset = moment(aYearAgo).add(i, 'M').startOf('month');
      let weekPosition = offset.week() - baseWeek;
      if (weekPosition < 0) weekPosition += 52;
      console.log(i, offset.format());
      return `translate(${(weekPosition) * CELL_WIDTH + CELL_WIDTH / 2} ${Y_OFFSET - 30}) rotate(90)`;
    })

  const cells = svg.selectAll('g')
    .data(lastYearsData)
    .enter()
    .append('svg:rect')
    .attr('x', (d) => {
      if (d.date.week() - baseWeek === 0) {
        if (d.date.year() === moment(aYearAgo).year()) return 0;
        else return 51 * CELL_WIDTH;
      } else if (d.date.week() - baseWeek < 0) return (d.date.week() + 53 -
        baseWeek) * CELL_WIDTH;
      else return (d.date.week() - baseWeek) * CELL_WIDTH;
    })
    .attr('y', (d) => (d.date.day() * CELL_HEIGHT) + Y_OFFSET)
    .attr('data-date', (d) => d.date.format())
    .attr('width', CELL_WIDTH)
    .attr('height', CELL_HEIGHT)
    .style('fill', d => `rgba(255, 0, 0, ${normalizer(d.value)})`);
}

// const data = [{
//   date: moment("2016-01-22T19:51:16-08:00"),
//   value: 0,
// }, ];
//
// for (var i = 1; i < 366; i++) {
//   currentDay = moment(data[0].date)
//     .add(i, 'd');
//   if (Math.random() * 10 >= 5) {
//
//     data.push({
//       date: currentDay,
//       value: Math.floor(Math.random() * 9),
//     });
//   }
// }
//
// document.addEventListener("DOMContentLoaded", () => {
//   createGraph(data);
// });

/// *** GOOGLE CHARTS STUFF *** ///
// Your Client ID can be retrieved from your project in the Google
// Developer Console, https://console.developers.google.com
var CLIENT_ID = '1068895437155-j6ocpdfo1u3nek6q3svs90nu7mcagnbf.apps.googleusercontent.com';

var SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"];

/**
 * Check if current user has authorized this application.
 */
function checkAuth() {
  gapi.auth.authorize(
    {
      'client_id': CLIENT_ID,
      'scope': SCOPES.join(' '),
      'immediate': true
    }, handleAuthResult);
}

/**
 * Handle response from authorization server.
 *
 * @param {Object} authResult Authorization result.
 */
function handleAuthResult(authResult) {
  var authorizeDiv = document.getElementById('authorize-div');
  if (authResult && !authResult.error) {
    // Hide auth UI, then load client library.
    authorizeDiv.style.display = 'none';
    loadSheetsApi();
  } else {
    // Show auth UI, allowing the user to initiate authorization by
    // clicking authorize button.
    authorizeDiv.style.display = 'inline';
  }
}

/**
 * Initiate auth flow in response to user clicking authorize button.
 *
 * @param {Event} event Button click event.
 */
function handleAuthClick(event) {
  gapi.auth.authorize(
    {client_id: CLIENT_ID, scope: SCOPES, immediate: false},
    handleAuthResult);
  return false;
}

/**
 * Load Sheets API client library.
 */
function loadSheetsApi() {
  var discoveryUrl =
      'https://sheets.googleapis.com/$discovery/rest?version=v4';
  gapi.client.load(discoveryUrl).then(fetchData);
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 */
function fetchData() {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: '1gol0YokIuIslj-j8YFdpJb-9N9uSRl3M_-1Q1yIdmDY',
    range: 'Sheet1!A2:B',
  }).then(function(response) {
    let data = [];
    var range = response.result;
    if (range.values.length > 0) {
      for (i = 0; i < range.values.length; i++) {
        var row = range.values[i];
          data.push({
            date: moment(row[0]),
            value: row[1],
          });
      }
      console.log(data);
      createGraph(data);
    } else {
      appendPre('No data found.');
    }
  }, function(response) {
    appendPre('Error: ' + response.result.error.message);
  });
}

/**
 * Append a pre element to the body containing the given message
 * as its text node.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById('output');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}
