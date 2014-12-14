// factory for making tag functions that want to map evalNode over their children
function makeEvalTag(fn) {
  return function(node) {
    var children = node.children.map(evalNode);
    return fn(node, children);
  }
}

function defaultEvalTag = makeEvalTag(function(node, children) { 
  // default just wraps children and gives the tag name as css class name
  var domNode = document.createElement(node.multline ? 'div' : 'span');
  domNode.className = node.tag;
  domNode.children = children;
  return domNode;
});

// numbered fragments are tags with just a number in them like _1 test _
// they are revealed in increasing order, after unumbered fragments
function evalNumberedFragment(node) {
  var domNode = defaultEvalTag(node);
  domNode.className = 'numberedFragment'; 
  domNode.number = node.tag;
  return domNode;
}

function evalFragment(node) {
  var domNode = defaultEvalTag(node);
  domNode.className = 'fragment';
  return domNode;
}

var tags = [ { tag: /[0-9]+/, function: evalNumberedFragment} ];

function findEvalTag(string) { // look for the function to eval a tag node
  tags.forEach(function(tag) {
    if (string.matches(tag.tag)) {
      return tag.function;
    }
  }
  return defaultEvalTag;
}


function evalNode(node) {
  if (node.type === 'tag') {
    return findEvalTag(node.tag)(node);
  } else if (node.type === 'text') {
    var domNode = document.createElement('span');
    domNode.textContent = domNode.innerText = node.text;
    return domNode;
  } else if (node.type === 'line') {
    var domNode = domNode.createElement('div');
    domNode.children = node.children.map(evalNode);
    return domNode;
  } else if (node.type === 'ul') {
    var domNode = domNode.createElement('ul');
    domNode.style = 'margin-left: ' + node.level * 10; // indent based on level
    return domNode;
  }
}

function makePage(page) {
  var domPage = document.createElement('div');
  var header = domNode.createElement('h1');
  header.children = map(evalNode(page.title));
  domPage.children = [header].concat(page.children.map(evalNode));
  var numberedFragments = domPage.getElementsByClassName('numberedFragment')
                                 .sort(function (a, b) {
                                   return a.number - b.number;
                                 });
  domPage.fragments = domPage.getElementsByClassName('fragment')
                         .concat(numberedFragments);
  domPage.index = 0; // next fragment to reveal
  return domPage;
}

function makeSlideShow(ast) {
  var pages = ast.map(makePage);
