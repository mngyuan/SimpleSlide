#basic examples
#no title
basic example
====
_a www.google.com google _
_a google's website | www.google.com _
_table
1 | 2 | 3
4 | 5 | 6
7 | 8 | 9
_
_yt linktoyoutubevideo _
_f nested _f fragments _ _

page 2
====
_ff
auto
fragments
every
line
*lists
 *lists
 *lists
  *lists
_hl
function () {
  // code highlighting whatever;
}
_
\_escape with backslash
_



#example with javascript library
====
_$(
   var str = ss.img('https://www.google.com/logos/doodles/2014/wassily-kandinskys-148th-birthday-5655681428357120-hp.jpg');
   str += ss.table([[1,2,3],[4,5,6],[7,8,9]]);
   str += '\n' + ss.link('www.google.com', 'google');
   str += ss.page('page2');
   return ss.ff(str);
_$)

