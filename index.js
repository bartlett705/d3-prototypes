const config = {
  CANVAS_HEIGHT: 500,
  CANVAS_WIDTH: window.innerWidth * 0.9,
};

const { CANVAS_WIDTH, CANVAS_HEIGHT } = config;

function vowelProportion(str) {
  const vowels = ['a', 'e', 'i', 'o', 'u'];
  const arr = str.split('');
  const vowelCount = arr.reduce((count, letter) => {
    if (vowels.includes(letter.toLowerCase())) count++
    return count;
  }, 0);
  console.log(vowelCount,  'of', 'str.length');
  return (vowelCount / str.length) * 1.5;
}

function createGraph() {

  d3.select('svg').remove();

  const svg = d3.select('div').append('svg');

  const ourText = document.getElementById('thaOne').value.split(' ');
  var ourCanvas = d3.select('body').selectAll('span');

  ourCanvas
    .data(ourText)
    .style('font-size', (d) => 4 * d.length)
    .text((d) => d + ' ');

  ourCanvas
    .data(ourText)
    .enter()
    .append("span")
    .style('font-size', (d) => 4 * d.length)
    .text((d) => d + ' ');

  ourCanvas
    .data(ourText)
    .exit()
    .remove();

  svg.attr('height', CANVAS_HEIGHT)
    .attr('width', CANVAS_WIDTH);

  svg.selectAll('g')
  .data([1])
  .exit((d) => console.log(d))
  .remove();

  svg.selectAll('g')
    .data(ourText)
    .attr('x', (d, i) => i * CANVAS_WIDTH / ourText.length)
    .attr('y', (d) => CANVAS_HEIGHT / 2 - 10 * d.length)
    .attr('width', CANVAS_WIDTH / ourText.length)
    .attr('height', (d) => 10 * d.length)
    .style('opacity', (d) => {
      console.log(d, vowelProportion(d));
      vowelProportion(d)
    });

  svg.selectAll('g')
    .data(ourText)
    .enter()
    .append('svg:rect')
    .attr('x', (d, i) => i * CANVAS_WIDTH / ourText.length)
    .attr('y', (d) => CANVAS_HEIGHT / 2 - 10 * d.length)
    .attr('width', CANVAS_WIDTH / ourText.length)
    .attr('height', (d) => 10 * d.length)
    .style('opacity', (d) => vowelProportion(d));
}
