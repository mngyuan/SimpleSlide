function parse(text) {
  var pages = [];
  var nodes = [];
  var text = text.replace(/\\\n/, ''); // ignore backslash newlines
  // ignore comment lines that start with #
  var lines = text.split('\n').filter(function (line) {
    return !line.match(/^#.*/);
  });
  var globalDeclarations = [];
  var globalDec = /^:\w+/; // regex for global declarations ie :background blue
  var multTag = /^_\w+$/; // regex for a multi-line tag ie: _code
  var closeTag = /^_\s*$/; //regex for closing a multi-line tag
  var ul = /^[\t ]*\*/; //regex for unordered list item ie *item1
  lines.unshift(''); // add a blank line in case of no title first page

  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    if (lines[i+1] && lines[i+1] === '====') {
      while (nodes.length) {
        var node = nodes.pop();
        console.log('Warning: unclosed tag: ' + node.tag + ' closed automatically.');
        node.text = lines.slice(node.start, i).join('\n');
        pushNode(node);
      }
      if (pages.length != 0) { // if there is a previous page
        var prevPage = pages[pages.length - 1];
        prevPage.text = lines.slice(prevPage.start, i).join('\n'); // fill out the text field
      }
      var title = parseLine(line);
      pages.push(newPage(title, globalDeclarations, i));
      currNode = pages[pages.length - 1];
      i++;
    } else if (line.match(globalDec)) {
      pushDec(parseDec(line));
    } else if (line.match(multTag)) {
      nodes.push(newNode(line.substring(1), i));
    } else if (line.match(closeTag)) { // if the line is closing a multi-line tag
      if (nodes.length) {
        var node = nodes.pop(); // fill out the text field of the node
        node.text = lines.slice(node.start + 1, i).join('\n');
        pushNode(node);
      } else {
        console.log('Warning: ignoring unmatched close tag');
      }
    } else if (line.match(ul)) {
      pushNode(parseUL(line));
    } else if (line != '') {
      pushNode(parseLine(line));
    }
  }

  var prevPage = pages[pages.length - 1]; // fill out text field for last page
  prevPage.text = lines.slice(prevPage.start, i).join('\n'); 
  while (nodes.length) { // close all tags on last page
    var node = nodes.pop();
    console.log('Warning: unclosed tag: ' + node.tag + ' closed automatically.');
    node.text = lines.slice(node.start, i).join('\n');
    pushNode(node);
  }


  // removes leading backslashes for text
  function unesc(string) {
    return string.replace(/\\(.)/g, '$1');
  }

  function newNode(tag, start) {
    return { type:'tag', tag: tag, start: start, children: [], multiline: true };
  }

  function pushNode(node) {
    if (nodes.length == 0) { // there are no more parent nodes
      if (pages.length) {
        pages[pages.length - 1].children.push(node); // push directly to the current page
      } else {
        console.log('Warning, declarations outside of the first page ignored');
      }
    } else {
      nodes[nodes.length - 1].children.push(node); // push to the node above
    }
  }

  function newPage(title, declarations, start) {
    var page = { title: title, start: start, properties: [], children: [] };
    declarations.forEach(function (v) { // deep copy current declaration list
      page.properties.push(v);
    });
    return page;
  }

  function parseDec(line) {
    var dec = line.substring(1).split(/\s/); // split by whitespace character
    return { key: dec[0], values: dec.slice(1) };
  }

  function pushDec(dec) {
    if (dec.values.length) { // if there are values to be assigned, open a new declaration
      globalDeclarations.push(dec);
    } else { // otherwise close the last open declaration of the same key
      var index = -1;
      for (var i = globalDeclarations.length - 1; i >= 0; i--) {
        if (globalDeclarations[i].key === dec.key) {
          index = i;
          break;
        }
      }
      if (index != -1) {
        globalDeclarations.splice(index, 1);
      } else {
        console.log('Warning: trying to close unopened declaration: ' + dec.key);
      }
    }
  }

  function parseUL(line) {
    var indent = line.indexOf('*');
    var node = { type: 'ul', level: indent }; // how many indentation levels deep
    node.children = [parseLine(line.substring(indent + 1))];
    return node;
  }

  function parseLine(line) { // pretty much the same structure as parseText, except by line
    var newChildren = [];
    var newNode = { type: 'line', children: newChildren };
    var nodes = [];
    var currentText = '';
    var open = /^_\w+$/; // regex for open tag
    var close = /^_$/; // regex for close tag
    var words = line.split(/\s/);
    for (var i = 0; i < words.length; i++) {
      var word = words[i];
      if (word.match(open)) {
        if (currentText) {
          pushNode( { type: 'text', text: unesc(currentText) } );
          currentText = '';
        }
        nodes.push( { type: 'tag', tag: word.substring(1), start: i, children: [],
                      multiline: false });
      } else if (word.match(close)) {
        if (nodes.length) {
          var node = nodes.pop();
          node.children.push({ type: 'text', text: unesc(currentText) });
          node.text = words.slice(node.start + 1, i).join(' ');
          pushNode(node);
          currentText = '';
        } else {
          console.log('Warning: ignoring unmatched close tag');
        }
      } else {
        currentText += word + ' ';
      }
    }

    if (currentText) {
      pushNode( { type: 'text', text: unesc(currentText) });
    }

    while (nodes.length) {
      var node = nodes.pop();
      console.log('Warning: unclosed tag: ' + node.tag + ' closed automatically.');
      node.text = words.slice(node.start + 1, i).join(' ');
      pushNode(node);
    }

    function pushNode(node) {
      if (nodes.length == 0) {
        newChildren.push(node);
      } else {
        nodes[nodes.length - 1].children.push(node); 
      }
    }
    return newNode;

  }

  return pages;
}
