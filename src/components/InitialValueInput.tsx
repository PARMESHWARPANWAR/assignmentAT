import React from 'react';
import { Position } from '../types';
import { ConnectionPoint } from './ConnectionPoint';
  
interface InitialValueInputProps {
    value: number;
    onChange: (value: number) => void;
    position: Position;
}

const InitialValueInput: React.FC<InitialValueInputProps> = ({ 
    value, 
    onChange, 
    position 
  }) => {
    return (
      <div 
        className="absolute z-10"
        style={{ 
          left: position.x,
          top: position.y
        }}
      >
        <div className="bg-[#E29A2D] text-[#FFFFFF] text-[12px] font-[600] text-center mb-[6px] rounded-[14px] w-[115px] h-[22px]">
          Initial value of x
        </div>
        
        <div className="relative bg-white border-[2px] px-1 pr-2 border-[#FFC267] rounded-[15px] flex items-center justify-between w-[115px] h-[50px]">
          <input type='number' value={value} onChange={(e)=>onChange(Number(e.target.value))} className='pl-2 text-[18px] font-bold w-[50px]'/> 
          <div className="w-[1px] h-[46px] bg-[#FFEED5] mr-2"></div>
          <div className="flex items-center">
            <ConnectionPoint id={'in-input'} type="output" label = {false} />
          </div>
        </div>
      </div>
    );
  };
  
  export default InitialValueInput;