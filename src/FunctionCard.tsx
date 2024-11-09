import React, { useEffect, useState } from 'react';
import { Icon } from './components/Icons';
import { evaluateEquation } from './utils/equationCal';
import { Position } from './types';
import { ConnectionPoint } from './components/ConnectionPoint';

interface FunctionCardProps {
    id: number;
    label: string,
    equation: string;
    nextFunId: number | null,
    input: number;
    output: (val: number, id: number | null) => void;
    position : Position
}

const FunctionCard :React.FC<FunctionCardProps> = ({ 
    id, 
    label, 
    equation, 
    nextFunId, 
    input, 
    output,
    position
  }) => {
    const [newEquation, setNewEquation] = useState(equation);

    const calculateOutput = () => {
      const result = evaluateEquation(newEquation, input);
      output(result, nextFunId);
    };

    useEffect(() => {
      calculateOutput();
    }, [newEquation, input]);

    return (
      <div 
        className="absolute bg-white border border-gray-200 rounded-lg p-4 flex flex-col w-[235px] h-[251px] shadow-sm"
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
        <input
          id={`equation-${id}`}
          type="text"
          value={newEquation}
          onChange={(e) => setNewEquation(e.target.value)}
          placeholder="Enter equation"
          className="border text-xs rounded-lg px-2 py-2 mb-4 h-8"
        />

        <label htmlFor={`nextFunction-${id}`} className="text-gray-800 text-xs font-medium mb-2">
          Next function
        </label>
        <select
          id={`nextFunction-${id}`}
          value="-"
          className="bg-gray-100 text-xs border rounded-lg px-2 py-2 text-gray-600 appearance-none h-8"
          disabled
        >
          <option value={`Function: ${id + 1}`}>
            {nextFunId ? 'Function ' + nextFunId : '-'}
          </option>
        </select>

        <div className="flex justify-between items-center mt-12">
            <ConnectionPoint id={`${id}-input`} type="input" />
            <ConnectionPoint id={`${id}-output`} type="output" />
        </div>
      </div>
    );
  };

export default FunctionCard;