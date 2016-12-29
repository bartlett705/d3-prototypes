const actionCreators = {"name":"Action Creators","children":[{"name":"addTodo","children":[{"name":"ADD_TODO"}]},{"name":"setVisibilityFilter","children":[{"name":"SET_VISIBILITY_FILTER"}]},{"name":"toggleTodo","children":[{"name":"TOGGLE_TODO"}]}]};
const reducers = {"name":"Reducers","children":[{"name":"todos","children":[{"name":"ADD_TODO"},{"name":"TOGGLE_TODO"}]},{"name":"visibilityFilter","children":[{"name":"SET_VISIBILITY_FILTER"}]}]};
const ui = {"name":"Containers","children":[{"name":"Link","children":[{"name":"active"},{"name":"children"},{"name":"onClick"}]},{"name":"AddTodo","children":[{"name":"dispatch"}]},{"name":"TodoList","children":[{"name":"todos"},{"name":"onTodoClick"}]}]};

const data = {
  name: 'APP',
  children: [
    actionCreators,
    reducers,
    ui,
  ],
};

// default chart size and spacing constants
const config = {};

config.fancyTree = {
  CHART_WIDTH: 1000,
  CHART_HEIGHT: 500,
  // multiplier between 0 and 1 that determines horizontal spacing of tree
  // generations.  Smaller is 'more compact'.
  DEPTH_SPACING_FACTOR: 0.25,
  // multiplier between 0 and 1 that determines vertical spacing of tree
  // generations.  Smaller is 'more compact'.
  BREADTH_SPACING_FACTOR: 0.4,
  NODE_RADIUS: 7,
};

config.comfyTree = {
  CHART_WIDTH: 500,
  CHART_HEIGHT: 250,
  // multiplier between 0 and 1 that determines horizontal spacing of tree
  // generations.  Smaller is 'more compact'.
  DEPTH_SPACING_FACTOR: 0.7,
  // multiplier between 0 and 1 that determines vertical spacing of tree
  // generations.  Smaller is 'more compact'.
  BREADTH_SPACING_FACTOR: 1,
  NODE_RADIUS: 15,

};

config.list = {
  CHART_WIDTH: 250,
  CHART_HEIGHT: 250,
  DEPTH_SPACING_FACTOR: 0.25,
  BREADTH_SPACING_FACTOR: 0.25,
  RECT_HEIGHT: 20,
  RECT_WIDTH: 50,

};

const exports = {};

// //--- D3 LOGIC -----////
// The canvas for the tree//

// takes in DOM element to be transformed into DefaultCluster,
// && data that the DefaultCluster visualizes
exports.transformVizNode = function transformVizNode(element, data, type = 'cozyTree', searchTerm = null) {
  if (type === 'comfyTree') {
    buildBasicTree(element, data, config.comfyTree, searchTerm);
  } else if (type === 'cozyTree') {
    buildBasicTree(element, data, config.cozyTree, searchTerm)
  }
  else if (type === 'list') {
    buildBasicList(element, data, config.list, searchTerm);
  }
};
function buildBasicList(element, data, config, searchTerm) {
  let svg = d3.select(element)
  .append('svg')
  .attr('width', CHART_WIDTH)
  .attr('height', CHART_HEIGHT)
  .style('left', 1000)
  .append('g')
  .attr('transform', `translate(${CHART_WIDTH / 2}, ${CHART_HEIGHT / 2})`);

  var layout = d3.layout.indent()
  .children(function(d) { return d.children; })
  .nodeSize([10, 15])
  .separation(function(node, previousNode) { return node.parent === previousNode.parent || node.parent === previousNode ? 1 : 2; });

  const nodes = layout(data);

  labels = svg.selectAll(".label")
        .data(nodes, function(d) { return d.name });

    labels.enter()
        .append("text")
        .attr({
          "class": "label",
          dy: ".35em",
          transform: function(d) { return "translate(" + (d.x - 200) + "," + d.y + ")"; }
        })
        .style("font-weight", function(d) { return d.Country ? null : "bold" })
        .text(function(d) { return id(d); });
}

function project(x, y) {
  var angle = (x - 90) / 180 * Math.PI, radius = y;
  return [radius * Math.cos(angle), radius * Math.sin(angle)];
}

function buildFancyTree(element, data, config, searchTerm) {
  const { CHART_WIDTH, CHART_HEIGHT, DEPTH_SPACING_FACTOR, BREADTH_SPACING_FACTOR, NODE_RADIUS } = config;
  let svg = d3.select(element)
  .append('svg')
  .attr('width', CHART_WIDTH)
  .attr('height', CHART_HEIGHT)
  .append('g')
  .attr('transform', `translate(${CHART_WIDTH / 2}, ${CHART_HEIGHT / 2})`);

  const tree = d3.tree()
    .size([360, CHART_WIDTH / 5])
    .separation(function(a, b) {
      return (a.parent == b.parent ? 2 : 3) / a.depth;
    });
  // passes hierarchiacal data into tree to create the root node

  let nodeHierarchy = d3.hierarchy(data);
  // let nodeHierarchy = data;
  tree(nodeHierarchy);


  //creating links

  let link = svg.selectAll('.node')
    .data(nodeHierarchy.descendants()
      .slice(1))
    .enter()
    .append('path')
    .attr('class', 'link')
    .attr("d", function(d) {
        return "M" + project(d.x, d.y)
            + "C" + project(d.x, (d.y + d.parent.y) / 2)
            + " " + project(d.parent.x, (d.y + d.parent.y) / 2)
            + " " + project(d.parent.x, d.parent.y);
    });

    // entering the nodes --> finally appending to DOM
    let nodeEnter = svg.selectAll('.node')
    .data(nodeHierarchy.descendants())
    .enter()
    .append('g')
    .attr('class', function(d) {
      return 'node' + (d.children ? 'node-internal' : 'node-leaf');
    })
    .attr('transform', function(d) {
      return 'translate(' + project(d.x, d.y) + ')';
    });
  // console.log(link)

  nodeEnter.append('circle')
    .attr('r', NODE_RADIUS)
    .style('fill', function(d) {
      let color = 'lightsteelblue';
      if (searchTerm) {
        if (d.data.children) {
          d.data.children.forEach(node => {
            if (node.name === searchTerm) {
              color = 'yellow';
            }
            else if (node.children) {
              node.children.forEach(childNode => {
                if (childNode.name === searchTerm) {
                  color = 'yellow';
                }
              })
            }
          })
        }
        else if (d.data.name === searchTerm) {
          color = 'yellow';
        }
      }
      return color;
    });

  nodeEnter.append('text')
    .text(function(d) {
      return d.data.name;
    })
    // .attr("transform", function(d) {
    //   if (!d.children) return "rotate(" + (d.x < 180 ? d.x - 90 : d.x + 90) + ")";
    //   return null;
    //   })
    .style('fill', 'darkblue');
}

const ele = d3.select('body');
buildFancyTree('body', data, config.fancyTree, '');
