var makeSeq = function (l_expr, r_expr) {
  return { tag: 'seq', left: l_expr, right: r_expr };
};

var makeNote = function (pitch, duration) {
  return { tag: 'note', pitch: pitch, dur: duration };
};

// "Write a function prelude that takes a music expression expr as input and
// returns an expression that means to play a d4 note for 500 milliseconds and
// then play expr."
var prelude = function (expr) {
  return makeSeq(makeNote('d4', 500), expr);
};

// "Write a function reverse that takes a music expression as input
// and returns a new music expression that plays the notes in the reverse
// order. Your function shouldn't modify the input, it should just return a
// new reversed expression."
var reverse = function (expr) {
  if (expr.tag !== 'seq') { return expr; }
  else { return makeSeq(reverse(expr.right), reverse(expr.left)); }
};

// "Write a function endTime that takes a start time time in milliseconds and a
// MUS expression expr. Assuming expr starts playing at time time, the function
// should return the time when expr finishes."
var endTime = function (time, expr) {
  switch(expr.tag) {

    case 'seq':
    return endTime(endTime(time, expr.left), expr.right);

    case 'par':
    return Math.max(endTime(time, expr.left), endTime(time, expr.right));

    default :
    return expr.dur + time;

  }
};

// "Write a function compile that compiles MUS songs into NOTE songs."
// Note : I assume 'rest' elemnts have a 'dur' field, not a 'duration' field.
var compile = function (expr) {

  var _compile = function (start, notes, expr) {
    switch(expr.tag) {

      case 'seq':
      return _compile(
        endTime(start, expr.left),
        _compile(start, notes, expr.left),
        expr.right
      );

      case 'par':
      return _compile(start, notes, expr.left).concat(_compile(start, [], expr.right));

      case 'repeat':
      for(var ii = 0 ; ii < expr.count ; ii++) {
        notes.push(expr.section);
      }
      return notes;

      case 'note':
      return notes.concat([{
        tag: 'note',
        pitch: expr.pitch,
        start: start,
        dur: expr.dur
      }]);

      case 'rest':
      return notes.concat([{
        tag: 'rest',
        start: start,
        dur: expr.dur
      }]);

    }
  };

  return _compile(0, [], expr);
};

// "Assuming you have compile and playNOTE implemented in JavaScript,
// implement playMUS in JavaScript."
var playMUS = function (expr) {
  playNOTE(compile(expr));
};

// Compile MUS songs into NOTE songs using MIDI note numbers.
var compileT = function (expr) {

  // Takes a pitch and returns a MIDI number.
  var convertPitch = function (pitch) {
    return 12 + {c:0,d:2,e:4,f:5,g:7,a:9,b:11}[pitch[0]] + (12 * pitch[1]);
  };

  var _compile = function (start, notes, expr) {
    switch(expr.tag) {

      case 'seq':
      return _compile(
        endTime(start, expr.left),
        _compile(start, notes, expr.left),
        expr.right
      );

      case 'par':
      return _compile(start, notes, expr.left).concat(_compile(start, [], expr.right));

      case 'repeat':
      for(var ii = 0 ; ii < expr.count ; ii++) {
        notes.push(expr.section);
      }
      return notes;

      case 'note':
      return notes.concat([{
        tag: 'note',
        pitch: convertPitch(expr.pitch),
        start: start,
        dur: expr.dur
      }]);

      case 'rest':
      return notes.concat([expr]);

    }
  };

  return _compile(0, [], expr);
};