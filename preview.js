window.onload = function () {
  content = document.getElementById('slideshow');
  document.getElementById('load').onclick = function () {
    var content = document.getElementById('slideshow');
    var input = document.getElementById('input').value;
    makeSlideShow(input);
  }
};
