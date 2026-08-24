"""Nexus Quantum Backend API - AI-Powered Quantum Error Mitigation."""
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import asyncio
import uvicorn

from backend.core import QuantumSimulator, ZNEEngine, GateMetric, ZNEResult
from backend.streaming import MetricsStreamer


# ============================================================================
# FastAPI Application Setup
# ============================================================================

app = FastAPI(
    title="Nexus Quantum API",
    description="Formal verification meets quantum error mitigation",
    version="0.2.0"
)

# CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global instances
simulator = QuantumSimulator(backend='qiskit')
zne_engine = ZNEEngine(simulator)
streamer = MetricsStreamer(simulator)


# ============================================================================
# Request/Response Models
# ============================================================================

class SimulationRequest(BaseModel):
    """Request to simulate a quantum circuit."""
    num_qubits: int = Field(default=5, ge=1, le=20)
    circuit_type: str = Field(default="GHZ", description="GHZ or Parametric")
    noise_level: float = Field(default=0.001, ge=0.0, le=0.1)


class GateAnalysisRequest(BaseModel):
    """Request gate performance analysis."""
    gate_type: str = Field(default="CNOT")
    num_qubits: int = Field(default=5, ge=1, le=20)


class ZNERequest(BaseModel):
    """Request ZNE mitigation analysis."""
    num_qubits: int = Field(default=5, ge=1, le=15)
    circuit_type: str = Field(default="GHZ")
    fold_factors: Optional[List[int]] = Field(default=[1, 3, 5, 7])


# ============================================================================
# Health & Status Endpoints
# ============================================================================

@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "operational",
        "service": "Nexus Quantum API",
        "version": "0.2.0",
        "description": "Zero-Noise Extrapolation meets Formal Verification"
    }


@app.get("/health")
async def health():
    """Detailed health status."""
    return {
        "status": "healthy",
        "simulator": "qiskit-aer",
        "zne_engine": "mitiq",
        "streaming": "active",
        "backend": "production"
    }


# ============================================================================
# Gate Performance Analysis
# ============================================================================

@app.post("/api/v1/gate-performance")
async def analyze_gate_performance(request: GateAnalysisRequest):
    """
    Analyze individual gate performance across qubits.
    
    Returns:
    - Fidelity per qubit
    - Error rates (experimental data from IBM Quantum)
    - Timing characteristics
    - Provenance and confidence levels
    - Caveats and qubit-specific variations
    """
    try:
        metrics = simulator.get_gate_metrics(request.gate_type, request.num_qubits)
        
        return {
            "gate_type": request.gate_type,
            "num_qubits": request.num_qubits,
            "metrics": [m.to_dict() for m in metrics],
            "summary": {
                "avg_fidelity": sum(m.fidelity for m in metrics) / len(metrics),
                "max_error_rate": max(m.error_rate for m in metrics),
                "avg_duration_ns": sum(m.duration_ns for m in metrics) / len(metrics) if metrics else 0
            }
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ============================================================================
# ZNE Mitigation Engine
# ============================================================================

@app.post("/api/v1/zne-analyze")
async def run_zne_mitigation(request: ZNERequest):
    """
    Execute Zero-Noise Extrapolation (ZNE) mitigation.
    
    Process:
    1. Create quantum circuit (GHZ or Parametric)
    2. Simulate with multiple noise scaling factors (fold factors)
    3. Perform linear extrapolation to zero noise
    4. Return unmitigated vs mitigated fidelity
    5. Include formal verification hash (Lean proof reference)
    
    Returns comprehensive mitigation analysis with:
    - Fidelity improvement percentage
    - Gate-by-gate performance breakdown
    - Mitigation overhead cost (cubic in fold factor)
    - Warnings about extrapolation validity
    - Lean 4 formal verification status
    """
    try:
        result = zne_engine.run_zne_analysis(
            num_qubits=request.num_qubits,
            circuit_type=request.circuit_type,
            fold_factors=request.fold_factors
        )
        return result.to_dict()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ZNE analysis failed: {str(e)}")


@app.get("/api/v1/zne-history")
async def get_zne_history(limit: int = 10):
    """
    Retrieve recent ZNE mitigation results.
    
    Useful for:
    - Tracking mitigation effectiveness over time
    - Comparing circuit types and configurations
    - Analyzing warning patterns
    """
    return {
        "total_analyses": len(zne_engine.mitigation_history),
        "recent": [r.to_dict() for r in zne_engine.mitigation_history[-limit:]]
    }


# ============================================================================
# Formal Verification & Consistency Proofs
# ============================================================================

@app.get("/api/v1/formal-proof/{proof_hash}")
async def get_formal_proof(proof_hash: str):
    """
    Retrieve Lean 4 formal verification metadata.
    
    Links quantum results to machine-checked consistency proofs:
    - ZFA (Zero-Fidelity-Alignment) guarantees
    - Null-cone geometric consistency
    - Spectral mode scalar identity
    - Non-collapse theorems
    """
    # Mock formal proof metadata
    proofs = {
        "0x7f3e9d2c": {
            "theorem": "zfa_implies_global_consistency",
            "proof_system": "Lean 4",
            "axioms": "Zero (QLF_Axioms)",
            "key_lemmas": [
                "toSpectralMode_zero_zero",
                "pure_zero_count_implies_empty",
                "NullCone_implies_Consistency"
            ],
            "git_commit": "3e1e0da093ef3b78a32b4d2d9a7e421665273048",
            "repository": "aixaria0/nexus-quantum",
            "verified_at": "2025-08-24T12:00:00Z"
        }
    }
    
    if proof_hash in proofs:
        return proofs[proof_hash]
    else:
        raise HTTPException(status_code=404, detail="Proof not found")


# ============================================================================
# Real-Time WebSocket Streaming
# ============================================================================

@app.websocket("/ws/live-metrics")
async def websocket_live_metrics(websocket: WebSocket):
    """
    WebSocket endpoint for real-time gate performance streaming.
    
    Connects to /ws/live-metrics and receives:
    - Gate fidelity updates (2Hz)
    - Error rate tracking
    - Qubit-specific variations
    - Provenance and confidence metadata
    """
    await websocket.accept()
    await streamer.register_connection(websocket)
    
    try:
        while True:
            # Keep connection alive while streaming happens elsewhere
            data = await websocket.receive_text()
            if data == 'ping':
                await websocket.send_text('{"type": "pong"}')
    except WebSocketDisconnect:
        await streamer.unregister_connection(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        await streamer.unregister_connection(websocket)


@app.websocket("/ws/zne-simulation")
async def websocket_zne_simulation(websocket: WebSocket):
    """
    WebSocket endpoint for ZNE simulation progress.
    
    Streams:
    - Fold factor progression
    - Fidelity estimates at each stage
    - Final mitigation result
    """
    await websocket.accept()
    
    try:
        # Receive simulation parameters
        message = await websocket.receive_json()
        num_qubits = message.get('num_qubits', 5)
        circuit_type = message.get('circuit_type', 'GHZ')
        
        await streamer.stream_zne_simulation(num_qubits, circuit_type)
    except WebSocketDisconnect:
        pass
    except Exception as e:
        print(f"ZNE WebSocket error: {e}")


# ============================================================================
# Background Task: Continuous Metrics Broadcasting
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Start background metrics broadcaster on server startup."""
    asyncio.create_task(streamer.broadcast_metrics())


# ============================================================================
# Main
# ============================================================================

if __name__ == "__main__":
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
