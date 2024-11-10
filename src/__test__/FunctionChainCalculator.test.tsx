import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FunctionChainManager from '../FunctionChainCalculator';
import '@testing-library/jest-dom';
import { Connection } from '../types';

// Mock child components
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

        // Check if all function cards are rendered
        expect(screen.getByTestId('function-card-1')).toBeInTheDocument();
        expect(screen.getByTestId('function-card-2')).toBeInTheDocument();
        expect(screen.getByTestId('function-card-3')).toBeInTheDocument();
        expect(screen.getByTestId('function-card-4')).toBeInTheDocument();
        expect(screen.getByTestId('function-card-5')).toBeInTheDocument();

        // Check if initial value input and output box are rendered
        expect(screen.getByTestId('initial-value-input')).toBeInTheDocument();
        expect(screen.getByTestId('output-box')).toBeInTheDocument();
        expect(screen.getByTestId('connection-lines')).toBeInTheDocument();
    });

    it('updates initial value and propagates through chain', async () => {
        render(<FunctionChainManager />);

        const initialInput = screen.getByTestId('initial-value-input-field');
        fireEvent.change(initialInput, { target: { value: '4' } });

        await waitFor(() => {
            // Check if the first function card received the new input
            expect(screen.getByTestId('function-card-1')).toHaveTextContent('Input: 4');
        });
    });

    it('handles output propagation through the chain', async () => {
        render(<FunctionChainManager />);

        // Trigger outputs in sequence
        const triggerOutput1 = screen.getByTestId('trigger-output-1');
        fireEvent.click(triggerOutput1);

        await waitFor(() => {
            // Check if next function in chain received the output as input
            expect(screen.getByTestId('function-card-2')).toHaveTextContent('Input: 4');
        });
    });

    // it('updates connections when next function changes', async () => {
    //     const { rerender } = render(<FunctionChainManager />);

    //     // Get the first function card
    //     const card1 = screen.getByTestId('function-card-1');
        
    //     // Find the initial connection
    //     expect(screen.getByTestId('connection-1-output-2-input')).toBeInTheDocument();

    //     // Simulate changing next function
    //     const FunctionCard = require('../FunctionCard').default;
    //     FunctionCard.mockImplementation(({ id, onNextFunctionChange }) => (
    //         <div data-testid={`function-card-${id}`}>
    //             <button 
    //                 onClick={() => onNextFunctionChange(id, 3)}
    //                 data-testid={`change-next-${id}`}
    //             >
    //                 Change Next
    //             </button>
    //         </div>
    //     ));

    //     rerender(<FunctionChainManager />);

    //     const changeNextButton = screen.getByTestId('change-next-1');
    //     fireEvent.click(changeNextButton);

    //     await waitFor(() => {
    //         // Check if new connection is created
    //         expect(screen.getByTestId('connection-1-output-3-input')).toBeInTheDocument();
    //     });
    // });

    // it('calculates final output correctly', async () => {
    //     render(<FunctionChainManager />);

    //     // Simulate chain of calculations
    //     const cards = [1, 2, 4, 5, 3];
    //     for (const id of cards) {
    //         const triggerOutput = screen.getByTestId(`trigger-output-${id}`);
    //         fireEvent.click(triggerOutput);
    //         await waitFor(() => {
    //             if (id === 3) {
    //                 // Check final output
    //                 expect(screen.getByTestId('output-box')).toHaveTextContent('Output: ');
    //             } else {
    //                 // Check next function input
    //                 const nextId = id + 1;
    //                 expect(screen.getByTestId(`function-card-${nextId}`)).toBeInTheDocument();
    //             }
    //         });
    //     }
    // });

    it('maintains correct component positioning', () => {
        render(<FunctionChainManager />);

        // Check InitialValueInput position
        const initialInput = screen.getByTestId('initial-value-input');
        expect(initialInput).toHaveStyle({
            left: '141px',
            top: '335px'
        });

        // Check OutputBox position
        const outputBox = screen.getByTestId('output-box');
        expect(outputBox).toHaveStyle({
            left: '1299px',
            top: '335px'
        });
    });

    // it('handles disconnected function chain gracefully', async () => {
    //     render(<FunctionChainManager />);

    //     // Simulate breaking the chain by setting nextFunId to null
    //     const FunctionCard = require('../FunctionCard').default;
    //     FunctionCard.mockImplementation(({ id, onNextFunctionChange }) => (
    //         <div data-testid={`function-card-${id}`}>
    //             <button 
    //                 onClick={() => onNextFunctionChange(id, null)}
    //                 data-testid={`disconnect-${id}`}
    //             >
    //                 Disconnect
    //             </button>
    //         </div>
    //     ));

    //     const disconnectButton = screen.getByTestId('disconnect-1');
    //     fireEvent.click(disconnectButton);

    //     await waitFor(() => {
    //         // Check if connection to output box is created
    //         expect(screen.getByTestId('connection-1-output-out-input')).toBeInTheDocument();
    //     });
    // });
});