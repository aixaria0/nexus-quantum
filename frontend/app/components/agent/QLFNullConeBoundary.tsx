'use client';
import React from 'react';
import { useAgentVQE } from '../../context/AgentVQEContext';

const QLFNullConeBoundary: React.FC = () => {
  const { currentPacket } = useAgentVQE();
  const data = currentPacket?.qlf_null_cone_boundary;

  if (!data) {
    return (
      <div className="panel glow-agent h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full" />
          </div>
          <p className="text-gray-400">Loading verification terminal...</p>
        </div>
      </div>
    );
  }

  const isLocked = data.spectral_valid && data.can_execute;

  return (
    <div className={`panel h-full transition-all ${isLocked ? 'glow-success' : 'glow-error'}`}>
      <div className="panel-header text-cyan-400">
        <span>🔒</span>
        <span className="panel-title">QLF Null-Cone Boundary</span>
        <span className={`ml-auto text-xs ${isLocked ? 'status-live' : 'status-error'}`} />
      </div>

      <div className="space-y-4">
        {/* Geometric Lock Status */}
        <div className={`rounded p-4 border transition-all ${
          isLocked
            ? 'bg-green-900/20 border-green-500/30 glow-success'
            : 'bg-red-900/20 border-red-500/30 glow-error'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <span className={isLocked ? 'status-live' : 'status-error'} />
            <span className={`font-bold ${isLocked ? 'text-green-400' : 'text-red-400'}`}>
              {isLocked ? 'GEOMETRIC LOCK: ACTIVE' : 'CONSTRAINT VIOLATION: HALT'}
            </span>
          </div>
          <p className="text-xs text-gray-300">{data.execution_status}</p>
        </div>

        {/* Spectral Mode Status */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-cyan-300">SPECTRAL MODE INVARIANT:</p>
          <div className="bg-cyan-900/20 rounded p-3 text-xs font-mono space-y-1 border border-cyan-500/20">
            <div className="flex justify-between">
              <span>Eigenvalue:</span>
              <span className={data.spectral_valid ? 'text-green-400' : 'text-red-400'}>
                {data.consistency_metric}
              </span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Lean Theorem:</span>
              <span>NullCone_implies_Consistency</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Status:</span>
              <span>{data.spectral_valid ? '✓ Non-zero' : '✗ Collapse'}</span>
            </div>
          </div>
        </div>

        {/* Verification Terminal */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-cyan-300">VERIFICATION LOG:</p>
          <div className="terminal max-h-48">
            {data.recent_violations.length === 0 ? (
              <div className="terminal-line">
                <span className="terminal-prompt">&gt;</span>
                <span className="terminal-success ml-1">✓ No violations. System secure.</span>
              </div>
            ) : (
              data.recent_violations.map((violation: any, idx: number) => (
                <div key={idx} className="terminal-line">
                  <span className="terminal-prompt">&gt;</span>
                  <span className="terminal-error ml-1">VIOLATION: {violation.constraint} = {violation.proposed_value}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Execution Gate */}
        <div className={`rounded p-3 text-center text-sm font-bold ${
          data.can_execute
            ? 'bg-green-900/30 text-green-400 border border-green-500/30'
            : 'bg-red-900/30 text-red-400 border border-red-500/30'
        }`}>
          {data.can_execute ? '✓ EXECUTION GATE: OPEN' : '✗ EXECUTION GATE: CLOSED'}
        </div>
      </div>
    </div>
  );
};

export default QLFNullConeBoundary;