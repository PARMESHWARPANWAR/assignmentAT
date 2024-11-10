export function evaluateEquation(equation: string, value: number): number {
    // First handle implicit multiplication with parentheses
    equation = equation.replace(/(\d+|\))(?=\()/g, '$1*');
    
    let normalizedEq = equation
        .replace(/(\d)(x)/g, "$1*$2") // Handle implicit multiplication with x
        .replace(/([+\-*/^()])/g, ' $1 ')
        .replace(/\s+/g, ' ')
        .trim();
  
    // Handle unary operators
    normalizedEq = normalizedEq
        // Handle start of string
        .replace(/^-\s*x/, `0 - x`)
        .replace(/^\+\s*x/, `0 + x`)
        // Handle after operators or open parenthesis
        .replace(/([+\-*/^(])\s*-\s*x/g, '$1 0 - x')
        .replace(/([+\-*/^(])\s*\+\s*x/g, '$1 0 + x')
        // Replace remaining x with value
        .replace(/x/g, value.toString());
  
    // Handle consecutive operators for cases like -x * -x
    normalizedEq = normalizedEq
        .replace(/(\d+)\s*-\s*-\s*(\d+)/g, '$1 + $2')
        .replace(/(\d+)\s*-\s*\+\s*(\d+)/g, '$1 - $2')
        .replace(/(\d+)\s*\+\s*-\s*(\d+)/g, '$1 - $2')
        .replace(/(\d+)\s*\+\s*\+\s*(\d+)/g, '$1 + $2');
  
    try {
        return customEval(normalizedEq);
    } catch (error) {
        throw new Error("Invalid equation input");
    }
  }
  
  function customEval(expression: string): number {
    const tokens = expression.split(' ').filter(token => token.length > 0);
    if (!tokens.length) throw new Error("Invalid equation input");
  
    const outputQueue: (number | string)[] = [];
    const operatorStack: string[] = [];
  
    const precedence: { [key: string]: number } = {
        '+': 1,
        '-': 1,
        '*': 2,
        '/': 2,
        '^': 3,
        'u+': 4,
        'u-': 4
    };
  
    const associativity: { [key: string]: 'L' | 'R' } = {
        '+': 'L',
        '-': 'L',
        '*': 'L',
        '/': 'L',
        '^': 'R',
        'u+': 'R',
        'u-': 'R'
    };
  
    const isOperator = (token: string) => ['+', '-', '*', '/', '^'].includes(token);
    const isNumber = (token: string) => !isNaN(parseFloat(token));
  
    // Process tokens and handle unary operators
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
  
        if (isNumber(token)) {
            outputQueue.push(parseFloat(token));
            continue;
        }
  
        if (isOperator(token)) {
            // Check for unary operators
            const isUnary = i === 0 || 
                           tokens[i-1] === '(' || 
                           isOperator(tokens[i-1]);
            
            const actualOperator = isUnary && (token === '+' || token === '-') 
                                  ? `u${token}` 
                                  : token;
  
            while (
                operatorStack.length > 0 &&
                operatorStack[operatorStack.length - 1] !== '(' &&
                ((associativity[actualOperator] === 'L' &&
                  precedence[actualOperator] <= precedence[operatorStack[operatorStack.length - 1]]) ||
                 (associativity[actualOperator] === 'R' &&
                  precedence[actualOperator] < precedence[operatorStack[operatorStack.length - 1]]))
            ) {
                outputQueue.push(operatorStack.pop()!);
            }
            operatorStack.push(actualOperator);
            continue;
        }
  
        if (token === '(') {
            operatorStack.push(token);
        } else if (token === ')') {
            while (
                operatorStack.length > 0 && 
                operatorStack[operatorStack.length - 1] !== '('
            ) {
                outputQueue.push(operatorStack.pop()!);
            }
            if (operatorStack.length === 0) {
                throw new Error('Mismatched parentheses');
            }
            operatorStack.pop(); // Remove the '('
        }
    }
  
    while (operatorStack.length > 0) {
        const op = operatorStack.pop()!;
        if (op === '(' || op === ')') {
            throw new Error('Mismatched parentheses');
        }
        outputQueue.push(op);
    }
  
    const evaluationStack: number[] = [];
    
    for (const token of outputQueue) {
        if (typeof token === 'number') {
            evaluationStack.push(token);
        } else {
            if (token === 'u-' || token === 'u+') {
                if (evaluationStack.length < 1) throw new Error("Invalid equation input");
                const a = evaluationStack.pop()!;
                evaluationStack.push(token === 'u-' ? -a : +a);
            } else {
                if (evaluationStack.length < 2) throw new Error("Invalid equation input");
                const b = evaluationStack.pop()!;
                const a = evaluationStack.pop()!;
                switch (token) {
                    case '+': evaluationStack.push(a + b); break;
                    case '-': evaluationStack.push(a - b); break;
                    case '*': evaluationStack.push(a * b); break;
                    case '/': 
                        if (b === 0) throw new Error("Division by zero");
                        evaluationStack.push(a / b); 
                        break;
                    case '^': evaluationStack.push(Math.pow(a, b)); break;
                    default: throw new Error(`Unsupported operator: ${token}`);
                }
            }
        }
    }
  
    if (evaluationStack.length !== 1) {
        throw new Error("Invalid equation input");
    }
  
    return evaluationStack[0];
  }