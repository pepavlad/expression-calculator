function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    expr = expr.replace(/\s/g, '');
    return decideExpr(expr);
}

function decideExpr(expr){
    return convertToInt(convertToRPN(prepareExpr(expr)));
}


function convertToRPN(expr){ 
    let resStr = '', priority;
    let stack = [];
    let count = 0;
    for(let i = 0; i < expr.length; i++){
        if(expr[i] == '(') count++;
        if(expr[i] == ')') count--;
    }
    if(count !== 0) throw Error("ExpressionError: Brackets must be paired");
    for(let i = 0; i < expr.length; i++){
        priority = getPriority(expr.charAt(i));
        
        if(priority === 0) resStr += expr.charAt(i);
        if(priority === 1) {
            stack.push(expr.charAt(i));
        }

        if(priority > 1){
            resStr += ' ';
            while(stack.length !== 0){
                if(getPriority(stack[stack.length-1]) >= priority) resStr += stack.pop()
                else break;
            } 
            stack.push(expr.charAt(i));
        }
        if(priority === -1){
            resStr += ' ';
            while(getPriority(stack[stack.length-1]) !== 1) {
                resStr += stack.pop();
            }
            stack.pop();
        }
    }
    while(stack.length !== 0) resStr += stack.pop();
    return resStr;
}

function convertToInt(resStr){
    let operand = '';
    let stack = [];

    for(let i = 0; i < resStr.length; i++){
        if(resStr.charAt(i) === ' ') continue;
        if(getPriority(resStr.charAt(i)) == 0){
            while(resStr.charAt(i) !== ' ' && getPriority(resStr.charAt(i)) === 0){
                operand += resStr.charAt(i++);
                if(i == resStr.length) break; 
            }
            stack.push(operand);
            operand = '';
        }
        if(getPriority(resStr.charAt(i)) > 1){
            let num1 = +stack.pop(), num2 = +stack.pop();
            if(resStr.charAt(i) === '+') stack.push(num2 + num1);
            if(resStr.charAt(i) === '-') stack.push(num2 - num1);
            if(resStr.charAt(i) === '*') stack.push(num2 * num1);
            if(resStr.charAt(i) === '/'){
                if(num1 == 0) throw new Error('TypeError: Division by zero.');
                stack.push(num2 / num1);
            } 
        }
    }
    return stack.pop();
}

function prepareExpr(expr){
    let preparedExpr = '';
    for(let i = 0; i< expr.length; i++){
        let symbol = expr.charAt(i);
        if(symbol === '-'){
            if(i === 0) preparedExpr += '0';
            else if(expr.charAt(i-1) === '(') preparedExpr += '0';
        }
        preparedExpr += symbol;
    }    
    return preparedExpr;
}

function getPriority(token){
    if(token === '*' || token === '/') return 3;
    else if(token === '+' || token === '-') return 2;
    else if(token === '(') return 1;
    else if(token === ')') return -1;
    else return 0;
}
    

module.exports = {
    expressionCalculator
}