var screen = document.querySelector('#screen');
var calculator = document.querySelector('#calculator');
var historyScreen = document.querySelector('#history-screen');
var optionsTab = document.querySelector('#options-tab');
var sign = document.querySelector('#sign');
var hueSlider = document.querySelector('#hue-slider');
var fontSlider = document.querySelector('#font-slider');
var body = document.querySelector('body');
var mainContainer = document.querySelector('#main-container');

var calcText = '';
var historyText = '';
var signValue = 1;
var lastOperator=null;
var memoryRecall = 0;

document.querySelectorAll('button').forEach(x=>x.addEventListener('click',handleClick)  );
window.addEventListener('keypress',handleKeyPress);

function handleClick(e){
    processInput(e.target.innerHTML);
}
function handleKeyPress(e){
    var key = e.keyCode || e.charCode;
    /*if (key >= 48 && key <= 57) {
        processInput((key - 48)+'');
    }*/
    console.log(key);
    if(key === 8) key = '⌫';
    else if(key === 13) key = '=';
    else if(e.key === 'Delete') key = 'C';
    else key = String.fromCharCode(key).replace(/\*/,'×').replace(/\//,'÷').replace(/M/,'m').replace(/c/,'C');
    if(key.match(/[-\.÷×\+0-9=Cm⌫]/g))processInput(key);
    else console.log('invalid input ',key);
}
function processInput(key){
    if(isNumber(Number(key))||key==='m'){
        calcText += key;
    }else{
        switch(key){
            case '.':
                if(calcText.indexOf('.') !== -1)break;
                calcText += key;
                break;
            case '⌫':
                if(calcText ===  '')break;
                calcText = calcText.substr(0,calcText.length-1);
                break;
            case 'C':
                calcText = historyScreen.innerHTML = historyText = '';
                lastOperator = null;
                break;
            case 'CE':
                calcText ='';
                break;
            case '+':case '-': case '÷':case '×':
                lastOperator = key;
                historyScreen.innerHTML = historyText = solve(historyText+calcText) + key;
                calcText = '';
                break;
            case '=':

                //Clear History if no last operator
                if(!lastOperator) historyText = '';

                //Allow chaining of inputs by keeping the last operator in memory
                if(lastOperator && !historyText.match(/[-÷×\+]/g))historyText+= lastOperator;
                historyScreen.innerHTML = historyText = solve(historyText + calcText)+'';
                calcText = '';
                break;
            case '+/-':
                signValue*=-1;
                sign.innerHTML = signValue===1?'':'-';
                break;
            case 'm+':case 'm-':
                let val = 0;
                historyScreen.innerHTML = historyText = val = solve(historyText + calcText);
                calcText = '';
                if(key=='m+')memoryRecall += val;
                else memoryRecall -= val;
                break;
            case '%':
                historyScreen.innerHTML = historyText = solve(historyText + calcText) * 0.01;
                calcText = '';
                break;
            case '^':
                openOptionsTab();
                break;
        }
    }
    screen.innerHTML = calcText;
}
function isNumber(value) 
{
    return typeof value === 'number' && isFinite(value);
}
function solve(s){
    return myEval(s.replace(/×/g,'*').replace(/÷/g,'/').replace(/\m/g,memoryRecall+'')); 
}
var operators = ['+','-','/','*'];
function myEval(s){

    //Splits on ANY operator into an Array
    // [12, +, 41]
    // [Before, Operator, After]

    var arr = s.split(/([-\+*\/])/g);
    console.log(arr);
    if(arr.length<3)return s;
    var x = Number(arr[0]);
    var y = Number(arr[2]);
    var operator = arr[1];

    switch(operator){
        case '+':
            return x+y;
        case '-':
            return x-y;
        case '*':
            return x*y;
        case '/':
            return x/y;
    }
    //If no operator found return default string
    return s;
}

/*

    -Dragging Widget-

*/

var dragWidget;
calculator.addEventListener('mousedown', createDragListenerFor(calculator));
function createDragListenerFor(widget){
    return () => {
        dragWidget = widget;
        dragWidget.style.position='relative';
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', endDrag);
    }
}

function getWidgetLeft(){
    return dragWidget.style.left ? parseFloat(dragWidget.style.left) : 0;
}
function getWidgetTop(){
    return dragWidget.style.top ? parseFloat(dragWidget.style.top) : 0;
}

function drag(event){
    dragWidget.style.left = getWidgetLeft() + event.movementX * .75 +'px';
    dragWidget.style.top  = getWidgetTop()  + event.movementY * .75 +'px';
};
function endDrag(event){
    document.removeEventListener('mousemove',drag);
    document.removeEventListener('mouseup', endDrag);
}

/*

Option Tab

*/

optionsTab.addEventListener('mouseout', hideOptionsTab);
function openOptionsTab(){
    optionsTab.style.height='100vh';
}
function hideOptionsTab(e){
    var e = e.toElement || e.relatedTarget;
    //Don't hide if mouseout was onto a child element
    if ((e.parentNode && e.parentNode.parentNode == this)
        || e.parentNode == this
        || e == this) return;

    optionsTab.style.height='0vh';
}

/*

Slider

*/
hueSlider.addEventListener('input',function(){
    mainContainer.style.filter=`hue-rotate(${this.value}deg)`;
});
fontSlider.addEventListener('input',function(){
    calculator.style['font-size']=`${this.value}%`;
});