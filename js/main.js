var $firstTermCurve = $('path#first-term');
var $secondTermCurve = $('path#second-term');

// length of 1 point on ruler
var UNIT = 39;
var Y = 105;
var ELLIPSE_CONST = 'A3 1, 0, 0 1,'; // all we need is to add endpoint


function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function getMathTask() {
  var firstTerm = getRandomInt(6, 9);
  var secondTerm = 0;

  while(firstTerm + secondTerm < 11 || firstTerm + secondTerm > 14) {
    secondTerm = getRandomInt(2, 8);
  }

  return [firstTerm, secondTerm];
}

function startMath() {
  var terms = getMathTask();

  writeTask(terms[0], terms[1]);

  var firstCurvePath = calculatePath(0, terms[0]);
  var secondCurvePath = calculatePath(terms[0], terms[1] + terms[0]);

  drawCurve($firstTermCurve, firstCurvePath);
  drawCurve($secondTermCurve, secondCurvePath)
}

function writeTask(first, second) {
  $('#first-term-num').append(first);
  $('#second-term-num').append(second);
}


// compose path for curve with set numbers
// example: M0 105 A3 1, 0, 0 1, 272 105
function calculatePath(startPoint, endPoint) {
  var end = endPoint * UNIT;
  var start = startPoint * UNIT;

  var curve = ELLIPSE_CONST + ' ' + end + ' ' + Y;

  return 'M' + start + ' ' + Y + curve;
}

function drawCurve(term, path) {
  term.attr('d', path);
}

$(document).ready(function() {
 startMath();
});