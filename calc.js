var screen = document.querySelector('#screen');
var calculator = document.querySelector('#calculator');
var historyScreen = document.querySelector('#history-screen');

var sign = document.querySelector('#sign');
document.querySelectorAll('button').forEach(x=>x.addEventListener('click',handleClick)  );
window.addEventListener('keypress',handleKeyPress);
var calcText = '';
var historyText = '';
var val = 0;
var signValue = 1;
var lastOperator=null;
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
    else key = String.fromCharCode(key).replace(/\*/,'×').replace(/\//,'÷').toLocaleLowerCase();
    if(key.match(/[-\.÷×\+0-9=cm⌫]/gi))processInput(key);
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
                val = 0;
                break;
            case 'CE':
                calcText ='';
                break;
            case '+':case '-': case '÷':case '×':
                lastOperator = key;
                historyScreen.innerHTML = historyText =  solve(historyText+calcText) + key;
                calcText = '';
                break;
            case '=':
                var op = '';
                if(!lastOperator) historyText = '';
                if(lastOperator && !historyText.match(/[-÷×\+]/g))historyText+= lastOperator;
                val = solve(historyText + calcText);
                calcText = '';
                historyScreen.innerHTML = historyText = val+'';
                break;
            case '+/-':
                console.log('vvs');
                signValue*=-1;
                sign.innerHTML = signValue===1?'':'-';
                break;
            case 'm+':case 'm-':
                val = solve(historyText + calcText);
                calcText = '';
                historyScreen.innerHTML = historyText = val+'';
                if(key=='m+')memoryRecall += Number(val);
                else memoryRecall -= Number(val);
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
    return s;
}

/* 

    -Memory Recall-

*/

var memoryRecall = 0;



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