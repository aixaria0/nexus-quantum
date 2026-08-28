# 🌌 NEXUS QUANTUM
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Formal Verification](https://img.shields.io/badge/Verified-Lean_4-emerald.svg)](#-the-breakthrough-machine-checked-formal-artifact)
A **formal-verification-first** quantum optimization framework. NEXUS QUANTUM bridges the gap between AI-driven heuristics and strict mathematical boundaries by combining AI-guided VQE optimization, **machine-checked Lean 4 constraint validation**, quantum simulation, and zero-noise extrapolation (ZNE).
### 🚀 Live Telemetry & Demo
Monitor the live system state at **[Nexus Quantum](https://aixaria0.github.io/nexus-quantum/)**. 
The interactive dashboard streams four concurrent processes:
1. **Cognitive Engine** (AI parameter proposals)
2. **QLF Null-Cone Boundary** (Real-time logical constraints)
3. **VQE Energy Topology** (State convergence)
4. **Hardware ZNE Mitigation** (Error reduction)
---
## 🔬 The Breakthrough: Machine-Checked Formal Artifact
Standard quantum workflows rely on probabilistic or heuristic bounds. NEXUS QUANTUM introduces an uncompromising mathematical boundary layer. 
The defining contribution of this repository is the public, machine-checked artifact: `QLF_NullCone.lean`. 
    
This Lean 4 module **formally verifies the spectral-mode geometric boundary condition**. It mathematically proves that topological strings converge to a scalar multiple of the identity without collapsing to the origin (the $\delta = 1$ invariant lock). This provides a verified, axiom-free control mechanism that strictly blocks invalid AI execution paths before they can ever reach the quantum simulator.
---
## ⚙️ Pipeline Architecture
The system architecture enforces a strict, four-stage validation and execution pipeline:

| Stage | Component | Responsibility | Location |
| :--- | :--- | :--- | :--- |
| **1** | **Cognitive Engine** | Analyzes topology and proposes VQE parameter updates. | `backend/` |
| **2** | **QLF Null-Cone** | Executes Lean 4 constraint proofs; rejects invalid proposals. | `backend/` |
| **3** | **VQE Simulation** | Simulates energy convergence toward the target ground state. | `backend/` |
| **4** | **Hardware ZNE** | Applies zero-noise extrapolation to filter hardware-level noise. | `backend/` |

---
## 🔒 Verified Constraints
The formal verification layer currently enforces the following bounds:
*   **Rotation Angles:** $\theta \in [0, 2\pi]$
*   **Ground State Energy:** $\in [-10, 10]$ Ha
*   **Fidelity:** $\in [0, 1]$
*   **Spectral Scalar:** Formally verified non-zero ($\in [0.01, 1.0]$)
*   **Gate Count:** $> 0$
---
## 🛠 Quick Start
```bash
# Install dependencies
pip install fastapi uvicorn qiskit qiskit-aer pydantic google-generativeai websockets
    
# Configure environment
export GEMINI_API_KEY="your-gemini-api-key"
    
# Launch the verification backend
cd backend
python main_agent_vqe.py
```
*The verified quantum payloads will begin streaming on `localhost:8000`.*
---
## 📂 Repository Structure
*   `backend/` — Core agent logic, Lean 4 bridge, and FastAPI service
*   `frontend/` — Interactive telemetry dashboard
*   `.github/workflows/` — CI/CD pipelines
*   `README_AGENT_VQE.md` — Deep dive into the Cognitive Engine logic
*   `SETUP_AGENT_VQE.md` — Detailed local deployment guide
---
## 🖋 Author
**Aria Fani** | [AixAria](https://github.com/aixaria0)  
*Demonstrating formal logic as the ultimate control layer for autonomous quantum systems.*