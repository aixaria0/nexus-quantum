"""Production FastAPI Backend - Agent-Driven VQE with Formal Verification"""
import asyncio
import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
import uvicorn

from backend.qlf_verification import QLF_ZFA_Constraints, violation_log
from backend.agent_optimizer import VQEAgentOptimizer
from backend.vqe_optimizer import VQECircuitOptimizer
from backend.streaming_pipeline import RealtimeStreamingPipeline

# ============================================================================
# FastAPI Setup
# ============================================================================

app = FastAPI(
    title="Nexus Quantum Agent-VQE Platform",
    description="AI-driven quantum circuit optimization with formal geometric verification",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global instances
streaming_pipeline = RealtimeStreamingPipeline()
background_task: Optional[asyncio.Task] = None


# ============================================================================
# Pydantic Models
# ============================================================================

class ConstraintBoundsResponse(BaseModel):
    """Formal constraint bounds response."""
    spectral_mode_min: float = QLF_ZFA_Constraints.SPECTRAL_MODE_MIN
    spectral_mode_max: float = QLF_ZFA_Constraints.SPECTRAL_MODE_MAX
    energy_min: float = QLF_ZFA_Constraints.ENERGY_MIN
    energy_max: float = QLF_ZFA_Constraints.ENERGY_MAX
    angle_min: float = QLF_ZFA_Constraints.ANGLE_MIN
    angle_max: float = QLF_ZFA_Constraints.ANGLE_MAX
    fidelity_min: float = QLF_ZFA_Constraints.FIDELITY_MIN
    fidelity_max: float = QLF_ZFA_Constraints.FIDELITY_MAX
    gate_count_min: int = QLF_ZFA_Constraints.COUNT_GATE_MIN
    gate_count_max: int = QLF_ZFA_Constraints.COUNT_GATE_MAX
    fold_factor_min: int = QLF_ZFA_Constraints.FOLD_FACTOR_MIN
    fold_factor_max: int = QLF_ZFA_Constraints.FOLD_FACTOR_MAX
    consistency_epsilon: float = QLF_ZFA_Constraints.CONSISTENCY_EPSILON


class ConstraintViolation(BaseModel):
    """Record of a constraint violation."""
    timestamp: str
    constraint: str
    proposed_value: float
    bounds: tuple
    agent_justification: str
    status: str = "REJECTED"


class VQEStateResponse(BaseModel):
    """Current VQE optimization state."""
    iteration: int
    energy: float
    fidelity: float
    angles: List[float]
    num_qubits: int
    gate_count: int
    spectral_eigenvalue: float
    timestamp: str
    convergence_history: List[float]


class AgentHealthResponse(BaseModel):
    """Agent operational status."""
    agent_online: bool
    gemini_api_configured: bool
    ooda_iterations: int
    total_violations: int
    recent_violations: List[Dict]


# ============================================================================
# REST Endpoints
# ============================================================================

@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "status": "operational",
        "service": "Nexus Quantum Agent-VQE Platform",
        "version": "1.0.0",
        "features": [
            "Gemini 1.5 Pro autonomous optimization",
            "Lean 4 formal verification gates",
            "Real-time 2Hz streaming pipeline",
            "Hard-stop constraint enforcement"
        ]
    }


@app.get("/health")
async def health():
    """Detailed health status."""
    return {
        "status": "healthy",
        "vqe_optimizer": "operational",
        "agent_optimizer": "operational" if streaming_pipeline.agent_optimizer.model else "mock_mode",
        "streaming_pipeline": "active" if streaming_pipeline.is_running else "idle",
        "constraint_engine": "armed",
        "websocket_connections": len(streaming_pipeline.websocket_connections)
    }


@app.get("/api/v1/constraints")
async def get_constraints() -> ConstraintBoundsResponse:
    """
    Retrieve formal constraint bounds.
    These are extracted from Lean 4 proofs and enforced as hard-stops.
    """
    return ConstraintBoundsResponse()


@app.get("/api/v1/vqe-state")
async def get_vqe_state() -> VQEStateResponse:
    """
    Retrieve current VQE optimization state.
    """
    state = streaming_pipeline.vqe_optimizer.get_current_state()
    return VQEStateResponse(**state.to_dict())


@app.get("/api/v1/agent-health")
async def get_agent_health() -> AgentHealthResponse:
    """
    Check agent operational status and constraint violations.
    """
    return AgentHealthResponse(
        agent_online=streaming_pipeline.agent_optimizer.model is not None,
        gemini_api_configured=bool(os.getenv("GEMINI_API_KEY")),
        ooda_iterations=len(streaming_pipeline.agent_optimizer.ooda_history),
        total_violations=len(violation_log.violations),
        recent_violations=violation_log.get_recent_violations(limit=5)
    )


