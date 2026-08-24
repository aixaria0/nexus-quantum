'use client';
import React from 'react';
import { useQuantum } from '../context/QuantumContext';

const LiveMetricsStream: React.FC = () => {
  const { liveMetrics } = useQuantum();

  if (liveMetrics.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin mb-4">
          <div className="w-12 h-12 border-3 border-quantum-accent border-t-transparent rounded-full" />
        </div>
        <p className="text-gray-400">Connecting to real-time stream...</p>
      </div>
    );
  }

  const latest = liveMetrics[liveMetrics.length - 1];

  return (
    <div className="space-y-6">
      {/* Live Indicator */}
      <div className="bg-gradient-to-r from-quantum-accent/20 to-quantum-primary/20 border border-quantum-accent/30 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-3 h-3 bg-quantum-accent rounded-full animate-pulse" />
          <h3 className="text-lg font-semibold text-quantum-accent">Live Quantum Metrics</h3>
        </div>
        <p className="text-sm text-gray-400">Real-time gate performance at 2Hz update rate</p>
      </div>

      {/* Current Gate Info */}
      {latest && (
        <div className="bg-quantum-surface/50 border border-quantum-accent/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-quantum-accent">Current: {latest.current_gate}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {latest.metrics.map((metric: any, idx: number) => (
              <div key={idx} className="bg-quantum-surface/50 rounded-lg p-4 border border-quantum-accent/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-quantum-primary">Qubit {metric.qubit}</span>
                  <span className="text-xs text-quantum-accent px-2 py-1 bg-quantum-accent/10 rounded">{metric.provenance}</span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fidelity</span>
                    <span className="text-quantum-accent font-medium">{(metric.fidelity * 100).toFixed(3)}%</span>
                  </div>
                  <div className="w-full h-2 bg-quantum-surface rounded-full overflow-hidden border border-quantum-accent/20">
                    <div
                      className="h-full bg-quantum-accent transition-all"
                      style={{ width: `${metric.fidelity * 100}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between mt-2">
                    <span className="text-gray-400">Error Rate</span>
                    <span className="text-quantum-error">{(metric.error_rate * 100).toFixed(3)}%</span>
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-2">
                    Source: {metric.source}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metrics Timeline */}
      <div className="bg-quantum-surface/50 border border-quantum-accent/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-quantum-accent">Event Timeline ({liveMetrics.length} events)</h3>
        
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {[...liveMetrics].reverse().map((metric, idx) => (
            <div key={idx} className="text-xs bg-quantum-surface/30 rounded px-3 py-2 border border-quantum-accent/10 font-mono">
              <span className="text-quantum-primary">{metric.current_gate}</span>
              <span className="text-gray-500 ml-2">{new Date(metric.timestamp).toLocaleTimeString()}</span>
              <span className="text-quantum-accent ml-2">Q{metric.metrics[0]?.qubit || '?'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveMetricsStream;