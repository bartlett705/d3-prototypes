import * as d3 from 'd3';
const config = {
  CANVAS_HEIGHT: 500,
  CANVAS_WIDTH: window.innerWidth * 0.9,
};

// const { CANVAS_WIDTH, CANVAS_HEIGHT } = config;

function render() {
  d3.select('svg').remove();
  const svg = d3.select('div')
    .append('svg')
    .attr('height', '128')
    .attr('width', '150');

  console.log(svg);
  const ourCanvas = d3.select('body').selectAll('span');

  const whee = setInterval(() => createTriange(svg, { l: Math.random() * 150 }), 100);
}

const createTriange = (svg, inputSpecs) => {
  
  const specs = calculateTrianglePathEnds(inputSpecs);
  svg.selectAll('g')
    .data(specs)
    .enter()
    .append('path')
    .attr('d', (specs) => stroker(specs))
    .attr('stroke', getRandomColor())
    .attr('stroke-width', 1)
    .attr('fill', 'none')
    .style('opacity', 0.8)
    
}

const stroker = d3.line()

const getRandomColor = () => "#000000".replace(/0/g,() => (~~(Math.random()*16)).toString(16));

const calculateTrianglePathEnds = ({ l = 1, x = 0, y = 0}) => {
 return [
   [[x, y], [x + l, y]],
   [[x + l, y], [x + (l / 2), y + (l * Math.sqrt(3) / 2)]],
   [[x + (l / 2), y + (l * Math.sqrt(3) / 2)], [x, y]],
 ]
}

render();
const svg = document.querySelector('svg');
svg.classList.add('rotate');