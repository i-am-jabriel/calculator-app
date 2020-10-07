var screen = document.querySelector('#screen');
var calculator = document.querySelector('#calculator');
var historyScreen = document.querySelector('#history-screen');

var sign = document.querySelector('#sign');
document.querySelectorAll('button').forEach(x=>x.addEventListener('click',handleClick)  );
document.addEventListener('keypress',handleKeyPress);
var calcText = '';
var historyText = '';
var val = 0;
var signValue = 1;
var lastOperator='+';
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
    else key = String.fromCharCode(key).replace(/\*/,'×').replace(/\//,'÷');
    if(key.match(/[-\.÷×\+0-9=cCcC]/gi))processInput(key);
    else console.log('invalid input ',key);
}
function processInput(key){
    if(isNumber(Number(key))){
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
                calcText = '';
                historyScreen.innerHTML = historyText = '';
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
                if(!historyText.match(/[-÷×\+]/g) )historyText+= lastOperator;
                val = solve(historyText + calcText);
                calcText = '';
                historyScreen.innerHTML = historyText = val+'';
                break;
            case '+/-':
                console.log('vvs');
                signValue*=-1;
                sign.innerHTML = signValue===1?'':'-';
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
    return eval(s.replace(/×/g,'*').replace(/÷/g,'/')); 
}
var _top, _left;
calculator.style.left = 0;
calculator.style.top = 0;
calculator.addEventListener('mousedown', event =>{
    _left = parseInt(calculator.style.left);
    _top = parseInt(calculator.style.top);
    if(!isNumber(top))top=0; 
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);
});


var drag = event =>{
    calculator.style.left = (_left += event.movementX)+'px';
    calculator.style.top  = (_top += event.movementY)+'px';
};
var endDrag = event =>{
    document.removeEventListener('mousemove',drag);
    document.removeEventListener('mouseup', endDrag);
}