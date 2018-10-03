// all we need is to add endpoint
var $firstTermCurve = $('path#first-term');
var $secondTermCurve = $('path#second-term');

var $firstTermCheck = $('input#first-term-check');
var $secondTermCheck = $('input#second-term-check');

var $firstTermNum = $('mark#first-term-num');
var $secondTermNum = $('mark#second-term-num');
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
    return parseInt(variant) === this.calculateSum();
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }
}

class Curve {
  constructor(num1, num2) {
    this.UNIT = 39;
    this.start = num1 * this.UNIT;
    this.end = num2 * this.UNIT;

    this.Y = 105;
    this.ELLIPSE_CONST = 'A3 1, 0, 0 1,';

    // length of 1 point on ruler

    this.curvePath = this.calculatePath(num1, num2);
  }

  // compose path for curve with set numbers
  // example: M0 105 A3 1, 0, 0 1, 272 105
  calculatePath(startPoint, endPoint) {
    var end = endPoint * this.UNIT;
    var start = startPoint * this.UNIT;

    var curve = this.ELLIPSE_CONST + ' ' + end + ' ' + this.Y;
    var arrowHead = ' v-10 m -5 2 l5 7';

    return 'M' + start + ' ' + this.Y + curve + arrowHead;
  }

  drawCurve(term) {
    term.attr('d', this.curvePath);
  }

  moveInputToCurve(field) {
    var leftOffset = (this.end - this.start) / 2 + this.start - 10;
    var topOffset = leftOffset * 0.08;
    field.closest('.input-box').css({left: leftOffset, top: topOffset});
  }
}

function startMath() {
  var Math = new Sum;

  writeTask(Math.firstTerm, Math.secondTerm);

  var FirstCurve = new Curve(0, Math.firstTerm);
  var SecondCurve = new Curve(Math.firstTerm, Math.firstTerm + Math.secondTerm);

  FirstCurve.drawCurve($firstTermCurve);
  FirstCurve.moveInputToCurve($firstTermCheck);

  $firstTermCheck.keyup(function(e) {
      var $field = $(e.currentTarget);
      $field.submit();
      if (checkNum($field, Math)) {
        $secondTermCheck.removeClass('hidden').focus();


        SecondCurve.drawCurve($secondTermCurve);
        SecondCurve.moveInputToCurve($secondTermCheck);
      }
  });

  $secondTermCheck.keyup(function(e) {
    var $field = $(e.currentTarget);
    $field.submit();

    if (checkNum($field, Math)) {
      transformSumToInput($sumField, Math);
    }
  });
}

function isFirstField(field) {
  return parseInt(field.dataset.field) === 1;
}

function isCorrect(field, Num, isFirst) {
  if (isFirst) {
    return parseInt(field.value) === Num.firstTerm;
  }

  return parseInt(field.value) === Num.secondTerm;
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
    $("<span />", { text: this.value, class: 'solved'}).insertAfter(this);
    $(this).hide();
  });
}

function transformSumToInput(field, Math) {
  $(field).each(function() {
    $("<input />", { id: this.id, type: 'text'}).insertAfter(this).keyup(function(e) {
      var $field = $(e.currentTarget);
      $field.submit();

      if (Math.checkSum($field[0].value)) {
        transformToSpan($field);
        $field.removeClass('wrong');
      } else {
        $field.addClass('wrong');
      }
    }).focus();
    $(this).remove();
  });
}

function writeTask(first, second) {
  $firstTermNum.append(first);
  $secondTermNum.append(second);
}

$(document).ready(function() {
 startMath();
});