# Nexus Quantum Agent-VQE: Installation & Setup Guide

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm or yarn
- (Optional) Gemini API key from Google AI Studio

## Quick Start

### 1. Clone & Navigate

```bash
git clone https://github.com/aixaria0/nexus-quantum.git
cd nexus-quantum
git checkout agent-vqe-revolution
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Set Gemini API key (optional)
export GEMINI_API_KEY="your-gemini-api-key"

# Run server
python main_agent_vqe.py
```

You should see:
```
================================================================================
NEXUS QUANTUM AGENT-VQE PLATFORM
================================================================================

✅ Formal Verification Engine: ARMED
✅ Agent Optimizer: ONLINE (Gemini 1.5 Pro) [or MOCK MODE]
✅ VQE Circuit Optimizer: READY
✅ Streaming Pipeline: 2Hz (0.5s/packet)
✅ WebSocket Endpoint: ws://localhost:8000/ws/agent-vqe-pipeline

CRITICAL: Hard-stop constraint enforcement ACTIVE
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure API URL
echo 'NEXT_PUBLIC_API_URL=http://localhost:8000' > .env.local

# Start development server
npm run dev
```

Navigate to: http://localhost:3000/agent-dashboard

### 4. Start Optimization

Click the **"▶ Start Optimization"** button in the dashboard.

You should see:
- **Chimera Cognition panel**: Agent OODA loop reasoning
- **QLF Null-Cone panel**: Constraint verification (should show GREEN if all valid)
- **Energy Topology panel**: Ground state convergence chart
- **Hardware ZNE panel**: Mitigation metrics

---

## Verification Checklist

### Backend Health

```bash
curl http://localhost:8000/
# Should return: {"status": "operational", ...}

curl http://localhost:8000/health
# Should return: {"status": "healthy", ...}

curl http://localhost:8000/api/v1/constraints
# Should return all formal bounds (energy, angle, fidelity, etc.)
```

### Agent Status

```bash
curl http://localhost:8000/api/v1/agent-health
# Returns: agent_online (true/false), ooda_iterations, total_violations
```

### WebSocket Connection

```bash
# From browser console on dashboard:
ws = new WebSocket('ws://localhost:8000/ws/agent-vqe-pipeline')
ws.onmessage = (e) => console.log(JSON.parse(e.data))
# Should receive packets every 0.5s
```

---

## Configuration

### Environment Variables

**Backend:**
```bash
GEMINI_API_KEY=<your-gemini-api-key>  # Optional; defaults to mock mode
```

**Frontend:**
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000  # Backend URL
```

### Formal Constraint Bounds

Edit `backend/backend/qlf_verification.py` to adjust:

```python
class QLF_ZFA_Constraints:
    SPECTRAL_MODE_MIN = 0.01      # ← Adjust null-cone boundary
    ANGLE_MIN = 0.0
    ANGLE_MAX = 2 * 3.14159       # ← 2π
    ENERGY_MIN = -10.0            # ← Problem-specific
    ENERGY_MAX = 10.0
    # ...
```

**WARNING**: Changing these bounds requires mathematical justification. Lean 4 proofs establish these relationships.

---

## Example Workflows

### 1. Mock Mode (No Gemini API)

```bash
# Backend runs with mock agent
python main_agent_vqe.py

# Agent still proposes parameters and they're validated
# Useful for UI/UX testing and development
```

### 2. With Gemini API

```bash
export GEMINI_API_KEY="sk-..."
python main_agent_vqe.py

# Real agent reasoning now connects to Gemini 1.5 Pro
# All proposals validated against constraints
```

### 3. Monitor Constraint Violations

```bash
# In another terminal:
while true; do
  curl http://localhost:8000/api/v1/violations?limit=5
  sleep 2
done
```

### 4. Retrieve OODA Loop History

```bash
curl http://localhost:8000/api/v1/ooda-history?limit=10 | jq .

# Shows:
# - Agent's observation of quantum state
# - Orient analysis
# - Decide reasoning
# - Proposed parameters
# - Constraint validation results
```

---

## Debugging

### Backend Logs

```bash
# Run with verbose logging
UVICORN_LOG_LEVEL=debug python main_agent_vqe.py
```

### Check Constraint Violations

```bash
# Query violations endpoint
curl http://localhost:8000/api/v1/violations | jq '.[-5:]'

