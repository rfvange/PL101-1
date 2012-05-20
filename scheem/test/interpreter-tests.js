var assert = chai.assert;
var expect = chai.expect;

<<<<<<< HEAD
=======
var make_env = function(bindings, outer) {
  if(bindings === undefined) {
    bindings = {};
  }
  if(outer === undefined) {
    outer = {};
  }
  return { bindings: bindings, outer: outer };
};

>>>>>>> master
suite('INTERPRETER', function() {

// Some unit tests

suite('retrieving values', function() {
    test('x', function() {
<<<<<<< HEAD
        evalScheem('x', {x:2, y:3, z:10}),
        2
    });
    test('(* y 3)', function() {
        evalScheem(['*', 'y', 3], {x:2, y:3, z:10}),
        9
    });
    test('(/ z (+ x y))', function() {
        evalScheem(['/', 'z', ['+', 'x', 'y']], {x:2, y:3, z:10}),
=======
        evalScheem('x', make_env({x:2, y:3, z:10})),
        2
    });
    test('(* y 3)', function() {
        evalScheem(['*', 'y', 3], make_env({x:2, y:3, z:10})),
        9
    });
    test('(/ z (+ x y))', function() {
        evalScheem(['/', 'z', ['+', 'x', 'y']], make_env({x:2, y:3, z:10})),
>>>>>>> master
        2
    });
});
suite('define', function() {
    test('evaluation of define should return 0', function() {
<<<<<<< HEAD
        evalScheem(['define', 'a', 0], {}),
        0
    });
    test('defining new values', function() {
        var env = {};
        evalScheem(['define', 'x', 42], env);
        expect(env).to.eql({x:42});
    });
    test('redefining values', function() {
        var env = {y:13};
        evalScheem(['define', 'y', 12], env);
        expect(env).to.eql({y:12});
    });
    test('expressions are evaluated before being defined', function() {
        var env = {x:100};
        evalScheem(['define', 'xplus1', ['+', 'x', 1]], env);
        expect(env).to.eql({x:100, xplus1:101});
=======
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
>>>>>>> master
    });
});
suite('set!', function() {
    test('set! should fail on undefined values', function() {
        expect(
<<<<<<< HEAD
            function(){ evalScheem(['set!', 'x', 0], {}); }
        ).to.throw(Error, "can't set undefined variables");
    });
    test('setting a value', function() {
        var env = {a:0};
        evalScheem(['set!', 'a', 1], env);
        expect(env).to.eql({a:1});
    });
    test('expressions are being evaluated before being set', function() {
        var env = {b:14};
        evalScheem(['set!', 'b', ['-', 'b', 4]], env);
        expect(env).to.eql({b:10});
=======
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
>>>>>>> master
    });
});
suite('begin', function() {
    test('begin evaluates to its last expression', function() {
<<<<<<< HEAD
        expect(evalScheem(['begin', 1, 's', 't'], {s:2, t:3})).to.eql(3);
=======
        expect(evalScheem(['begin', 1, 's', 't'], make_env({s:2, t:3}))).to.eql(3);
>>>>>>> master
    });
    test('begin evaluates multiple expressions', function() {
        evalScheem(['begin', ['define', 'u', 17],
                                 ['define', 'v', 23],
<<<<<<< HEAD
                                 ['+', 'u', 'v']], {}),
=======
                                 ['+', 'u', 'v']], make_env()),
>>>>>>> master
        40;
    });
});
suite('quote', function() {
    test('a number', function() {
<<<<<<< HEAD
        expect(evalScheem(['quote', 3], {})).to.eql(3);
    });
    test('an atom', function() {
        expect(evalScheem(['quote', 'dog'], {})).to.eql('dog');
    });
    test('a list', function() {
        expect(evalScheem(['quote', [1, 2, 3]], {})).to.eql([1, 2, 3]);
=======
        expect(evalScheem(['quote', 3], make_env())).to.eql(3);
    });
    test('an atom', function() {
        expect(evalScheem(['quote', 'dog'], make_env())).to.eql('dog');
    });
    test('a list', function() {
        expect(evalScheem(['quote', [1, 2, 3]], make_env())).to.eql([1, 2, 3]);
>>>>>>> master
    });
});
suite('=', function() {
    test('2 is not equal to 3', function() {
<<<<<<< HEAD
        evalScheem(['=', 2, 3]),
        '#f'
    });
    test('x+y = x*y when x=2 and y=2', function() {
        evalScheem(['=', ['+', 'x', 'y'], ['*', 'x', 'y']], {x:2, y:2}),
=======
        evalScheem(['=', 2, 3], make_env()),
        '#f'
    });
    test('x+y = x*y when x=2 and y=2', function() {
        evalScheem(['=', ['+', 'x', 'y'], ['*', 'x', 'y']], make_env({x:2, y:2})),
>>>>>>> master
        '#t'
    });
});
suite('<', function() {
    test('2 is not less than 1', function() {
<<<<<<< HEAD
        evalScheem(['<', 2, 1]),
        '#f'
    });
    test('x+y < x*y when x=2 and y=3', function() {
        evalScheem(['=', ['+', 'x', 'y'], ['*', 'x', 'y']], {x:2, y:3}),
=======
        evalScheem(['<', 2, 1], make_env()),
        '#f'
    });
    test('x+y < x*y when x=2 and y=3', function() {
        evalScheem(['=', ['+', 'x', 'y'], ['*', 'x', 'y']], make_env({x:2, y:3})),
>>>>>>> master
        '#t'
    });
});
suite('>', function() {
    test('2 is not more than 3', function() {
<<<<<<< HEAD
        evalScheem(['<', 2, 1]),
        '#f'
    });
    test('x+y > x*y when x=1 and y=2', function() {
        evalScheem(['=', ['+', 'x', 'y'], ['*', 'x', 'y']], {x:1, y:2}),
=======
        evalScheem(['<', 2, 1], make_env()),
        '#f'
    });
    test('x+y > x*y when x=1 and y=2', function() {
        evalScheem(['=', ['+', 'x', 'y'], ['*', 'x', 'y']], make_env({x:1, y:2})),
>>>>>>> master
        '#t'
    });
});
suite('cons', function() {
    test("consing onto something that isn't a list is illegal", function () {
        expect(
<<<<<<< HEAD
            function () { evalScheem(['cons', 1, 2]); }
        ).to.throw(Error, "can only cons onto lists");
    });
    test("consing 1 onto the empty list gives '(1)", function() {
        evalScheem(['cons', 1, ['quote', []]], {}),
        [1]
    });
    test("consing 1 onto '(2 3) gives '(1 2 3)", function() {
        evalScheem(['cons', 1, ['quote', [2, 3]]], {}),
        [1, 2, 3]
    });
    test("consing '(0 1) onto '(2 3) gives '((0 1) 2 3)", function() {
        evalScheem(['cons', ['quote', [0, 1]], ['quote', [2, 3]]], {}),
=======
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
>>>>>>> master
        [[0, 1], 2, 3]
    });
});
suite('car', function() {
    test('taking the car of the empty list is illegal', function() {
        expect(
<<<<<<< HEAD
            function() { evalScheem(['car', ['quote', []]], {}); }
        ).to.throw(Error, "can't take the car of the empty list");
    });
    test("the car of '(0) is 0", function() {
        expect(evalScheem(['car', ['quote', [0]]], {})).to.eql(0);
    });
    test("the car of '(1 2 3) is 1", function() {
        expect(evalScheem(['car', ['quote', [1, 2, 3]]], {})).to.eql(1);
    });
    test("the car of '((1 2) 3) is (1 2)", function() {
        expect(evalScheem(['car', ['quote', [[1, 2], 3]]], {})).to.eql([1, 2]);
=======
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
>>>>>>> master
    });
});
suite('cdr', function() {
    test('taking the cdr of the empty list is illegal', function() {
        expect(
<<<<<<< HEAD
            function () { evalScheem(['cdr', ['quote', []]], {}); }
        ).to.throw(Error, "can't take the cdr of the empty list");
    });
    test("the cdr of '(0) is '()", function() {
        expect(evalScheem(['cdr', ['quote', [0]]], {})).to.eql([]);
    });
    test("the cdr of '(1 2 3) is (2 3)", function() {
        expect(evalScheem(['cdr', ['quote', [1, 2, 3]]], {})).to.eql([2, 3]);
    });
    test("the cdr of '((1 2) 3) is (3)", function() {
        expect(evalScheem(['cdr', ['quote', [[1, 2], 3]]], {})).to.eql([3]);
=======
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
>>>>>>> master
    });
});
suite('if', function() {
    test('(if (= 2 2) 1) is illegal', function() {
        expect(
<<<<<<< HEAD
            function () { evalScheem(['if', ['=', 2, 2], 1], {}) }
=======
            function () { evalScheem(['if', ['=', 2, 2], 1], make_env()) }
>>>>>>> master
        ).to.throw(Error, "illegal 'if' expression");
    });
    test('(if (= 2 2) 1 0 2) is illegal', function() {
        expect(
<<<<<<< HEAD
            function () { evalScheem(['if', ['=', 2, 2], 1, 0, 2], {}) }
        ).to.throw(Error, "illegal 'if' expression");
    });
    test('(if (= 2 2) 1 0) is 1', function() {
        expect(evalScheem(['if', ['=', 2, 2], 1, 0], {})).to.eql(1);
    });
    test('(if (= 2 3) 1 0) is 0', function() {
        expect(evalScheem(['if', ['=', 2, 3], 1, 0], {})).to.eql(0);
=======
            function () { evalScheem(['if', ['=', 2, 2], 1, 0, 2], make_env()) }
        ).to.throw(Error, "illegal 'if' expression");
    });
    test('(if (= 2 2) 1 0) is 1', function() {
        expect(evalScheem(['if', ['=', 2, 2], 1, 0], make_env())).to.eql(1);
    });
    test('(if (= 2 3) 1 0) is 0', function() {
        expect(evalScheem(['if', ['=', 2, 3], 1, 0], make_env())).to.eql(0);
>>>>>>> master
    });
});
suite('arithmetic', function() {
    suite('add', function() {
        test('two numbers', function() {
            assert.deepEqual(
<<<<<<< HEAD
                evalScheem(['+', 3, 5], {}),
=======
                evalScheem(['+', 3, 5], make_env()),
>>>>>>> master
                8
            );
        });
        test('a number and an expression', function() {
            assert.deepEqual(
<<<<<<< HEAD
                evalScheem(['+', 3, ['+', 2, 2]], {}),
=======
                evalScheem(['+', 3, ['+', 2, 2]], make_env()),
>>>>>>> master
                7
            );
        });
        test('a dog and a cat', function() {
            assert.throws(function() {
<<<<<<< HEAD
                evalScheem(['+', 'dog', 'cat'], {});
=======
                evalScheem(['+', 'dog', 'cat'], make_env());
>>>>>>> master
            });
        });
    });
    suite('substract', function() {
        test('two numbers', function() {
            assert.deepEqual(
<<<<<<< HEAD
                evalScheem(['-', 3, 5], {}),
=======
                evalScheem(['-', 3, 5], make_env()),
>>>>>>> master
                -2
            );
        });
        test('a number and an expression', function() {
            assert.deepEqual(
<<<<<<< HEAD
                evalScheem(['-', 3, ['-', 3, 2]], {}),
=======
                evalScheem(['-', 3, ['-', 3, 2]], make_env()),
>>>>>>> master
                2
            );
        });
        test('a dog and a cat', function() {
            assert.throws(function() {
<<<<<<< HEAD
                evalScheem(['-', 'dog', 'cat'], {});
=======
                evalScheem(['-', 'dog', 'cat'], make_env());
>>>>>>> master
            });
        });
    });
    suite('multiply', function() {
        test('two numbers', function() {
            assert.deepEqual(
<<<<<<< HEAD
                evalScheem(['*', 3, 5], {}),
=======
                evalScheem(['*', 3, 5], make_env()),
>>>>>>> master
                15
            );
        });
        test('a number and an expression', function() {
            assert.deepEqual(
<<<<<<< HEAD
                evalScheem(['*', 3, ['*', 2, 2]], {}),
=======
                evalScheem(['*', 3, ['*', 2, 2]], make_env()),
>>>>>>> master
                12
            );
        });
        test('a dog and a cat', function() {
            assert.throws(function() {
<<<<<<< HEAD
                evalScheem(['*', 'dog', 'cat'], {});
=======
                evalScheem(['*', 'dog', 'cat'], make_env());
>>>>>>> master
            });
        });
    });
    suite('divide', function() {
        test('two numbers', function() {
            assert.deepEqual(
<<<<<<< HEAD
                evalScheem(['/', 3, 6], {}),
=======
                evalScheem(['/', 3, 6], make_env()),
>>>>>>> master
                0.5
            );
        });
        test('a number and an expression', function() {
            assert.deepEqual(
<<<<<<< HEAD
                evalScheem(['/', 12, ['/', 24, 2]], {}),
=======
                evalScheem(['/', 12, ['/', 24, 2]], make_env()),
>>>>>>> master
                1
            );
        });
        test('a dog and a cat', function() {
            assert.throws(function() {
<<<<<<< HEAD
                evalScheem(['/', 'dog', 'cat'], {});
=======
                evalScheem(['/', 'dog', 'cat'], make_env());
>>>>>>> master
            });
        });
    });

});

});
