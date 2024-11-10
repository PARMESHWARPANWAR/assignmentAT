import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import OutputBox from '../OutputBox';
import '@testing-library/jest-dom';

describe('OutputBox', () => {
    const defaultProps = {
      value: 42,
      position: { x: 200, y: 200 },
    };
  
    it('renders with correct value', () => {
      render(<OutputBox {...defaultProps} />);
      expect(screen.getByText('42')).toBeInTheDocument();
    });
  
    it('positions correctly based on provided coordinates', () => {
      render(<OutputBox {...defaultProps} />);
      const container = screen.getByText('Final Output y').parentElement;
      expect(container).toHaveStyle({
        left: '200px',
        top: '200px',
      });
    });
  
    it('contains a ConnectionPoint with correct props', () => {
      render(<OutputBox {...defaultProps} />);
      const connectionPoint = document.getElementById('out-input');
      expect(connectionPoint).toBeInTheDocument();
    });
});