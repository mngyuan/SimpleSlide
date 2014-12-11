%lex
%%

\s+               /* skip whitespace */
_[0-9a-zA-Z]+     return 'OPEN_TAG'
_                 return 'CLOSE_TAG'
[0-9a-zA-Z]+      return 'WORD'
<<EOF>>           return 'EOF'


/lex

%%

ss
  : exp EOF { console.log($1); }
  ;

exp
  : OPEN_TAG exp CLOSE_TAG { $$ = [{'tag':$1, 'content':$2}]; }
  | exp WORD { $$ = $1.concat($2); }
  | WORD { $$ = [$1]; }
  ;
