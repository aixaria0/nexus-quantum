# 🌌 NEXUS QUANTUM // PROJECT CHIMERA

![Status](https://img.shields.io/badge/Status-Operational-00ff00?style=for-the-badge)
![Verification](https://img.shields.io/badge/Verification-Lean_4_Geometric_Bounds-blue?style=for-the-badge)
![Agent](https://img.shields.io/badge/Cognition-Gemini_1.5_Pro-purple?style=for-the-badge)
![Quantum](https://img.shields.io/badge/Simulation-Qiskit_Aer-orange?style=for-the-badge)

**An autonomous, AI-driven Variational Quantum Eigensolver (VQE) optimization engine, strictly bound by formal mathematical proofs.**

🔗 **[Launch Live Dashboard Simulation](https://aixaria0.github.io/nexus-quantum/)**

---

## 🚀 The Vision: Constrained Autonomy

Project Chimera represents a paradigm shift in how artificial intelligence interacts with quantum hardware. Instead of granting an AI unrestricted access to generate quantum circuits, this pipeline introduces **Hard-Stop Constraint Enforcement**. 

An autonomous agent (Google Gemini 1.5 Pro) operates within an OODA loop (Observe, Orient, Decide, Act) to navigate the complex Hilbert space and optimize VQE parameters. However, every decision is intercepted and verified against a set of geometric and topological proofs formulated in **Lean 4**. 

If the agent hallucinates or proposes parameters that cause a logical state collapse (breaching the Null-Cone Boundary), the execution is brutally halted, logged, and the agent is forced to recalculate.

**Constraints are not obstacles; they are the core feature of this platform.**

---

## 🧠 Core Architecture

The architecture is divided into four deeply integrated panels, streaming at a constant 2Hz via WebSocket:

### 1. Chimera Cognition Engine
*   **Role:** The "Brain" of the system.
*   **Mechanism:** Gemini 1.5 Pro analyzes the current Hamiltonian energy, state fidelity, and spectral eigenvalue. It formulates a strategy to tune $R_y$ and $R_z$ gate rotations to achieve the ground state.
*   **Transparency:** Complete visibility into the agent's internal monologue and reasoning.

### 2. QLF Null-Cone Boundary (Lean 4)
*   **Role:** The "Immutable Law".
*   **Mechanism:** Parses constraints directly from mathematical proofs (`zfa_implies_null_spectral`). 
*   **Enforcement:** Evaluates the `toSpectralMode` invariant. If the spectral scalar $c$ approaches $0$, the topological string symmetric constraint is breached, indicating zero-fidelity alignment failure. The execution gate snaps shut.

### 3. Energy Topology (Physics)
*   **Role:** The "Objective Reality".
*   **Mechanism:** Simulates the parameterized ansatz circuit using `qiskit-aer`. Calculates the exact eigenvalue convergence toward the molecular ground state (measured in Hartree, Ha).

### 4. Hardware ZNE Mitigation
*   **Role:** The "Bridge to NISQ".
*   **Mechanism:** Implements Zero-Noise Extrapolation. The pipeline dynamically scales noise channels using varying fold factors ($\lambda = 1, 3, 5, 7$) and extrapolates the mitigated state purity to bypass hardware decoherence.

---

## 📐 Formal Constraint Definitions

Every proposed matrix mutation must pass the following immutable bounds before execution:

*   **Rotation Angles:** $\theta \in [0, 2\pi]$ (Quantum mechanical validity)
*   **Ground State Energy:** $E \in [-10, 10]$ Ha (Physical molecular bounds)
*   **Fidelity:** $F \in [0, 1]$ (State purity)
*   **Spectral Scalar:** $c \in [0.01, 1.0]$ (Null-cone boundary containment)
*   **Gate Count:** $> 0$ (Non-empty circuit invariant)

---

## 🛠️ Deployment & Execution

### Live Simulation (GitHub Pages)
The primary dashboard is available as a client-side simulation, demonstrating the exact data flow, UI rendering, and convergence charts as driven by the backend WebSocket stream.
👉 **[View Dashboard](https://aixaria0.github.io/nexus-quantum/)**

### Local Backend Ignition (FastAPI)
To run the true quantum-AI backend locally:

```bash
# 1. Install Dependencies
pip install fastapi uvicorn qiskit qiskit-aer pydantic google-generativeai websockets

# 2. Authenticate the Chimera Agent
export GEMINI_API_KEY="your-gemini-api-key"

# 3. Ignite the Pipeline
cd backend
python main_agent_vqe.py


The backend will stream the verified quantum payload at 2Hz on localhost:8000.
​🛡️ Mathematical Flawlessness
​This is not an unrestricted execution engine. It is a legally and mathematically bound quantum researcher. The Lean 4 proofs are real mathematical guarantees within their domain. They verify circuit geometry, preventing the AI from wasting expensive QPU time on mathematically impossible ansatz configurations.
​Built by Aria Fanee — Orchestrating the intersection of Computational Pathology, Quantum Systems, and AI Security.