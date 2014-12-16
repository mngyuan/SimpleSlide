window.onload = function() {
  content = document.getElementById('slideshow');
  document.getElementById('input').addEventListener('change', function(evt) {
    var f = evt.target.files[0];
    if (f) {
      var r = new FileReader();
      r.onload = function(e) { 
	      var contents = e.target.result;
        makeSlideShow(contents);
      }
      document.title = f.name.split('.')[0];
      r.readAsText(f);;
    }
  }, false);
};

// UI functionality
var i = 0;
var content;

function next() {
  var page = pages[i];
  if (page.index < page.fragments.length) {
    var fragment = page.fragments[page.index];
    fragment.className = 'revealed' + ' ' + fragment.type;
    page.index++;
  } else if (i < pages.length - 1) {
    content.removeChild(pages[i]);
    i++;
    $(content).append($(pages[i]).fadeIn(500));
  }
}

function prev() {
  var page = pages[i];
  if (page.index > 0) {
    var fragment = page.fragments[page.index - 1];
    fragment.className = fragment.type;
    page.index--;
  } else if (i > 0) {
    content.removeChild(pages[i]);
    i--;
    $(content).append($(pages[i]).fadeIn(500));
  }
}

function makeSlideShow(input) {
  var ast = parse(input);
  pages = ast.map(makePage);
  $(content).empty();
  content.appendChild(pages[0]);
  document.getElementById('next').onclick = next;
  document.getElementById('prev').onclick = prev;
  document.onkeydown = function(e) {
    e = e || window.event;
    switch(e.which || e.keyCode) {
      case 37: // left
        prev();
        break;
      case 39: // right
        next();
        break;

      default:
        return;
    }
    e.preventDefault();
  };
}


// jquery based ui stuff
$(document).ready(function() {
  var editMode = false;
  $("#edit").click(function() {
    if (editMode == true) {
      $("#controls").removeClass("edit");
      $("#editor").addClass("hidden");
      editMode = false;
    } else {
      $("#controls").addClass("edit");
      $("#editor").removeClass("hidden");
      editMode = true;
    }
  });

  // $("#editor").on("keyup paste", function() {
  $("#editor").on("change", function() {
    makeSlideShow($(this).val());
  });
});
