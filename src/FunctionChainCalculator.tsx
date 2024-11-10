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
    const [functionCards, setFunctionCards] = useState([
      {
        id: 1,
        label: 'Function: 1',
        equation: 'x^2',
        nextFunId: 2,
        input: 2,
        position: { x: 265, y: 162 }
      },
      {
        id: 2,
        label: 'Function: 2',
        equation: '2x+4',
        nextFunId: 4,
        input: 0,
        position: { x: 631, y: 162 }
      },
      {
        id: 3,
        label: 'Function: 3',
        equation: 'x^2+20',
        nextFunId: null,
        input: 0,
        position: { x: 989, y: 162 }
      },
      {
        id: 4,
        label: 'Function: 4',
        equation: 'x-2',
        nextFunId: 5,
        input: 0,
        position: { x: 454, y: 520 }
      },
      {
        id: 5,
        label: 'Function: 5',
        equation: 'x/2',
        nextFunId: 3,
        input: 0,
        position: { x: 823, y: 520 }
      }
    ]);
    
    const [connections, setConnections] = useState<Connection[]>([
        { from: 'in-input', to: '1-input' },
        { from: '1-output', to: '2-input' },
        { from: '2-output', to: '4-input' },
        { from: '4-output', to: '5-input' },
        { from: '5-output', to: '3-input' },
        { from: '3-output', to: 'out-input' },
    ]);

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

    // Update connections when nextFunId changes
    const updateConnections = (currentId: number, nextId: number | null) => {
      const newConnections = connections.filter(conn => 
        !conn.from.startsWith(`${currentId}-`) && !conn.to.startsWith(`${currentId}-`)
      );

      if (!newConnections.find(conn => conn.from === 'in-input')) {
        newConnections.push({ from: 'in-input', to: '1-input' });
      }

      if (nextId) {
        newConnections.push({
          from: `${currentId}-output`,
          to: `${nextId}-input`
        });
      }

      if (!nextId) {
        newConnections.push({
          from: `${currentId}-output`,
          to: 'out-input'
        });
      }

      setConnections(newConnections);
    };

    const handleNextFunctionChange = (currentId: number, nextId: number | null) => {
      setFunctionCards(prev => prev.map(card => 
        card.id === currentId 
          ? { ...card, nextFunId: nextId }
          : card
      ));

      updateConnections(currentId, nextId);
    };

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
              availableFunctions={functionCards}
              onNextFunctionChange={handleNextFunctionChange}
              input={inputs[card.id] || card.input}
            />
          ))}
        </div>
      </div>
    );
};

export default FunctionChainManager;