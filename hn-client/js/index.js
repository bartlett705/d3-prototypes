function showCards(data) {
const cards = d3.select('div').selectAll('div')
  .data(data)
  .enter()
  .append('div')
  .attr('class', 'card')
  .attr('id', d => d.id);

const titles = cards.append('div')
  .attr('class', 'card-title')

titles.append('a').attr('href', d => d.url).text(d => d.title);

const preview = cards.append('div')
  .attr('class', 'card-content')
  .text(d => {
    const relevantId = d.id;
    const firstChild = d.kids ? d.kids[0] : '1'
    fetch(`https://hacker-news.firebaseio.com/v0/item/${firstChild}.json`).then(response => response.json()).then(item => {
    insertPreview(relevantId, item.text);  
    });
  });
}
function insertPreview(id, text) {
  console.log(id, text);
  const thisWon = document.getElementById(id).children[1];
  if (text) thisWon.innerHTML = text.slice(0, 550);
  thisWon.classList.add('show');
}
function fetchStories(itemIds) {
  var items = [];
  itemIds.slice(0, 20).forEach(id => {
    fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(response => response.json()).then(item => {
    items.push(item);
      showCards(items);
    }); 
  })
}

fetch('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty')
  .then(response => response.json())
  .then(data => fetchStories(data));