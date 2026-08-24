'use client';
import React from 'react';
import { useQuantum } from '../context/QuantumContext';
import MetricsChart from './MetricsChart';
import ConfidenceIndicator from './ConfidenceIndicator';

const GatePerformancePanel: React.FC = () => {
  const { metrics, selectedGate, setSelectedGate, isLoading } = useQuantum();

  const gates = ['H', 'X', 'RZ', 'CNOT', 'ECR'];
  const avgFidelity = metrics.length > 0
    ? (metrics.reduce((sum, m) => sum + m.fidelity, 0) / metrics.length * 100).toFixed(2)
    : '0.00';

  const maxError = metrics.length > 0
    ? Math.max(...metrics.map(m => m.error_rate)) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-quantum-accent/20 to-transparent border border-quantum-accent/30 rounded-lg p-6 glow-accent">
          <div className="text-sm text-quantum-accent/70 mb-2">Average Fidelity</div>
          <div className="text-3xl font-bold text-quantum-accent">{avgFidelity}%</div>
          <div className="text-xs text-gray-500 mt-2">Across {metrics.length} qubits</div>
        </div>

        <div className="bg-gradient-to-br from-quantum-warning/20 to-transparent border border-quantum-warning/30 rounded-lg p-6 glow-warning">
          <div className="text-sm text-quantum-warning/70 mb-2">Max Error Rate</div>
          <div className="text-3xl font-bold text-quantum-warning">{maxError.toFixed(3)}%</div>
          <div className="text-xs text-gray-500 mt-2">Across all qubits</div>
        </div>

        <div className="bg-gradient-to-br from-quantum-primary/20 to-transparent border border-quantum-primary/30 rounded-lg p-6 glow-accent">
          <div className="text-sm text-quantum-primary/70 mb-2">Source</div>
          <div className="text-sm font-mono text-quantum-primary">IBM Quantum Heron</div>
          <div className="text-xs text-gray-500 mt-2">arxiv:2210.14109</div>
        </div>
      </div>

      {/* Gate Selector */}
      <div className="bg-quantum-surface/50 border border-quantum-accent/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 text-quantum-accent">Select Gate Type</h3>
        <div className="flex flex-wrap gap-3">
          {gates.map((gate) => (
            <button
              key={gate}
              onClick={() => setSelectedGate(gate)}
              disabled={isLoading}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedGate === gate
                  ? 'bg-quantum-accent text-black glow-accent'
                  : 'bg-quantum-surface border border-quantum-accent/30 text-quantum-accent hover:border-quantum-accent'
              } disabled:opacity-50`}
            >
              {gate}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Visualization */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin">
            <div className="w-8 h-8 border-2 border-quantum-accent border-t-transparent rounded-full" />
          </div>
          <p className="text-gray-400 mt-4">Loading gate metrics...</p>
        </div>
      ) : metrics.length > 0 ? (
        <div className="space-y-6">
          <MetricsChart metrics={metrics} />
          
          {/* Detailed Table */}
          <div className="bg-quantum-surface/50 border border-quantum-accent/20 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-quantum-accent/20">
              <h3 className="text-lg font-semibold text-quantum-accent">Detailed Metrics for {selectedGate}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-quantum-accent/10 border-b border-quantum-accent/20">
                  <tr>
                    <th className="px-6 py-3 text-left text-quantum-accent">Qubit</th>
                    <th className="px-6 py-3 text-left text-quantum-accent">Fidelity</th>
                    <th className="px-6 py-3 text-left text-quantum-accent">Error Rate</th>
                    <th className="px-6 py-3 text-left text-quantum-accent">Duration (ns)</th>
                    <th className="px-6 py-3 text-left text-quantum-accent">Provenance</th>
                    <th className="px-6 py-3 text-left text-quantum-accent">Confidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-quantum-accent/10">
                  {metrics.map((metric, idx) => (
                    <tr key={idx} className="hover:bg-quantum-accent/5 transition-colors">
                      <td className="px-6 py-3 font-mono text-quantum-primary">Q{metric.qubit}</td>
                      <td className="px-6 py-3">
                        <span className="text-quantum-accent font-medium">{(metric.fidelity * 100).toFixed(2)}%</span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-quantum-error">{(metric.error_rate * 100).toFixed(3)}%</span>
                      </td>
                      <td className="px-6 py-3 text-gray-300">{metric.duration_ns}</td>
                      <td className="px-6 py-3 text-xs text-gray-400">{metric.provenance}</td>
                      <td className="px-6 py-3">
                        <ConfidenceIndicator confidence={metric.confidence} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <p>No metrics available</p>
        </div>
      )}
    </div>
  );
};

export default GatePerformancePanel;