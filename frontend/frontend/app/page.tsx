'use client';
import { useState } from 'react';

export default function NexusQuantum() {
  const [result, setResult] = useState('');
  
  const runZNE = async () => {
    setResult('Executing ZNE on GHZ circuit...');
    // Connect to backend later
    setResult('ZNE Value: \~0.99 (Mitigated Success)');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-10">
      <h1 className="text-5xl font-bold mb-6">Nexus Quantum</h1>
      <p className="text-xl mb-8">Error Mitigation at Scale</p>
      
      <button 
        onClick={runZNE}
        className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-xl text-lg font-medium"
      >
        Run 5-Qubit GHZ with ZNE
      </button>
      
      <div className="mt-8 bg-zinc-900 p-6 rounded-xl font-mono">
        {result}
      </div>
    </div>
  );
}
