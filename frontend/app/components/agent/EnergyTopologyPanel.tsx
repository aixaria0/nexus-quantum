'use client';
import React from 'react';
import { useAgentVQE } from '../../context/AgentVQEContext';

const EnergyTopologyPanel: React.FC = () => {
  const { currentPacket } = useAgentVQE();
  const data = currentPacket?.energy_topology;

  if (!data) {
    return (
      <div className="panel glow-accent h-full flex items-center justify-center">
        <p className="text-gray-400">Waiting for energy data...</p>
      </div>
    );
  }

  const convergenceData = data.convergence_history || [];
  const minEnergy = convergenceData.length > 0 ? Math.min(...convergenceData) : 0;
  const maxEnergy = convergenceData.length > 0 ? Math.max(...convergenceData) : 1;
  const energyRange = maxEnergy - minEnergy || 1;

  return (
    <div className="panel glow-accent h-full">
      <div className="panel-header text-green-400">
        <span>⚡</span>
        <span className="panel-title">Energy Topology</span>
        <span className={`ml-auto text-xs ${data.energy_valid ? 'status-live' : 'status-error'}`} />
      </div>

      <div className="space-y-4">
        {/* Current Energy Display */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-green-900/20 rounded p-3 border border-green-500/20">
            <p className="text-xs text-gray-400 mb-1">Current Energy</p>
            <p className="text-2xl font-bold text-green-400">{data.current_energy.toFixed(4)}</p>
            <p className="text-xs text-gray-500 mt-1">Ha</p>
          </div>
          <div className="bg-blue-900/20 rounded p-3 border border-blue-500/20">
            <p className="text-xs text-gray-400 mb-1">Fidelity</p>
            <p className="text-2xl font-bold text-blue-400">{(data.current_fidelity * 100).toFixed(1)}%</p>
            <p className="text-xs text-gray-500 mt-1">State purity</p>
          </div>
        </div>

        {/* Convergence Chart */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-green-300">CONVERGENCE HISTORY:</p>
          <div className="bg-black/30 rounded p-3 border border-green-500/20">
            {convergenceData.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">No convergence data</p>
            ) : (
              <div className="space-y-1">
                {convergenceData.slice(-10).map((energy, idx) => {
                  const normalized = (energy - minEnergy) / energyRange;
                  const barWidth = Math.max(normalized * 100, 5);
                  return (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <span className="text-gray-400 w-8 text-right">Step {idx + 1}</span>
                      <div className="flex-1 h-4 bg-gray-900 rounded overflow-hidden border border-green-500/20">
                        <div
                          className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                      <span className="text-gray-400 w-12 text-right">{energy.toFixed(3)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Validity Checks */}
        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <span className={data.energy_valid ? 'status-live' : 'status-error'} />
            <span className={data.energy_valid ? 'text-green-400' : 'text-red-400'}>
              Energy within bounds: {data.energy_valid ? '✓' : '✗'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={data.fidelity_valid ? 'status-live' : 'status-error'} />
            <span className={data.fidelity_valid ? 'text-green-400' : 'text-red-400'}>
              Fidelity within [0, 1]: {data.fidelity_valid ? '✓' : '✗'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnergyTopologyPanel;