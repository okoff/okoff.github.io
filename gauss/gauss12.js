var diagramColor = 'blueDiagram';
var diagramBorder = '';
var startTime;


/**
 * Demonstrate Central limit theorem.
 */
function count() {
    startTime = new Date().getTime();

    var n = parseInt(document.getElementById("number_of_sources").value) || 0;
    var k = parseInt(document.getElementById("number_of_elements").value) || 0;

    clearHistogram();
    clearResult();

    if(n === 0 || k === 0) {
        alert("Пожалуйста введите данные!");
        return;
    }

    var generatedNumbers = generate(n, k);

    var array = generatedNumbers.array;
    var min = generatedNumbers.min;
    var expectedValue = generatedNumbers.expectedValue;
    var deviation = generatedNumbers.deviation;
    var gradY = generatedNumbers.gradY;
    

    showHistogram(array, min, gradY);
    showResult(k, array, expectedValue, deviation);
}

/**
 * Generate normal distributed numbers.
 * @param numberOfSources   count of generated numbers.
 * @param numberOfElements  count of uniform distributed numbers in array.
 * @returns {Object}        array of count of number normal distributed, min number, expectedValue, deviation, interval's grad.
 */
function generate(numberOfSources, numberOfElements) {
    var uniformDistributionNumbersArray = generateUniformDistributionNumbers(numberOfSources, numberOfElements);

    var normalDistributedNumbers = [];
    var sum = 0;
    for(var p = 0; p < numberOfElements; p++) {
        sum = 0;
        for(var q = 0; q < numberOfSources; q++) {
            sum += uniformDistributionNumbersArray[q][p];
        }
        var average = sum / numberOfSources;
        normalDistributedNumbers.push(average);
    }

    sum = 0;
    for(var l = 0; l < normalDistributedNumbers.length; l++) {
        sum += normalDistributedNumbers[l];
    }
    var expectedValue = sum / normalDistributedNumbers.length;
    expectedValue = expectedValue.toFixed(2);
    
    sum = 0;
    for(var m = 0; m < normalDistributedNumbers.length; m++) {
        sum += Math.pow((normalDistributedNumbers[m] - expectedValue), 2);
    }
    var deviation = Math.sqrt((1 / normalDistributedNumbers.length) * sum);
    deviation = deviation.toFixed(2);
    
    var max = normalDistributedNumbers[0];
    var min = normalDistributedNumbers[0];
    for(var i = 0; i < numberOfElements; i++) {
        max = normalDistributedNumbers[i] > max ? normalDistributedNumbers[i] : max;
        min = normalDistributedNumbers[i] < min ? normalDistributedNumbers[i] : min;
    }
    var gradY = (max - min) / 10;

    var countList = [0,0,0,0,0,0,0,0,0,0];
    for(var k = 0; k < numberOfElements; k++) {
        var round = Math.floor(normalDistributedNumbers[k] / gradY - (min / gradY));
        countList[(round == 10) ? 9 : round] ++; // [1,2)-[2,3)-[3,4)-[4,5)-[5,6)-[6,7)-[7,8)-[8,9)-[9,10]
    }

    return {
        array           : countList,
        min             : min,
        expectedValue   : expectedValue,
        deviation       : deviation,
        gradY           : gradY
    };
}

/**
 * Generate uniform distributed numbers.
 * @param numberOfSources   count of generated numbers.
 * @param numberOfElements  count of uniform distributed numbers in array.
 * @returns {Array}         array of array of uniform distributed numbers.
 */
function generateUniformDistributionNumbers(numberOfSources, numberOfElements) {
    var uniformDistributionNumbersArray = [];
    for(var i = 0; i < numberOfSources; i++) {
        var uniformDistributionNumbers = [];
        for(var j = 0; j < numberOfElements; j++) {
            uniformDistributionNumbers.push(Math.floor(Math.random() * 10 + 1));
        }
        uniformDistributionNumbersArray.push(uniformDistributionNumbers);
    }

    return uniformDistributionNumbersArray;
}

/**
 * Paint histogram with given values.
 * @param min min number.
 * @param gradY interval's grad
 * @param array of count of normal distributed numbers.
 */
