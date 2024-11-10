import React, { useEffect, useState, useMemo } from 'react';
import { Icon } from './components/Icons';
import { ChevronDown } from 'lucide-react';
import { evaluateEquation } from './utils/equationCal';
import { Position } from './types';
import { ConnectionPoint } from './components/ConnectionPoint';

interface FunctionCard {
    id: number;
    label: string;
    equation: string;
    nextFunId: number | null;
    input: number;
    position: Position;
}

interface FunctionCardProps {
    id: number;
    label: string;
    equation: string;
    nextFunId: number | null;
    input: number;
    output: (val: number, id: number | null) => void;
    position: Position;
    availableFunctions: FunctionCard[];
    onNextFunctionChange: (currentId: number, nextId: number | null) => void;
}

const FunctionCard: React.FC<FunctionCardProps> = ({ 
    id, 
    label, 
    equation, 
    nextFunId, 
    input, 
    output,
    position,
    availableFunctions,
    onNextFunctionChange
}) => {
    const [newEquation, setNewEquation] = useState(equation);
    const [error, setError] = useState<string>('');
    
    const functionOptions = useMemo(() => {
        return availableFunctions
            .filter(func => func.id !== id)
            .sort((a, b) => a.id - b.id);
    }, [availableFunctions, id]);

    const validateEquation = (eq: string): boolean => {
        // Remove all whitespace
        const cleanEquation = eq.replace(/\s/g, '');
        
        // Check if equation only contains valid characters
        const validCharsRegex = /^[0-9x+\-*/^().]+$/;
        if (!validCharsRegex.test(cleanEquation)) {
            setError('Only numbers, x, and basic operators (+,-,*,/,^) are allowed');
            return false;
        }

        // Check for valid operator usage
        const operatorRegex = /[\+\-\*\/\^]/g;
        const operators = cleanEquation.match(operatorRegex);
        
        if (operators) {
            // Check for consecutive operators
            const consecutiveOperators = /[\+\-\*\/\^]{2,}/;
            if (consecutiveOperators.test(cleanEquation)) {
                setError('Consecutive operators are not allowed');
                return false;
            }
        }

        // Check for balanced parentheses
        const openParens = (cleanEquation.match(/\(/g) || []).length;
        const closeParens = (cleanEquation.match(/\)/g) || []).length;
        if (openParens !== closeParens) {
            setError('Unbalanced parentheses');
            return false;
        }

        // Check if equation starts with an operator
        if (/^[\+\*\/\^]/.test(cleanEquation)) {
            setError('Equation cannot start with an operator (except minus)');
            return false;
        }

        // Check if equation ends with an operator
        if (/[\+\-\*\/\^]$/.test(cleanEquation)) {
            setError('Equation cannot end with an operator');
            return false;
        }

        setError('');
        return true;
    };

    const calculateOutput = () => {
        if (validateEquation(newEquation)) {
            const result = evaluateEquation(newEquation, input);
            output(result, nextFunId);
        }
    };

    useEffect(() => {
        calculateOutput();
    }, [newEquation, input]);

    const handleEquationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewEquation(value);
        validateEquation(value);
    };

    const handleNextFunctionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const nextId = value === '-' ? null : Number(value);
        onNextFunctionChange(id, nextId);
    };

    return (
        <div 
            className="absolute bg-white border border-[#DFDFDF] rounded-[15px] p-4 flex flex-col w-[235px] h-[251px] shadow-sm"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`
            }}
        >
            <div className="flex mb-2 h-fit items-center">
                <Icon />
                <span className="text-gray-400 text-sm font-medium ml-2">{label}</span>
            </div>

            <label htmlFor={`equation-${id}`} className="text-gray-800 text-xs font-medium mb-2">
                Equation
            </label>
            <div className="flex flex-col gap-1">
                <input
                    id={`equation-${id}`}
                    type="text"
                    value={newEquation}
                    onChange={handleEquationChange}
                    placeholder="Enter equation"
                    className={`border text-xs rounded-lg px-2 py-2 h-8 ${error ? 'border-red-500' : 'border-[#D3D3D3]'}`}
                />
                {error && (
                    <span className="text-red-500 text-xs">{error}</span>
                )}
            </div>

            <label htmlFor={`nextFunction-${id}`} className="text-gray-800 text-xs font-medium mb-2 mt-2">
                Next function
            </label>
            <div className="relative">
                <select
                    id={`nextFunction-${id}`}
                    value={nextFunId || '-'}
                    disabled={true}
                    onChange={handleNextFunctionChange}
                    className="bg-[#F5F5F5] text-xs border border-[#D3D3D3] rounded-lg px-2 py-2 text-gray-600 h-8 w-full cursor-pointer appearance-none"
                >
                    <option value="-">-</option>
                    {functionOptions.map((func) => (
                        <option key={func.id} value={func.id}>
                            {func.label}
                        </option>
                    ))}
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                    <ChevronDown size={14} className='text-[#b8bbc2]'/>
                </div>
            </div>

            <div className="flex justify-between items-center mt-12">
                <ConnectionPoint id={`${id}-input`} type="input" />
                <ConnectionPoint id={`${id}-output`} type="output" />
            </div>
        </div>
    );
};

export default FunctionCard;