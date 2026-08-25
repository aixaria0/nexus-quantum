'use client';
import React from 'react';
import { useAgentVQE } from '../../context/AgentVQEContext';

const HardwareZNEPanel: React.FC = () => {
  const { currentPacket } = useAgentVQE();
  const data = currentPacket?.hardware_zne;

  if (!data) {
    return (
      <div className="panel glow-warning h-full flex items-center justify-center">
        <p className="text-gray-400">Waiting for ZNE metrics...</p>
      </div>
    );
  }

  return (
    <div className="panel glow-warning h-full">
      <div className="panel-header text-orange-400">
        <span>🛡️</span>
        <span className="panel-title">Hardware ZNE Mitigation</span>
        <span className="ml-auto text-xs status-live" />
      </div>

      <div className="space-y-4">
        {/* Best Fold Factor */}
        <div className="bg-orange-900/20 rounded p-3 border border-orange-500/20">
          <p className="text-xs text-gray-400 mb-1">Optimal Fold Factor</p>
          <p className="text-3xl font-bold text-orange-400">{data.best_fold}×</p>
          <p className="text-xs text-gray-500 mt-1">Noise scaling factor</p>
        </div>

        {/* ZNE Metrics */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-orange-300">FOLD FACTOR ANALYSIS:</p>
          <div className="space-y-2">
            {data.zne_metrics.map((metric: any, idx: number) => (
              <div
                key={idx}
                className={`rounded p-3 border transition-all ${
                  metric.fold_factor === data.best_fold
                    ? 'bg-orange-900/30 border-orange-500/30'
                    : 'bg-gray-900/30 border-gray-500/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-mono">
                    λ = {metric.fold_factor}× {metric.fold_factor === data.best_fold && '⭐'}
                  </span>
                  <span className="text-xs text-gray-400">
                    +{(metric.improvement * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-gray-400">Fidelity:</span>
                  <div className="flex-1 h-2 bg-gray-900 rounded overflow-hidden border border-orange-500/20">
                    <div
                      className="h-full bg-gradient-to-r from-orange-600 to-orange-400"
                      style={{ width: `${metric.mitigated_fidelity * 100}%` }}
                    />
                  </div>
                  <span className="text-orange-400 font-mono w-12 text-right">
                    {(metric.mitigated_fidelity * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mitigation Strategy */}
        <div className="bg-orange-900/20 rounded p-3 border border-orange-500/20 text-xs space-y-1">
          <p className="font-semibold text-orange-300 mb-2">STRATEGY:</p>
          <p className="text-gray-300">
            ZNE with fold factor {data.best_fold}× achieves optimal error mitigation through
            unitary folding and linear extrapolation to zero noise.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HardwareZNEPanel;