'use client';
import React, { useState } from 'react';
import { useQuantum } from '../context/QuantumContext';

const ZNEDashboard: React.FC = () => {
  const { apiUrl, setZNEResult, setIsLoading } = useQuantum();
  const [numQubits, setNumQubits] = useState(5);
  const [circuitType, setCircuitType] = useState('GHZ');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [wsProgress, setWsProgress] = useState<any[]>([]);

  const runZNEAnalysis = async () => {
    setLoading(true);
    setWsProgress([]);

    // Connect to WebSocket for progress updates
    const wsUrl = apiUrl.replace('http', 'ws') + '/ws/zne-simulation';
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ num_qubits: numQubits, circuit_type: circuitType }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'zne_progress') {
          setWsProgress(prev => [...prev, data]);
        } else if (data.type === 'zne_complete') {
          setResult(data.result);
          setZNEResult(data.result);
          setLoading(false);
        }
      } catch (error) {
        console.error('Parse error:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setLoading(false);
    };
  };

  return (
    <div className="space-y-6">
      {/* Configuration Panel */}
      <div className="bg-quantum-surface/50 border border-quantum-accent/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-6 text-quantum-accent">ZNE Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-quantum-accent mb-2">Number of Qubits</label>
            <input
              type="range"
              min="1"
              max="15"
              value={numQubits}
              onChange={(e) => setNumQubits(parseInt(e.target.value))}
              className="w-full accent-quantum-accent"
            />
            <div className="text-center mt-2 text-2xl font-bold text-quantum-primary">{numQubits}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-quantum-accent mb-2">Circuit Type</label>
            <select
              value={circuitType}
              onChange={(e) => setCircuitType(e.target.value)}
              className="w-full bg-quantum-surface border border-quantum-accent/30 rounded px-3 py-2 text-white focus:border-quantum-accent focus:outline-none"
            >
              <option value="GHZ">GHZ State</option>
              <option value="Parametric">Parametric</option>
            </select>
          </div>
        </div>

        <button
          onClick={runZNEAnalysis}
          disabled={loading}
          className="w-full bg-gradient-to-r from-quantum-accent to-quantum-primary text-black font-bold py-3 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed glow-accent"
        >
          {loading ? '🔄 Analyzing...' : '▶ Run ZNE Analysis'}
        </button>
      </div>

      {/* Progress */}
      {wsProgress.length > 0 && (
        <div className="bg-quantum-surface/50 border border-quantum-primary/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-quantum-primary">Mitigation Progress</h3>
          <div className="space-y-3">
            {wsProgress.map((progress, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm">Fold Factor: {progress.fold_factor}×</span>
                <div className="flex-1 mx-4 h-2 bg-quantum-surface rounded-full overflow-hidden border border-quantum-primary/20">
                  <div
                    className="h-full bg-quantum-primary transition-all"
                    style={{ width: `${(progress.fidelity_estimate || 0) * 100}%` }}
                  />
                </div>
                <span className="text-sm font-mono text-quantum-primary">{(progress.fidelity_estimate * 100).toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-quantum-error/20 to-transparent border border-quantum-error/30 rounded-lg p-6 glow-error">
            <div className="text-sm text-quantum-error/70 mb-2">Unmitigated Fidelity</div>
            <div className="text-3xl font-bold text-quantum-error">{(result.unmitigated_fidelity * 100).toFixed(2)}%</div>
          </div>

          <div className="bg-gradient-to-br from-quantum-accent/20 to-transparent border border-quantum-accent/30 rounded-lg p-6 glow-accent animate-glow-pulse">
            <div className="text-sm text-quantum-accent/70 mb-2">Mitigated Fidelity</div>
            <div className="text-3xl font-bold text-quantum-accent">{(result.mitigated_fidelity * 100).toFixed(2)}%</div>
          </div>

          <div className="bg-gradient-to-br from-quantum-success/20 to-transparent border border-quantum-success/30 rounded-lg p-6 glow-accent">
            <div className="text-sm text-quantum-success/70 mb-2">Improvement</div>
            <div className="text-3xl font-bold text-quantum-success">+{result.improvement_percent.toFixed(1)}%</div>
          </div>
        </div>
      )}

      {/* Detailed Results */}
      {result && (
        <div className="bg-quantum-surface/50 border border-quantum-accent/20 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-quantum-accent">Analysis Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">Execution Time</p>
              <p className="text-lg font-mono text-quantum-primary">{result.execution_time_ms}ms</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Mitigation Overhead</p>
              <p className="text-lg font-mono text-quantum-primary">{result.mitigation_overhead_factor}×</p>
            </div>
          </div>

          {result.warnings && result.warnings.length > 0 && (
            <div className="bg-quantum-warning/10 border border-quantum-warning/30 rounded p-4">
              <h4 className="text-sm font-semibold text-quantum-warning mb-2">⚠️ Warnings</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                {result.warnings.map((warning: string, idx: number) => (
                  <li key={idx}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}

          {result.lean_proof_hash && (
            <div className="mt-4 bg-quantum-primary/10 border border-quantum-primary/30 rounded p-4">
              <p className="text-xs font-mono text-quantum-primary">✓ Formally Verified: {result.lean_proof_hash}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ZNEDashboard;