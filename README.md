# NEXUS QUANTUM

[![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![GitHub Pages](https://img.shields.io/badge/demo-live-success.svg)](https://aixaria0.github.io/nexus-quantum/)
[![Project Type](https://img.shields.io/badge/type-research%20prototype-purple.svg)](#overview)

A research prototype that combines AI-guided VQE optimization, Lean 4 constraint checking, quantum simulation, and zero-noise extrapolation.

## Demo

The live dashboard shows four main components:

- Cognitive Engine
- QLF Null-Cone Boundary
- VQE Energy Topology
- Hardware ZNE Mitigation

A live demo is available at <a href="https://aixaria0.github.io/nexus-quantum/" target="_blank">Nexus Quantum</a>.

## Overview

NEXUS QUANTUM explores a constrained workflow for quantum optimization.

An AI agent proposes VQE parameter updates, Lean 4 checks whether those proposals satisfy the defined constraints, the circuit is evaluated in simulation, and mitigation techniques are applied to reduce noise effects.

The goal is to demonstrate how AI-assisted quantum optimization can remain within explicit mathematical and physical boundaries.

## Architecture

The system is organized into four components:

| Component | Responsibility | Code area |
|---|---|---|
| Cognitive Engine | Proposes the next circuit parameters | `backend/` |
| QLF Null-Cone Boundary | Enforces Lean 4 constraint checks before execution | `backend/` |
| VQE Energy Topology | Simulates energy convergence toward the target state | `backend/` |
| Hardware ZNE Mitigation | Applies zero-noise extrapolation to reduce error | `backend/` |

## Core Components

### Cognitive Engine
The agent analyzes the current optimization state and proposes the next circuit parameters.

### QLF Null-Cone Boundary
Lean 4 is used to enforce constraint checks before execution. If a proposal violates the defined bounds, the execution path is blocked.

### VQE Energy Topology
The circuit is simulated to evaluate energy convergence toward the target ground state.

### Hardware ZNE Mitigation
Zero-noise extrapolation is used to reduce noise-induced error and improve state estimation.

## Constraints

The current system uses the following bounds:

- Rotation angles: within `[0, 2π]`
- Ground state energy: within `[-10, 10]` Ha
- Fidelity: within `[0, 1]`
- Spectral scalar: within `[0.01, 1.0]`
- Gate count: greater than `0`

## Quick Start

```bash
pip install fastapi uvicorn qiskit qiskit-aer pydantic google-generativeai websockets
export GEMINI_API_KEY="your-gemini-api-key"
cd backend
python main_agent_vqe.py
The backend streams verified quantum payloads on localhost:8000.
Repository Structure
backend/ — backend service and agent logic
frontend/ — dashboard interface
.github/workflows/ — CI/CD workflows
README_AGENT_VQE.md — agent-specific documentation
SETUP_AGENT_VQE.md — local setup instructions
Notes
This project is a simulation and research prototype.
It demonstrates how formal verification can be used as a control layer for AI-assisted quantum optimization.
Author
Aria Fani
License
Apache-2.0
