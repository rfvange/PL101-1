var assert = chai.assert;
var expect = chai.expect;

var make_env = function(bindings, outer) {
  if(bindings === undefined) {
    bindings = {};
  }
  if(outer === undefined) {
    outer = {};
  }
  return { bindings: bindings, outer: outer };
};

suite('INTERPRETER', function() {

// Some unit tests

suite('retrieving values', function() {
    test('x', function() {
        evalScheem('x', make_env({x:2, y:3, z:10})),
        2
    });
    test('(* y 3)', function() {
        evalScheem(['*', 'y', 3], make_env({x:2, y:3, z:10})),
        9
    });
    test('(/ z (+ x y))', function() {
        evalScheem(['/', 'z', ['+', 'x', 'y']], make_env({x:2, y:3, z:10})),
        2
    });
});
suite('define', function() {
    test('evaluation of define should return 0', function() {
        evalScheem(['define', 'a', 0], make_env()),
        0
    });
    test('defining new values', function() {
        var env = make_env();
        evalScheem(['define', 'x', 42], env);
        expect(env).to.eql(make_env({x:42}));
    });
    test('redefining values', function() {
        var env = make_env({y:13});
        evalScheem(['define', 'y', 12], env);
        expect(env).to.eql(make_env({y:12}));
    });
    test('expressions are evaluated before being defined', function() {
        var env = make_env({x:100});
        evalScheem(['define', 'xplus1', ['+', 'x', 1]], env);
        expect(env).to.eql(make_env({x:100, xplus1:101}));
    });
});
suite('set!', function() {
    test('set! should fail on undefined values', function() {
        expect(
            function(){ evalScheem(['set!', 'x', 0], make_env()); }
        ).to.throw(Error, "can't set undefined variables");
    });
    test('setting a value', function() {
        var env = make_env({a:0});
        evalScheem(['set!', 'a', 1], env);
        expect(env).to.eql(make_env({a:1}));
    });
    test('expressions are being evaluated before being set', function() {
        var env = make_env({b:14});
        evalScheem(['set!', 'b', ['-', 'b', 4]], env);
        expect(env).to.eql(make_env({b:10}));
    });
});
suite('begin', function() {
    test('begin evaluates to its last expression', function() {
        expect(evalScheem(['begin', 1, 's', 't'], make_env({s:2, t:3}))).to.eql(3);
    });
    test('begin evaluates multiple expressions', function() {
        evalScheem(['begin', ['define', 'u', 17],
                                 ['define', 'v', 23],
                                 ['+', 'u', 'v']], make_env()),
        40;
    });
});
suite('quote', function() {
    test('a number', function() {
        expect(evalScheem(['quote', 3], make_env())).to.eql(3);
    });
    test('an atom', function() {
        expect(evalScheem(['quote', 'dog'], make_env())).to.eql('dog');
    });
    test('a list', function() {
        expect(evalScheem(['quote', [1, 2, 3]], make_env())).to.eql([1, 2, 3]);
    });
});
suite('=', function() {
    test('2 is not equal to 3', function() {
        evalScheem(['=', 2, 3], make_env()),
        '#f'
    });
    test('x+y = x*y when x=2 and y=2', function() {
        evalScheem(['=', ['+', 'x', 'y'], ['*', 'x', 'y']], make_env({x:2, y:2})),
        '#t'
    });
});
suite('<', function() {
    test('2 is not less than 1', function() {
        evalScheem(['<', 2, 1], make_env()),
        '#f'
    });
    test('x+y < x*y when x=2 and y=3', function() {
        evalScheem(['=', ['+', 'x', 'y'], ['*', 'x', 'y']], make_env({x:2, y:3})),
        '#t'
    });
});
suite('>', function() {
    test('2 is not more than 3', function() {
        evalScheem(['<', 2, 1], make_env()),
        '#f'
    });
    test('x+y > x*y when x=1 and y=2', function() {
        evalScheem(['=', ['+', 'x', 'y'], ['*', 'x', 'y']], make_env({x:1, y:2})),
        '#t'
    });
});
suite('cons', function() {
    test("consing onto something that isn't a list is illegal", function () {
        expect(
            function () { evalScheem(['cons', 1, 2], make_env()); }
        ).to.throw(Error, "can only cons onto lists");
    });
    test("consing 1 onto the empty list gives '(1)", function() {
        evalScheem(['cons', 1, ['quote', []]], make_env()),
        [1]
    });
    test("consing 1 onto '(2 3) gives '(1 2 3)", function() {
        evalScheem(['cons', 1, ['quote', [2, 3]]], make_env()),
        [1, 2, 3]
    });
    test("consing '(0 1) onto '(2 3) gives '((0 1) 2 3)", function() {
        evalScheem(['cons', ['quote', [0, 1]], ['quote', [2, 3]]], make_env()),
        [[0, 1], 2, 3]
    });
});
suite('car', function() {
    test('taking the car of the empty list is illegal', function() {
        expect(
            function() { evalScheem(['car', ['quote', []]], make_env()); }
        ).to.throw(Error, "can't take the car of the empty list");
    });
    test("the car of '(0) is 0", function() {
        expect(evalScheem(['car', ['quote', [0]]], make_env())).to.eql(0);
    });
    test("the car of '(1 2 3) is 1", function() {
        expect(evalScheem(['car', ['quote', [1, 2, 3]]], make_env())).to.eql(1);
    });
    test("the car of '((1 2) 3) is (1 2)", function() {
        expect(evalScheem(['car', ['quote', [[1, 2], 3]]], make_env())).to.eql([1, 2]);
    });
});
suite('cdr', function() {
    test('taking the cdr of the empty list is illegal', function() {
        expect(
            function () { evalScheem(['cdr', ['quote', []]], make_env()); }
        ).to.throw(Error, "can't take the cdr of the empty list");
    });
    test("the cdr of '(0) is '()", function() {
        expect(evalScheem(['cdr', ['quote', [0]]], make_env())).to.eql([]);
    });
    test("the cdr of '(1 2 3) is (2 3)", function() {
        expect(evalScheem(['cdr', ['quote', [1, 2, 3]]], make_env())).to.eql([2, 3]);
    });
    test("the cdr of '((1 2) 3) is (3)", function() {
        expect(evalScheem(['cdr', ['quote', [[1, 2], 3]]], make_env())).to.eql([3]);
    });
});
suite('if', function() {
    test('(if (= 2 2) 1) is illegal', function() {
        expect(
            function () { evalScheem(['if', ['=', 2, 2], 1], make_env()) }
        ).to.throw(Error, "illegal 'if' expression");
    });
    test('(if (= 2 2) 1 0 2) is illegal', function() {
        expect(
            function () { evalScheem(['if', ['=', 2, 2], 1, 0, 2], make_env()) }
        ).to.throw(Error, "illegal 'if' expression");
    });
    test('(if (= 2 2) 1 0) is 1', function() {
        expect(evalScheem(['if', ['=', 2, 2], 1, 0], make_env())).to.eql(1);
    });
    test('(if (= 2 3) 1 0) is 0', function() {
        expect(evalScheem(['if', ['=', 2, 3], 1, 0], make_env())).to.eql(0);
    });
});
suite('arithmetic', function() {
    suite('add', function() {
        test('two numbers', function() {
            assert.deepEqual(
                evalScheem(['+', 3, 5], make_env()),
                8
            );
        });
        test('a number and an expression', function() {
            assert.deepEqual(
                evalScheem(['+', 3, ['+', 2, 2]], make_env()),
                7
            );
        });
        test('a dog and a cat', function() {
            assert.throws(function() {
                evalScheem(['+', 'dog', 'cat'], make_env());
            });
        });
    });
    suite('substract', function() {
        test('two numbers', function() {
            assert.deepEqual(
                evalScheem(['-', 3, 5], make_env()),
                -2
            );
        });
        test('a number and an expression', function() {
            assert.deepEqual(
                evalScheem(['-', 3, ['-', 3, 2]], make_env()),
                2
            );
        });
        test('a dog and a cat', function() {
            assert.throws(function() {
                evalScheem(['-', 'dog', 'cat'], make_env());
            });
        });
    });
    suite('multiply', function() {
        test('two numbers', function() {
            assert.deepEqual(
                evalScheem(['*', 3, 5], make_env()),
                15
            );
        });
        test('a number and an expression', function() {
            assert.deepEqual(
                evalScheem(['*', 3, ['*', 2, 2]], make_env()),
                12
            );
        });
        test('a dog and a cat', function() {
            assert.throws(function() {
                evalScheem(['*', 'dog', 'cat'], make_env());
            });
        });
    });
    suite('divide', function() {
        test('two numbers', function() {
            assert.deepEqual(
                evalScheem(['/', 3, 6], make_env()),
                0.5
            );
        });
        test('a number and an expression', function() {
            assert.deepEqual(
                evalScheem(['/', 12, ['/', 24, 2]], make_env()),
                1
            );
        });
        test('a dog and a cat', function() {
            assert.throws(function() {
                evalScheem(['/', 'dog', 'cat'], make_env());
            });
        });
    });

});

});
