var prelude = function (expr) {
  return {
    tag: 'seq',
    left: { tag: 'note', pitch: 'd4', dur: 500 },
    right: expr
  };
};

var reverse = function (expr) {
  if (expr.tag === 'note') { return expr; }
  return {
    tag: 'seq',
    left: reverse(expr.right),
    right: reverse(expr.left)
  };
};

var endTime = function (time, expr) {
  if (expr.tag === 'note') { return expr.dur + time; }
  return endTime(endTime(time, expr.left), expr.right);
};

var compile = function (musexpr) {
  var _compile = function (start, notes, expr) {
    if (expr.tag === 'note') {
      return notes.concat([{
        tag: 'note',
        pitch: expr.pitch,
        start: start,
        dur: expr.dur
      }]);
    } else {
      return _compile(
        endTime(start, expr.left),
        _compile(start, notes, expr.left),
        expr.right
      );
    }
  };
  return _compile(0, [], musexpr);
};

var playMUS = function (musexpr) {
  playNOTE(compile(musexpr));
};