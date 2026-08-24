"""Real-time WebSocket streaming of quantum metrics."""
import asyncio
import json
from typing import Set
from datetime import datetime
import numpy as np
from .core import QuantumSimulator, ZNEEngine


class MetricsStreamer:
    """Broadcast real-time quantum metrics to connected clients."""
    
    def __init__(self, simulator: QuantumSimulator):
        self.simulator = simulator
        self.zne_engine = ZNEEngine(simulator)
        self.connections: Set[any] = set()
        self.simulation_state = {
            'current_gate': 'H',
            'active_qubits': [0, 1],
            'fidelity': 0.9995,
            'error_rate': 0.0005,
            'timestamp': None
        }
    
    async def register_connection(self, websocket):
        """Register a new WebSocket connection."""
        self.connections.add(websocket)
        await websocket.send_text(json.dumps({'type': 'connected', 'message': 'Metrics streaming active'}))
    
    async def unregister_connection(self, websocket):
        """Unregister a WebSocket connection."""
        self.connections.discard(websocket)
    
    async def broadcast_metrics(self):
        """Stream gate performance metrics in real-time."""
        gates = ['H', 'X', 'RZ', 'CNOT', 'ECR']
        gate_idx = 0
        
        while True:
            current_gate = gates[gate_idx % len(gates)]
            metrics = self.simulator.get_gate_metrics(current_gate, 2)
            
            # Create streaming packet with uncertainty quantification
            packet = {
                'type': 'gate_metric',
                'timestamp': datetime.utcnow().isoformat() + 'Z',
                'current_gate': current_gate,
                'metrics': [
                    {
                        'qubit': m.qubit,
                        'fidelity': m.fidelity,
                        'fidelity_confidence': m.confidence,
                        'error_rate': m.error_rate,
                        'duration_ns': m.duration_ns,
                        'provenance': m.provenance,
                        'source': m.source,
                        'caveat': m.caveat
                    }
                    for m in metrics
                ]
            }
            
            # Broadcast to all connected clients
            dead_connections = set()
            for connection in self.connections:
                try:
                    await connection.send_text(json.dumps(packet))
                except Exception as e:
                    dead_connections.add(connection)
            
            # Clean up dead connections
            for conn in dead_connections:
                await self.unregister_connection(conn)
            
            gate_idx += 1
            await asyncio.sleep(0.5)  # 2Hz update rate
    
    async def stream_zne_simulation(self, num_qubits: int, circuit_type: str):
        """Stream ZNE simulation progress."""
        for connection in self.connections:
            try:
                # Simulate fold factor progression
                for fold in [1, 3, 5, 7]:
                    await asyncio.sleep(0.8)  # Simulate computation time
                    
                    progress = {
                        'type': 'zne_progress',
                        'fold_factor': fold,
                        'fidelity_estimate': min(0.82 + 0.03 * (fold / 7), 0.991),
                        'timestamp': datetime.utcnow().isoformat() + 'Z'
                    }
                    await connection.send_text(json.dumps(progress))
                
                # Send final result
                final_result = self.zne_engine.run_zne_analysis(num_qubits, circuit_type)
                await connection.send_text(json.dumps({
                    'type': 'zne_complete',
                    'result': final_result.to_dict()
                }))
            except Exception as e:
                print(f"Stream error: {e}")
