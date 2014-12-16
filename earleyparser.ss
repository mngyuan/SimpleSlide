create a slide show about earley parser in 8 lines
====
_code
\_ $(
   var str = '';
   for (var i = 0; i < 13; i++) {
     str += ss.page();
     str += ss.img('http://inst.eecs.berkeley.edu/~cs164/fa10/earley/ex1part' + ss.norm(i,2) + '.png');
   }
   return str;
\_ $)
_


_$(
   var str = '';
   for (var i = 0; i < 13; i++) {
     str += ss.page();
     str += ss.img('http://inst.eecs.berkeley.edu/~cs164/fa10/earley/ex1part' + ss.norm(i,2) + '.png');
   }
   return str;
_$)

