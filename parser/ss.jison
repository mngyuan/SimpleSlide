%lex
%%

<<EOF>>           return 'EOF'
_[0-9a-zA-Z]+     return 'OPEN_TAG'
_\s*                 return 'CLOSE_TAG'
\-\s*                return 'PAGE_BREAK'
\[[0-9]*          return 'OPEN_FRAGMENT'
\]\s*                return 'CLOSE_FRAGMENT'
\|                return 'FRAGMENT_SEP'
\*                return 'UL'
\#                return 'OL'
\s*([^\[|\]_:*#-][^\s]*[\s]*)*      return 'WORDS'


/lex

%left EXP
%left UL
%left OL

%%

ss
  : page_list EOF { console.log(JSON.stringify($1, null, 2)); }
  ;

page
  : PAGE_BREAK WORDS PAGE_BREAK exp_list { $$ = {'title':$2, 'content':$4}; }
  ;

page_list
  : page { $$ = [$1]; }
  | page_list page { $$ = $1.concat($2); }
  ;

exp
  : OPEN_TAG exp_list CLOSE_TAG { $$ = {'type':'tag', 'tag':$1, 'content':$2}; }
  | WORDS { $$ = {'type':'words', 'content':$1}; }
  | OPEN_FRAGMENT frag_list CLOSE_FRAGMENT { $$ = {'type':'fragment', 'num':$1, 'content':$2}; }
  | ul %prec EXP { $$ = {'type':'ul', 'content':$1}; }
  | ol %prec EXP { $$ = {'type':'ol', 'content':$1}; }
  ;

exp_list
  : exp { $$ = [$1]; }
  | exp_list exp { $$ = $1.concat($2); }
  ;

uli
  : UL exp { $$ = $2; }
  ;

ul
  : uli { $$ = [$1]; }
  | ul uli %prec UL { $$ = $1.concat($2); }
  ;

oli
  : OL exp { $$ = $2; }
  ;

ol
  : oli { $$ = [$1]; }
  | ol oli %prec OL { $$ = $1.concat($2); }
  ;

frag_list
  : WORDS { $$ = [$1]; }
  | frag_list FRAGMENT_SEP WORDS { $$ = $1.concat($3) }
  ;
