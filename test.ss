====
_$(
   var str = ss.img('https://www.google.com/logos/doodles/2014/wassily-kandinskys-148th-birthday-5655681428357120-hp.jpg');
   str += ss.table([[1,2,3],[4,5,6],[7,8,9]]);
   str += '\n' + ss.link('www.google.com', 'google');
   str += '\n' + ss.yt('https://www.youtube.com/watch?v=PqJNc9KVIZE', [600,400]);
   str += ss.page('page2');
   return ss.ff(ss.ul(str));
_$)

