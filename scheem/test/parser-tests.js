var prs = Scheem.parse;

suite('PARSER', function () {
    test('a number', function () {
        expect(prs('42')).to.eql(42);
    });
    test('a variable', function () {
        expect(prs('x')).to.eql('x');
    });
    test('the empty list', function () {
        expect(prs('()')).to.eql([]);
    });
    test('nested lists', function () {
        expect(prs('((()))')).to.eql([[[]]]);
    });
    test('a list of one symbol', function () {
        expect(prs('(quux)')).to.eql(['quux']);
    });
    test('a list of several symbols', function () {
        expect(prs('(a b c)')).to.eql(['a', 'b', 'c']);
    });
    test('a list of symbols and other lists', function () {
        expect(prs('(a (b c))')).to.eql(['a', ['b', 'c']]);
    });
    test('a quote', function () {
        expect(prs("'x")).to.eql(['quote', 'x']);
    });
    test('another quote', function () {
        expect(prs("(quote x)")).to.eql(['quote', 'x']); 
    });
    test('a more complicated quote', function () {
        expect(prs("'(a (b c))")).to.eql(['quote', ['a', ['b', 'c']]]); 
    });
    test('a comment', function () {
        expect(prs("x ;; (comment)")).to.eql('x'); 
    });
    test('a comment in an expression', function () {
        expect(prs("(a\n;;comment\nb c)")).to.eql(['a', 'b', 'c']);
    });
    test('factorial', function () {
        expect(prs(
                "(define factorial (lambda (n) (if (= n 0) 1 (* n (factorial (- n 1))))))"
                )).to.eql(
                ["define", "factorial", ["lambda", ["n"], ["if", ["=", "n", 0], 1, ["*", "n", ["factorial", ["-", "n", 1]]]]]]
                );
    });
});
