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

If you add a screenshot or short GIF later, place it here.

## Overview

NEXUS QUANTUM explores a constrained workflow for quantum optimization.

An AI agent proposes VQE parameter updates, Lean 4 checks whether those proposals satisfy the defined constraints, the circuit is evaluated in simulation, and mitigation techniques are applied to reduce noise effects.

The goal is to demonstrate how AI-assisted quantum optimization can remain within explicit mathematical and physical boundaries.

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
