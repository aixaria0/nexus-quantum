'use client';
import React from 'react';
import { useAgentVQE } from '../../context/AgentVQEContext';

const ChimeraCognitionPanel: React.FC = () => {
  const { currentPacket } = useAgentVQE();
  const data = currentPacket?.chimera_cognition;

  if (!data) {
    return (
      <div className="panel glow-agent h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin mb-4">
            <div className="w-8 h-8 border-2 border-purple-400 border-t-transparent rounded-full" />
          </div>
          <p className="text-gray-400">Waiting for agent connection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="panel glow-agent h-full">
      <div className="panel-header text-purple-400">
        <span>🧠</span>
        <span className="panel-title">Chimera Cognition</span>
        <span className={`ml-auto text-xs ${data.agent_online ? 'status-live' : 'status-error'}`} />
      </div>

      <div className="space-y-4">
        {/* Iteration Info */}
        <div className="text-xs text-gray-400">
          <span className="text-purple-300 font-mono">Iteration #{data.iteration}</span>
          <span className="ml-2 text-gray-600">|</span>
          <span className="ml-2">{new Date(data.timestamp).toLocaleTimeString()}</span>
        </div>

        {/* Observation Terminal */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-purple-300">OBSERVATION:</p>
          <div className="terminal">
            {data.observation.split('\n').map((line, idx) => (
              <div key={idx} className="terminal-line">
                <span className="terminal-prompt">&gt;</span>
                <span className="ml-1">{line.trim()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* OODA Loop Status */}
        {data.ooda_loop && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-purple-300">OODA LOOP:</p>
            <div className="bg-purple-900/20 rounded p-3 text-xs space-y-2 border border-purple-500/20">
              <div>
                <span className="text-purple-300">ORIENT:</span>
                <p className="text-gray-300 mt-1">{data.ooda_loop.orient_analysis}</p>
              </div>
              <div>
                <span className="text-purple-300">DECIDE:</span>
                <p className="text-gray-300 mt-1">{data.ooda_loop.decide_action}</p>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <span className={data.ooda_loop.all_constraints_satisfied ? 'status-live' : 'status-error'} />
                <span className={data.ooda_loop.all_constraints_satisfied ? 'text-green-400' : 'text-red-400'}>
                  {data.ooda_loop.all_constraints_satisfied ? '✓ All constraints satisfied' : `✗ ${data.ooda_loop.rejection_count} constraint violations`}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChimeraCognitionPanel;