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
    try { content.removeChild(pages[i]); } catch (e) {}
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
    try { content.removeChild(pages[i]); } catch (e) {}
    i--;
    $(content).append($(pages[i]).fadeIn(500));
  }
}

function makeSlideShow(input) {
  var ast = parse(input);
  pages = ast.map(makePage);
  i = 0;
  $(content).empty();
  $(content).append($(pages[0]).fadeIn(500));
  document.getElementById('next').onclick = next;
  document.getElementById('prev').onclick = prev;
  document.getElementById('ex1').onclick = function () {
    $.get("ex1.ss", function(data) {
      $("#editor").val(data);
      $("#editor").trigger("keyup");
    });
  }
  document.getElementById('ex2').onclick = function () {
    $.get("ex2.ss", function(data) {
      $("#editor").val(data);
      $("#editor").trigger("keyup");
    });
  }
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

  $("#editor").on("keyup paste", function() {
  // $("#editor").on("change", function() {
    makeSlideShow($(this).val());
  });

  // use ex1.ss as default slideshow
  $.get("ex1.ss", function(data) {
    $("#editor").val(data);
    $("#editor").trigger("keyup");
  });
});
