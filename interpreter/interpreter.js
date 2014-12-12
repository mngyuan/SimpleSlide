// factory for making tag functions that want to map evalNode over their children
function makeEvalTag(fn) {
  return function(node) {
    var children = node.children.map(evalNode);
    return fn(node, children);
  }
}

// numbered fragments are tags with just a number in them like _1 test _
// they are revealed in increasing order, after unumbered fragments
var evalNumberedFragment = makeEvalTag(function (node, children) {
  var fragment = document.createElement('span');
  fragment.className = 'numberedFragment ' + node.tag // class name includes number
  fragment.children = children;
  return fragment;
}

var tags = [ { tag: /[0-9]+/, function: evalNumberedFragment} ]

function evalNode(node) {
  if (node.type === 'tag') {
    // look in tags and call the proper function on the node
  } else if (node.type === 'text') {
    // make a span element of the text
  } // etc
}


