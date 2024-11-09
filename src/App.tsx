import React from 'react';
import './App.css';
import FunctionChainManager from './FunctionChainCalculator';

function App() {
  return (
    <div className="min-h-screen w-full bg-[#f7f7f7] relative">
      {/* Dotted background overlay */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          backgroundImage: `radial-gradient(#ededed 2px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      />
      
      {/* Content container */}
      <div className="relative z-10">
        <FunctionChainManager />
      </div>
    </div>
  );
}

export default App;
