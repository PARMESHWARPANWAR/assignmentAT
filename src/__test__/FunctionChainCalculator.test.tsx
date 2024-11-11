import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FunctionChainManager from '../FunctionChainCalculator';
import '@testing-library/jest-dom';
import { Connection } from '../types';

jest.mock('../FunctionCard', () => {
    return jest.fn(({ id, label, equation, input, output }) => (
        <div data-testid={`function-card-${id}`}>
            <div>{label}</div>
            <div>Equation: {equation}</div>
            <div>Input: {input}</div>
            <button 
                data-testid={`trigger-output-${id}`} 
                onClick={() => output(input * 2, id + 1)}
            >
                Trigger Output
            </button>
        </div>
    ));
});

jest.mock('../components/InitialValueInput', () => {
    return jest.fn(({ value, onChange, position }) => (
        <div data-testid="initial-value-input" style={{ position: 'absolute', left: position.x, top: position.y }}>
            <input 
                type="number" 
                value={value} 
                onChange={(e) => onChange(Number(e.target.value))}
                data-testid="initial-value-input-field"
            />
        </div>
    ));
});

jest.mock('../components/OutputBox', () => {
    return jest.fn(({ value, position }) => (
        <div data-testid="output-box" style={{ position: 'absolute', left: position.x, top: position.y }}>
            Output: {value}
        </div>
    ));
});

jest.mock('../components/ConnectionLines', () => ({
    ConnectionLines: jest.fn(({ connections }) => (
        <div data-testid="connection-lines">
            {connections.map((conn:Connection, index:number) => (
                <div key={index} data-testid={`connection-${conn.from}-${conn.to}`}>
                    {conn.from} → {conn.to}
                </div>
            ))}
        </div>
    ))
}));

describe('FunctionChainManager', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders all initial components', () => {
        render(<FunctionChainManager />);

        expect(screen.getByTestId('function-card-1')).toBeInTheDocument();
        expect(screen.getByTestId('function-card-2')).toBeInTheDocument();
        expect(screen.getByTestId('function-card-3')).toBeInTheDocument();
        expect(screen.getByTestId('function-card-4')).toBeInTheDocument();
        expect(screen.getByTestId('function-card-5')).toBeInTheDocument();

        expect(screen.getByTestId('initial-value-input')).toBeInTheDocument();
        expect(screen.getByTestId('output-box')).toBeInTheDocument();
        expect(screen.getByTestId('connection-lines')).toBeInTheDocument();
    });

    it('updates initial value and propagates through chain', async () => {
        render(<FunctionChainManager />);

        const initialInput = screen.getByTestId('initial-value-input-field');
        fireEvent.change(initialInput, { target: { value: '4' } });

        await waitFor(() => {
            expect(screen.getByTestId('function-card-1')).toHaveTextContent('Input: 4');
        });
    });

    it('handles output propagation through the chain', async () => {
        render(<FunctionChainManager />);

        const triggerOutput1 = screen.getByTestId('trigger-output-1');
        fireEvent.click(triggerOutput1);

        await waitFor(() => {
            expect(screen.getByTestId('function-card-2')).toHaveTextContent('Input: 4');
        });
    });

    it('maintains correct component positioning', () => {
        render(<FunctionChainManager />);

        const initialInput = screen.getByTestId('initial-value-input');
        expect(initialInput).toHaveStyle({
            left: '141px',
            top: '335px'
        });

        const outputBox = screen.getByTestId('output-box');
        expect(outputBox).toHaveStyle({
            left: '1239px',
            top: '335px'
        });
    });
});