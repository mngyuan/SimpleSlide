// util functions: extra tags etc

var newTags = [ { tag: /^img$/, function: evalImage } ,
                { tag: /^table$/, function: evalTable } ,
                { tag: /^yt$/, function: evalYT } ,
                { tag: /^hl$/, function: evalHL } ,
                { tag: /^a$/, function: evalLink } ,
                { tag: /^code$/, function: evalCode } ,
                { tag: /^ff$/, function: evalFF} ];

tags = tags.concat(newTags);


// images are of the form _img url dimensions | hover text | caption _
// dimensions, alt text, and caption are optional
function evalImage(node) {
  var fields = node.text.split('|');
  var image = fields[0].split(' '); // image and dimensions separated by space
  var img = document.createElement('img');
  img.src = image[0];
  console.log(image);
  if (image.length > 2) {
    img.width = image[1]; // set dimensions if exists
    img.height = image[2];
  }
  if (fields.length > 1) {
    img.title = fields[1]; // set hover text if exists
  }
  if (fields.length > 2) { // wrap in div and add caption if exists
    var caption = document.createElement('div');
    caption.textContent = caption.innerText = fields[2];
    caption.className = 'caption';
    var container = document.createElement('div');
    container.appendChild(img);
    container.appendChild(caption);
    img = container;
  }
  return img;
}

// table rows are delimited by newlines, columns by |
function evalTable(node) {
  var rows = node.text.split('\n');
  var table = document.createElement('table');
  var tbody = document.createElement('tbody');
  rows.forEach(function (row) {
    var items = row.split('|');
    var tr = document.createElement('tr');
    items.forEach(function (item) {
      var td = document.createElement('td');
      td.appendChild(document.createTextNode(item));
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  return table;
}

// youtube video embedding, format is _yt link width height _
// link can either be embed link or normal watch link
// width and height optional
function evalYT(node) {
  var iframe = document.createElement('iframe');
  var text = node.text.split(' ');
  var url = text[0];
  if (url.match(/watch/)) { // if normal watch link
    var id = url.split('=')[1];
    url = 'https://www.youtube.com/embed/' + id;
  } else if (url.match(/embed/)) { // embed link
    if (!url.match(/^https:/)) { // no https in front
      url = 'https://' + url;
    }
  } else {
    console.log('Warning: invalid embed link');
  }
  iframe.src = url;
  if (text.length > 2) {
    iframe.width = text[1];
    iframe.height = text[2];
  }
  return iframe;
}

// autofragment: makes every children a fragment
function evalFF(node) {
  node.children = node.children.map(function (child) {
     return { type: 'tag', tag: 'f', children: [child], multline: true };
  });
  node.tag = '';
  return evalNode(node);
}

function evalCode(node) {
  var pre = document.createElement('pre');
  var code = document.createElement('code');
  code.innerHTML = node.text;
  pre.appendChild(code);
  return pre;
}

// syntax highlighting
function evalHL(node) {
  var pre = document.createElement('pre');
  var code = document.createElement('code');
  code.innerHTML = node.text;
  pre.appendChild(code);
  hljs.highlightBlock(code);
  return pre;
}

function trim(s){ 
  return ( s || '' ).replace( /^\s+|\s+$/g, '' ); 
}

// links are created with _a url text _
// or _a text | url _
// or _a url _
function evalLink(node) {
  var link = document.createElement('a');
  var text = node.text.split('|');
  var href = ''
  if (text.length > 1) {
    href = trim(text[text.length - 1]);
    link.innerHTML = text.slice(0, text.length - 1).join('|');
  } else {
    text = text[0].split(' ');
    if (text.length === 1) {
      text.push(text[0]);
    }
    href = trim(text[0]);
    link.innerHTML = text.slice(1).join(' ');
  }
  if (!href.match(/^http/)) {
    href = 'https://' + href;
  }
  link.href = href;
  return link;
}

