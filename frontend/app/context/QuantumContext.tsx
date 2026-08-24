'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface GateMetric {
  gate_name: string;
  qubit: number;
  fidelity: number;
  error_rate: number;
  duration_ns: number;
  t1_microseconds: number;
  t2_microseconds: number;
  provenance: string;
  confidence: number;
  source: string;
  caveat?: string;
}

interface ZNEResult {
  circuit_type: string;
  num_qubits: number;
  unmitigated_fidelity: number;
  mitigated_fidelity: number;
  improvement_percent: number;
  gate_performance: any[];
  execution_time_ms: number;
  mitigation_overhead_factor: number;
  fold_factor: number;
  timestamp: string;
  is_consistent: boolean;
  lean_proof_hash?: string;
  warnings: string[];
}

interface QuantumContextType {
  metrics: GateMetric[];
  selectedGate: string;
  setSelectedGate: (gate: string) => void;
  zneResult: ZNEResult | null;
  setZNEResult: (result: ZNEResult | null) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  liveMetrics: any[];
  apiUrl: string;
}

const QuantumContext = createContext<QuantumContextType | undefined>(undefined);

export function QuantumProvider({ children }: { children: React.ReactNode }) {
  const [metrics, setMetrics] = useState<GateMetric[]>([]);
  const [selectedGate, setSelectedGate] = useState('CNOT');
  const [zneResult, setZNEResult] = useState<ZNEResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState<any[]>([]);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Fetch gate metrics on gate selection change
  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `${apiUrl}/api/v1/gate-performance`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gate_type: selectedGate, num_qubits: 5 })
          }
        );
        const data = await response.json();
        setMetrics(data.metrics || []);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [selectedGate, apiUrl]);

  // WebSocket connection for live metrics
  useEffect(() => {
    const wsUrl = apiUrl.replace('http', 'ws') + '/ws/live-metrics';
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'gate_metric') {
          setLiveMetrics(prev => [...prev.slice(-29), data]);
        }
      } catch (error) {
        console.error('WebSocket parse error:', error);
      }
    };

    ws.onerror = (error) => console.error('WebSocket error:', error);

    return () => {
      if (ws.readyState === WebSocket.OPEN) ws.close();
    };
  }, [apiUrl]);

  return (
    <QuantumContext.Provider
      value={{
        metrics,
        selectedGate,
        setSelectedGate,
        zneResult,
        setZNEResult,
        isLoading,
        setIsLoading,
        liveMetrics,
        apiUrl
      }}
    >
      {children}
    </QuantumContext.Provider>
  );
}

export function useQuantum() {
  const context = useContext(QuantumContext);
  if (!context) {
    throw new Error('useQuantum must be used within QuantumProvider');
  }
  return context;
}