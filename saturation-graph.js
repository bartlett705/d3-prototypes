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

  const COL_HEIGHT = CANVAS_HEIGHT / data.length;
  const COL_WIDTH = CANVAS_WIDTH / maxSubArrayLength(data);
  normalizer = assignNormalizedValues(data);

  d3.select('svg').remove();
  const svg = d3.select('div').append('svg');
  svg.attr('height', CANVAS_HEIGHT)
  .attr('width', CANVAS_WIDTH);

  const rows = svg.selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .each(function (d, idx) {
      createRow(d3.select(this), d, idx, COL_HEIGHT, COL_WIDTH)
    });
}

function createRow(g, rowData, idx, COL_HEIGHT, COL_WIDTH) {
  const COL_Y = idx * COL_HEIGHT;

  g.selectAll('rect')
    .data(rowData)
    .enter()
    .append('svg:rect')
    .attr('x', (d, i) => i * COL_WIDTH)
    .attr('y', COL_Y)
    .attr('width', COL_WIDTH)
    .attr('height', COL_HEIGHT)
    .style('fill', d => `rgba(0, 200, 100, ${normalizer(d)})`);

}

document.addEventListener("DOMContentLoaded", () => {
  createGraph(
    [
      [10, 2, 5, 5, 4, 5, 3],
      [8, 2, 5, 4, 5, 0, 2],
      [1, 5, 4, 5, 0, 1, 2],
      [5, 4, 5, 0, 7, 0, 7],
      [11, 2, 5, 5, 4, 5, 4],
    ]
  );
});
