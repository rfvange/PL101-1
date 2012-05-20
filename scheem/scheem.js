var evalScheem = function (expr, env) {
    // Numbers evaluate to themselves
    if (typeof expr === 'number') {
        return expr;
    }
    // Strings are variable references
    if (typeof expr === 'string') {
        return env[expr];
    }
    // Look at head of list for operation
    switch (expr[0]) {
        case 'quote':
            return expr[1];
        case 'cons':
            var x = evalScheem(expr[2], env);
            if (Object.prototype.toString.call(x) !== '[object Array]') {
                throw new Error("can only cons onto lists");
            }
            x.unshift(evalScheem(expr[1], env));
            return x;
        case 'car':
            if (expr[1][1].length < 1) {
                throw new Error("can't take the car of the empty list");
            }
            return expr[1][1][0];
        case 'cdr':
            if (expr[1][1].length < 1) {
                throw new Error("can't take the cdr of the empty list");
            }
            expr[1][1].shift();
            return expr[1][1];
        case 'begin':
            var result;
            expr.shift();
            for (var i in expr) {
                result = evalScheem(expr[i], env);
            }
            return result;
        case '=':
            var eq = (evalScheem(expr[1], env) ===
                      evalScheem(expr[2], env));
            if (eq) return '#t';
            return '#f';
        case '<':
            var lt = (evalScheem(expr[1], env) <
                      evalScheem(expr[2], env));
            if (lt) return '#t';
            return '#f';
        case '>':
            var gt = (evalScheem(expr[1], env) >
                      evalScheem(expr[2], env));
            if (gt) return '#t';
            return '#f';
        case 'if':
            if (expr.length !== 4) { 
                throw new Error("illegal 'if' expression");
            }
            if (evalScheem(expr[1]) === '#t') return evalScheem(expr[2]);
            return evalScheem(expr[3]);
        case 'define':
            env[expr[1]] = evalScheem(expr[2], env);
            return 0;
        case 'set!':
            if (env[expr[1]] === undefined) {
                throw new Error("can't set undefined variables");
            }
            env[expr[1]] = evalScheem(expr[2], env);
            return 0;
        case '+':
            var operands = ensureNumeric(expr, env);
            return operands[0] + operands[1];
        case '-':
            var operands = ensureNumeric(expr, env);
            return operands[0] - operands[1];
        case '*':
            var operands = ensureNumeric(expr, env);
            return operands[0] * operands[1];
        case '/':
            var operands = ensureNumeric(expr, env);
            return operands[0] / operands[1];
    }
};

// Ensure that expr has 2 numeric operands
var ensureNumeric = function(expr, env) {
    var isNumeric = function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    var e1 = evalScheem(expr[1], env);
    var e2 = evalScheem(expr[2], env);
    if (isNumeric(e1) && isNumeric(e2)) {
        return [e1, e2];
    } else {
        throw new Error("can't do arithmetic without numeric values");
    }
}