# Look for patterns:
# - Repeated constraint type → Agent systematically violating
# - One-off violations → Exploration/edge cases
```

### Dashboard Terminal Panel

The **QLF Null-Cone Boundary** panel shows live constraint violations:
```
> VIOLATION: angle = 6.5 (outside [0, 2π])
> VIOLATION: energy = 15.3 Ha (outside [-10, 10])
```

### VQE State Dump

```bash
curl http://localhost:8000/api/v1/vqe-state | jq .

# Shows:
# - Current energy, fidelity
# - All circuit angles
# - Spectral eigenvalue (geometric invariant)
# - Convergence history
```

---

## Performance Tuning

### Streaming Rate

Edit `backend/backend/streaming_pipeline.py`:

```python
await asyncio.sleep(0.5)  # ← 2Hz rate (0.5s/packet)
# Reduce for faster updates (e.g., 0.25s = 4Hz)
# Increase for lower CPU (e.g., 1.0s = 1Hz)
```

### Agent Response Time

Gemini API call in `request_agent_action()` can take 2-5 seconds.
If constrained:
- Use shorter prompts
- Reduce model to gemini-1.5-flash
- Implement response caching

### Circuit Simulation

Default: 1024 shots per simulation. Edit `vqe_optimizer.py`:

```python
result = self.simulator.run(qc, shots=1024).result()  # ← Adjust
# Higher = more accurate but slower
# Lower = faster but noisier
```

---

## Troubleshooting

### Dashboard Shows "Waiting for connection..."

**Solution:**
1. Verify backend is running: `curl http://localhost:8000/health`
2. Check WebSocket URL in browser console
3. Verify frontend env var: `NEXT_PUBLIC_API_URL=http://localhost:8000`
4. Check CORS: backend should allow `*` origins

### Agent Always Halts (Constraints Violated)

**Solution:**
1. Check `/api/v1/violations` for patterns
2. Review Gemini prompt in `request_agent_action()`
3. Ensure constraint bounds are physically reasonable
4. Try mock mode to verify dashboard works

### Energy Not Decreasing

**Solution:**
1. VQE ansatz may be too shallow
2. Check fidelity (should improve together with energy)
3. Increase number of circuit layers
4. Verify simulator is not saturating (shot limit)

### WebSocket Disconnects

**Solution:**
1. Check backend logs for crashes
2. Increase WebSocket timeout (FastAPI config)
3. Monitor network tab in browser DevTools
4. Restart backend and reconnect

---

## Deployment to Production

### Backend (Docker)

```dockerfile
# Dockerfile.backend
FROM python:3.11-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend .
EXPOSE 8000
CMD ["uvicorn", "main_agent_vqe:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
docker build -f Dockerfile.backend -t nexus-quantum-backend:latest .
docker run -p 8000:8000 -e GEMINI_API_KEY=$GEMINI_API_KEY nexus-quantum-backend
```

### Frontend (Vercel)

```bash
# Set environment variable in Vercel dashboard
NEXT_PUBLIC_API_URL=https://your-backend-domain.com

# Deploy
npm run build
# Follow Vercel's deployment instructions
```

### Production Checklist

- [ ] GEMINI_API_KEY securely stored (not in git)
- [ ] Backend behind HTTPS reverse proxy (nginx/HAProxy)
- [ ] WebSocket connection secured (wss://)
- [ ] CORS configured for specific frontend domain
- [ ] Rate limiting on API endpoints
- [ ] Database logging for constraint violations (optional)
- [ ] Monitoring/alerting on agent failures
- [ ] Backup constraint bounds configuration

---

## Support & Questions

For issues or questions:
1. Check `/api/v1/violations` for constraint rejection patterns
2. Review dashboard QLF panel for live verification status
3. Consult Lean 4 theorems in `qlf_verification.py`
4. Open GitHub issue with:
   - Backend logs
   - Frontend console errors
   - Recent violations dump
   - Steps to reproduce

---

**Built for production. Verified by mathematics. Ready for quantum optimization at scale.**
