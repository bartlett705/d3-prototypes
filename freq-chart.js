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
  } = getConfig(250);
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
  const svg = d3.select('div')
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
    .style('fill', d => `rgba(0, 200, 100, ${normalizer(d.value)})`);
}

const data = [{
  date: moment("2016-01-22T19:51:16-08:00"),
  value: 0,
}, ];

for (var i = 1; i < 366; i++) {
  currentDay = moment(data[0].date)
    .add(i, 'd');
  if (Math.random() * 10 >= 5) {

    data.push({
      date: currentDay,
      value: Math.floor(Math.random() * 9),
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  createGraph(data);
});
