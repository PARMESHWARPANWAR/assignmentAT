import { render } from '@testing-library/react';
import { ConnectionPoint } from '../ConnectionPoint';
import '@testing-library/jest-dom';

describe('ConnectionPoint', () => {
    it('renders input type connection point correctly', () => {
      render(<ConnectionPoint id="test-input" type="input" />);
      const point = document.getElementById('test-input');
      expect(point).toBeInTheDocument();
      expect(point).toHaveClass('mr-auto');
      expect(point).toHaveAttribute('data-connection-point', 'input');
    });
  
    it('renders output type connection point correctly', () => {
      render(<ConnectionPoint id="test-output" type="output" />);
      const point = document.getElementById('test-output');
      expect(point).toBeInTheDocument();
      expect(point).toHaveClass('ml-auto');
      expect(point).toHaveAttribute('data-connection-point', 'output');
    });
});