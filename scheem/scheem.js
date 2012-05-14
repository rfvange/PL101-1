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
        case 'define':
        case 'set!':
            env[expr[1]] = evalScheem(expr[2], env);
            return 0;
        case '+':
            return evalScheem(expr[1], env) +
                   evalScheem(expr[2], env);
        case '-':
            return evalScheem(expr[1], env) -
                   evalScheem(expr[2], env);
        case '*':
            return evalScheem(expr[1], env) *
                   evalScheem(expr[2], env);
        case '/':
            return evalScheem(expr[1], env) /
                   evalScheem(expr[2], env);
    }
};

