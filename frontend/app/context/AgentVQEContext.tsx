'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface ChimeraCognition {
  iteration: number;
  timestamp: string;
  observation: string;
  ooda_loop: any;
  agent_online: boolean;
}

interface QLFNullCone {
  type: string;
  iteration: number;
  timestamp: string;
  spectral_eigenvalue: number;
  spectral_valid: boolean;
  consistency_metric: string;
  geometric_lock_active: boolean;
  recent_violations: any[];
  execution_status: string;
  can_execute: boolean;
}

interface EnergyTopology {
  type: string;
  iteration: number;
  timestamp: string;
  current_energy: number;
  current_fidelity: number;
  convergence_history: number[];
  energy_valid: boolean;
  fidelity_valid: boolean;
}

interface HardwareZNE {
  type: string;
  iteration: number;
  timestamp: string;
  zne_metrics: any[];
  best_fold: number;
}

interface StreamPacket {
  stream_iteration: number;
  timestamp: string;
  chimera_cognition: ChimeraCognition;
  qlf_null_cone_boundary: QLFNullCone;
  energy_topology: EnergyTopology;
  hardware_zne: HardwareZNE;
  vqe_state: any;
}

interface AgentVQEContextType {
  currentPacket: StreamPacket | null;
  isConnected: boolean;
  apiUrl: string;
  startOptimization: () => Promise<void>;
  stopOptimization: () => Promise<void>;
  isOptimizing: boolean;
}

const AgentVQEContext = createContext<AgentVQEContextType | undefined>(undefined);

export function AgentVQEProvider({ children }: { children: React.ReactNode }) {
  const [currentPacket, setCurrentPacket] = useState<StreamPacket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // WebSocket connection for streaming pipeline
  useEffect(() => {
    const wsUrl = apiUrl.replace('http', 'ws') + '/ws/agent-vqe-pipeline';
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      setIsConnected(true);
      console.log('Connected to Agent-VQE pipeline');
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'connection_established') {
          console.log(data.message);
        } else if (data.stream_iteration !== undefined) {
          setCurrentPacket(data as StreamPacket);
        }
      } catch (error) {
        console.error('WebSocket parse error:', error);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    };

    ws.onclose = () => {
      setIsConnected(false);
      console.log('Disconnected from Agent-VQE pipeline');
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) ws.close();
    };
  }, [apiUrl]);

  const startOptimization = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/start-optimization`, {
        method: 'POST',
      });
      if (response.ok) {
        setIsOptimizing(true);
      }
    } catch (error) {
      console.error('Failed to start optimization:', error);
    }
  };

  const stopOptimization = async () => {
    try {
      const response = await fetch(`${apiUrl}/api/v1/stop-optimization`, {
        method: 'POST',
      });
      if (response.ok) {
        setIsOptimizing(false);
      }
    } catch (error) {
      console.error('Failed to stop optimization:', error);
    }
  };

  return (
    <AgentVQEContext.Provider
      value={{
        currentPacket,
        isConnected,
        apiUrl,
        startOptimization,
        stopOptimization,
        isOptimizing,
      }}
    >
      {children}
    </AgentVQEContext.Provider>
  );
}

export function useAgentVQE() {
  const context = useContext(AgentVQEContext);
  if (!context) {
    throw new Error('useAgentVQE must be used within AgentVQEProvider');
  }
  return context;
}