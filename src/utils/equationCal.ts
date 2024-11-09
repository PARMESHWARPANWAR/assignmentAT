export function evaluateEquation(equation: string, value: number): number {
    // Insert '*' between numbers and 'x' to correctly form multiplications
    const correctedEquation = equation.replace(/(\d)(x)/g, '$1*$2');
  
    // Replace all occurrences of 'x' with the provided value
    const evaluatedEquation = correctedEquation.replace(/x/g, value.toString());
  
    // Use a regex to handle exponentiation
    const powRegex = /(\d+)\^(\d+)/g;
    const evaluatedEquationWithPow = evaluatedEquation.replace(
      powRegex,
      (match, base, exponent) => Math.pow(parseFloat(base), parseFloat(exponent)).toString()
    );
  
    // Evaluate the expression (caution: only use if input is trusted)
    try {
      return customEval(evaluatedEquationWithPow);
    } catch {
      throw new Error("Invalid equation input");
    }
}

function customEval(expression: string): number {
    // Tokenize input (split into numbers, operators, and variables)
    const tokens = expression.match(/(\d+(\.\d+)?)|[-+*/^()]|x/g);
    if (!tokens) return NaN;
  
    const outputQueue: (number | string)[] = [];
    const operatorStack: string[] = [];
    const precedence: { [key: string]: number } = {
      '+': 1,
      '-': 1,
      '*': 2,
      '/': 2,
      '^': 3
    };
    const associativity: { [key: string]: 'L' | 'R' } = {
      '+': 'L',
      '-': 'L',
      '*': 'L',
      '/': 'L',
      '^': 'R'
    };
  
    tokens.forEach(token => {
      if (!isNaN(parseFloat(token))) {
        // If token is a number, add it to the output queue
        outputQueue.push(parseFloat(token));
      } else if (['+', '-', '*', '/', '^'].includes(token)) {
        // If token is an operator
        while (
          operatorStack.length > 0 &&
          ['+', '-', '*', '/', '^'].includes(operatorStack[operatorStack.length - 1]) &&
          ((associativity[token] === 'L' &&
            precedence[token] <= precedence[operatorStack[operatorStack.length - 1]]) ||
           (associativity[token] === 'R' &&
            precedence[token] < precedence[operatorStack[operatorStack.length - 1]]))
        ) {
          outputQueue.push(operatorStack.pop()!);
        }
        operatorStack.push(token);
      } else if (token === '(') {
        operatorStack.push(token);
      } else if (token === ')') {
        while (operatorStack.length > 0 && operatorStack[operatorStack.length - 1] !== '(') {
          outputQueue.push(operatorStack.pop()!);
        }
        operatorStack.pop();
      }
    });
  
    // Pop all remaining operators to the output queue
    while (operatorStack.length > 0) {
      outputQueue.push(operatorStack.pop()!);
    }
  
    // Evaluate the output queue (Reverse Polish Notation)
    const evaluationStack: number[] = [];
    outputQueue.forEach(token => {
      if (typeof token === 'number') {
        evaluationStack.push(token);
      } else {
        const b = evaluationStack.pop()!;
        const a = evaluationStack.pop()!;
        switch (token) {
          case '+':
            evaluationStack.push(a + b);
            break;
          case '-':
            evaluationStack.push(a - b);
            break;
          case '*':
            evaluationStack.push(a * b);
            break;
          case '/':
            evaluationStack.push(a / b);
            break;
          case '^':
            evaluationStack.push(Math.pow(a, b));
            break;
          default:
            throw new Error(`Unsupported operator: ${token}`);
        }
      }
    });
  
    return evaluationStack.pop()!;
}
  