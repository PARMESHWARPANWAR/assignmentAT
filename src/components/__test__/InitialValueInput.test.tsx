import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import InitialValueInput from '../InitialValueInput';
import '@testing-library/jest-dom';

describe('InitialValueInput', () => {
    const defaultProps = {
      value: 10,
      onChange: jest.fn(),
      position: { x: 100, y: 100 },
    };
  
    it('renders with correct initial value', () => {
      render(<InitialValueInput {...defaultProps} />);
      const input = screen.getByRole('spinbutton') as HTMLInputElement;
      expect(input.value).toBe('10');
    });
  
    it('calls onChange when value is modified', () => {
      render(<InitialValueInput {...defaultProps} />);
      const input = screen.getByRole('spinbutton');
      fireEvent.change(input, { target: { value: '20' } });
      expect(defaultProps.onChange).toHaveBeenCalledWith(20);
    });
  
    it('positions correctly based on provided coordinates', () => {
      render(<InitialValueInput {...defaultProps} />);
      const container = screen.getByText('Initial value of x').parentElement;
      expect(container).toHaveStyle({
        left: '100px',
        top: '100px',
      });
    });
  
    it('contains a ConnectionPoint with correct props', () => {
      render(<InitialValueInput {...defaultProps} />);
      const connectionPoint = document.getElementById('in-input');
      expect(connectionPoint).toBeInTheDocument();
    });
  });