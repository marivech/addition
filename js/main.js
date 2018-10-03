// length of 1 point on ruler
var UNIT = 39;


var Y = 105;

// all we need is to add endpoint
var ELLIPSE_CONST = 'A3 1, 0, 0 1,';

var $firstTermCurve = $('path#first-term');
var $secondTermCurve = $('path#second-term');

var $firstTermCheck = $('input#first-term-check');
var $secondTermCheck = $('input#second-term-check');

var $firstTermNum = $('em#first-term-num');
var $secondTermNum = $('em#second-term-num');
var $sumField = $('#sum-field');

class Sum {
  constructor() {
    this.firstTerm = this.getRandomInt(6, 9);
    this.secondTerm = 0;

    while(this.firstTerm + this.secondTerm < 11 || this.firstTerm + this.secondTerm > 14) {
      this.secondTerm = this.getRandomInt(2, 8);
    }
  }

  calculateSum() {
    return this.firstTerm + this.secondTerm;
  }

  checkSum(variant) {
    return parseInt(variant) === this.calculateSum()
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }
}

class Curve {
  constructor(num1, num2) {
    this.start = num1;
    this.end = num2;
    this.curvePath = this.calculatePath(num1, num2);
  }
  // compose path for curve with set numbers
  // example: M0 105 A3 1, 0, 0 1, 272 105
  calculatePath(startPoint, endPoint) {
    var end = endPoint * UNIT;
    var start = startPoint * UNIT;

    var curve = ELLIPSE_CONST + ' ' + end + ' ' + Y;

    return 'M' + start + ' ' + Y + curve;
  }

  drawCurve(term) {
    term.attr('d', this.curvePath);
  }
}

function startMath() {
  var Math = new Sum;

  writeTask(Math.firstTerm, Math.secondTerm);

  var FirstCurve = new Curve(0, Math.firstTerm);
  var SecondCurve = new Curve(Math.firstTerm, Math.firstTerm + Math.secondTerm);

  FirstCurve.drawCurve($firstTermCurve);

  var firstCorrect = false;
  var secondCorrect = false;
  var sumCorrect = false;

  $firstTermCheck.blur(function(e) {
      var $field = $(e.currentTarget);
      $field.submit();
      if (checkNum($field, Math)) {
        firstCorrect = true;
        $secondTermCheck.removeClass('hidden');

        SecondCurve.drawCurve($secondTermCurve);
      }
  });

  $secondTermCheck.blur(function(e) {
    var $field = $(e.currentTarget);
    $field.submit();

    if (checkNum($field, Math)) {
      secondCorrect = true;
      transformToInput($sumField, Math);
    }
  });
}

function writeTask(first, second) {
  $firstTermNum.append(first);
  $secondTermNum.append(second);
}

function isFirstField(field) {
  return field.dataset.field == 1 ? true : false;
}

function isCorrect(field, Num, isFirst) {
  if (isFirst) {
    return (parseInt(field.value) === Num.firstTerm) ? true: false
  }

  return (parseInt(field.value) === Num.secondTerm) ? true: false
}

function checkNum($field, Num) {
  var isFirst = isFirstField($field[0]);

  if (isCorrect($field[0], Num, isFirst)) {
    markField($field, true, isFirst);
    transformToSpan($field);
    return true;
  }

  markField($field, false, isFirst)
  return false;
}

function markField(field, isCorrect, isFirst) {
  if (isCorrect) {
    if(isFirst) {
      $firstTermNum.removeClass('wrong');
    } else {
      $secondTermNum.removeClass('wrong');
    }

    field.removeClass('wrong');

  } else {
    if(isFirst) {
      $firstTermNum.addClass('wrong');
    } else {
      $secondTermNum.addClass('wrong');
    }

    field.addClass('wrong');
  }
}

function transformToSpan(field) {
  $(field).each(function() {
    $("<span />", { text: this.value}).insertAfter(this);
    $(this).hide();
  });
}

function transformToInput(field, Math) {
  $(field).each(function() {
    $("<input />", { id: this.id, type: 'number'}).insertAfter(this).blur(function(e) {
      var $field = $(e.currentTarget);
      console.log($field);
      $field.submit();

      if (Math.checkSum($field[0].value)) {
        transformToSpan($field);
        $field.removeClass('wrong');
      } else {
        $field.addClass('wrong');
      }
    });
    $(this).remove();
  });
}


$(document).ready(function() {
 startMath();
});