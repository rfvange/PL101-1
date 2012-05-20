start        =  expr

expr         =  _* e:scheem_expr _*                { return e; }

scheem_expr  = n:[0-9]+                            { return parseInt(n.join('')); }
             / "'" e:expr                          { return ["quote", e]; }
             /  x:symbol                           { return x; }
             /  xs:list                            { return xs; }

symbol       =  chars:[0-9a-zA-Z_?!+-=@#$%^&*/.]+  { return chars.join(""); }

list         =  "(" xs:expr* ")"                   { return xs; }

_            =  [ \t\r\n]+
             /  ";;" [^\r\n]*
