import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FunctionCard from '../FunctionCard';
import { evaluateEquation } from '../utils/evaluateEquation';
import '@testing-library/jest-dom';

jest.mock('../utils/evaluateEquation');
jest.mock('lucide-react', () => ({
    ChevronDown: () => <div data-testid="chevron-down">ChevronDown</div>
}));
jest.mock('../components/Icons', () => ({
    Icon: () => <div data-testid="function-icon">Icon</div>
}));
jest.mock('../components/ConnectionPoint', () => ({
    ConnectionPoint: ({ id, type }: { id: string; type: string }) => (
        <div data-testid={`connection-point-${type}`}>{id}</div>
    )
}));

describe('FunctionCard', () => {
    const defaultProps = {
        id: 1,
        label: 'Test Function',
        equation: 'x + 1',
        nextFunId: null,
        input: 5,
        output: jest.fn(),
        position: { x: 100, y: 100 },
        availableFunctions: [
            { id: 2, label: 'Function 2', equation: 'x * 2', nextFunId: null, input: 0, position: { x: 200, y: 200 } },
            { id: 3, label: 'Function 3', equation: 'x - 1', nextFunId: null, input: 0, position: { x: 300, y: 300 } }
        ],
        onNextFunctionChange: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (evaluateEquation as jest.Mock).mockReturnValue(6);
    });

    it('renders with correct initial values', () => {
        render(<FunctionCard {...defaultProps} />);

        expect(screen.getByText('Test Function')).toBeInTheDocument();
        expect(screen.getByDisplayValue('x + 1')).toBeInTheDocument();
        expect(screen.getByTestId('function-icon')).toBeInTheDocument();
        expect(screen.getByTestId('connection-point-input')).toBeInTheDocument();
        expect(screen.getByTestId('connection-point-output')).toBeInTheDocument();
    });

    it('validates equation correctly - invalid characters', async () => {
        render(<FunctionCard {...defaultProps} />);
        
        const equationInput = screen.getByPlaceholderText('Enter equation');
        fireEvent.change(equationInput, { target: { value: 'x + @' } });

        await waitFor(() => {
            expect(screen.getByText('Only numbers, x, and basic operators (+,-,*,/,^) are allowed')).toBeInTheDocument();
        });
    });

    it('validates equation correctly - consecutive operators', async () => {
        render(<FunctionCard {...defaultProps} />);
        
        const equationInput = screen.getByPlaceholderText('Enter equation');
        fireEvent.change(equationInput, { target: { value: 'x ++1' } });

        await waitFor(() => {
            expect(screen.getByText('Consecutive operators are not allowed')).toBeInTheDocument();
        });
    });

    it('validates equation correctly - unbalanced parentheses', async () => {
        render(<FunctionCard {...defaultProps} />);
        
        const equationInput = screen.getByPlaceholderText('Enter equation');
        fireEvent.change(equationInput, { target: { value: '(x + 1' } });

        await waitFor(() => {
            expect(screen.getByText('Unbalanced parentheses')).toBeInTheDocument();
        });
    });

    it('validates equation correctly - invalid start', async () => {
        render(<FunctionCard {...defaultProps} />);
        
        const equationInput = screen.getByPlaceholderText('Enter equation');
        fireEvent.change(equationInput, { target: { value: '*x + 1' } });

        await waitFor(() => {
            expect(screen.getByText('Equation cannot start with an operator (except - and +)')).toBeInTheDocument();
        });
    });

    it('validates equation correctly - invalid end', async () => {
        render(<FunctionCard {...defaultProps} />);
        
        const equationInput = screen.getByPlaceholderText('Enter equation');
        fireEvent.change(equationInput, { target: { value: 'x + ' } });

        await waitFor(() => {
            expect(screen.getByText('Equation cannot end with an operator')).toBeInTheDocument();
        });
    });

    it('calculates output when equation changes', async () => {
        render(<FunctionCard {...defaultProps} />);
        
        const equationInput = screen.getByPlaceholderText('Enter equation');
        fireEvent.change(equationInput, { target: { value: 'x * 2' } });

        await waitFor(() => {
            expect(evaluateEquation).toHaveBeenCalledWith('x * 2', 5);
            expect(defaultProps.output).toHaveBeenCalledWith(6, null);
        });
    });

    it('calculates output when input changes', () => {
        render(<FunctionCard {...defaultProps} />);
        
        expect(evaluateEquation).toHaveBeenCalledWith('x + 1', 5);
        expect(defaultProps.output).toHaveBeenCalledWith(6, null);
    });

    it('positions the card correctly', () => {
        const { container } = render(<FunctionCard {...defaultProps} />);
        
        const card = container.firstChild as HTMLElement;
        expect(card).toHaveStyle({
            left: '100px',
            top: '100px'
        });
    });

    it('displays next function options correctly', () => {
        render(<FunctionCard {...defaultProps} />);
        
        const select = screen.getByRole('combobox');
        expect(select).toBeDisabled();
        expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('handles next function change correctly', () => {
        render(<FunctionCard {...defaultProps} />);
        
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: '2' } });
        
        expect(defaultProps.onNextFunctionChange).toHaveBeenCalledWith(1, 2);
    });
});