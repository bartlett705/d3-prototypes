// takes a 2D array of arbitrary size and plots a grid with rows
// evenly spaced and stretched to fill the canvas, and uniform-width
// columns sized by the longest subarray

const config = {
  CANVAS_WIDTH: window.innerWidth * 0.9,
  CANVAS_HEIGHT: window.innerHeight * 0.9,
};

const { CANVAS_WIDTH, CANVAS_HEIGHT } = config;

function maxSubArrayLength(arrayOfArrays) {
  return Math.max(...arrayOfArrays.map(subArr => subArr.length))
}

function createGraph(data) {

  const COL_HEIGHT = CANVAS_HEIGHT / data.length;
  const COL_WIDTH = CANVAS_WIDTH / maxSubArrayLength(data);

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
    .attr('height', COL_HEIGHT);

}

document.addEventListener("DOMContentLoaded", () => {
  createGraph(
    [
      [1, 2, 5, 5, 4, 5],
      [1, 2, 5, 4, 5],
      [1, 5, 4, 5],
      [5, 4, 5],
      [1, 2, 5, 5, 4, 5],
      [1, 2, 5, 5, 4, 5],
      [1, 2, 5, 5, 4, 5],
    ]
  );
});
