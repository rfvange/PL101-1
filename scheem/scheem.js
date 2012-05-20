var lookup = function (env, v) {
  if (env === undefined) {
    throw new Error('environment is undefined');
  }

  if(env.bindings === undefined) {
    return undefined;
  }

  if (env.bindings.hasOwnProperty(v)) {
    return env.bindings[v];
  } else {
    return lookup(env.outer, v);
  }
};

var fixEnv = function (env) {
  if (env === undefined) {
    throw new Error('environment is undefined');
  }

  if (!env.hasOwnProperty('bindings')) {
    env.bindings = {};
  }

  if (!env.hasOwnProperty('outer')) {
    env.outer = {};
  }
}

var update = function (env, v, val) {
  fixEnv(env);

  if (env.bindings.hasOwnProperty(v)) {
    env.bindings[v] = val;
  } else {
    update(env.outer, v, val);
  }
};

var add_binding = function (env, v, val) {
  fixEnv(env);

  env.bindings[v] = val;
};

var evalScheem = function (expr, env) {
  if (env === undefined) {
    throw new Error('environment is undefined');
  }

  if (typeof expr === 'number') {
    return expr;
  }
  if (typeof expr === 'string') {
    return evalScheem(lookup(env, expr), env);
  }
  // Look at head of list for operation
  switch (expr[0]) {
  case 'quote':
    return expr[1];
  case 'let-one':
    var bnds = { };
    bnds[expr[1]] = expr[2];
    return evalScheem(expr[3], { bindings: bnds, outer: env });
  case 'lambda-one':
    return function (arg) {
      var bnd = { };
      bnd[expr[1]] = arg;
      var newenv = { bindings: bnd, outer: env };
      return evalScheem(expr[2], newenv);
    };
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
    if (evalScheem(expr[1], env) === '#t') {
      return evalScheem(expr[2], env);
    }
    return evalScheem(expr[3], env);
  case 'define':
    add_binding(env, expr[1], evalScheem(expr[2], env));
    return 0;
  case 'set!':
    if (lookup(env, expr[1]) === undefined) {
      throw new Error("can't set undefined variables");
    }
    update(env, expr[1], evalScheem(expr[2], env));
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
  default: // function application
    return evalScheem(expr[0], env)(evalScheem(expr[1], env));
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

