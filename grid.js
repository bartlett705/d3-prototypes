// takes a 2D array of arbitrary size and plots a grid with columns
// and rows evenly spaced and stretched to fill the canvas 

const config = {
  CANVAS_WIDTH: window.innerWidth * 0.9,
  CANVAS_HEIGHT: window.innerHeight * 0.9,
};

const { CANVAS_WIDTH, CANVAS_HEIGHT } = config;

function createGraph(data) {
  const COL_HEIGHT = CANVAS_HEIGHT / data.length;
  d3.select('svg').remove();
  const svg = d3.select('div').append('svg');
  svg.attr('height', CANVAS_HEIGHT)
  .attr('width', CANVAS_WIDTH);

  const rows = svg.selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .each(function (d, idx) {
      createRow(d3.select(this), d, idx, COL_HEIGHT)
    });
}

function createRow(g, rowData, idx, COL_HEIGHT) {
  const COL_Y = idx * COL_HEIGHT;
  const COL_WIDTH = CANVAS_WIDTH / rowData.length;

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
