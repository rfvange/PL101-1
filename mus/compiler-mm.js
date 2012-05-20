var multimethod = require('multimethod');

// Return the time when expr finishes.
var endTime = multimethod('tag');

// Compile an expression.
var _compile = multimethod('tag');

// Default behavior for endTime, used for 'note' and 'rest'.
endTime.default(function (expr, start) {
  return start + expr.dur;
});

// Handle the 'note' operator.

_compile.when('note', function (expr, start, notes) {
  notes.push({
    tag: 'note',
    pitch: expr.pitch,
    start: start,
    dur: expr.dur
  });
  return notes;
});

// Handle the 'seq' operator.

endTime.when('seq', function (expr, start) {
  return endTime(expr.right, endTime(expr.left, start));
});

_compile.when('seq', function (expr, start, notes) {
  return _compile(
    expr.right,
    endTime(expr.left, start),
    _compile(expr.left, start, notes)
  );
});

// Handle the 'par' operator.

endTime.when('par', function (expr, start) {
  return Math.max(endTime(expr.left, start), endTime(expr.right, start));
});

_compile.when('par', function (expr, start, notes) {
  return _compile(start, notes, expr.left).concat(_compile(start, [], expr.right));
});

// Handle the 'rest' operator.

_compile.when('rest', function (expr, start, notes) {
  notes.push({
    tag: 'rest',
    start: start,
    dur: expr.dur
  });
  return notes;
});

// Handle the 'repeat' operator.

endTime.when('repeat', function (expr, start) {
  return start + expr.count*endTime(expr.section);
});

_compile.when('repeat', function (expr, start, notes) {
  for(var ii = 0 ; ii < expr.count ; ii++) {
    notes.push(expr.section);
  }
  return notes;
});

// Compile a MUS expression into a NOTE programme.
var compile = function (expr) { return _compile(expr, 0, []); };