
page 3
====
_hl
function () {
  return true;
}
$(document).ready(function() {
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
});
_
