var ss = {};

ss.wrap = function (tag, contents, multiline) {
  if (multiline) {
    return '\n_' + tag + '\n' + contents + '\n_\n';
  }
  return '_' + tag + ' ' + contents + ' _';
}

ss.page = function (title) {
  if (!title) {
    title = '';
  }
  return '\n' + title + '\n====\n';
}

ss.img = function (url, caption, hover, dimensions) {
  var img = url;
  if (dimensions && dimensions.length > 1) {
    img += ' ' + dimensions[0] + ' ' + dimensions[1];
  }
  if (hover) {
    img += ' | ' + hover;
  }
  if (caption) {
    img += ' | ' + dimensions;
  }
  return ss.wrap('img', img);
}

ss.ff = function (contents) {
  return ss.wrap('ff', contents, true);
}

ss.yt = function (url, dimensions) {
  var yt = url;
  if (dimensions && dimensions.length > 1) {
    url += ' ' + dimensions[0] + ' ' + dimensions[1];
  }
  return ss.wrap('yt', yt);
}

ss.link = function(url, text) {
  if (text) {
    return ss.wrap('a', url + ' ' + text);
  }
  return ss.wrap('a', url);
}

ss.table = function(arr) {
  return ss.wrap('table', arr.map(function (row) {
    return row.join(' | ')
  }).join('\n'), true);
}

ss.ul = function(lines, level) {
  if (!level) {
    level = 0;
  }
  return lines.split('\n').map(function (line) {
    return Array(level + 1).join(' ') + '*' + line;
  }).join('\n');
}

