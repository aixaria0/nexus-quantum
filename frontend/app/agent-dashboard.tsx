'use client';
import React, { useState } from 'react';
import { useAgentVQE } from './context/AgentVQEContext';
import ChimeraCognitionPanel from './components/agent/ChimeraCognitionPanel';
import QLFNullConeBoundary from './components/agent/QLFNullConeBoundary';
import EnergyTopologyPanel from './components/agent/EnergyTopologyPanel';
import HardwareZNEPanel from './components/agent/HardwareZNEPanel';
import AgentHeader from './components/agent/AgentHeader';

export default function AgentVQEDashboard() {
  const { isConnected, isOptimizing, startOptimization, stopOptimization } = useAgentVQE();

  return (
    <div className="quantum-grid min-h-screen">
      <AgentHeader isConnected={isConnected} isOptimizing={isOptimizing} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Control Panel */}
        <div className="mb-8 panel glow-agent">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-purple-400 mb-2">🤖 Agent-Driven VQE Optimizer</h2>
              <p className="text-sm text-gray-300">Gemini 1.5 Pro + Lean 4 Formal Verification</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={startOptimization}
                disabled={isOptimizing}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-all disabled:opacity-50"
              >
                {isOptimizing ? '⏸ Running' : '▶ Start Optimization'}
              </button>
              <button
                onClick={stopOptimization}
                disabled={!isOptimizing}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-all disabled:opacity-50"
              >
                ⏹ Stop
              </button>
            </div>
          </div>
        </div>

        {/* 4-Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Panel 1: Chimera Cognition */}
          <div>
            <ChimeraCognitionPanel />
          </div>

          {/* Panel 2: QLF Null-Cone Boundary */}
          <div>
            <QLFNullConeBoundary />
          </div>

          {/* Panel 3: Energy Topology */}
          <div>
            <EnergyTopologyPanel />
          </div>

          {/* Panel 4: Hardware ZNE */}
          <div>
            <HardwareZNEPanel />
          </div>
        </div>
      </main>

      <footer className="border-t border-quantum-accent/20 mt-16 py-6 text-center text-xs text-gray-500">
        <p>Nexus Quantum | Agent-VQE with Formal Verification</p>
        <p className="text-purple-400 mt-2">Hard-stop constraints armed. Hallucination rejection active.</p>
      </footer>
    </div>
  );
}