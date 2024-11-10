export function evaluateEquation(equation: string, value: number): number {
  let normalizedEq = equation
      .replace(/([+\-*/^()])/g, ' $1 ')
      .replace(/\s+/g, ' ')
      .trim();
      
  normalizedEq = normalizedEq.replace(/(\d)(x)/g, "$1 * $2");    
  
  normalizedEq = normalizedEq
      .replace(/(?<=^|\s)-\s*x/g, `-${value}`) 
      .replace(/(?<=[+\-*/^()])\s*-\s*x/g, `-${value}`)
      .replace(/x/g, value.toString());
  
  try {
      return customEval(normalizedEq);
  } catch (error) {
      throw new Error("Invalid equation input");
  }
}

function customEval(expression: string): number {
  const tokens = expression.split(' ').filter(token => token.length > 0);
  if (!tokens) return NaN;

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

  for (let i = 0; i < tokens.length; i++) {
      let token = tokens[i];

      if (isNumber(token)) {
          outputQueue.push(parseFloat(token));
          continue;
      }

      if (isOperator(token)) {
          // Check for unary operators
          const isUnary = i === 0 || 
                         isOperator(tokens[i-1]) || 
                         tokens[i-1] === '(' ||
                         tokens[i-1] === '^';  // Important for cases like -x^2
          
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
              const a = evaluationStack.pop()!;
              evaluationStack.push(token === 'u-' ? -a : +a);
          } else {
              const b = evaluationStack.pop()!;
              const a = evaluationStack.pop()!;
              switch (token) {
                  case '+': evaluationStack.push(a + b); break;
                  case '-': evaluationStack.push(a - b); break;
                  case '*': evaluationStack.push(a * b); break;
                  case '/': evaluationStack.push(a / b); break;
                  case '^': evaluationStack.push(Math.pow(a, b)); break;
                  default: throw new Error(`Unsupported operator: ${token}`);
              }
          }
      }
  }

  return evaluationStack.pop()!;
}