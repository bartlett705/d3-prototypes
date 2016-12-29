// takes a 2D array of arbitrary size and plots a grid with rows
// evenly spaced and stretched to fill the canvas, and uniform-width
// columns sized by the longest subarray

const config = {
  CANVAS_WIDTH: window.innerWidth * 0.9,
  CANVAS_HEIGHT: window.innerHeight * 0.9,
};

let normalizer;

const { CANVAS_WIDTH, CANVAS_HEIGHT } = config;

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
  console.log(flatArray);
  const max = Math.max(...flatArray);
  return (number) => {
    return number / max
  };
}

function createGraph(data) {

  normalizer = assignNormalizedValues(data);
  const sortedData = data.sort((a, b) => a < b);
  d3.select('svg').remove();
  const svg = d3.select('div').append('svg');
  svg.attr('height', CANVAS_HEIGHT)
  .attr('width', CANVAS_WIDTH);

svg.selectAll('rect')
    .data(sortedData)
    .enter()
    .append('svg:rect')
    .attr('x', d => {
      return CANVAS_WIDTH / 2 - (normalizer(d) * CANVAS_WIDTH / 2)
    })
    .attr('y', 0)
    .attr('width', d => normalizer(d) * CANVAS_WIDTH)
    .attr('height', d => normalizer(d) * CANVAS_HEIGHT)
    .style('fill', d => `rgba(0, 200, 100, ${1.2 - normalizer(d)})`);
}

document.addEventListener("DOMContentLoaded", () => {
  createGraph(
      fibbs(12)
  );
});

function fibb(n) {
  if (n < 2) return 1;
  return fibb(n - 1) + fibb(n - 2);
}
function fibbs(n) {
  return [...Array(n)].map((x, i) => fibb(i));
}
