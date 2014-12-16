#comment

page 3
====
_$(return 'hi' _$)
_$(
   var str = '';
   for (var i = 0; i < 10; i++) {
    str += ' ' + i;
  }
  return str;
   _$)

_$(
   var str = '';
   for (var i = 0; i < 10; i ++) {
          str += 'page ' + i + '\n====\n';
          }
          return str; _$)
