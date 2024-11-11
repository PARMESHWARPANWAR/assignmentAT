import React from 'react';
import { Position } from '../types';
import { ConnectionPoint } from './ConnectionPoint';
  
interface InitialValueInputProps {
    value: number;
    position: Position;
}

const OutputBox: React.FC<InitialValueInputProps> = ({ 
    value, 
    position 
  }) => {
    return (
      <div 
        className="absolute"
        style={{ 
          left: position.x,
          top: position.y
        }}
      >
        <div className="bg-[#4CAF79] text-[#FFFFFF] text-[12px] font-[600] text-center mb-[6px] rounded-[14px] w-[115px] h-[22px]">
          Final Output y
        </div>
      
        <div className="relative bg-white border-[2px] px-4 border-[#2DD179] rounded-[15px] flex items-center justify-between w-[115px] h-[50px]">
           <div className="flex items-center">
           <ConnectionPoint id={`out-input`} type="input" label = {false}/>
          </div>
          <div className="w-[1px] h-[46px] bg-[#C5F2DA] mr-4"></div>
          <span className="text-[18px] font-bold">
            {value}
          </span>
        </div>
      </div>
    );
  };
  
  export default OutputBox;