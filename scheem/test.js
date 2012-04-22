var peg = require('pegjs');
var should = require('should');
var fs = require('fs');

fs.readFile('scheem.pegjs', 'ascii', function(err, data) {
    if(err !== null) {
      console.log(err);
    } else {
      var parse = peg.buildParser(data).parse;

      var verify = function(code, expected) {
        console.log("Verifying: " + code);
        should.deepEqual(parse(code), expected);
      }

      verify("42", "42");
      verify("quux", "quux");
      verify("()", []);
      verify("((()))", [[[]]]);
      verify("(quux)", ["quux"]);
      verify("(a b c)", ["a", "b", "c"]);
      verify("(a (b c))", ["a", ["b", "c"]]);
      verify("'quux", ["quote", "quux"]);
      verify("'(quux)", ["quote", ["quux"]]);
      verify("(quux) ;; comment", ["quux"]);
      verify("(a\n;; comment\nb c)", ["a", "b", "c"]);
      verify("(define factorial (lambda (n) (if (= n 0) 1 (* n (factorial (- n 1))))))", ["define", "factorial", ["lambda", ["n"], ["if", ["=", "n", "0"], "1", ["*", "n", ["factorial", ["-", "n", "1"]]]]]]);
    }
});
