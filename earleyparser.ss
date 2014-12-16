_$(
   var str = '';
   for (var i = 0; i < 13; i++) {
     str += ss.page();
     str += ss.img('http://inst.eecs.berkeley.edu/~cs164/fa10/earley/ex1part' + ss.norm(i,2) + '.png');
   }
   return str;
_$)

