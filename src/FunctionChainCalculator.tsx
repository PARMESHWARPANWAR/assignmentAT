import React, { useEffect, useState } from 'react';
import FunctionCard from './FunctionCard';
import { Connection, Position } from './types';
import InitialValueInput from './components/InitialValueInput';
import OutputBox from './components/OutputBox';
import { ConnectionLines } from './components/ConnectionLines';

const FunctionChainManager = () => {
    const [initialX, setInitialX] = useState(2);
    const [inputs, setInputs] = useState<{ [key: number]: number }>({});
    const [finalY, setFinalY] = useState(0);
  
    const handleOutput = (val: number, id: number | null) => {
      if (id) {
        setInputs(prev => ({
          ...prev,
          [id]: !Number.isNaN(val) ? val : 0
        }));
      } else {
        setFinalY(val || 0);
      }
    };
  
    useEffect(() => {
      setInputs(prev => ({
        ...prev,
        1: initialX
      }));
    }, [initialX]);
  
    const cardPositions:{[key:number]:Position} = {
      1: { x: 265, y: 162 },    
      2: { x: 631, y: 162 },   
      3: { x: 989, y: 162 },     
      4: { x: 454, y: 520 },
      5: { x: 823, y: 520 } 
     
    };

    const connections: Connection[] = [
        { from: 'in-input', to: '1-input' },
        { from: '1-output', to: '2-input' },
        { from: '2-output', to: '4-input' },
        { from: '4-output', to: '5-input' },
        { from: '5-output', to: '3-input' },
        { from: '3-output', to: 'out-input' },
    ];
  
    const functionCards = [
      {
        id: 1,
        label: 'Function: 1',
        equation: 'x^2',
        nextFunId: 2,
        input: inputs[1] || initialX,
        position: cardPositions[1]
      },
      {
        id: 2,
        label: 'Function: 2',
        equation: '2x+4',
        nextFunId: 4,
        input: inputs[2] || 0,
        position: cardPositions[2]
      },
      {
        id: 3,
        label: 'Function: 3',
        equation: 'x^2+20',
        nextFunId: null,
        input: inputs[3] || 0,
        position: cardPositions[3]
      },
      {
        id: 4,
        label: 'Function: 4',
        equation: 'x-2',
        nextFunId: 5,
        input: inputs[4] || 0,
        position: cardPositions[4]
      },
      {
        id: 5,
        label: 'Function: 5',
        equation: 'x/2',
        nextFunId: 3,
        input: inputs[5] || 0,
        position: cardPositions[5]
      }
    ];
  
    return (
      <div className="relative w-full h-screen">
        <ConnectionLines connections={connections} />
        <InitialValueInput 
            value={initialX}
            onChange={setInitialX}
            position={{ x: 141, y: 335 }} 
        />
        <OutputBox
           value={finalY}
           position={{ x: 1299, y: 335 }} 
        /> 
        <div className="relative h-[800px]">
          {functionCards.map((card) => (
            <FunctionCard
              key={card.id}
              {...card}
              output={handleOutput}
            />
          ))}
        </div>
      </div>
    );
};

export default FunctionChainManager;