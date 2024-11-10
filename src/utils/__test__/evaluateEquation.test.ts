import { evaluateEquation } from '../evaluateEquation';

describe('evaluateEquation', () => {
  describe('basic operations', () => {
    it('evaluates simple x substitution', () => {
      expect(evaluateEquation('x', 5)).toBe(5);
      expect(evaluateEquation('x', -3)).toBe(-3);
    });

    it('evaluates basic arithmetic with x', () => {
      expect(evaluateEquation('x + 2', 3)).toBe(5);
      expect(evaluateEquation('x - 2', 3)).toBe(1);
      expect(evaluateEquation('x * 2', 3)).toBe(6);
      expect(evaluateEquation('x / 2', 6)).toBe(3);
    });

    it('evaluates expressions with multiple x occurrences', () => {
      expect(evaluateEquation('x + x', 3)).toBe(6);
      expect(evaluateEquation('x * x', 3)).toBe(9);
      expect(evaluateEquation('x + x * x', 2)).toBe(6);
    });
  });

  describe('unary operators', () => {
    it('handles unary minus', () => {
      expect(evaluateEquation('-x', 5)).toBe(-5);
      expect(evaluateEquation('-x + 2', 5)).toBe(-3);
    });

    it('handles unary plus', () => {
      expect(evaluateEquation('+x', 5)).toBe(5);
      expect(evaluateEquation('+x + 2', 5)).toBe(7);
    });

    it('handles multiple unary operators in complex expressions', () => {
      expect(evaluateEquation('(-x)*(-x)', 3)).toBe(9);
      expect(evaluateEquation('(-x)*(+x)', 3)).toBe(-9);
    });
  });

  describe('parentheses handling', () => {
    it('evaluates simple parenthesized expressions', () => {
      expect(evaluateEquation('(x + 2) * 3', 4)).toBe(18);
      expect(evaluateEquation('3 * (x + 2)', 4)).toBe(18);
    });

    it('evaluates nested parentheses', () => {
      expect(evaluateEquation('(x + (2 * x))', 3)).toBe(9);
      expect(evaluateEquation('((x + 2) * (x + 3))', 2)).toBe(20);
    });

    it('handles unary operators with parentheses', () => {
      expect(evaluateEquation('-(x + 2)', 3)).toBe(-5);
      expect(evaluateEquation('(-x + 2)', 3)).toBe(-1);
    });
  });

  describe('exponentiation', () => {
    it('evaluates simple exponents', () => {
      expect(evaluateEquation('x^2', 3)).toBe(9);
      expect(evaluateEquation('x^3', 2)).toBe(8);
    });

    it('handles negative exponents', () => {
      expect(evaluateEquation('x^-2', 2)).toBe(0.25);
    });

    it('evaluates expressions with multiple exponents', () => {
      expect(evaluateEquation('x^2 + x^3', 2)).toBe(12);
    });

    it('handles unary minus with exponents correctly', () => {
      expect(evaluateEquation('-x^2', 3)).toBe(-9); // Should be -(x^2), not (-x)^2
      expect(evaluateEquation('(-x)^2', 3)).toBe(9);
    });
  });

  describe('complex expressions', () => {
    it('evaluates complex arithmetic combinations', () => {
      expect(evaluateEquation('2*x + 3*x^2 - 4', 2)).toBe(12);
      expect(evaluateEquation('(x + 1)^2 - x^2', 3)).toBe(7);
    });

    it('handles expressions with multiple operations and parentheses', () => {
      expect(evaluateEquation('(2*x + 3)/(x + 1)', 2)).toBe(2.3333333333333335);
      expect(evaluateEquation('(x^2 + 2*x)/(x - 1)', 3)).toBe(7.5);
    });
  });

  describe('whitespace handling', () => {
    it('handles various whitespace patterns', () => {
      expect(evaluateEquation('x+2', 3)).toBe(5);
      expect(evaluateEquation(' x + 2 ', 3)).toBe(5);
      expect(evaluateEquation('x    +   2', 3)).toBe(5);
    });
  });

  describe('error handling', () => {
    it('throws error for invalid equations', () => {
      expect(() => evaluateEquation('x + ', 3)).toThrow();
      expect(() => evaluateEquation('x * * 2', 3)).toThrow();
      expect(() => evaluateEquation('(x + 2', 3)).toThrow();
      expect(() => evaluateEquation('x + 2)', 3)).toThrow();
    });

    it('throws error for division by zero', () => {
      expect(() => evaluateEquation('x/0', 3)).toThrow();
      expect(() => evaluateEquation('1/(x-3)', 3)).toThrow();
    });
  });

  describe('implicit multiplication', () => {
    it('handles implicit multiplication with numbers', () => {
      expect(evaluateEquation('2x', 3)).toBe(6);
      expect(evaluateEquation('2x + 3x', 2)).toBe(10);
    });

    it('handles implicit multiplication with parentheses', () => {
      expect(evaluateEquation('2(x + 1)', 3)).toBe(8);
      expect(evaluateEquation('(x + 1)(x + 2)', 2)).toBe(12);
    });
  });
});