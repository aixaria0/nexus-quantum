'use client';
import React from 'react';

interface AgentHeaderProps {
  isConnected: boolean;
  isOptimizing: boolean;
}

const AgentHeader: React.FC<AgentHeaderProps> = ({ isConnected, isOptimizing }) => {
  return (
    <header className="bg-gradient-to-b from-quantum-surface to-transparent border-b border-quantum-accent/20 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              🔮 Nexus Quantum Agent-VQE
            </h1>
            <p className="text-purple-300/80 text-sm font-medium mt-1">
              Autonomous optimization with formal geometric constraints
            </p>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs">
            <div className={`px-3 py-2 rounded border ${isConnected ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
              <span className={isConnected ? 'status-live' : 'status-error'} />
              <span className="ml-2">{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
            <div className={`px-3 py-2 rounded border ${isOptimizing ? 'bg-purple-500/10 border-purple-500/30 pulse-agent' : 'bg-gray-500/10 border-gray-500/30'}`}>
              <span className="ml-2">{isOptimizing ? '⚡ Optimizing' : '⏸ Idle'}</span>
            </div>
            <div className="bg-cyan-500/10 px-3 py-2 rounded border border-cyan-500/30">
              <span className="text-cyan-400">🔒</span>
              <span className="ml-2">Constraints Active</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AgentHeader;