function showHistogram(array, min, gradY) {
    var maxValue = array.reduce(function(previous, current){
        return previous > current ? previous : current;
    });
    var gradX = Math.floor(maxValue / 20) + 1;

    var xAxisCategories = document.getElementsByClassName('xAxisCategory');
    for(var p = 0; p < xAxisCategories.length - 1; p++) {
        xAxisCategories[p+1].innerHTML = gradX * (p + 1);
    }

    var yAxisCategories = document.getElementsByClassName('yAxisCategory');
    var fixed = Math.abs(Math.floor(Math.log(gradY) / Math.LN10));
    for(var q = 0; q < yAxisCategories.length; q++) {
        yAxisCategories[(yAxisCategories.length - 1) - q].innerHTML = (min + gradY * q).toFixed(fixed);
    }

    for(var i = 1; i <= array.length; i++) {
        var j = Math.floor(array[i-1] / gradX);
        var tds = document.getElementById('tr_' + i).children;
        if(j > 0) {
            for(var k = 0; k < j; k++) {
                tds[k+2].className = "item fill " + diagramColor + " " +diagramBorder;
            }
        }
        tds[1].innerHTML = array[i-1];
    }
}

/**
 * Clear histogram.
 */
function clearHistogram() {
    var xAxisCategories = document.getElementsByClassName('xAxisCategory');
    for(var z = 0; z < xAxisCategories.length - 1; z++) {
        xAxisCategories[z+1].innerHTML = "";
    }

    var yAxisCategories = document.getElementsByClassName('yAxisCategory');
    for(var q = 0; q < yAxisCategories.length; q++) {
        yAxisCategories[q].innerHTML = "";
    }

    for(var i = 1; i <= 10; i++) {
        var tds = document.getElementById('tr_' + i).children;
        for(var k = 0; k < 20; k++) {
            tds[k+2].className = "item " + diagramBorder;
        }
        tds[1].innerHTML = "";
    }
}

/**
 * Show additional information for result.
 * @param numberOfElements count of normal distributed numbers.
 * @param array array of count of normal distributed numbers.
 */
function showResult(numberOfElements, array, expectedValue, deviation) {
    var result = document.getElementsByClassName("result")[0];

    if(document.getElementById("show_entropy").checked) {
        var entropy = countEntropy(numberOfElements, array);
        result.innerHTML = "<span>Энтропия (нат) = " + entropy + "</span>";
    }

    result.innerHTML += "<span>Мат. ожидание = " + expectedValue + "</span>";
    result.innerHTML += "<span>Среднеквадратическое отклонение = " + deviation + "</span><br/>";

    var time = new Date().getTime() - startTime;
    result.innerHTML += "<span>Время работы (мс) = " + time + "</span>";
}

/**
 * Clear additional information for result.
 * @param entropy
 */
function clearResult() {
    document.getElementsByClassName("result")[0].innerHTML = "";
}

/**
 *
 * @param count count of generated numbers
 * @param array array of count of number normal distributed.
 * @returns {number} Entropy
 */
function countEntropy(count, array) {
    var entropy = 0;
    for(var i = 0; i < array.length; i++) {
        var p = array[i] / count;
        entropy += (p !== 0) ? (-1) * p * Math.log(p) : 0;
    }
    return entropy.toFixed(2);
}

function changeBackgroundColor() {
    var color = document.getElementById("background_color").value;
    
    document.getElementsByClassName('form')[0].className = "form " + color;
    document.getElementsByClassName('diagram')[0].className = "diagram " + color;
    document.getElementsByClassName('result')[0].className = "result " + color;
}

function changeDiagramColor() {
    var value = document.getElementById("diagram_color").value;
    diagramColor = value +'Diagram';
    
    var elements = document.getElementsByClassName('fill');
    for(var i = 0; i < elements.length; i++) {
        elements[i].className = "item fill " + diagramColor + " " + diagramBorder;
    }
}

function showHideLines() {
    document.getElementById("show_lines").checked ? showLines() : hideLines();
}

function showLines() {
    var items = document.getElementsByClassName('item');
    for(var i = 0; i < items.length; i++) {
        items[i].className = items[i].className + " borderDiagram";
    }
    diagramBorder = "borderDiagram";
}

function hideLines() {
    var items = document.getElementsByClassName('item');
    for(var i = 0; i < items.length; i++) {
        items[i].className = items[i].className.replace("borderDiagram", '');
    }
    diagramBorder = " ";
}