// factory for making tag functions that want to map evalNode over their children
function makeEvalTag(fn) {
  return function(node) {
    var children = node.children.map(evalNode);
    return fn(node, children);
  }
}

var defaultEvalTag = makeEvalTag(function(node, children) { 
  // default just wraps children and gives the tag name as css class name
  var domNode = document.createElement(node.multline ? 'div' : 'span');
  domNode.className = node.tag;
  children.forEach(function (child) {
    domNode.appendChild(child);
  });
  return domNode;
});

// numbered fragments are tags with just a number in them like _1 test _
// they are revealed in increasing order, after unumbered fragments
function evalNumberedFragment(node) {
  var domNode = defaultEvalTag(node);
  domNode.type = domNode.className = 'numberedFragment'; 
  domNode.number = node.tag;
  return domNode;
}

function evalFragment(node) {
  var domNode = defaultEvalTag(node);
  domNode.type = domNode.className = 'fragment';
  return domNode;
}

var tags = [ { tag: /^[0-9]+$/, function: evalNumberedFragment} ,
             { tag: /^f$/, function: evalFragment } ];

function findEvalTag(string) { // look for the function to eval a tag node
  var fn;
  tags.forEach(function(tag) {
    if (string.match(tag.tag)) {
      fn = tag.function;
    }
  });
  return fn || defaultEvalTag;
}


function evalNode(node) {
  if (node.type === 'tag') {
    return findEvalTag(node.tag)(node);
  } else if (node.type === 'text') {
    var domNode = document.createElement('span');
    domNode.textContent = domNode.innerText = node.text;
    return domNode;
  } else if (node.type === 'line') {
    var domNode = document.createElement('div');
    node.children.map(evalNode).forEach(function (child) {
      domNode.appendChild(child);
    });
    return domNode;
  } else if (node.type === 'ul') {
    var domNode = document.createElement('ul');
    domNode.style.margin = '0px ' + node.level*10 + 'px';
    node.children.map(evalNode).forEach(function (child) {
      var li = document.createElement('li');
      li.appendChild(child);
      domNode.appendChild(li);
    });
    return domNode;
  }
}

function makePage(page) {
  var domPage = document.createElement('div');
  var header = document.createElement('h1');
  console.log(page);
  //support property
  var pageStyle = document.getElementsByTagName('body')[0].style;
  pageStyle = backupBodyStyle;
  page.properties.forEach(function(property){
    console.log(property.key);
    if (property.values.length == 1) {
      pageStyle[property.key] = property.values[0];
    } else {
      pageStyle[property.key] = property.values;
    }
  })
  header.appendChild(evalNode(page.title));
  [header].concat(page.children.map(evalNode)).forEach(function (child) {
    domPage.appendChild(child);
  });
  var numberedFragmentsCol = domPage.getElementsByClassName('numberedFragment');
  var numberedFragments = [].slice.call(numberedFragmentsCol)
                                 .sort(function (a, b) {
                                   return a.number - b.number;
                                 });
  var fragmentsCol = domPage.getElementsByClassName('fragment');
  domPage.fragments = [].slice.call(fragmentsCol)
                         .concat(numberedFragments);
  domPage.index = 0; // next fragment to reveal
  return domPage;
}
