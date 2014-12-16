// util functions: extra tags etc

var newTags = [ { tag:/img/, function: evalImage } ,
                { tag:/table/, function: evalTable } ];

tags = tags.concat(newTags);


// images are of the form _img url dimensions | hover text | caption _
// dimensions, alt text, and caption are optional
function evalImage(node) {
  var fields = node.text.split('|');
  var image = fields[0].split(' '); // image and dimensions separated by space
  var img = document.createElement('img');
  img.src = image[0];
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

  