@app.get("/api/v1/ooda-history")
async def get_ooda_history(limit: int = 10) -> List[Dict]:
    """
    Retrieve recent OODA loop iterations from agent.
    Shows reasoning, decisions, and constraint validation results.
    """
    return streaming_pipeline.agent_optimizer.get_ooda_history(limit=limit)


@app.get("/api/v1/violations")
async def get_violations(limit: int = 20) -> List[Dict]:
    """
    Retrieve recent constraint violations.
    Used for debugging agent hallucinations and system behavior.
    """
    violations = violation_log.get_recent_violations(limit=limit)
    return [{
        'timestamp': v['timestamp'],
        'constraint': v['constraint'],
        'proposed_value': v['proposed_value'],
        'bounds': v['bounds'],
        'agent_reason': v['agent_justification'],
        'status': v['status']
    } for v in violations]


@app.post("/api/v1/start-optimization")
async def start_optimization(background_tasks: BackgroundTasks):
    """
    Start the agent-driven VQE optimization loop.
    This launches the 2Hz streaming pipeline.
    """
    global background_task
    
    if streaming_pipeline.is_running:
        raise HTTPException(status_code=400, detail="Optimization already running")
    
    # Launch streaming loop in background
    async def run_pipeline():
        await streaming_pipeline.run_streaming_loop()
    
    background_task = asyncio.create_task(run_pipeline())
    
    return {
        "status": "optimization_started",
        "message": "Agent-VQE pipeline launched at 2Hz",
        "pipeline_mode": "agent-driven_with_formal_verification",
        "constraint_engine": "armed"
    }


@app.post("/api/v1/stop-optimization")
async def stop_optimization():
    """
    Stop the optimization loop.
    """
    await streaming_pipeline.stop_streaming()
    return {
        "status": "optimization_stopped",
        "message": "Agent-VQE pipeline halted"
    }


# ============================================================================
# WebSocket Endpoints
# ============================================================================

@app.websocket("/ws/agent-vqe-pipeline")
async def websocket_agent_vqe_pipeline(websocket: WebSocket):
    """
    Main WebSocket endpoint for 4-panel real-time dashboard.
    Streams:
    1. Chimera Cognition: Agent OODA loop
    2. QLF Null-Cone Boundary: Formal verification lock
    3. Energy Topology: VQE convergence
    4. Hardware ZNE: Mitigation metrics
    
    Streaming rate: 2Hz (0.5s per packet)
    """
    await websocket.accept()
    await streaming_pipeline.register_connection(websocket)
    
    try:
        # Send initial state
        initial_state = streaming_pipeline.vqe_optimizer.get_current_state()
        await websocket.send_json({
            'type': 'initial_state',
            'vqe_state': initial_state.to_dict(),
            'constraints': {
                'energy_bounds': (QLF_ZFA_Constraints.ENERGY_MIN, QLF_ZFA_Constraints.ENERGY_MAX),
                'angle_bounds': (QLF_ZFA_Constraints.ANGLE_MIN, QLF_ZFA_Constraints.ANGLE_MAX),
                'fidelity_bounds': (QLF_ZFA_Constraints.FIDELITY_MIN, QLF_ZFA_Constraints.FIDELITY_MAX)
            }
        })
        
        # Keep connection alive while streaming happens
        while True:
            data = await websocket.receive_text()
            if data == 'ping':
                await websocket.send_json({'type': 'pong'})
    
    except WebSocketDisconnect:
        await streaming_pipeline.unregister_connection(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        await streaming_pipeline.unregister_connection(websocket)


# ============================================================================
# Startup/Shutdown
# ============================================================================

@app.on_event("startup")
async def startup_event():
    """Initialize on startup."""
    print("\n" + "="*80)
    print("NEXUS QUANTUM AGENT-VQE PLATFORM")
    print("="*80)
    print("\n✅ Formal Verification Engine: ARMED")
    print(f"  - Constraint Bounds: {QLF_ZFA_Constraints.__doc__}")
    print(f"\n✅ Agent Optimizer: {'ONLINE (Gemini 1.5 Pro)' if streaming_pipeline.agent_optimizer.model else 'MOCK MODE'}")
    print(f"\n✅ VQE Circuit Optimizer: READY")
    print(f"  - Qubits: {streaming_pipeline.vqe_optimizer.num_qubits}")
    print(f"  - Initial Angles: {streaming_pipeline.vqe_optimizer.angles}")
    print(f"\n✅ Streaming Pipeline: 2Hz (0.5s/packet)")
    print(f"\n✅ WebSocket Endpoint: ws://localhost:8000/ws/agent-vqe-pipeline")
    print(f"\nCRITICAL: Hard-stop constraint enforcement ACTIVE")
    print("Agent hallucinations will be REJECTED and logged.")
    print("="*80 + "\n")


@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on shutdown."""
    await streaming_pipeline.stop_streaming()


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
